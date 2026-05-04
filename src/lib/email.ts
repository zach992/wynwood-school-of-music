type SendOpts = {
  subject: string;
  html: string;
  replyTo?: string;
};

export async function sendFormNotification(opts: SendOpts): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not set");
  }
  const from = process.env.RESEND_FROM || "WSM Forms <onboarding@resend.dev>";
  const toEnv = process.env.RESEND_NOTIFY_TO || "info@wynwoodschoolofmusic.com";
  const to = toEnv.split(",").map((s) => s.trim()).filter(Boolean);

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to,
      subject: opts.subject,
      html: opts.html,
      reply_to: opts.replyTo,
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Resend ${res.status}: ${text}`);
  }
}
