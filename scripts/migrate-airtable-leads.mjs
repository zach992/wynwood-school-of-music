#!/usr/bin/env node

// Safe to rerun after cutover: --apply only copies legacy records that are missing.
// Before cutover only, --apply --reconcile also makes existing migrated copies match
// the legacy tables. Never reconcile after staff begin editing the unified table.

const API = "https://api.airtable.com/v0";
const SOURCE_TABLES = [
  {
    name: process.env.AIRTABLE_CONTACT_TABLE?.trim() || "Main Contact Form Leads",
    formSource: "Contact Us Form",
    kind: "contact",
  },
  {
    name: process.env.AIRTABLE_TRIAL_TABLE?.trim() || "Pvt Lesson Landing Page Leads",
    formSource: "Trial Lesson Form",
    kind: "trial",
  },
];
const TARGET_TABLE = process.env.AIRTABLE_LEADS_TABLE?.trim() || "Leads";
const APPLY = process.argv.includes("--apply");
const RECONCILE = process.argv.includes("--reconcile");

const token = process.env.AIRTABLE_TOKEN;
const baseId = process.env.AIRTABLE_BASE_ID;
if (!token || !baseId) {
  throw new Error("AIRTABLE_TOKEN and AIRTABLE_BASE_ID are required");
}

const commonFields = [
  "Name", "Student DOB", "Student Age", "Lesson Type", "Instruments",
  "Years Experience", "Parent Name", "Parent Email", "Parent Phone", "How Heard",
  "Other Info", "Lead Status", "Submitted", "Lead ID", "GCLID", "GBRAID", "WBRAID",
  "UTM Source", "UTM Medium", "UTM Campaign", "UTM Term", "UTM Content",
  "Google Campaign ID", "Google Ad Group ID", "Google Creative ID", "Google Match Type",
  "Google Device", "Landing Page", "Referrer", "PostHog Distinct ID",
  "Marketing Attribution", "Final Outcome", "Qualified At", "Finalized At",
  "Google Qualified Lead Uploaded At", "Google Enrolled Student Uploaded At",
  "Google Ads Upload Error",
];
const migratedFieldNames = [
  ...commonFields,
  "Form Source",
  "Legacy Source Record ID",
];

const choice = (name) => ({ name });
const dateTimeOptions = {
  dateFormat: { name: "local", format: "l" },
  timeFormat: { name: "12hour", format: "h:mma" },
  timeZone: "America/New_York",
};

const targetFields = [
  { name: "Name", type: "singleLineText" },
  { name: "Form Source", type: "singleSelect", options: { choices: [choice("Contact Us Form"), choice("Trial Lesson Form")] } },
  { name: "Legacy Source Record ID", type: "singleLineText" },
  { name: "Student DOB", type: "date", options: { dateFormat: { name: "local", format: "l" } } },
  { name: "Student Age", type: "number", options: { precision: 0 } },
  { name: "Lesson Type", type: "singleSelect", options: { choices: [choice("Private Lessons"), choice("Band and Private Lesson")] } },
  { name: "Instruments", type: "multipleSelects", options: { choices: [
    "Acoustic Guitar", "Bass", "Cello", "Drums", "Electric Bass", "Electric Guitar",
    "Guitar", "Horns (Saxophone, Trumpet)", "Keyboard", "Music Production", "Music Theory", "Musical Theater (Voice)",
    "Saxophone", "Songwriting", "Spoken Word / Poetry", "Strings (Violin, Viola, Cello)",
    "Trumpet", "Ukulele", "Viola", "Violin", "Voice",
  ].map(choice) } },
  { name: "Years Experience", type: "singleLineText" },
  { name: "Parent Name", type: "singleLineText" },
  { name: "Parent Email", type: "email" },
  { name: "Parent Phone", type: "phoneNumber" },
  { name: "How Heard", type: "singleLineText" },
  { name: "Other Info", type: "multilineText" },
  { name: "Staff Notes", type: "multilineText" },
  { name: "Next Follow Up", type: "dateTime", options: dateTimeOptions },
  { name: "Lead Status", type: "singleSelect", options: { choices: [
    "New", "Contacted", "Trial Booked", "Took trial, Pending Enrollment",
    "Future contact lead", "Enrolled", "Closed",
  ].map(choice) } },
  { name: "Submitted", type: "dateTime", options: dateTimeOptions },
  { name: "Lead ID", type: "singleLineText" },
  { name: "GCLID", type: "singleLineText" },
  { name: "GBRAID", type: "singleLineText" },
  { name: "WBRAID", type: "singleLineText" },
  { name: "UTM Source", type: "singleLineText" },
  { name: "UTM Medium", type: "singleLineText" },
  { name: "UTM Campaign", type: "singleLineText" },
  { name: "UTM Term", type: "singleLineText" },
  { name: "UTM Content", type: "singleLineText" },
  { name: "Google Campaign ID", type: "singleLineText" },
  { name: "Google Ad Group ID", type: "singleLineText" },
  { name: "Google Creative ID", type: "singleLineText" },
  { name: "Google Match Type", type: "singleLineText" },
  { name: "Google Device", type: "singleLineText" },
  { name: "Landing Page", type: "multilineText" },
  { name: "Referrer", type: "multilineText" },
  { name: "PostHog Distinct ID", type: "singleLineText" },
  { name: "Marketing Attribution", type: "multilineText" },
  { name: "Final Outcome", type: "singleSelect", options: { choices: [
    "Unqualified", "Qualified – Not Enrolled", "Enrolled",
  ].map(choice) } },
  { name: "Qualified At", type: "dateTime", options: dateTimeOptions },
  { name: "Finalized At", type: "dateTime", options: dateTimeOptions },
  { name: "Google Qualified Lead Uploaded At", type: "dateTime", options: dateTimeOptions },
  { name: "Google Enrolled Student Uploaded At", type: "dateTime", options: dateTimeOptions },
  { name: "Google Ads Upload Error", type: "multilineText" },
];

