/**
 * Sends BOTH variants of the contact-form auto-reply to a recipient so we can
 * preview adult-learner vs parent-of-child copy side by side.
 *
 * Usage: npx tsx --env-file=.env.local scripts/send-test-contact-auto-reply.ts <recipient>
 */

import { buildContactAutoReply } from "../src/lib/email-templates";

const recipient = process.argv[2];
if (!recipient) {
  console.error("Usage: npx tsx --env-file=.env.local scripts/send-test-contact-auto-reply.ts <recipient>");
  process.exit(1);
}

const apiKey = process.env.RESEND_API_KEY;
if (!apiKey) {
  console.error("RESEND_API_KEY missing from .env.local");
  process.exit(1);
}

const variants = [
  {
    label: "PARENT signing up child",
    payload: {
      studentFirstName: "Maya",
      studentLastName: "Larmer",
      parentFirstName: "Sarah",
      parentLastName: "Larmer",
      parentEmail: recipient,
      parentPhone: "305-555-0100",
      subjects: ["Electric Guitar"],
    },
    studentAge: 9,
  },
  {
    label: "ADULT signing themselves up",
    payload: {
      studentFirstName: "Zach",
      studentLastName: "Larmer",
      parentFirstName: "Zach",
      parentLastName: "Larmer",
      parentEmail: recipient,
      parentPhone: "305-555-0100",
      subjects: ["Voice", "Piano"],
    },
    studentAge: 32,
  },
];

async function send(label: string, payload: Record<string, unknown>, age: number) {
  const { subject, html, from, replyTo } = buildContactAutoReply(payload, age);
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to: recipient,
      subject: `[TEST · ${label}] ${subject}`,
      html,
      reply_to: replyTo,
    }),
  });
  const body = await res.json();
  if (!res.ok) {
    console.error(`❌ ${label} failed:`, body);
    return;
  }
  console.log(`✅ ${label} sent · Resend id: ${body.id}`);
}

async function main() {
  for (const v of variants) {
    await send(v.label, v.payload, v.studentAge);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
