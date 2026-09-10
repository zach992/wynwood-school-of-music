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

/** Minimum plausible human fill time. Mirrors MIN_HUMAN_FILL_MS in FormGuard.tsx. */
const MIN_HUMAN_FILL_MS = 3_000;

/**
 * True when a submission looks automated and should be silently discarded.
 *
 * The elapsed time arrives as a client-measured *duration* (`_elapsedMs`), not
 * as an absolute timestamp. An earlier version sent `_renderedAt` from the
 * browser clock and compared it against the server clock, which silently
 * discarded legitimate visitors whose device clock ran ahead — they passed the
 * client-side check, then vanished here while still being shown a success
 * message. A duration is immune to clock skew, and costs nothing in spam
 * resistance: the value was always client-supplied and equally spoofable.
 */
export function checkSpamGuard(body: Record<string, unknown>): boolean {
  if (typeof body.website === "string" && body.website.length > 0) return true;
  const elapsedMs = body._elapsedMs;
  if (typeof elapsedMs !== "number" || !Number.isFinite(elapsedMs)) return true;
  if (elapsedMs < MIN_HUMAN_FILL_MS) return true;
  return false;
}

/**
 * 200 + `{ accepted: true }` — the submission passed the guards and was
 * forwarded to its destinations.
 *
 * This flag exists so the client can tell acceptance from silent rejection.
 * A bare 200 is deliberately ambiguous (see discardedResponse), so `res.ok`
 * alone is not a safe trigger for reporting a conversion to Google or Meta.
 */
export function acceptedResponse(): Response {
  return new Response(JSON.stringify({ accepted: true }), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
}

/**
 * 200 with an empty body — returned when a submission trips the spam guards.
 *
 * Still a 200 on purpose: never tell a bot why it failed. The *absence* of the
 * `accepted` flag is the signal, which a scripted client is unlikely to read
 * and a real one uses to suppress its conversion events.
 */
export function discardedResponse(): Response {
  return new Response(null, { status: 200 });
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
