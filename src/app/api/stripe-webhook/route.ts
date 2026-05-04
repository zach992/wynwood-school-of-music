import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

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
        camperAge: meta.camper_age,
        instrument: meta.instrument,
        parentName: meta.parent_name,
        parentEmail: meta.parent_email || session.customer_details?.email,
        parentPhone: meta.parent_phone,
        sessionCodes: (meta.session_codes ?? "").split(",").filter(Boolean),
        cartTotal: Number(meta.cart_total ?? 0),
        depositPaid: Number(meta.cart_deposit ?? 0),
        balanceOwed: Number(meta.balance_owed ?? 0),
      };

      // TODO: send notification email to CAMP_NOTIFY_EMAIL once an email service is wired
      // (Resend / SendGrid / Postmark). Until then, log so it's visible in Railway logs.
      console.log("[camp deposit paid]", JSON.stringify(registration));
    }
  }

  return NextResponse.json({ received: true });
}
