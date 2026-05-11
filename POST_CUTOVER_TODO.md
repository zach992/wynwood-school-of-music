# Post-Cutover Follow-Ups

Items deferred from the cutover sequence. None of these block production traffic — the site is live, secure, and fully functional. Tackle these as time permits.

Status legend: ⬜ open · 🔧 in progress · ✅ done

---

## 1. ⬜ External profile / link audit
Most external links keep working because the domain (`wynwoodschoolofmusic.com`) did NOT change. Path-level mismatches are already covered by `next.config.ts` redirects (verified 2026-05-11). But spot-check these to be safe:

- **Google Business Profile** — confirm site URL is the canonical `https://www.wynwoodschoolofmusic.com` (with `www`, with `https`).
- **Instagram / Facebook bio links** — same.
- **Email signatures** — anywhere staff has the old Squarespace site shortlink.
- **Printed/QR-coded materials** (flyers, business cards) — same domain, so should still work; only worry if any of them link to a specific page path that no longer exists. Test with the redirect list in `next.config.ts`.
- **Local directory listings** (Yelp, Google Maps, Bing Places).
- **Active ad campaigns** (Google Ads, Meta Ads) — destination URL should be `https://www.wynwoodschoolofmusic.com` or a specific live page.

## 2. ⬜ Google Search Console
- Add `wynwoodschoolofmusic.com` as a property (use Domain property type to cover apex + www).
- Verify ownership via DNS TXT record in Squarespace.
- Submit `https://www.wynwoodschoolofmusic.com/sitemap.xml` for crawling.
- Request indexing on the homepage to nudge Google to re-crawl quickly.
- Watch for crawl errors over the first 1-2 weeks.

## 3. ⬜ Uptime monitoring
- Sign up for **UptimeRobot** (free) or **Better Stack**.
- Add an HTTP(S) check on `https://www.wynwoodschoolofmusic.com` — 5-minute interval.
- Set up email + SMS alerts to your phone.
- Optional second check on the apex (`https://wynwoodschoolofmusic.com`) to catch Squarespace forwarding outages.

## 4. ⬜ Resend deliverability spot-check
Already verified locally before cutover. Best practice is to re-confirm in production by:
- Submitting one form on prod (this is happening as part of cutover smoke-test anyway).
- Checking that the auto-reply email arrives in the parent's inbox (NOT spam).
- Checking that staff notification arrives at `info@wynwoodschoolofmusic.com`.
- If any go to spam, add Resend SPF/DKIM/DMARC records as needed.

## 5. ⬜ Re-enable CDN if disabled
Confirm both Railway custom-domain rows show the **lightning-bolt CDN icon enabled** (not crossed out). If one is off, click it once to toggle on.

## 6. ⬜ Lower DNS TTLs (optional)
Squarespace defaults DNS TTL to `14400` (4 hours), which makes future DNS changes slow to propagate. If Squarespace exposes a TTL override field in their custom-records UI (it usually doesn't), bring it down to 300-600 seconds. Otherwise skip — not worth the friction.

## 7. ⬜ Stripe live-mode end-to-end test
Run one real charge through the camp deposit flow on production. Refund yourself via Stripe dashboard immediately after. Confirms:
- Stripe live key works in prod
- Webhook fires on prod URL
- Airtable + Resend emails fan out correctly with live data

## 8. ⬜ Wait ~30 days, then fully delete the old Squarespace site
After 30 days of running on the new site with no rollback needed:
- Squarespace → Settings → Site Availability → keep "Private" or fully cancel the Squarespace subscription if you want to stop paying for hosting.
- **CRITICAL: Do NOT cancel the Squarespace domain account itself** — the domain registration AND the apex Domain Forwarding rule live there. You only want to stop paying for the *website hosting* part.

## 9. ⬜ Re-add CDN if not on
Already covered in #5.

## 10. ⬜ Test old Squarespace URLs (one-time audit)
Done on 2026-05-11. 47/49 URLs from the archived sitemap redirect cleanly; the two missing ones (`/anastasia-chubb`, `/vivian-valls`) were added to `next.config.ts` in the same session.
