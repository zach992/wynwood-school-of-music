const AIRTABLE_API = "https://api.airtable.com/v0";

type AirtableFields = Record<string, unknown>;

export async function airtableCreate(tableName: string, fields: AirtableFields) {
  const token = process.env.AIRTABLE_TOKEN;
  const baseId = process.env.AIRTABLE_BASE_ID;
  if (!token || !baseId) {
    throw new Error("AIRTABLE_TOKEN or AIRTABLE_BASE_ID is not set");
  }

  const cleaned: AirtableFields = {};
  for (const [k, v] of Object.entries(fields)) {
    if (v === undefined || v === null || v === "") continue;
    cleaned[k] = v;
  }

  const res = await fetch(
    `${AIRTABLE_API}/${baseId}/${encodeURIComponent(tableName)}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        records: [{ fields: cleaned }],
        typecast: true,
      }),
    }
  );

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Airtable ${res.status}: ${text}`);
  }
  return res.json();
}
