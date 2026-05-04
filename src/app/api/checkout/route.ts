import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { computeCart, SESSIONS } from "@/lib/camp-pricing";

export const runtime = "nodejs";

type CheckoutBody = {
  sessionCodes: string[];
  camperName: string;
  camperAge: string;
  instrument: string;
  parentName?: string;
  parentEmail: string;
  parentPhone: string;
};

function isValidBody(b: unknown): b is CheckoutBody {
  if (!b || typeof b !== "object") return false;
  const o = b as Record<string, unknown>;
  return (
    Array.isArray(o.sessionCodes) &&
    o.sessionCodes.every((c) => typeof c === "string") &&
    typeof o.camperName === "string" &&
    typeof o.camperAge === "string" &&
    typeof o.instrument === "string" &&
    typeof o.parentEmail === "string" &&
    typeof o.parentPhone === "string"
  );
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

  const checkoutSession = await stripe.checkout.sessions.create({
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
    metadata: {
      kind: "camp_deposit",
      session_codes: sessionCodes.join(","),
      camper_name: body.camperName,
      camper_age: body.camperAge,
      instrument: body.instrument,
      parent_name: body.parentName ?? "",
      parent_email: body.parentEmail,
      parent_phone: body.parentPhone,
      cart_list: String(cart.list),
      cart_early_bird_discount: String(cart.earlyBirdDiscount),
      cart_bundle_discount: String(cart.bundleDiscount),
      cart_total: String(cart.total),
      cart_deposit: String(cart.deposit),
      balance_owed: String(balanceOwed),
    },
    success_url: `${baseUrl}/camp/thank-you?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/musicperformancecamp?checkout=cancelled`,
  });

  if (!checkoutSession.url) {
    return NextResponse.json({ error: "Stripe did not return a URL" }, { status: 502 });
  }

  return NextResponse.json({ url: checkoutSession.url });
}
