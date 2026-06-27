import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { airtableCreate } from "@/lib/airtable";
import { computeCart, SESSIONS } from "@/lib/camp-pricing";
import { calcAge, isRealISODate } from "@/lib/form-utils";

export const runtime = "nodejs";

type CheckoutBody = {
  sessionCodes: string[];
  camperName: string;
  camperDob: string;
  instrument: string;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
};

function isValidBody(b: unknown): b is CheckoutBody {
  if (!b || typeof b !== "object") return false;
  const o = b as Record<string, unknown>;
  if (!Array.isArray(o.sessionCodes) || !o.sessionCodes.every((c) => typeof c === "string")) return false;
  const reqStr = (v: unknown) => typeof v === "string" && v.trim().length > 0;
  if (!reqStr(o.camperName) || !reqStr(o.camperDob) || !reqStr(o.instrument)) return false;
  if (!reqStr(o.parentName) || !reqStr(o.parentEmail) || !reqStr(o.parentPhone)) return false;
  return true;
}

export async function POST(req: NextRequest) {
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) {
    return NextResponse.json(
      { error: "Stripe is not configured. Set STRIPE_SECRET_KEY." },
      { status: 500 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  if (!isValidBody(body)) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const validCodes = new Set(SESSIONS.map((s) => s.code));
  const sessionCodes = Array.from(new Set(body.sessionCodes)).filter((c) => validCodes.has(c));
  if (sessionCodes.length === 0) {
    return NextResponse.json({ error: "Select at least one session" }, { status: 400 });
  }

  const cart = computeCart(sessionCodes, Date.now());
  if (cart.deposit <= 0) {
    return NextResponse.json({ error: "Cart total is zero" }, { status: 400 });
  }

  // Birthday is the field of record; age is derived for staff convenience and
  // to keep existing age-based Airtable views working. calcAge returns null for
  // unparseable dates, future dates, and implausible ages (>120), so a null here
  // means the birthday is impossible — reject before creating any Stripe/Airtable
  // row. (The client's min/max are UI-only and not enforced on the onClick path.)
  // Note: this rejects only *impossible* dates, not out-of-8–14 ages — those are
  // intentionally allowed with a soft warning. isRealISODate also rejects
  // calendar-impossible dates that new Date() would silently normalize (e.g.
  // "2015-02-31" → Mar 3), which calcAge alone would accept.
  const camperAge = calcAge(body.camperDob); // number | null
  if (!isRealISODate(body.camperDob) || camperAge === null) {
    return NextResponse.json(
      { error: "Please enter a valid birthday." },
      { status: 400 }
    );
  }

  const stripe = new Stripe(secret);

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, "") ||
    req.nextUrl.origin;

  const balanceOwed = cart.total - cart.deposit;

  // One consolidated line item with a structured, readable breakdown.
  // No image — Stripe's branding logo at the top of the checkout page is sufficient,
  // and the per-line thumbnail rendered as confusing logo fragments at small sizes.
  const sessionsHuman =
    cart.picks.length === 1
      ? `Session ${cart.picks[0].code} (${cart.picks[0].dates})`
      : `${cart.picks.length} sessions: ${cart.picks
          .map((p) => `${p.code} (${p.dates})`)
          .join(", ")}`;

  const breakdownLines: string[] = [];
  breakdownLines.push(`Camp total: $${cart.total}`);
  if (cart.earlyBirdDiscount > 0) breakdownLines.push(`  • Early-bird discount applied: −$${cart.earlyBirdDiscount}`);
  if (cart.bundleDiscount > 0) breakdownLines.push(`  • Multi-week discount applied: −$${cart.bundleDiscount}`);
  breakdownLines.push("");
  breakdownLines.push(`Today's payment: $${cart.deposit}  (50% deposit to reserve)`);
  breakdownLines.push(`Remaining balance: $${balanceOwed}  (invoiced separately before camp begins)`);
  breakdownLines.push("");
  breakdownLines.push(`${sessionsHuman}`);
  breakdownLines.push(`Ages 8–14 · 9 AM – 3:30 PM · Friday showcase included`);

  const lineItems = [
    {
      quantity: 1,
      price_data: {
        currency: "usd" as const,
        unit_amount: cart.deposit * 100,
        product_data: {
          name: `WSM Summer Camp Reservation — $${cart.total} total`,
          description: breakdownLines.join("\n"),
        },
      },
    },
  ];

  // Pre-create a "Cart Started" Airtable row BEFORE redirecting to Stripe so
  // every checkout intent is visible to staff — even ones that never pay. The
  // returned record ID is stashed in Stripe session metadata; the webhook
  // flips this exact row to "Enrolled" on payment instead of creating a new
  // one. If the Airtable write fails — OR hangs past the timeout below — we
  // still proceed to Stripe (payment is more important than tracking). The
  // webhook then falls back to creating a fresh row on success, matching
  // pre-recovery behavior.
  //
  // The 2.5s timeout matters: Node `fetch` has no default timeout, so without
  // an AbortController a degraded-but-not-failing Airtable would block the
  // customer from ever reaching Stripe. Normal Airtable latency is well under
  // 1s; 2.5s is a generous ceiling that still keeps the worst case bounded.
  const airtableTable = process.env.AIRTABLE_CAMP_TABLE || "Summer Camp Signups";
  let airtableRecordId = "";
  const airtableCtrl = new AbortController();
  const airtableTimer = setTimeout(() => airtableCtrl.abort(), 2500);
  try {
    const record = await airtableCreate(
      airtableTable,
      {
        Name: body.camperName || "(no name)",
        Submitted: new Date().toISOString(),
        "Student DOB": body.camperDob,
        "Student Age": camperAge ?? "",
        "Primary Instrument": body.instrument,
        Sessions: sessionCodes.length ? sessionCodes.map((s) => `• ${s}`).join("\n") : "",
        "Parent Name": body.parentName,
        "Parent Email": body.parentEmail,
        "Parent Phone": body.parentPhone,
        "Lead Status": "Cart Started",
        "Lead Source": "Stripe Deposit",
        "Cart Total": cart.total,
        "Deposit Paid": 0,
        "Balance Owed": cart.total,
      },
      { signal: airtableCtrl.signal }
    );
    airtableRecordId = record.id;
  } catch (err) {
    // Covers both thrown HTTP errors (AirtableError) and abort timeouts
    // (DOMException with name "AbortError"). Either way: log, proceed to
    // Stripe, let the webhook's create-fallback handle the missing record ID.
    console.error("[api/checkout] Airtable cart-started write failed (proceeding to Stripe):", err);
  } finally {
    clearTimeout(airtableTimer);
  }

  let checkoutSession;
  try {
    checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: body.parentEmail,
      submit_type: "pay",
      billing_address_collection: "auto",
      line_items: lineItems,
      payment_intent_data: {
        // Stripe sends a receipt to this address automatically in live mode.
        // In test mode receipts don't send — preview them via the Stripe dashboard
        // by clicking into a payment and selecting "Send receipt".
        receipt_email: body.parentEmail,
        description: `WSM Summer Camp deposit — ${body.camperName} (${cart.picks.map((p) => p.code).join(", ")})`,
      },
      custom_text: {
        submit: {
          message:
            `You're paying a 50% deposit today to reserve your ${
              cart.picks.length === 1 ? "spot" : "spots"
            }. ` +
            `We'll email a separate invoice for the remaining $${balanceOwed} balance before camp begins. ` +
            `Questions? info@wynwoodschoolofmusic.com`,
        },
      },
      // Abandoned-cart recovery. Stripe generates a fresh `recovered_url` on
      // expiry and — because `customer_email` is set above — sends an
      // automatic recovery email ~1h after the session is abandoned. The
      // recovered URL is also surfaced in the Stripe Dashboard so staff can
      // re-send a fresh checkout link manually.
      after_expiration: {
        recovery: {
          enabled: true,
          allow_promotion_codes: false,
        },
      },
      metadata: {
        kind: "camp_deposit",
        session_codes: sessionCodes.join(","),
        camper_name: body.camperName,
        camper_dob: body.camperDob,
        camper_age: camperAge != null ? String(camperAge) : "",
        instrument: body.instrument,
        parent_name: body.parentName,
        parent_email: body.parentEmail,
        parent_phone: body.parentPhone,
        cart_list: String(cart.list),
        cart_early_bird_discount: String(cart.earlyBirdDiscount),
        cart_bundle_discount: String(cart.bundleDiscount),
        cart_total: String(cart.total),
        cart_deposit: String(cart.deposit),
        balance_owed: String(balanceOwed),
        // Empty string when the pre-create above failed; the webhook handles
        // both cases (update vs. create).
        airtable_record_id: airtableRecordId,
      },
      success_url: `${baseUrl}/camp/thank-you?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/musicperformancecamp?checkout=cancelled`,
    });
  } catch (err) {
    console.error("[api/checkout] Stripe API error:", err);
    return NextResponse.json(
      { error: "We couldn't start checkout. Please try again or email info@wynwoodschoolofmusic.com." },
      { status: 502 }
    );
  }

  if (!checkoutSession.url) {
    return NextResponse.json({ error: "Stripe did not return a URL" }, { status: 502 });
  }

  return NextResponse.json({ url: checkoutSession.url });
}