async function request(path, options = {}) {
  const response = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(`Airtable ${response.status}: ${JSON.stringify(payload)}`);
  }
  return payload;
}

async function getTables() {
  return (await request(`/meta/bases/${baseId}/tables`)).tables;
}

async function listRecords(tableName) {
  const records = [];
  let offset;
  do {
    const params = new URLSearchParams({ pageSize: "100" });
    if (offset) params.set("offset", offset);
    const page = await request(`/${baseId}/${encodeURIComponent(tableName)}?${params}`);
    records.push(...page.records);
    offset = page.offset;
  } while (offset);
  return records;
}

function compact(fields) {
  return Object.fromEntries(Object.entries(fields).filter(([, value]) =>
    value !== undefined && value !== null && value !== "" &&
    (!Array.isArray(value) || value.length > 0)
  ));
}

function mapRecord(source, record) {
  const original = record.fields;
  const mapped = {};
  for (const field of commonFields) {
    if (Object.hasOwn(original, field)) mapped[field] = original[field];
  }
  mapped["Form Source"] = source.formSource;
  mapped["Legacy Source Record ID"] = record.id;

  if (source.kind === "trial") {
    mapped["Lesson Type"] = original["Lesson Type"] || "Private Lessons";
    mapped.Instruments = original.Instruments || (original.Instrument ? [original.Instrument] : undefined);
    mapped["Years Experience"] = original["Years Experience"] || original["Experience Level"];
  }

  return compact(mapped);
}

function stable(value) {
  if (Array.isArray(value)) return [...value].sort();
  return value;
}

function compareMapped(expected, actual) {
  const mismatches = [];
  for (const key of migratedFieldNames) {
    if (JSON.stringify(stable(expected[key])) !== JSON.stringify(stable(actual[key]))) {
      mismatches.push(key);
    }
  }
  return mismatches;
}

function fieldsForUpdate(mapped) {
  return Object.fromEntries(migratedFieldNames.map((name) => [
    name,
    Object.hasOwn(mapped, name) ? mapped[name] : null,
  ]));
}

function targetSchemaErrors(target) {
  const actualByName = new Map(target.fields.map((field) => [field.name, field]));
  return targetFields.flatMap((expected) => {
    const actual = actualByName.get(expected.name);
    if (!actual) return [`missing field ${expected.name}`];
    if (actual.type !== expected.type) {
      return [`${expected.name} must be ${expected.type}, found ${actual.type}`];
    }

    const requiredChoices = expected.options?.choices?.map(({ name }) => name) || [];
    if (!requiredChoices.length) return [];
    const actualChoices = new Set(actual.options?.choices?.map(({ name }) => name) || []);
    const missingChoices = requiredChoices.filter((name) => !actualChoices.has(name));
    return missingChoices.length
      ? [`${expected.name} is missing choices: ${missingChoices.join(", ")}`]
      : [];
  });
}

async function createTargetIfNeeded(tables) {
  const existing = tables.find((table) => table.name === TARGET_TABLE);
  if (existing) return existing;
  if (!APPLY) return null;
  return request(`/meta/bases/${baseId}/tables`, {
    method: "POST",
    body: JSON.stringify({ name: TARGET_TABLE, fields: targetFields }),
  });
}

async function createRecords(tableName, records) {
  for (let index = 0; index < records.length; index += 10) {
    await request(`/${baseId}/${encodeURIComponent(tableName)}`, {
      method: "POST",
      body: JSON.stringify({
        records: records.slice(index, index + 10).map((fields) => ({ fields })),
        typecast: true,
      }),
    });
  }
}

