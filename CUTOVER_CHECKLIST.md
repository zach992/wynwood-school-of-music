# WSM Cutover Checklist

Punch list of everything that should be addressed before flipping DNS from Squarespace to this Next.js site. Group by severity. Update statuses as items complete.

Status legend: ⬜ open · 🔧 in progress · ✅ done · ⏭️ skipped

---

## ⚡ Cutover status as of 2026-05-11 ~4:45 PM

**DNS cutover is COMPLETE.** Site is live and serving production traffic at `https://www.wynwoodschoolofmusic.com` with a valid Let's Encrypt cert (auto-renewing). Old Squarespace site is set to Private. Apex domain redirects to www via Squarespace Domain Forwarding.

**🔴 Today (before walking away):**
1. ⬜ Submit one real form on prod (Contact recommended) and verify the full fan-out: Airtable row + Resend auto-reply email + Mailchimp subscriber + Basecamp todo via Zapier.
2. ⬜ Run one real Stripe deposit charge → confirm webhook fires → Airtable `Lead Source: Stripe Deposit` row appears + parent receipt + staff notification email arrive. Refund yourself in Stripe dashboard after.

**🟡 Soon:**
3. ⬜ Backup old Squarespace content (Settings → Advanced → Import/Export → Export → WordPress XML — that's the only export format; the "WordPress" label is misleading, it's just XML).
4. ⬜ Commit the cutover changes to git (`CUTOVER_CHECKLIST.md`, `next.config.ts`, `POST_CUTOVER_TODO.md`, memory files).

**🟢 Deferred (tracked in `POST_CUTOVER_TODO.md`):**
- Google Search Console setup + sitemap submission
- External profile audit (Google Business, Instagram, FB bio, ads)
- Uptime monitoring (UptimeRobot/Better Stack)
- Resend deliverability spam-check
- 30-day wait, then optionally cancel Squarespace site subscription (NEVER cancel the domain account — forwarding rule + DNS live there)

---

## 🔴 Must-fix before cutover

### 1. Camp deposit confirmation email — wire Stripe webhook to Resend
- **File:** `src/app/api/stripe-webhook/route.ts:56`
- **Currently:** TODO comment + `console.log` only. After a parent pays the camp deposit, no confirmation goes out — to staff or to the parent.
- **Fix:** Use existing Resend integration (`src/lib/email.ts`) to send:
  1. Internal notification to `CAMP_NOTIFY_EMAIL` ("Deposit paid: <parent> — <sessions>")
  2. Receipt to the parent ("Thanks for your deposit, see you at camp")
- **Owner:** Claude (autonomous)
- **Status:** ✅ done — wired to Resend with two emails: staff notification (to `CAMP_NOTIFY_EMAIL`) + parent receipt with deposit + balance summary.

### 2. Brand typeface — Barlow Condensed self-hosted (replaces Adobe Fonts plan)
- **Files:** `src/app/layout.tsx`, `src/app/globals.css`
- **Decision:** Skipped paying for Adobe Fonts (Acumin Pro Condensed). Switched to Barlow Condensed via `next/font/google`, the closest free match. Files are subsetted, preloaded, and served same-origin — no Adobe CC subscription, no third-party CDN, no privacy concern.
- **Verified:** Production build succeeds; visual check confirms condensed sans on hero, nav, CTAs.
- **Owner:** Claude
- **Status:** ✅ done

### 3. `NEXT_PUBLIC_BASE_URL` on Railway points at staging
- **Currently on Railway:** `https://www.wynwoodschoolofmusic.com`
- **Used by:** `src/app/api/checkout/route.ts` for Stripe success/cancel redirects.
- **Owner:** Zach + Claude during cutover sequence
- **Status:** ✅ done — set via `railway variables --set` on 2026-05-11

### 4. Stripe still in test mode
- **Currently:** Live secret + live webhook signing secret on Railway. Live webhook endpoint "memorable-finesse" created in Stripe dashboard, listening to `checkout.session.completed` at `https://www.wynwoodschoolofmusic.com/api/stripe-webhook`.
- **Owner:** Zach
- **Status:** ✅ done — 2026-05-11

