export function calcAge(value: unknown): number | null {
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

export function checkSpamGuard(body: Record<string, unknown>): boolean {
  if (typeof body.website === "string" && body.website.length > 0) return true;
  const renderedAt = body._renderedAt;
  if (typeof renderedAt !== "number" || Date.now() - renderedAt < 3_000) return true;
  return false;
}

export function joinNonEmpty(...parts: unknown[]): string {
  return parts.map((p) => (typeof p === "string" ? p.trim() : "")).filter(Boolean).join(" ");
}

export function asArray(value: unknown): string[] {
  return Array.isArray(value) ? value.map(String) : [];
}

/** Mailchimp BIRTHDAY merge field expects MM/DD (no year). */
export function fmtBirthdayMMDD(value: unknown): string | undefined {
  if (typeof value !== "string" || !value) return undefined;
  const d = new Date(value);
  if (isNaN(d.getTime())) return undefined;
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(d.getUTCDate()).padStart(2, "0");
  return `${mm}/${dd}`;
}