async function updateRecords(tableName, records) {
  for (let index = 0; index < records.length; index += 10) {
    await request(`/${baseId}/${encodeURIComponent(tableName)}`, {
      method: "PATCH",
      body: JSON.stringify({
        records: records.slice(index, index + 10).map(({ id, mapped }) => ({
          id,
          fields: fieldsForUpdate(mapped),
        })),
        typecast: true,
      }),
    });
  }
}

async function main() {
  if (RECONCILE && !APPLY) {
    throw new Error("--reconcile requires --apply");
  }

  const distinctTableNames = new Set([
    TARGET_TABLE,
    ...SOURCE_TABLES.map((source) => source.name),
  ].map((name) => name.toLocaleLowerCase()));
  if (distinctTableNames.size !== SOURCE_TABLES.length + 1) {
    throw new Error("Target and legacy source table names must be distinct");
  }

  const tables = await getTables();
  for (const source of SOURCE_TABLES) {
    if (!tables.some((table) => table.name === source.name)) {
      throw new Error(`Missing source table: ${source.name}`);
    }
  }

  const sourceRows = [];
  for (const source of SOURCE_TABLES) {
    for (const record of await listRecords(source.name)) {
      sourceRows.push({ source, record, mapped: mapRecord(source, record) });
    }
  }

  let target = await createTargetIfNeeded(tables);
  if (!target) {
    console.log(JSON.stringify({ mode: "plan", target: TARGET_TABLE, sourceRecords: sourceRows.length, targetExists: false }, null, 2));
    return;
  }

  const schemaErrors = targetSchemaErrors(target);
  if (schemaErrors.length) {
    throw new Error(`Target table schema is incompatible: ${schemaErrors.join("; ")}`);
  }

  let targetRows = await listRecords(TARGET_TABLE);
  const targetByLegacyId = new Map(targetRows.map((row) => [row.fields["Legacy Source Record ID"], row]));
  const existingLegacyIds = new Set(targetRows.map((row) => row.fields["Legacy Source Record ID"]).filter(Boolean));
  const pending = sourceRows.filter(({ record }) => !existingLegacyIds.has(record.id));
  const changed = sourceRows.flatMap(({ record, mapped }) => {
    const targetRow = targetByLegacyId.get(record.id);
    return targetRow && compareMapped(mapped, targetRow.fields).length
      ? [{ id: targetRow.id, mapped }]
      : [];
  });

  if (!APPLY) {
    console.log(JSON.stringify({ mode: "plan", target: TARGET_TABLE, sourceRecords: sourceRows.length, existingTargetRecords: targetRows.length, recordsToCreate: pending.length, sourceDifferences: changed.length, targetExists: true }, null, 2));
    return;
  }

  await createRecords(TARGET_TABLE, pending.map(({ mapped }) => mapped));
  if (RECONCILE) await updateRecords(TARGET_TABLE, changed);
  targetRows = await listRecords(TARGET_TABLE);
  const migratedRows = targetRows.filter((row) => row.fields["Legacy Source Record ID"]);
  const byLegacyId = new Map(migratedRows.map((row) => [row.fields["Legacy Source Record ID"], row]));
  const duplicateLegacyIds = migratedRows.length - new Set(migratedRows.map((row) => row.fields["Legacy Source Record ID"])).size;
  const verificationErrors = [];
  const idsToVerify = new Set(
    (RECONCILE ? sourceRows : pending).map(({ record }) => record.id)
  );
  for (const { record, mapped } of sourceRows) {
    if (!idsToVerify.has(record.id)) continue;
    const migrated = byLegacyId.get(record.id);
    if (!migrated) {
      verificationErrors.push({ sourceRecordId: record.id, fields: ["missing record"] });
      continue;
    }
    const mismatches = compareMapped(mapped, migrated.fields);
    if (mismatches.length) verificationErrors.push({ sourceRecordId: record.id, fields: mismatches });
  }

  const report = {
    mode: "apply",
    target: TARGET_TABLE,
    reconciled: RECONCILE,
    sourceRecords: sourceRows.length,
    created: pending.length,
    sourceDifferences: changed.length,
    updated: RECONCILE ? changed.length : 0,
    targetRecords: targetRows.length,
    liveTargetRecords: targetRows.length - migratedRows.length,
    migratedRecords: migratedRows.length,
    duplicateLegacyIds,
    verificationErrors,
  };
  console.log(JSON.stringify(report, null, 2));
  if (migratedRows.length !== sourceRows.length || duplicateLegacyIds || verificationErrors.length) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