---

## 🟡 Nice-to-fix soon

### 5. PostHog analytics — fully wired and verified
- **Code:** `src/components/PostHogProvider.tsx` mounted in `src/app/layout.tsx`. Auto-tracks pageviews + autocapture (clicks, form submits) + heatmaps + web vitals + session recordings.
- **API key set on Railway + .env.local.** Authorized domains in PostHog: `wynwoodschoolofmusic.com`, `wsm-website-production.up.railway.app`, `localhost:3000`.
- **Verified:** End-to-end test on 2026-05-10 captured 36 events from one navigation session (pageviews, autocapture, web_vitals, pageleave) across `/`, `/our-story`, `/testimonials`, `/musicperformancecamp`.
- **Owner:** Claude
- **Status:** ✅ done

### 6. Old contact-form Zap deleted
- **State on 2026-05-10:** Zapier account has only 5 Zaps remaining — all Webhooks → Basecamp (one per form). The original duplicating Zap (Email + Mailchimp) was already removed.
- **Owner:** Zach
- **Status:** ✅ done

### 7. `.env.local.example` missing 4 Airtable table-name overrides
- **Missing:** `AIRTABLE_REPAIR_TABLE`, `AIRTABLE_CAMP_TABLE`, `AIRTABLE_TRIAL_TABLE`, `AIRTABLE_WGV_TABLE`
- **Why fix:** They have safe defaults in code (so nothing breaks), but a future dev cloning the repo wouldn't know the overrides exist. Documentation hygiene.
- **Owner:** Claude (autonomous)
- **Status:** ✅ done

### 8. Resend domain verification — confirm Railway behavior
- **Currently:** Resend env vars set on Railway. Domain `forms.wynwoodschoolofmusic.com` was verified locally during setup.
- **Fix:** Send a real email from the production deployment and confirm it arrives without spam-folder issues. Already verified locally; reconfirming in prod is the smart move.
- **Owner:** Zach (test on prod after first real form submission post-cutover)
- **Status:** ⬜ pending — included in the "submit one real form on prod" smoke-test (top of file)

---

## 🟢 Optional polish

