import { NextRequest } from "next/server";
import { airtableCreate } from "@/lib/airtable";
import { sendFormNotification } from "@/lib/email";
import { buildContactEmail, buildContactAutoReply } from "@/lib/email-templates";
import { fmtBirthdayMMDD } from "@/lib/form-utils";
import { mailchimpUpsertSubscriber } from "@/lib/mailchimp";

function esc(value: unknown): string {
  if (value === null || value === undefined) return "";
  const s = Array.isArray(value) ? value.join(", ") : String(value);
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function fmtDob(value: unknown): string {
  if (typeof value !== "string" || !value) return "";
  const d = new Date(value);
  if (isNaN(d.getTime())) return value;
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });
}

function calcAge(value: unknown): number | null {
  if (typeof value !== "string" || !value) return null;
  const d = new Date(value);
  if (isNaN(d.getTime())) return null;
  const now = new Date();
  let age = now.getUTCFullYear() - d.getUTCFullYear();
  const monthDiff = now.getUTCMonth() - d.getUTCMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getUTCDate() < d.getUTCDate())) {
    age--;
  }
  return age >= 0 && age <= 120 ? age : null;
}

function buildEmail(p: Record<string, unknown>) {
  const studentName = [p.studentFirstName, p.studentLastName].filter(Boolean).join(" ").trim() || "(no name)";
  const parentName = [p.parentFirstName, p.parentLastName].filter(Boolean).join(" ").trim() || "(no name)";
  const subjectsArr = Array.isArray(p.subjects) ? (p.subjects as unknown[]).map(String) : [];
  const subjectsStr = subjectsArr.length ? subjectsArr.join(", ") : "(none selected)";

  const emailSubject = `New WSM Contact: ${studentName}${subjectsArr.length ? ` — ${subjectsArr.slice(0, 3).join(", ")}${subjectsArr.length > 3 ? "…" : ""}` : ""}`;

  const row = (label: string, value: string) =>
    `<tr><td style="padding:6px 12px 6px 0;color:#666;vertical-align:top;white-space:nowrap;"><strong>${esc(label)}</strong></td><td style="padding:6px 0;color:#111;">${value || "<span style='color:#999;'>—</span>"}</td></tr>`;

  const emailBody = `<div style="font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;font-size:14px;color:#111;max-width:640px;">
  <h2 style="margin:0 0 8px;font-size:18px;">New Contact Form Submission</h2>
  <p style="margin:0 0 20px;color:#666;">Wynwood School of Music — wynwoodschoolofmusic.com/contact</p>

  <h3 style="margin:20px 0 4px;font-size:14px;text-transform:uppercase;letter-spacing:0.5px;color:#888;">Student</h3>
  <table style="border-collapse:collapse;width:100%;">
    ${row("Name", esc(studentName))}
    ${row("Date of Birth", esc(fmtDob(p.dob)))}
    ${row("Years of Experience", esc(p.experience))}
    ${row("Lesson Type", esc(p.lessonType))}
    ${row("Subjects", esc(subjectsStr))}
  </table>

  <h3 style="margin:24px 0 4px;font-size:14px;text-transform:uppercase;letter-spacing:0.5px;color:#888;">Parent / Guardian</h3>
  <table style="border-collapse:collapse;width:100%;">
    ${row("Name", esc(parentName))}
    ${row("Phone", `<a href="tel:${esc(p.parentPhone)}" style="color:#0066cc;text-decoration:none;">${esc(p.parentPhone)}</a>`)}
    ${row("Email", `<a href="mailto:${esc(p.parentEmail)}" style="color:#0066cc;text-decoration:none;">${esc(p.parentEmail)}</a>`)}
  </table>

  <h3 style="margin:24px 0 4px;font-size:14px;text-transform:uppercase;letter-spacing:0.5px;color:#888;">Other</h3>
  <table style="border-collapse:collapse;width:100%;">
    ${row("How did you hear about us?", esc(p.hearAboutUs))}
  </table>

  <p style="margin:28px 0 0;color:#999;font-size:12px;border-top:1px solid #eee;padding-top:12px;">Submitted ${esc(new Date().toLocaleString("en-US", { timeZone: "America/New_York", dateStyle: "medium", timeStyle: "short" }))} ET</p>
</div>`;

  return { emailSubject, emailBody };
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return new Response(null, { status: 400 });
  }

  // Honeypot tripped — silently succeed so the bot doesn't learn anything
  if (typeof body.website === "string" && body.website.length > 0) {
    return new Response(null, { status: 200 });
  }

  // Submitted faster than a human could fill it out
  const renderedAt = body._renderedAt;
  if (typeof renderedAt !== "number" || Date.now() - renderedAt < 3_000) {
    return new Response(null, { status: 200 });
  }

  const { website: _hp, _renderedAt: _t, ...payload } = body;
  const { emailSubject, emailBody } = buildEmail(payload);
  const studentAge = calcAge(payload.dob);
  const subjectsArr = Array.isArray(payload.subjects)
    ? (payload.subjects as unknown[]).map(String)
    : [];
  const studentFullName = [payload.studentFirstName, payload.studentLastName].filter(Boolean).join(" ");
  const parentFullName = [payload.parentFirstName, payload.parentLastName].filter(Boolean).join(" ");
  const submittedAt = new Date().toISOString();

  const enriched = {
    ...payload,
    studentAge,
    studentFullName,
    parentFullName,
    subjectsList: subjectsArr.join(", "),
    _form: "contact",
    _submittedAt: submittedAt,
    _userAgent: req.headers.get("user-agent") ?? null,
    _emailSubject: emailSubject,
    _emailBody: emailBody,
  };

  const tableName = process.env.AIRTABLE_CONTACT_TABLE || "Main Contact Form Leads";
  const airtablePromise = airtableCreate(tableName, {
    Name: studentFullName || "(no name)",
    Submitted: submittedAt,
    "Student DOB": payload.dob,
    "Student Age": studentAge,
    "Lesson Type": payload.lessonType,
    Instruments: subjectsArr,
    "Years Experience": payload.experience,
    "Parent Name": parentFullName,
    "Parent Email": payload.parentEmail,
    "Parent Phone": payload.parentPhone,
    "How Heard": payload.hearAboutUs,
    "Lead Status": "New",
  });

  const emailPromise: Promise<unknown> = process.env.RESEND_API_KEY
    ? sendFormNotification(buildContactEmail(payload, studentAge))
    : Promise.reject(new Error("RESEND_API_KEY not set"));

  // Parent-facing auto-reply (signed by Julianne). Non-critical: a failure
  // here doesn't fail the submission — Airtable + staff notification are.
  const autoReplyPromise: Promise<unknown> =
    process.env.RESEND_API_KEY && typeof payload.parentEmail === "string" && payload.parentEmail
      ? sendFormNotification({
          ...buildContactAutoReply(payload, studentAge),
          to: payload.parentEmail,
        })
      : Promise.reject(new Error("Auto-reply skipped (no RESEND_API_KEY or parentEmail)"));

  const year = new Date().getFullYear();
  const mailchimpPromise: Promise<unknown> =
    process.env.MAILCHIMP_API_KEY && typeof payload.parentEmail === "string" && payload.parentEmail
      ? mailchimpUpsertSubscriber({
          email: payload.parentEmail,
          firstName: typeof payload.parentFirstName === "string" ? payload.parentFirstName : undefined,
          lastName: typeof payload.parentLastName === "string" ? payload.parentLastName : undefined,
          mergeFields: {
            PHONE: typeof payload.parentPhone === "string" ? payload.parentPhone : "",
            MMERGE6: "Private Lessons",
            MMERGE7: subjectsArr.join(", "),
            MMERGE8: studentFullName,
            MMERGE9: parentFullName,
            BIRTHDAY: fmtBirthdayMMDD(payload.dob),
          },
          tags: [
            "Lead — Contact Form",
            `Website Lead ${year}`,
            ...subjectsArr.map((s) => `Instrument — ${s}`),
          ],
        })
      : Promise.reject(new Error("MAILCHIMP_API_KEY not set or no parent email"));

  const webhookUrl = process.env.ZAPIER_CONTACT_WEBHOOK_URL;
  const zapierPromise: Promise<unknown> = webhookUrl
    ? fetch(webhookUrl, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(enriched),
      }).then(async (r) => {
        if (!r.ok) throw new Error(`Zapier ${r.status}: ${await r.text().catch(() => "")}`);
        return r;
      })
    : Promise.reject(new Error("ZAPIER_CONTACT_WEBHOOK_URL not set"));

  const [airtableRes, emailRes, mailchimpRes, zapierRes, autoReplyRes] = await Promise.allSettled([
    airtablePromise,
    emailPromise,
    mailchimpPromise,
    zapierPromise,
    autoReplyPromise,
  ]);

  if (airtableRes.status === "rejected") {
    console.error("[api/contact] Airtable write failed:", airtableRes.reason);
  }
  if (emailRes.status === "rejected") {
    console.error("[api/contact] Resend email failed:", emailRes.reason);
  }
  if (mailchimpRes.status === "rejected") {
    console.error("[api/contact] Mailchimp subscribe failed:", mailchimpRes.reason);
  }
  if (zapierRes.status === "rejected") {
    console.error("[api/contact] Zapier forward failed:", zapierRes.reason);
  }
  if (autoReplyRes.status === "rejected") {
    console.error("[api/contact] Auto-reply to lead failed:", autoReplyRes.reason);
  }

  if (airtableRes.status === "rejected" && emailRes.status === "rejected") {
    return new Response(JSON.stringify({ error: "Critical destinations failed" }), {
      status: 502,
      headers: { "content-type": "application/json" },
    });
  }

  return new Response(null, { status: 200 });
}
