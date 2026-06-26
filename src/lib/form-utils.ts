/**
 * True only for a strict `YYYY-MM-DD` string that is a REAL calendar date.
 * `new Date()` silently normalizes overflow days (e.g. "2015-02-31" → Mar 3),
 * so we round-trip the parsed UTC components against the input to reject those.
 * Native `<input type="date">` can't produce such values, but a direct API
 * POST can — this hardens the trust boundary so junk DOBs don't reach storage.
 */
export function isRealISODate(value: unknown): boolean {
  if (typeof value !== "string") return false;
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!m) return false;
  const d = new Date(`${value}T00:00:00Z`);
  if (isNaN(d.getTime())) return false;
  return (
    d.getUTCFullYear() === Number(m[1]) &&
    d.getUTCMonth() + 1 === Number(m[2]) &&
    d.getUTCDate() === Number(m[3])
  );
}

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
