export type LeadAttribution = {
  gclid?: string;
  gbraid?: string;
  wbraid?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  googleCampaignId?: string;
  googleAdGroupId?: string;
  googleCreativeId?: string;
  googleMatchType?: string;
  googleDevice?: string;
  landingPage?: string;
  referrer?: string;
  capturedAt?: string;
  posthogDistinctId?: string;
};

const STORAGE_KEY = "wsm_lead_attribution_v1";
const SESSION_STORAGE_KEY = "wsm_lead_session_attribution_v1";
const MAX_SHORT_VALUE = 500;
const MAX_URL_VALUE = 2_000;
const ATTRIBUTION_TTL_MS = 90 * 24 * 60 * 60 * 1_000;
const MAX_CLOCK_SKEW_MS = 24 * 60 * 60 * 1_000;

const queryMappings = {
  gclid: "gclid",
  gbraid: "gbraid",
  wbraid: "wbraid",
  utm_source: "utmSource",
  utm_medium: "utmMedium",
  utm_campaign: "utmCampaign",
  utm_term: "utmTerm",
  utm_content: "utmContent",
  campaign_id: "googleCampaignId",
  adgroup_id: "googleAdGroupId",
  creative: "googleCreativeId",
  matchtype: "googleMatchType",
  device: "googleDevice",
} as const satisfies Record<string, keyof LeadAttribution>;

function cleanString(value: unknown, maxLength = MAX_SHORT_VALUE): string | undefined {
  if (typeof value !== "string") return undefined;
  const cleaned = value.trim().slice(0, maxLength);
  return cleaned || undefined;
}

/**
 * Treat attribution as untrusted input. This is shared by the browser and API
 * routes so only known, bounded strings can reach Airtable or analytics.
 */
export function sanitizeLeadAttribution(value: unknown): LeadAttribution {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const raw = value as Record<string, unknown>;
  const result: LeadAttribution = {};

  for (const key of Object.values(queryMappings)) {
    const cleaned = cleanString(raw[key]);
    if (cleaned) result[key] = cleaned;
  }

  result.landingPage = cleanString(raw.landingPage, MAX_URL_VALUE);
  result.referrer = cleanString(raw.referrer, MAX_URL_VALUE);
  result.capturedAt = cleanString(raw.capturedAt, 100);
  result.posthogDistinctId = cleanString(raw.posthogDistinctId);

  return Object.fromEntries(
    Object.entries(result).filter(([, entry]) => entry !== undefined)
  ) as LeadAttribution;
}

function readStoredAttribution(
  storageName: "localStorage" | "sessionStorage",
  storageKey: string
): LeadAttribution {
  if (typeof window === "undefined") return {};

  const removeStoredAttribution = () => {
    try {
      window[storageName].removeItem(storageKey);
    } catch {
      // Storage may be blocked by browser policy. Attribution is optional, so
      // failed cleanup must not prevent a lead form from being submitted.
    }
  };

  try {
    const stored = sanitizeLeadAttribution(
      JSON.parse(window[storageName].getItem(storageKey) || "{}")
    );
    const capturedAt = stored.capturedAt ? Date.parse(stored.capturedAt) : NaN;
    const age = Date.now() - capturedAt;

    // Never let a historical click claim a new lead indefinitely. Missing or
    // malformed timestamps are treated as stale, as are timestamps far enough
    // in the future to indicate corrupted data rather than ordinary clock skew.
    if (
      !Number.isFinite(capturedAt) ||
      age > ATTRIBUTION_TTL_MS ||
      age < -MAX_CLOCK_SKEW_MS
    ) {
      removeStoredAttribution();
      return {};
    }

    return stored;
  } catch {
    removeStoredAttribution();
    return {};
  }
}

function writeStoredAttribution(
  storageName: "localStorage" | "sessionStorage",
  storageKey: string,
  attribution: LeadAttribution
): void {
  try {
    window[storageName].setItem(
      storageKey,
      JSON.stringify(sanitizeLeadAttribution(attribution))
    );
  } catch {
    // Storage may be blocked by browser policy. Attribution is optional, so a
    // failed write must never prevent navigation or form submission.
  }
}

