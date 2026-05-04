import { NextRequest } from "next/server";
import { airtableCreate } from "@/lib/airtable";
import { sendFormNotification } from "@/lib/email";
import { buildTrialEmail } from "@/lib/email-templates";
import { calcAge, checkSpamGuard, joinNonEmpty } from "@/lib/form-utils";

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return new Response(null, { status: 400 });
  }

  if (checkSpamGuard(body)) return new Response(null, { status: 200 });

  const { website: _hp, _renderedAt: _t, ...p } = body;
  const studentName = joinNonEmpty(p.studentFirstName, p.studentLastName);
  const parentName = joinNonEmpty(p.parentFirstName, p.parentLastName);

  const tableName = process.env.AIRTABLE_TRIAL_TABLE || "Pvt Lesson Landing Page Leads";

  try {
    await airtableCreate(tableName, {
      Name: studentName || "(no name)",
      Submitted: new Date().toISOString(),
      "Student DOB": p.dob,
      "Student Age": calcAge(p.dob),
      Instrument: p.instrument,
      "Experience Level": p.experience,
      "Parent Name": parentName,
      "Parent Email": p.parentEmail,
      "Parent Phone": p.parentPhone,
      "How Heard": p.hearAboutUs,
      "Other Info": p.notes,
      "Lead Status": "New",
    });
  } catch (err) {
    console.error("[api/trial-lesson] Airtable write failed:", err);
    return new Response(JSON.stringify({ error: "Save failed" }), {
      status: 502,
      headers: { "content-type": "application/json" },
    });
  }

  if (process.env.RESEND_API_KEY) {
    sendFormNotification(buildTrialEmail(p, calcAge(p.dob))).catch((err) =>
      console.error("[api/trial-lesson] Resend email failed:", err)
    );
  }

  const webhookUrl = process.env.ZAPIER_TRIAL_WEBHOOK_URL;
  if (webhookUrl) {
    fetch(webhookUrl, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ...p, _form: "trial", _submittedAt: new Date().toISOString() }),
    }).catch((err) => console.error("[api/trial-lesson] Zapier forward failed:", err));
  }

  return new Response(null, { status: 200 });
}