### 9. Debug `console.log` left in code
- **Files:** `src/app/musicperformancecamp/CampPageClient.tsx`, scattered `console.log`s in routes/components.
- **Why fix:** Not user-facing or a security issue, just noise in browser console + server logs. Clutters Railway log view.
- **Owner:** Claude (autonomous)
- **Status:** ✅ done — the only remaining `console.log` was actually an unwired form (see #10). Other `console.error` calls intentionally kept for debugging.

### 10. Camp form unification (interest, long-form, paid deposit all → one Airtable view)
- **Files:** `src/app/api/camp-signup/route.ts`, `src/app/api/camp-lead/route.ts`, `src/app/api/stripe-webhook/route.ts`, `src/app/musicperformancecamp/CampPageClient.tsx`
- **Schema added** to `Summer Camp Signups` table: `Lead Source` (single-select: `Long Form` / `Interest Form` / `Stripe Deposit`), `Deposit Paid` ($), `Cart Total` ($), `Balance Owed` ($).
- **All 3 paths now write to Airtable:**
  1. `/api/camp-signup` (long form) → `Lead Source: Long Form`
  2. `/api/camp-lead` (interest) → `Lead Source: Interest Form` (only name/email/phone populated)
  3. `/api/stripe-webhook` (paid deposit) → `Lead Source: Stripe Deposit`, `Lead Status: Enrolled`, payment fields filled
- **Existing rows backfilled** to `Lead Source: Long Form` since that's where they originated.
- **Owner:** Claude
- **Status:** ✅ done — verified end-to-end with a test row

---

## 🌐 DNS cutover sequence (do all of this in order, on cutover day)

1. ✅ Added `www.wynwoodschoolofmusic.com` custom domain on Railway. **Apex (`wynwoodschoolofmusic.com`) intentionally NOT on Railway** — it can't CNAME at zone apex per RFC 1912, so we use **Squarespace Domain Forwarding** (`wynwoodschoolofmusic.com → https://www.wynwoodschoolofmusic.com`, permanent 301, maintain paths) to bridge it. Squarespace forwarding installs its own apex A records pointing at `198.49.23.x` / `198.185.159.x` redirect servers.
2. ✅ Squarespace DNS: `CNAME www → tcpp672m.up.railway.app` (current Railway target, may change if domain is ever re-added) + `TXT _railway-verify.www → railway-verify=15cb533dd66...` for Railway verification.
3. ✅ Railway verified www domain on 2026-05-11; Let's Encrypt issued cert at 16:15:26 (CN=`www.wynwoodschoolofmusic.com`, expires Aug 9 2026, auto-renews).
4. ✅ `NEXT_PUBLIC_BASE_URL=https://www.wynwoodschoolofmusic.com` set on Railway.
5. ✅ Stripe live keys (`STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`) set on Railway; live webhook endpoint "memorable-finesse" created in Stripe dashboard for `checkout.session.completed` → `https://www.wynwoodschoolofmusic.com/api/stripe-webhook`.
6. 🔧 Site loads with valid TLS at `https://www.wynwoodschoolofmusic.com` (Playwright-verified `/`, `/contact`, `/musicperformancecamp`, `/team` — all 200, zero console errors; sitemap audit on 2026-05-11 confirmed 47/49 archived Squarespace URLs redirect cleanly, plus added 2 missing redirects in `next.config.ts` for `/anastasia-chubb` and `/vivian-valls`). **Still pending:** real form submission + real Stripe checkout end-to-end smoke-test from prod.
7. ✅ Old Squarespace site set to **Private** on 2026-05-11. Keep it in Private state (not deleted) for ~30 days as a rollback safety net; never cancel the Squarespace domain account itself — the forwarding rule + DNS live there.

### DNS cutover footnotes
- **Local DNS cache lag (2026-05-11):** Mac local resolver cached the old apex A record `66.33.22.94` (Railway) for up to 4h TTL; flush with `sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder`. Public resolvers (1.1.1.1, 8.8.8.8) updated instantly. If a user reports "Not Secure" on the bare apex, this is the likely culprit — incognito works because it bypasses the cache.
- **CDN caching on Railway custom domains was off during cutover**, then re-enabled. Confirm both lightning-bolt icons in Railway → Networking are toggled on if you ever see slow TTFB.
- **Apex domain (`wynwoodschoolofmusic.com`) is NOT on Railway's custom-domain list.** Squarespace Domain Forwarding (Permanent 301, Maintain paths) handles bare-apex traffic → `https://www.wynwoodschoolofmusic.com`. Removing the apex from Railway was intentional: Railway requires CNAME (forbidden at zone apex per RFC 1912), so the apex would never verify. See `memory/project_apex_forwarding_setup.md`.
- **Railway CNAME target.** Currently `tcpp672m.up.railway.app`. This value changes every time you remove + re-add the www custom domain in Railway. If you ever re-add www, expect to update the Squarespace CNAME to whatever new target Railway prints in the "Configure DNS Records" dialog.

---

## ✅ Already verified working (leave alone)

- All 5 form thank-you / confirmation pages exist (`/thank-you`, `/summer-camp-thank-you`, `/your-trial`, plus `not-found.tsx`).
- `sitemap.ts`, `robots.ts`, `layout.tsx metadataBase` all already point at `https://www.wynwoodschoolofmusic.com`.
- Real phone (`305-359-5515`) and emails (`info@wynwoodschoolofmusic.com`, `info@friendsofwsm.org`) are referenced — no placeholder values.
- Old Squarespace URL redirects in `next.config.ts` are in place.
- All 5 forms wired: Airtable + Resend + Mailchimp (with full merge fields + tags) + Zapier→Basecamp.
- Stripe camp checkout itself works (only the post-payment notification is the gap — item #1).