/**
 * Save the first page of an untagged session or the most recent tagged visit.
 * Direct/internal navigation does not erase either the current session entry
 * or a paid click that is still inside its attribution window.
 */
export function captureLeadAttributionFromUrl(): void {
  if (typeof window === "undefined") return;
  const params = new URLSearchParams(window.location.search);
  const hasAttribution = Object.keys(queryMappings).some((key) => params.has(key));

  if (!hasAttribution) {
    const persistent = readStoredAttribution("localStorage", STORAGE_KEY);
    const session = readStoredAttribution("sessionStorage", SESSION_STORAGE_KEY);

    // Preserve a paid/tagged visit for its 90-day attribution window, and
    // preserve the first page of the current untagged browsing session while
    // the visitor moves around the site.
    if (Object.keys(persistent).length || Object.keys(session).length) return;

    writeStoredAttribution("sessionStorage", SESSION_STORAGE_KEY, {
      landingPage: window.location.href,
      referrer: document.referrer || undefined,
      capturedAt: new Date().toISOString(),
    });
    return;
  }

  // Start fresh for each newly tagged visit. Carrying an older GCLID into a
  // newer UTM-only visit (or vice versa) would join two different touches and
  // could credit the wrong campaign.
  const next: LeadAttribution = {
    landingPage: window.location.href,
    referrer: document.referrer || undefined,
    capturedAt: new Date().toISOString(),
  };

  for (const [queryKey, field] of Object.entries(queryMappings)) {
    const value = cleanString(params.get(queryKey));
    if (value) next[field as keyof LeadAttribution] = value;
  }

  // Tagged visits persist for the attribution window. The session copy is a
  // fallback for browsers that block persistent storage and also replaces any
  // untagged landing page captured earlier in the same tab.
  writeStoredAttribution("localStorage", STORAGE_KEY, next);
  writeStoredAttribution("sessionStorage", SESSION_STORAGE_KEY, next);
}

export function getLeadAttribution(posthogDistinctId?: string): LeadAttribution {
  return sanitizeLeadAttribution({
    ...readStoredAttribution("sessionStorage", SESSION_STORAGE_KEY),
    ...readStoredAttribution("localStorage", STORAGE_KEY),
    posthogDistinctId,
  });
}

export function airtableAttributionFields(
  attributionValue: unknown,
  leadId: string
): Record<string, unknown> {
  const attribution = sanitizeLeadAttribution(attributionValue);
  return {
    "Lead ID": leadId,
    GCLID: attribution.gclid,
    GBRAID: attribution.gbraid,
    WBRAID: attribution.wbraid,
    "UTM Source": attribution.utmSource,
    "UTM Medium": attribution.utmMedium,
    "UTM Campaign": attribution.utmCampaign,
    "UTM Term": attribution.utmTerm,
    "UTM Content": attribution.utmContent,
    "Google Campaign ID": attribution.googleCampaignId,
    "Google Ad Group ID": attribution.googleAdGroupId,
    "Google Creative ID": attribution.googleCreativeId,
    "Google Match Type": attribution.googleMatchType,
    "Google Device": attribution.googleDevice,
    "Landing Page": attribution.landingPage,
    Referrer: attribution.referrer,
    "PostHog Distinct ID": attribution.posthogDistinctId,
    "Marketing Attribution": Object.keys(attribution).length
      ? JSON.stringify(attribution)
      : undefined,
  };
}

export function posthogAttributionProperties(
  attributionValue: unknown
): Record<string, string> {
  const attribution = sanitizeLeadAttribution(attributionValue);
  return Object.fromEntries(
    Object.entries({
      gclid: attribution.gclid,
      gbraid: attribution.gbraid,
      wbraid: attribution.wbraid,
      utm_source: attribution.utmSource,
      utm_medium: attribution.utmMedium,
      utm_campaign: attribution.utmCampaign,
      utm_term: attribution.utmTerm,
      utm_content: attribution.utmContent,
      google_campaign_id: attribution.googleCampaignId,
      google_ad_group_id: attribution.googleAdGroupId,
      google_creative_id: attribution.googleCreativeId,
      google_match_type: attribution.googleMatchType,
      google_device: attribution.googleDevice,
      landing_page: attribution.landingPage,
    }).filter(([, entry]) => entry !== undefined)
  ) as Record<string, string>;
}
