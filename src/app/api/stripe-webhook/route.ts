import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import {
  AirtableError,
  airtableCreate,
  airtableEscapeFormulaString,
  airtableFind,
  airtableUpdate,
} from "@/lib/airtable";
import { sendFormNotification } from "@/lib/email";
import {
  buildCampDepositParentEmail,
  buildCampDepositStaffEmail,
} from "@/lib/email-templates";
import { calcAge } from "@/lib/form-utils";

export const runtime = "nodejs";

// Stripe needs the raw request body to verify the signature.
// Disabling body parsing isn't needed in App Router — `req.text()` gives us the raw payload.

export async function POST(req: NextRequest) {
  const secret = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret || !webhookSecret) {
    return NextResponse.json(
      { error: "Stripe webhook is not configured." },
      { status: 500 }
    );
  }

  const sig = req.headers.get("stripe-signature");
  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const rawBody = await req.text();
  const stripe = new Stripe(secret);

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Signature verification failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const meta = session.metadata ?? {};

    if (meta.kind === "camp_deposit") {
      const registration = {
        stripeSessionId: session.id,
        amountPaidCents: session.amount_total ?? 0,
        currency: session.currency,
        camperName: meta.camper_name,
        camperDob: meta.camper_dob ?? "",
        // Prefer recomputing age from DOB; fall back to the legacy numeric
        // camper_age for sessions created before the birthday rollout (their
        // metadata has camper_age but no camper_dob).
        camperAge:
          calcAge(meta.camper_dob) ??
          (meta.camper_age && meta.camper_age.trim() !== ""
            ? Number(meta.camper_age)
            : null),
        instrument: meta.instrument,
        parentName: meta.parent_name,
        parentEmail: meta.parent_email || session.customer_details?.email || "",
        parentPhone: meta.parent_phone,
        sessionCodes: (meta.session_codes ?? "").split(",").filter(Boolean),
        cartTotal: Number(meta.cart_total ?? 0),
        depositPaid: Number(meta.cart_deposit ?? 0),
        balanceOwed: Number(meta.balance_owed ?? 0),
      };

      // Update (or create) the Summer Camp Signups row.
      //
      // When checkout was started through `/api/checkout`, that route already
      // pre-created a "Cart Started" row and passed its Airtable record ID in
      // session metadata. We flip that exact row to "Enrolled" so we don't
      // double-row the same camper. Fallback to create when the metadata is
      // missing (e.g. session created out-of-band via Stripe Dashboard, or
      // the pre-create write failed at checkout time) — OR when the referenced
      // row turns out to be stale (deleted between cart-start and payment;
      // Airtable returns 403 for valid-format-but-missing IDs and 404 for
      // malformed IDs). Without that fallback a paid registration could get
      // stuck in Stripe retry hell with no Airtable record ever recorded,
      // which would be a regression vs. pre-recovery behavior.
      //
      // Awaited so a failure returns 502 to Stripe and triggers a retry —
      // never silently lose a paid registration. Email failures (below) are
      // fire-and-forget since they shouldn't gate Stripe retries.
      const tableName = process.env.AIRTABLE_CAMP_TABLE || "Summer Camp Signups";
      const recordId = meta.airtable_record_id;
      const sessionsText = registration.sessionCodes.length
        ? registration.sessionCodes.map((s) => `• ${s}`).join("\n")
        : "";

      // Fields shared by both code paths. Update only patches what changed +
      // backfills a few human fields in case the pre-create row was edited
      // manually between cart-start and payment.
      const updatePayload = {
        "Lead Status": "Enrolled",
        "Deposit Paid": registration.depositPaid,
        "Balance Owed": registration.balanceOwed,
        "Cart Total": registration.cartTotal,
        "Student DOB": registration.camperDob || "",
        "Student Age": registration.camperAge ?? "",
        "Primary Instrument": registration.instrument,
        Sessions: sessionsText,
        "Parent Email": registration.parentEmail,
        "Parent Phone": registration.parentPhone,
      };

      // Create needs the full payload (Name/Submitted/Parent Name/Lead Source
      // never came from a pre-create row in the fallback case).
      const createPayload = {
        ...updatePayload,
        Name: registration.camperName || "(no name)",
        Submitted: new Date().toISOString(),
        "Parent Name": registration.parentName,
        "Lead Source": "Stripe Deposit",
      };

      // Reconciliation helper: when we don't have a usable record ID
      // (because the metadata is empty OR the row it points at is stale),
      // try to find an existing "Cart Started" row by natural key before
      // creating a new one. This handles the abort-race case where the
      // pre-create in `/api/checkout` timed out at 2.5s but Airtable still
      // persisted the row — without a lookup we'd insert a duplicate
      // "Enrolled" row and leave the original orphan forever, which would
      // produce duplicate paid signups + false abandoned-cart leads any
      // time Airtable response time crept above the abort threshold.
      //
      // Natural key = Parent Email + Name + Lead Status. Both fields are
      // already in the Stripe session metadata that the pre-create wrote,
      // so a hit means the same checkout intent. Lookup failures fail
      // open (proceed to create) so a transient list-API error doesn't
      // 502-loop Stripe; the worst case is a single duplicate row, not a
      // lost enrollment.
      const reconcileOrCreate = async () => {
        const name = registration.camperName || "(no name)";
        const formula = `AND({Parent Email}='${airtableEscapeFormulaString(
          registration.parentEmail
        )}',{Name}='${airtableEscapeFormulaString(name)}',{Lead Status}='Cart Started')`;

        let orphan = null;
        try {
          orphan = await airtableFind(tableName, formula);
        } catch (err) {
          console.warn("[stripe-webhook] orphan lookup failed; creating fresh row:", err);
        }
        if (orphan) {
          console.info(
            `[stripe-webhook] reconciled orphan Cart Started row ${orphan.id} for ${registration.parentEmail}`
          );
          await airtableUpdate(tableName, orphan.id, updatePayload);
        } else {
          await airtableCreate(tableName, createPayload);
        }
      };

      try {
        if (recordId) {
          try {
            await airtableUpdate(tableName, recordId, updatePayload);
          } catch (err) {
            // Record ID unreachable (deleted before payment, or malformed).
            // Reconcile via lookup before creating, in case the orphan is
            // still findable by natural key. Other failures (5xx, rate
            // limit, network) bubble so Stripe retries the event.
            if (
              err instanceof AirtableError &&
              (err.status === 403 || err.status === 404)
            ) {
              console.warn(
                `[stripe-webhook] airtable record ${recordId} unreachable (HTTP ${err.status}); attempting reconcile`
              );
              await reconcileOrCreate();
            } else {
              throw err;
            }
          }
        } else {
          await reconcileOrCreate();
        }
      } catch (err) {
        console.error("[stripe-webhook] Airtable write failed (Stripe will retry):", err);
        return NextResponse.json({ error: "Airtable write failed" }, { status: 502 });
      }

      // Notify staff (CAMP_NOTIFY_EMAIL takes precedence over the default RESEND_NOTIFY_TO)
      if (process.env.RESEND_API_KEY) {
        const staffTo = process.env.CAMP_NOTIFY_EMAIL || process.env.RESEND_NOTIFY_TO;
        sendFormNotification({
          ...buildCampDepositStaffEmail(registration),
          to: staffTo,
        }).catch((err) => console.error("[stripe-webhook] staff notification failed:", err));

        if (registration.parentEmail) {
          sendFormNotification({
            ...buildCampDepositParentEmail(registration),
            to: registration.parentEmail,
          }).catch((err) => console.error("[stripe-webhook] parent receipt failed:", err));
        }
      } else {
        console.log("[camp deposit paid]", JSON.stringify(registration));
      }
    }
  }

  return NextResponse.json({ received: true });
}
