// Google Ads conversion tracking (account AW-700940936).
//
// The base gtag.js tag is loaded once in src/app/layout.tsx. This module owns
// the conversion labels and the single helper every caller uses to report one.
//
// Why a helper instead of Google's copy-paste snippet: the Google Ads UI emits
// an identically-named `gtag_report_conversion` function for *every* conversion
// action, so pasting two of them into one site means the second definition
// silently overwrites the first. Naming each conversion here keeps them
// distinct and keeps the labels in one auditable place.

export const GOOGLE_ADS_ID = "AW-700940936";

export const GOOGLE_ADS_ENABLED =
  process.env.NEXT_PUBLIC_ENABLE_GOOGLE_ADS === "true";

// Conversion labels from Google Ads → Goals → Conversions → (action) → Tag setup.
// Only the two actions that exist in the account today are wired. Adding
// another lead form to Ads means adding its label here, then calling
// reportConversion() on that form's submit success — nothing else changes.
const CONVERSION_LABELS = {
  "free-trial": "pWs0COa-ufIcEIiFns4C",
  contact: "temPCOm-ufIcEIiFns4C",
} as const;

export type GoogleAdsConversion = keyof typeof CONVERSION_LABELS;

type GtagFn = (...args: unknown[]) => void;

type GtagWindow = Window & {
  gtag?: GtagFn;
  dataLayer?: unknown[];
};

// Returns a usable gtag function, or null if Ads tracking is off entirely.
//
// gtag.js is loaded with strategy="afterInteractive", so by the time a visitor
// has filled out a form it is virtually always present. The fallback shim
// covers the remaining edge: a submit that lands before the inline bootstrap
// has executed. dataLayer is a queue, so an event pushed onto it now is still
// processed once gtag.js finishes loading.
function resolveGtag(): GtagFn | null {
  if (typeof window === "undefined") return null;
  if (!GOOGLE_ADS_ENABLED) return null;

  const w = window as GtagWindow;
  if (typeof w.gtag === "function") return w.gtag;

  w.dataLayer = w.dataLayer || [];
  const queue = w.dataLayer;
  const shim: GtagFn = (...args) => {
    queue.push(args);
  };
  w.gtag = shim;
  return shim;
}

/**
 * Reports a Google Ads conversion.
 *
 * Call this on genuine submit success — after the API has accepted the lead —
 * never on button click. A click fires for visitors who then fail validation,
 * trip the bot guard, or hit an API error, all of which would report
 * conversions that never became leads.
 *
 * Safe to call unconditionally: it is a no-op when Ads tracking is disabled,
 * during SSR, or when a blocker has prevented gtag.js from loading. It never
 * throws, so it cannot break a form submission.
 */
export function reportConversion(conversion: GoogleAdsConversion): void {
  try {
    const gtag = resolveGtag();
    if (!gtag) return;

    gtag("event", "conversion", {
      send_to: `${GOOGLE_ADS_ID}/${CONVERSION_LABELS[conversion]}`,
    });
  } catch (err) {
    // Analytics must never take a form submission down with it.
    console.error("Google Ads conversion report failed:", err);
  }
}
