import crypto from "node:crypto";

type AddSubscriberOpts = {
  email: string;
  firstName?: string;
  lastName?: string;
  tags?: string[];
  /** Additional Mailchimp merge field tags (e.g. PHONE, MMERGE6, BIRTHDAY). Empty values are dropped. */
  mergeFields?: Record<string, string | number | undefined>;
};

export async function mailchimpUpsertSubscriber(opts: AddSubscriberOpts): Promise<void> {
  const apiKey = process.env.MAILCHIMP_API_KEY;
  const audienceId = process.env.MAILCHIMP_AUDIENCE_ID;
  if (!apiKey || !audienceId) {
    throw new Error("MAILCHIMP_API_KEY or MAILCHIMP_AUDIENCE_ID is not set");
  }

  const dc = apiKey.split("-")[1];
  if (!dc) {
    throw new Error("MAILCHIMP_API_KEY missing datacenter suffix (e.g., '-us3')");
  }

  const email = opts.email.trim().toLowerCase();
  if (!email || !email.includes("@")) {
    throw new Error(`Invalid email: ${opts.email}`);
  }

  const subscriberHash = crypto.createHash("md5").update(email).digest("hex");
  const url = `https://${dc}.api.mailchimp.com/3.0/lists/${audienceId}/members/${subscriberHash}`;

  const merge_fields: Record<string, string | number> = {};
  if (opts.firstName?.trim()) merge_fields.FNAME = opts.firstName.trim();
  if (opts.lastName?.trim()) merge_fields.LNAME = opts.lastName.trim();
  if (opts.mergeFields) {
    for (const [k, v] of Object.entries(opts.mergeFields)) {
      if (v === undefined || v === null || v === "") continue;
      merge_fields[k] = v;
    }
  }

  const body = {
    email_address: email,
    status_if_new: "subscribed",
    merge_fields,
    tags: (opts.tags ?? []).filter(Boolean),
  };

  const auth = Buffer.from(`anystring:${apiKey}`).toString("base64");
  const res = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Mailchimp ${res.status}: ${text}`);
  }
}
