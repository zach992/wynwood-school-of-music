import { NextRequest } from "next/server";
import { airtableCreate } from "@/lib/airtable";
import { sendFormNotification } from "@/lib/email";
import { mailchimpUpsertSubscriber } from "@/lib/mailchimp";

/**
 * Lightweight "interest" form on the camp page — just 3 fields (name, email, phone).
 * Distinct from /api/camp-signup which is the full registration form.
 * Routes to: Airtable (Lead Source = Interest Form) + Mailchimp + Resend.
 */
export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return new Response(null, { status: 400 });
  }

  const parentName = typeof body.parentName === "string" ? body.parentName.trim() : "";
  const parentEmail = typeof body.parentEmail === "string" ? body.parentEmail.trim() : "";
  const parentPhone = typeof body.parentPhone === "string" ? body.parentPhone.trim() : "";
  if (!parentEmail) return new Response(JSON.stringify({ error: "Email required" }), { status: 400 });

  const [firstName, ...lastParts] = parentName.split(/\s+/);
  const lastName = lastParts.join(" ");
  const year = new Date().getFullYear();

  const tableName = process.env.AIRTABLE_CAMP_TABLE || "Summer Camp Signups";
  airtableCreate(tableName, {
    Name: parentName || parentEmail,
    Submitted: new Date().toISOString(),
    "Parent Name": parentName,
    "Parent Email": parentEmail,
    "Parent Phone": parentPhone,
    "Lead Status": "New",
    "Lead Source": "Interest Form",
  }).catch((err) => console.error("[api/camp-lead] Airtable failed:", err));

  if (process.env.MAILCHIMP_API_KEY) {
    mailchimpUpsertSubscriber({
      email: parentEmail,
      firstName,
      lastName,
      mergeFields: {
        PHONE: parentPhone,
        MMERGE6: "Summer Camp Interest",
        MMERGE9: parentName,
      },
      tags: ["Lead — Camp Interest", `Website Lead ${year}`],
    }).catch((err) => console.error("[api/camp-lead] Mailchimp failed:", err));
  }

  if (process.env.RESEND_API_KEY) {
    sendFormNotification({
      subject: `New Camp Interest: ${parentName || parentEmail}`,
      html: `<div style="font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;font-size:14px;color:#111;max-width:640px;margin:0 auto;background:#fff;border:1px solid #eee;border-radius:8px;overflow:hidden;">
        <div style="background:#994878;color:#fff;padding:18px 24px;">
          <div style="font-size:11px;text-transform:uppercase;letter-spacing:1.5px;opacity:0.85;">Camp page interest form · /musicperformancecamp</div>
          <h1 style="margin:6px 0 0;font-size:22px;font-weight:700;">${escapeHtml(parentName || "(no name)")}</h1>
        </div>
        <div style="padding:24px;font-size:14px;">
          <p style="margin:0 0 16px;color:#666;">A parent submitted the "Not quite ready?" lead capture form on the camp page. They want a follow-up call within 24 hours.</p>
          <table style="border-collapse:collapse;width:100%;">
            <tr><td style="padding:6px 12px 6px 0;color:#666;width:120px;font-weight:600;">Name</td><td>${escapeHtml(parentName) || "<span style='color:#bbb;'>—</span>"}</td></tr>
            <tr><td style="padding:6px 12px 6px 0;color:#666;width:120px;font-weight:600;">Email</td><td><a href="mailto:${escapeHtml(parentEmail)}" style="color:#994878;">${escapeHtml(parentEmail)}</a></td></tr>
            <tr><td style="padding:6px 12px 6px 0;color:#666;width:120px;font-weight:600;">Phone</td><td><a href="tel:${escapeHtml(parentPhone)}" style="color:#994878;">${escapeHtml(parentPhone)}</a></td></tr>
          </table>
        </div>
      </div>`,
      replyTo: parentEmail,
    }).catch((err) => console.error("[api/camp-lead] Resend failed:", err));
  }

  return new Response(null, { status: 200 });
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
