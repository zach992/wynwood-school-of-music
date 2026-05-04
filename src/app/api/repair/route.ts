import { NextRequest } from "next/server";
import { airtableCreate } from "@/lib/airtable";
import { sendFormNotification } from "@/lib/email";
import { buildRepairEmail } from "@/lib/email-templates";
import { asArray, checkSpamGuard } from "@/lib/form-utils";

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return new Response(null, { status: 400 });
  }

  if (checkSpamGuard(body)) return new Response(null, { status: 200 });

  const { website: _hp, _renderedAt: _t, ...p } = body;
  const services = asArray(p.services);

  const tableName = process.env.AIRTABLE_REPAIR_TABLE || "Repair Requests";

  try {
    await airtableCreate(tableName, {
      "Customer Name": p.name || "(no name)",
      Email: p.email,
      Phone: p.phone,
      "Repair Services": services.length ? services.map((s) => `• ${s}`).join("\n") : "",
      Submitted: new Date().toISOString(),
      "Repair Status": "New",
    });
  } catch (err) {
    console.error("[api/repair] Airtable write failed:", err);
    return new Response(JSON.stringify({ error: "Save failed" }), {
      status: 502,
      headers: { "content-type": "application/json" },
    });
  }

  if (process.env.RESEND_API_KEY) {
    sendFormNotification(buildRepairEmail(p)).catch((err) =>
      console.error("[api/repair] Resend email failed:", err)
    );
  }

  const webhookUrl = process.env.ZAPIER_REPAIR_WEBHOOK_URL;
  if (webhookUrl) {
    fetch(webhookUrl, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ...p, _form: "repair", _submittedAt: new Date().toISOString() }),
    }).catch((err) => console.error("[api/repair] Zapier forward failed:", err));
  }

  return new Response(null, { status: 200 });
}
