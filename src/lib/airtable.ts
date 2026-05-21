const AIRTABLE_API = "https://api.airtable.com/v0";

type AirtableFields = Record<string, unknown>;

// Airtable POST /records and PATCH /records/{id} both return a record envelope
// with `id`. We normalize the create response to a single record so callers
// can do `const { id } = await airtableCreate(...)` to chain follow-up writes
// (e.g. stashing the record ID in Stripe session metadata for later update).
export type AirtableRecord = { id: string; fields: AirtableFields; createdTime?: string };

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

export async function airtableCreate(
  tableName: string,
  fields: AirtableFields
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
    }
  );

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Airtable ${res.status}: ${text}`);
  }
  const data = (await res.json()) as { records: AirtableRecord[] };
  return data.records[0];
}

// Partial update: only the fields you pass are written; everything else is left
// alone. Used to flip a "Cart Started" row to "Enrolled" once Stripe confirms
// payment, without losing the original cart metadata captured at session
// creation time.
export async function airtableUpdate(
  tableName: string,
  recordId: string,
  fields: AirtableFields
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
    }
  );

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Airtable ${res.status}: ${text}`);
  }
  return (await res.json()) as AirtableRecord;
}
