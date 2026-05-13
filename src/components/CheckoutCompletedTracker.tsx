"use client";

import { useEffect } from "react";
import posthog from "posthog-js";

// Fires once when the Stripe success_url lands. The sessionId comes from
// Stripe's {CHECKOUT_SESSION_ID} substitution and dedupes refreshes.
export default function CheckoutCompletedTracker({
  product,
}: {
  product: string;
}) {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get("session_id");
    if (!sessionId) return;
    const key = `ph_checkout_completed:${sessionId}`;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");
    posthog.capture("checkout_completed", {
      product,
      stripe_session_id: sessionId,
    });
  }, [product]);

  return null;
}
