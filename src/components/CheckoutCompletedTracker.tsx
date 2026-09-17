"use client";

import { useEffect } from "react";
import posthog from "posthog-js";

// The dedupe flag lives in localStorage, not sessionStorage. Mobile Safari and
// Chrome iOS evict backgrounded tabs under memory pressure and re-navigate to
// the stored URL when the user returns, which resurrects the success_url with a
// blank sessionStorage and re-fires the event — silently, without the user
// doing anything. localStorage survives that, plus browser restarts and
// reopening the URL in a new tab.
//
// Both helpers swallow storage errors: access throws when a browser blocks site
// data, and degrading to "fire once per page load" beats throwing in the effect.
function alreadyFired(key: string) {
  try {
    return localStorage.getItem(key) !== null;
  } catch {
    return false;
  }
}

function markFired(key: string) {
  try {
    localStorage.setItem(key, "1");
  } catch {
    // Capture already happened; only the dedupe guarantee is lost.
  }
}

// Fires once when the Stripe success_url lands. The sessionId comes from
// Stripe's {CHECKOUT_SESSION_ID} substitution and dedupes repeat loads.
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
    if (alreadyFired(key)) return;

    let cancelled = false;

    const fire = () => {
      if (cancelled) return;
      if (alreadyFired(key)) return;
      posthog.capture("checkout_completed", {
        product,
        stripe_session_id: sessionId,
      });
      markFired(key);
    };

    const isLoaded = () =>
      (posthog as unknown as { __loaded?: boolean }).__loaded === true;

    if (isLoaded()) {
      fire();
      return;
    }

    const interval = window.setInterval(() => {
      if (isLoaded()) {
        window.clearInterval(interval);
        window.clearTimeout(timeout);
        fire();
      }
    }, 50);
    // Stop polling after 10s. If init hasn't happened by then, the user
    // is offline or NEXT_PUBLIC_POSTHOG_KEY is missing — nothing to fire.
    const timeout = window.setTimeout(() => {
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
