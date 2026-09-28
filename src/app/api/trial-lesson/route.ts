import { NextRequest } from "next/server";
import { airtableCreate } from "@/lib/airtable";
import { sendFormNotification } from "@/lib/email";
import { buildTrialEmail } from "@/lib/email-templates";
import { acceptedResponse, calcAge, checkSpamGuard, discardedResponse, fmtBirthdayMMDD, joinNonEmpty } from "@/lib/form-utils";
import { mailchimpUpsertSubscriber } from "@/lib/mailchimp";
import { airtableAttributionFields } from "@/lib/lead-attribution";
import { airtableLeadSourceFields, leadTableName } from "@/lib/lead-table";
import { BASECAMP_LEAD_FOLLOW_UP_HTML } from "@/lib/basecamp-lead";

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return new Response(null, { status: 400 });
  }

  if (checkSpamGuard(body)) return discardedResponse();

  const { website: _hp, _elapsedMs: _t, _attribution, ...p } = body;
  const studentName = joinNonEmpty(p.studentFirstName, p.studentLastName);
  const parentName = joinNonEmpty(p.parentFirstName, p.parentLastName);
  const studentAge = calcAge(p.dob);
  const submittedAt = new Date().toISOString();
  const notification = buildTrialEmail(p, studentAge);
  const leadId = crypto.randomUUID();

  const tableName = leadTableName();

  try {
    await airtableCreate(tableName, {
      Name: studentName || "(no name)",
      Submitted: submittedAt,
      "Student DOB": p.dob,
      "Student Age": studentAge,
      "Lesson Type": "Private Lessons",
      Instruments: typeof p.instrument === "string" && p.instrument ? [p.instrument] : undefined,
      "Years Experience": p.experience,
      "Parent Name": parentName,
      "Parent Email": p.parentEmail,
      "Parent Phone": p.parentPhone,
      "How Heard": p.hearAboutUs,
      "Other Info": p.notes,
      "Lead Status": "New",
      ...airtableLeadSourceFields("trial"),
      ...airtableAttributionFields(_attribution, leadId),
    });
  } catch (err) {
    console.error("[api/trial-lesson] Airtable write failed:", err);
    return new Response(JSON.stringify({ error: "Save failed" }), {
      status: 502,
      headers: { "content-type": "application/json" },
    });
  }

  if (process.env.RESEND_API_KEY) {
    sendFormNotification(notification).catch((err) =>
      console.error("[api/trial-lesson] Resend email failed:", err)
    );
  }

  if (process.env.MAILCHIMP_API_KEY && typeof p.parentEmail === "string" && p.parentEmail) {
    const year = new Date().getFullYear();
    const tags = ["Lead — Trial Lesson", `Website Lead ${year}`];
    if (typeof p.instrument === "string" && p.instrument) tags.push(`Instrument — ${p.instrument}`);
    mailchimpUpsertSubscriber({
      email: p.parentEmail,
      firstName: typeof p.parentFirstName === "string" ? p.parentFirstName : undefined,
      lastName: typeof p.parentLastName === "string" ? p.parentLastName : undefined,
      mergeFields: {
        PHONE: typeof p.parentPhone === "string" ? p.parentPhone : "",
        MMERGE6: "Trial Lesson",
        MMERGE7: typeof p.instrument === "string" ? p.instrument : "",
        MMERGE8: studentName,
        MMERGE9: parentName,
        BIRTHDAY: fmtBirthdayMMDD(p.dob),
      },
      tags,
    }).catch((err) => console.error("[api/trial-lesson] Mailchimp subscribe failed:", err));
  }

  const webhookUrl = process.env.ZAPIER_TRIAL_WEBHOOK_URL;
  if (webhookUrl) {
    try {
      const zapierRes = await fetch(webhookUrl, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          ...p,
          studentAge,
          studentFullName: studentName,
          parentFullName: parentName,
          _form: "trial",
          _submittedAt: submittedAt,
          _userAgent: req.headers.get("user-agent") ?? null,
          _emailSubject: notification.subject,
          // The existing Basecamp Zap maps this field into the to-do body.
          // Keep it aligned with the contact-form webhook's stable contract.
          _emailBody: notification.html + BASECAMP_LEAD_FOLLOW_UP_HTML,
        }),
      });
      if (!zapierRes.ok) {
        throw new Error(`Zapier ${zapierRes.status}: ${await zapierRes.text().catch(() => "")}`);
      }
    } catch (err) {
      console.error("[api/trial-lesson] Zapier forward failed:", err);
    }
  }

  return acceptedResponse({ leadId });
}
