"use client";

import { useEffect } from "react";
import posthog from "posthog-js";

// Fires once when the Stripe success_url lands. The sessionId comes from
// Stripe's {CHECKOUT_SESSION_ID} substitution and dedupes refreshes.
//
// PostHogProvider initializes the client in its own useEffect. On the
// initial mount after the full-page navigation back from Stripe, React
// runs child effects before parent effects, so this component's effect
// would otherwise execute against an uninitialized posthog client and
// silently drop the event. Wait for `posthog.__loaded` before capturing,
// and only set the dedupe key once the capture has actually fired.
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

    let cancelled = false;
    let interval: number | undefined;
    let timeout: number | undefined;

    const fire = () => {
      if (cancelled) return;
      if (sessionStorage.getItem(key)) return;
      posthog.capture("checkout_completed", {
        product,
        stripe_session_id: sessionId,
      });
      sessionStorage.setItem(key, "1");
    };

    const isLoaded = () =>
      (posthog as unknown as { __loaded?: boolean }).__loaded === true;

    if (isLoaded()) {
      fire();
      return;
    }

    interval = window.setInterval(() => {
      if (isLoaded()) {
        window.clearInterval(interval);
        window.clearTimeout(timeout);
        fire();
      }
    }, 50);
    // Stop polling after 10s. If init hasn't happened by then, the user
    // is offline or NEXT_PUBLIC_POSTHOG_KEY is missing — nothing to fire.
    timeout = window.setTimeout(() => {
      window.clearInterval(interval);
    }, 10_000);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
      window.clearTimeout(timeout);
    };
  }, [product]);

  return null;
}
