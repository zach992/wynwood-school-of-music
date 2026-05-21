const AIRTABLE_API = "https://api.airtable.com/v0";

type AirtableFields = Record<string, unknown>;

// Airtable POST /records and PATCH /records/{id} both return a record envelope
// with `id`. We normalize the create response to a single record so callers
// can do `const { id } = await airtableCreate(...)` to chain follow-up writes
// (e.g. stashing the record ID in Stripe session metadata for later update).
export type AirtableRecord = { id: string; fields: AirtableFields; createdTime?: string };

// Thrown by `airtableCreate` / `airtableUpdate` on any non-2xx response. Exposes
// the HTTP status so callers can branch on it — most importantly, the webhook
// uses `status === 403 || status === 404` to detect a stale record ID (the
// Cart-Started row was deleted between session creation and payment) and fall
// back to creating a fresh row instead of letting the paid signup get stuck in
// Stripe retry hell. Airtable returns 403 for a valid-format-but-missing ID
// (deliberately conflated with permission errors so row existence isn't
// leakable) and 404 for a malformed ID; both indicate "row not reachable for
// PATCH" and warrant the create fallback.
export class AirtableError extends Error {
  status: number;
  body: string;
  constructor(status: number, body: string) {
    super(`Airtable ${status}: ${body}`);
    this.name = "AirtableError";
    this.status = status;
    this.body = body;
  }
}

function getCreds() {
  const token = process.env.AIRTABLE_TOKEN;
  const baseId = process.env.AIRTABLE_BASE_ID;
  if (!token || !baseId) {
    throw new Error("AIRTABLE_TOKEN or AIRTABLE_BASE_ID is not set");
  }
  return { token, baseId };
}

function cleanFields(fields: AirtableFields): AirtableFields {
  const cleaned: AirtableFields = {};
  for (const [k, v] of Object.entries(fields)) {
    if (v === undefined || v === null || v === "") continue;
    cleaned[k] = v;
  }
  return cleaned;
}

// Optional per-call options. `signal` lets callers bound the request with an
// `AbortController` so a slow Airtable can't hang a customer-facing route
// (Node `fetch` has no default timeout, so without this a degraded — not
// failing — Airtable would block forever).
export type AirtableRequestOptions = { signal?: AbortSignal };

export async function airtableCreate(
  tableName: string,
  fields: AirtableFields,
  options: AirtableRequestOptions = {}
): Promise<AirtableRecord> {
  const { token, baseId } = getCreds();

  const res = await fetch(
    `${AIRTABLE_API}/${baseId}/${encodeURIComponent(tableName)}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        records: [{ fields: cleanFields(fields) }],
        typecast: true,
      }),
      signal: options.signal,
    }
  );

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new AirtableError(res.status, text);
  }
  const data = (await res.json()) as { records: AirtableRecord[] };
  return data.records[0];
}

// Partial update: only the fields you pass are written; everything else is left
// alone. Used to flip a "Cart Started" row to "Enrolled" once Stripe confirms
// payment, without losing the original cart metadata captured at session
// creation time.
// Returns the first record matching `filterByFormula`, sorted newest-first
// by `Submitted`, or `null` if no match. Used by the Stripe webhook to find
// an existing "Cart Started" row when the pre-created record ID is missing
// or stale, so we don't duplicate-write on slow-Airtable races.
//
// Escape user-provided values with `airtableEscapeFormulaString` before
// interpolating them into the formula.
export async function airtableFind(
  tableName: string,
  filterByFormula: string,
  options: AirtableRequestOptions = {}
): Promise<AirtableRecord | null> {
  const { token, baseId } = getCreds();

  const params = new URLSearchParams({
    filterByFormula,
    maxRecords: "1",
    "sort[0][field]": "Submitted",
    "sort[0][direction]": "desc",
  });

  const res = await fetch(
    `${AIRTABLE_API}/${baseId}/${encodeURIComponent(tableName)}?${params}`,
    {
      headers: { Authorization: `Bearer ${token}` },
      signal: options.signal,
    }
  );

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new AirtableError(res.status, text);
  }
  const data = (await res.json()) as { records: AirtableRecord[] };
  return data.records[0] ?? null;
}

// Airtable formula string literals are wrapped in single quotes; embedded
// single quotes are escaped with backslash. Use this on any user-provided
// value going into `airtableFind`'s `filterByFormula`.
export function airtableEscapeFormulaString(s: string): string {
  return s.replace(/\\/g, "\\\\").replace(/'/g, "\\'");
}

export async function airtableUpdate(
  tableName: string,
  recordId: string,
  fields: AirtableFields,
  options: AirtableRequestOptions = {}
): Promise<AirtableRecord> {
  const { token, baseId } = getCreds();

  const res = await fetch(
    `${AIRTABLE_API}/${baseId}/${encodeURIComponent(tableName)}/${encodeURIComponent(recordId)}`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fields: cleanFields(fields),
        typecast: true,
      }),
      signal: options.signal,
    }
  );

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new AirtableError(res.status, text);
  }
  return (await res.json()) as AirtableRecord;
}
