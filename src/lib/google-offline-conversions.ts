import "server-only";

import { airtableList, airtableUpdate, type AirtableRecord } from "@/lib/airtable";
import { ingestOfflineConversion } from "@/lib/google-data-manager";

function leadTables(): string[] {
  return [
    process.env.AIRTABLE_CONTACT_TABLE || "Main Contact Form Leads",
    process.env.AIRTABLE_TRIAL_TABLE || "Pvt Lesson Landing Page Leads",
  ];
}
const FIELDS = [
  "Lead ID",
  "Parent Email",
  "Parent Phone",
  "GCLID",
  "GBRAID",
  "WBRAID",
  "Final Outcome",
  "Qualified At",
  "Finalized At",
  "Submitted",
  "Google Qualified Lead Uploaded At",
  "Google Enrolled Student Uploaded At",
] as const;

type Stage = "qualified" | "enrolled";

type UploadSummary = {
  scanned: number;
  uploaded: number;
  validated: number;
  skipped: number;
  failed: number;
};

function stringField(record: AirtableRecord, name: string): string | undefined {
  const value = record.fields[name];
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function eventTimestamp(record: AirtableRecord, stage: Stage): string {
  const candidates =
    stage === "qualified"
      ? ["Qualified At", "Finalized At", "Submitted"]
      : ["Finalized At", "Qualified At", "Submitted"];
  for (const field of candidates) {
    const value = stringField(record, field);
    if (value && Number.isFinite(Date.parse(value))) return value;
  }
  throw new Error(`Lead ${record.id} has no valid conversion timestamp`);
}

function errorMessage(stage: Stage, error: unknown): string {
  const message = error instanceof Error ? error.message : String(error);
  return `${stage}: ${message}`;
}

async function uploadStage(
  table: string,
  record: AirtableRecord,
  stage: Stage,
  validateOnly: boolean
) {
  const leadId = stringField(record, "Lead ID");
  if (!leadId) throw new Error(`Lead ${record.id} has no Lead ID`);

  const conversionActionId =
    stage === "qualified"
      ? process.env.GOOGLE_ADS_QUALIFIED_LEAD_ACTION_ID
      : process.env.GOOGLE_ADS_ENROLLED_STUDENT_ACTION_ID;
  if (!conversionActionId) {
    throw new Error(
      stage === "qualified"
        ? "GOOGLE_ADS_QUALIFIED_LEAD_ACTION_ID is not set"
        : "GOOGLE_ADS_ENROLLED_STUDENT_ACTION_ID is not set"
    );
  }

  const response = await ingestOfflineConversion(
    {
      conversionActionId,
      eventTimestamp: eventTimestamp(record, stage),
      transactionId: `${leadId}:${stage}`,
      email: stringField(record, "Parent Email"),
      phone: stringField(record, "Parent Phone"),
      gclid: stringField(record, "GCLID"),
      gbraid: stringField(record, "GBRAID"),
      wbraid: stringField(record, "WBRAID"),
    },
    { validateOnly }
  );

  if (response.fieldWarnings?.length) {
    console.warn("Google Data Manager accepted a conversion with field warnings", {
      table,
      recordId: record.id,
      stage,
      requestId: response.requestId,
      warningCount: response.fieldWarnings.length,
    });
  }
}

export async function syncOfflineConversions(options: {
  validateOnly?: boolean;
  maxRecordsPerTable?: number;
} = {}): Promise<UploadSummary> {
  const validateOnly = options.validateOnly ?? false;
  const summary: UploadSummary = {
    scanned: 0,
    uploaded: 0,
    validated: 0,
    skipped: 0,
    failed: 0,
  };

  for (const table of new Set(leadTables())) {
    // Only post-deployment leads have a Lead ID. Requiring it prevents an
    // accidental historical backfill and gives every event a stable key.
    const records = await airtableList(table, {
      fields: [...FIELDS],
      filterByFormula:
        "AND(NOT({Lead ID}=BLANK()),OR(AND(OR({Final Outcome}='Qualified – Not Enrolled',{Final Outcome}='Enrolled'),{Google Qualified Lead Uploaded At}=BLANK()),AND({Final Outcome}='Enrolled',{Google Enrolled Student Uploaded At}=BLANK())))",
      maxRecords: options.maxRecordsPerTable ?? 100,
    });

    for (const record of records) {
      summary.scanned += 1;
      const outcome = stringField(record, "Final Outcome");
      const stages: Stage[] = [];

      if (!record.fields["Google Qualified Lead Uploaded At"]) stages.push("qualified");
      if (outcome === "Enrolled" && !record.fields["Google Enrolled Student Uploaded At"]) {
        stages.push("enrolled");
      }
      if (stages.length === 0) {
        summary.skipped += 1;
        continue;
      }

      const errors: string[] = [];
      const uploadedStages: Stage[] = [];
      for (const stage of stages) {
        try {
          await uploadStage(table, record, stage, validateOnly);
          if (validateOnly) summary.validated += 1;
          else {
            summary.uploaded += 1;
            uploadedStages.push(stage);
          }
        } catch (error) {
          summary.failed += 1;
          errors.push(errorMessage(stage, error));
          console.error("Offline conversion upload failed", {
            table,
            recordId: record.id,
            stage,
            error: error instanceof Error ? error.message : String(error),
          });
        }
      }

      if (!validateOnly) {
        try {
          const uploadedAt = new Date().toISOString();
          const statusFields: Record<string, string | null> = {
            "Google Ads Upload Error": errors.length
              ? `${uploadedAt} — ${errors.join(" | ")}`.slice(0, 10_000)
              : null,
          };
          for (const stage of uploadedStages) {
            statusFields[
              stage === "qualified"
                ? "Google Qualified Lead Uploaded At"
                : "Google Enrolled Student Uploaded At"
            ] = uploadedAt;
          }

          // Persist all successful stage timestamps and the combined diagnostic
          // atomically. If this PATCH fails, no timestamp advances, so the
          // stable transaction IDs make the whole record safe to retry.
          await airtableUpdate(
            table,
            record.id,
            statusFields,
            { preserveNullFields: true }
          );
        } catch (airtableError) {
          // Keep processing other leads even when the diagnostic write is the
          // part that failed. Stable transaction IDs make later retries safe.
          console.error("Could not update Google Ads status in Airtable", {
            table,
            recordId: record.id,
            error:
              airtableError instanceof Error
                ? airtableError.message
                : String(airtableError),
          });
        }
      }
    }
  }

  return summary;
}
