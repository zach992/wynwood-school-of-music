// Meta (Facebook) Pixel — pixel 1047538668081853.
//
// The base pixel snippet is loaded once in src/app/layout.tsx. This module owns
// the Lead event so every form reports it identically.
//
// Mirrors the shape of src/lib/google-ads.ts on purpose: one module per ad
// platform, owning its IDs and exposing a named report function, so a form
// component never contains vendor snippet code.

export const META_PIXEL_ID = "1047538668081853";

export const META_PIXEL_ENABLED =
  process.env.NEXT_PUBLIC_ENABLE_META_PIXEL === "true";

// Which form produced the lead. Meta has a single standard `Lead` event rather
// than Google's per-action conversion labels, so the form is passed as a
// parameter and segmented afterwards with a Custom Conversion in Events
// Manager. Keep these values stable — changing one orphans any Custom
// Conversion or audience already filtering on it.
export type LeadSource =
  | "contact"
  | "trial-lesson"
  | "repair"
  | "wgv"
  | "camp-interest";

type FbqFn = (...args: unknown[]) => void;

type FbqWindow = Window & { fbq?: FbqFn };

// fbevents.js defines window.fbq synchronously via the inline snippet and
// queues calls made before the library finishes loading — but the snippet
// itself runs on afterInteractive, so a very early call can still land before
// fbq exists at all. Hold those in a local queue and drain once it appears.
// Same bounded-retry idiom as CheckoutCompletedTracker.
let pendingCalls: unknown[][] = [];
let draining = false;

function drainWhenReady(): void {
  if (draining) return;
  draining = true;

  const startedAt = Date.now();
  const interval = window.setInterval(() => {
    const fbq = (window as FbqWindow).fbq;
    if (typeof fbq === "function") {
      window.clearInterval(interval);
      draining = false;
      const queued = pendingCalls;
      pendingCalls = [];
      queued.forEach((args) => fbq(...args));
      return;
    }
    // Give up after 10s: the pixel is blocked or the env flag is off, and
    // holding the calls forever just leaks.
    if (Date.now() - startedAt > 10_000) {
      window.clearInterval(interval);
      draining = false;
      pendingCalls = [];
    }
  }, 50);
}

function send(args: unknown[]): void {
  const fbq = (window as FbqWindow).fbq;
  if (typeof fbq === "function") {
    fbq(...args);
    return;
  }
  pendingCalls.push(args);
  drainWhenReady();
}

/**
 * Reports a Meta `Lead` standard event.
 *
 * Call this on genuine submit success — after the API has accepted the lead —
 * never on button click. A click fires for visitors who then fail validation,
 * trip the bot guard, or hit an API error, none of whom are leads.
 *
 * Safe to call unconditionally: it is a no-op when the pixel is disabled,
 * during SSR, or when a content blocker has stopped fbevents.js. It never
 * throws, so it cannot break a form submission.
 */
export function reportLead(source: LeadSource): void {
  try {
    if (typeof window === "undefined") return;
    if (!META_PIXEL_ENABLED) return;

    send([
      "track",
      "Lead",
      {
        content_name: source,
        content_category: "lead-form",
      },
    ]);
  } catch (err) {
    // Analytics must never take a form submission down with it.
    console.error("Meta Pixel lead report failed:", err);
  }
}
