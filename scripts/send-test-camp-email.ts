/**
 * One-off script — sends a TEST of the updated parent camp-deposit email.
 *
 * Usage: npx tsx --env-file=.env.local scripts/send-test-camp-email.ts <recipient>
 */

import { buildCampDepositParentEmail } from "../src/lib/email-templates";

const recipient = process.argv[2];
if (!recipient) {
  console.error("Usage: npx tsx scripts/send-test-camp-email.ts <recipient>");
  process.exit(1);
}

const apiKey = process.env.RESEND_API_KEY;
const from = process.env.RESEND_FROM || "WSM Forms <onboarding@resend.dev>";

if (!apiKey) {
  console.error("RESEND_API_KEY missing from .env.local");
  process.exit(1);
}

async function main() {
  // Realistic dummy payload — uses real session codes (A + C) so dates render
  const { subject, html, replyTo } = buildCampDepositParentEmail({
    camperName: "Test Camper",
    camperAge: "10",
    instrument: "Guitar",
    parentName: "Zach Larmer",
    parentEmail: recipient,
    parentPhone: "305-555-0100",
    sessionCodes: ["A", "C"],
    cartTotal: 700,
    depositPaid: 350,
    balanceOwed: 350,
    amountPaidCents: 35000,
    currency: "usd",
    stripeSessionId: "cs_test_PREVIEW_EMAIL",
  });

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: recipient,
      subject: `[TEST PREVIEW] ${subject}`,
      html,
      reply_to: replyTo || "info@wynwoodschoolofmusic.com",
    }),
  });

  const body = await res.json();
  if (!res.ok) {
    console.error(`Resend error (${res.status}):`, body);
    process.exit(1);
  }

  console.log(`✅ Sent to ${recipient}`);
  console.log(`   Resend id: ${body.id}`);
  console.log(`   Subject:   [TEST PREVIEW] ${subject}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
