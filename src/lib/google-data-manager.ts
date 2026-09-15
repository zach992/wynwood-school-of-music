import "server-only";

import { createHash } from "node:crypto";

const TOKEN_ENDPOINT = "https://oauth2.googleapis.com/token";
const INGEST_ENDPOINT = "https://datamanager.googleapis.com/v1/events:ingest";

type LeadIdentifiers = {
  email?: string;
  phone?: string;
  gclid?: string;
  gbraid?: string;
  wbraid?: string;
};

export type OfflineConversionEvent = LeadIdentifiers & {
  conversionActionId: string;
  eventTimestamp: string;
  transactionId: string;
};

type DataManagerResponse = {
  requestId?: string;
  fieldWarnings?: unknown[];
};

let cachedAccessToken: { value: string; expiresAt: number } | undefined;

function requiredEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`${name} is not set`);
  return value;
}

function sha256Hex(value: string): string {
  return createHash("sha256").update(value, "utf8").digest("hex");
}

export function normalizeEmail(value?: string): string | undefined {
  const normalized = value?.trim().toLowerCase();
  if (!normalized || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) return undefined;
  return normalized;
}

export function normalizePhone(value?: string): string | undefined {
  if (!value) return undefined;
  const digits = value.replace(/\D/g, "");
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  if (value.trim().startsWith("+") && digits.length >= 8 && digits.length <= 15) {
    return `+${digits}`;
  }
  return undefined;
}

function buildUserIdentifiers(email?: string, phone?: string) {
  const identifiers: Array<{ emailAddress?: string; phoneNumber?: string }> = [];
  const normalizedEmail = normalizeEmail(email);
  const normalizedPhone = normalizePhone(phone);
  if (normalizedEmail) identifiers.push({ emailAddress: sha256Hex(normalizedEmail) });
  if (normalizedPhone) identifiers.push({ phoneNumber: sha256Hex(normalizedPhone) });
  return identifiers;
}

async function getAccessToken(): Promise<string> {
  if (cachedAccessToken && cachedAccessToken.expiresAt > Date.now() + 5 * 60 * 1_000) {
    return cachedAccessToken.value;
  }

  const body = new URLSearchParams({
    client_id: requiredEnv("GOOGLE_DATA_MANAGER_CLIENT_ID"),
    client_secret: requiredEnv("GOOGLE_DATA_MANAGER_CLIENT_SECRET"),
    refresh_token: requiredEnv("GOOGLE_DATA_MANAGER_REFRESH_TOKEN"),
    grant_type: "refresh_token",
  });

  const response = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body,
    cache: "no-store",
  });
  const payload = (await response.json().catch(() => ({}))) as {
    access_token?: string;
    expires_in?: number;
    error?: string;
    error_description?: string;
  };
  if (!response.ok || !payload.access_token) {
    throw new Error(
      `Google OAuth token refresh failed (${response.status}): ${
        payload.error_description || payload.error || "unknown error"
      }`
    );
  }
  cachedAccessToken = {
    value: payload.access_token,
    expiresAt: Date.now() + (payload.expires_in ?? 3_600) * 1_000,
  };
  return cachedAccessToken.value;
}

export async function ingestOfflineConversion(
  event: OfflineConversionEvent,
  options: { validateOnly?: boolean } = {}
): Promise<DataManagerResponse> {
  const accountId = requiredEnv("GOOGLE_ADS_CUSTOMER_ID").replace(/\D/g, "");
  const userIdentifiers = buildUserIdentifiers(event.email, event.phone);
  const adIdentifiers = Object.fromEntries(
    Object.entries({
      gclid: event.gclid?.trim(),
      gbraid: event.gbraid?.trim(),
      wbraid: event.wbraid?.trim(),
    }).filter(([, value]) => value)
  );

  if (Object.keys(adIdentifiers).length === 0 && userIdentifiers.length === 0) {
    throw new Error("Lead has no usable Google click ID, email, or phone identifier");
  }

  const accessToken = await getAccessToken();
  const body = {
    destinations: [
      {
        operatingAccount: { accountType: "GOOGLE_ADS", accountId },
        loginAccount: { accountType: "GOOGLE_ADS", accountId },
        productDestinationId: event.conversionActionId,
      },
    ],
    encoding: "HEX",
    validateOnly: options.validateOnly ?? false,
    events: [
      {
        eventTimestamp: new Date(event.eventTimestamp).toISOString(),
        transactionId: event.transactionId,
        eventSource: "WEB",
        ...(Object.keys(adIdentifiers).length ? { adIdentifiers } : {}),
        ...(userIdentifiers.length
          ? { userData: { userIdentifiers } }
          : {}),
      },
    ],
    // Consent is deliberately not asserted here. The site does not yet record
    // a per-lead ad_user_data/ad_personalization choice. Omitting this field is
    // more accurate than claiming consent we cannot prove.
  };

  const response = await fetch(INGEST_ENDPOINT, {
    method: "POST",
    headers: {
      authorization: `Bearer ${accessToken}`,
      "content-type": "application/json",
      "x-goog-user-project": requiredEnv("GOOGLE_DATA_MANAGER_PROJECT_ID"),
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  const payload = (await response.json().catch(() => ({}))) as DataManagerResponse & {
    error?: { message?: string; status?: string };
  };
  if (!response.ok) {
    throw new Error(
      `Google Data Manager rejected the conversion (${response.status} ${
        payload.error?.status || "error"
      }): ${payload.error?.message || "unknown error"}`
    );
  }
  return payload;
}
