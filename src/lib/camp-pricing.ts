// Shared camp pricing logic.
// Imported by both CampPageClient (display) and /api/checkout (server-side recompute).
// Server NEVER trusts client-supplied prices — only session codes — and rebuilds the cart here.

export type Session = {
  code: string;
  dates: string;
  month: string;
  capacity: number;
  sold: number;
  startISO: string;
  flag?: string;
  bridge?: boolean;
  full?: boolean;
};

export const SESSIONS: Session[] = [
  { code: "A", dates: "June 15 – June 19", month: "Jun", capacity: 24, sold: 13, startISO: "2026-06-15" },
  { code: "B", dates: "June 22 – June 26", month: "Jun", capacity: 24, sold: 16, startISO: "2026-06-22" },
  { code: "B.5", dates: "June 29 – July 3", month: "Jun/Jul", capacity: 24, sold: 5, startISO: "2026-06-29", flag: "New! Bridge Week", bridge: true },
  { code: "C", dates: "July 6 – July 10", month: "Jul", capacity: 24, sold: 11, startISO: "2026-07-06" },
  { code: "D", dates: "July 13 – July 17", month: "Jul", capacity: 24, sold: 8, startISO: "2026-07-13" },
  { code: "E", dates: "July 20 – July 24", month: "Jul", capacity: 24, sold: 14, startISO: "2026-07-20" },
  { code: "F", dates: "July 27 – July 31", month: "Jul", capacity: 24, sold: 9, startISO: "2026-07-27" },
  { code: "G", dates: "August 3 – August 7", month: "Aug", capacity: 24, sold: 6, startISO: "2026-08-03" },
];

export const BASE_EARLY = 375;
export const BASE_STANDARD = 425;

// Early Bird ends end-of-day May 15 in WSM's local timezone (US Eastern, EDT in May).
export const EARLY_BIRD_DEADLINE_MS = new Date("2026-05-15T23:59:59-04:00").getTime();

export const sessionStartMs = (s: Session) =>
  new Date(`${s.startISO}T00:00:00-04:00`).getTime();

export const isEarlyBirdAt = (now: number) => now <= EARLY_BIRD_DEADLINE_MS;
export const isPastSessionAt = (s: Session, now: number) => now >= sessionStartMs(s);

export type Cart = {
  picks: Session[];
  list: number;
  earlyBirdDiscount: number;
  bundleDiscount: number;
  total: number;
  deposit: number;
};

// Pricing rules:
//   - List price per session: BASE_STANDARD
//   - Early bird: each session pays BASE_EARLY (savings = BASE_STANDARD - BASE_EARLY per session)
//   - Bundle:  2 sessions → -$25/session, 3+ sessions → -$50/session (after early bird)
//   - Deposit: 50% of total, rounded
export function computeCart(sessionCodes: string[], now: number): Cart {
  const picks = SESSIONS.filter((s) => sessionCodes.includes(s.code));
  const earlyBird = isEarlyBirdAt(now);

  const list = picks.length * BASE_STANDARD;
  const earlyBirdDiscount = earlyBird ? picks.length * (BASE_STANDARD - BASE_EARLY) : 0;
  const afterEarlyBird = list - earlyBirdDiscount;

  let bundleDiscount = 0;
  if (picks.length === 2) bundleDiscount = 25 * picks.length;
  else if (picks.length >= 3) bundleDiscount = 50 * picks.length;

  const total = afterEarlyBird - bundleDiscount;
  const deposit = Math.round(total / 2);

  return { picks, list, earlyBirdDiscount, bundleDiscount, total, deposit };
}
