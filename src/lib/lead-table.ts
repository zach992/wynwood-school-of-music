export const DEFAULT_LEADS_TABLE = "Leads";

export type LeadFormSource = "contact" | "trial";

const FORM_SOURCE_LABELS: Record<LeadFormSource, string> = {
  contact: "Contact Us Form",
  trial: "Trial Lesson Form",
};

export function leadTableName(
  configuredName: string | undefined = process.env.AIRTABLE_LEADS_TABLE
): string {
  return configuredName?.trim() || DEFAULT_LEADS_TABLE;
}

export function airtableLeadSourceFields(
  source: LeadFormSource
): { "Form Source": string } {
  return { "Form Source": FORM_SOURCE_LABELS[source] };
}
