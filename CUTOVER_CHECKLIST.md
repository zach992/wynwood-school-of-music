# WSM Cutover Checklist

Punch list of everything that should be addressed before flipping DNS from Squarespace to this Next.js site. Group by severity. Update statuses as items complete.

Status legend: ⬜ open · 🔧 in progress · ✅ done · ⏭️ skipped

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
- **Currently on Railway:** `https://wsm-website-production.up.railway.app`
- **Should be (after DNS cuts over):** `https://wynwoodschoolofmusic.com`
- **Used by:** `src/app/api/checkout/route.ts` for Stripe success/cancel redirects.
- **Fix:** Update at the moment DNS is flipped, not before (changing it earlier breaks Stripe checkout testing on the Railway URL).
- **Owner:** Zach + Claude during cutover sequence
- **Status:** ⬜ blocked on DNS cutover

### 4. Stripe still in test mode
- **File:** `.env.local` line 7 / Railway has matching test key (`sk_test_…`).
- **Currently:** Test secret + test webhook secret. Real cards don't charge.
- **Fix:** Generate live keys in Stripe dashboard → swap `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` on Railway → also create the live webhook endpoint pointing at the production URL.
- **Owner:** Zach (do at cutover, not before)
- **Status:** ⬜ blocked on cutover

---

## 🟡 Nice-to-fix soon

### 5. PostHog analytics — code wired, awaiting key
- **Status of code:** `src/components/PostHogProvider.tsx` exists, mounted in `src/app/layout.tsx`. Auto-tracks pageviews. `posthog-js` and `posthog-node` already in package.json.
- **What's missing:** `NEXT_PUBLIC_POSTHOG_KEY` is empty in `.env.local`.
- **Action you take:** Sign up at posthog.com → create project → Project Settings → "Project API Key" → paste here. I'll set it on Railway and `.env.local`.
- **Owner:** Zach (project key)
- **Status:** ⬜ blocked on key

### 6. Old contact-form Zap is still live
- **Currently:** The original Zap (Catch Hook → Email + Mailchimp) was set up early in this project and is now duplicated by Resend + direct Mailchimp. Every contact submission emails twice and runs Mailchimp twice.
- **Fix:** In Zapier, find the original `/contact` Zap (the one with Email + Mailchimp actions, *not* the Basecamp one). Turn it off or delete it. Keep all 5 Basecamp Zaps.
- **Owner:** Zach
- **Status:** ⬜

### 7. `.env.local.example` missing 4 Airtable table-name overrides
- **Missing:** `AIRTABLE_REPAIR_TABLE`, `AIRTABLE_CAMP_TABLE`, `AIRTABLE_TRIAL_TABLE`, `AIRTABLE_WGV_TABLE`
- **Why fix:** They have safe defaults in code (so nothing breaks), but a future dev cloning the repo wouldn't know the overrides exist. Documentation hygiene.
- **Owner:** Claude (autonomous)
- **Status:** ✅ done

### 8. Resend domain verification — confirm Railway behavior
- **Currently:** Resend env vars set on Railway. Domain `forms.wynwoodschoolofmusic.com` was verified locally during setup.
- **Fix:** Send a real email from the production deployment and confirm it arrives without spam-folder issues. Already verified locally; reconfirming in prod is the smart move.
- **Owner:** Zach (test on prod after first real form submission post-cutover)
- **Status:** ⬜

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

1. ⬜ In Railway → Settings → Networking → **Add custom domain**: `wynwoodschoolofmusic.com` and `www.wynwoodschoolofmusic.com`. Railway returns DNS records.
2. ⬜ In Squarespace DNS → add the records Railway provides (likely `A` or `CNAME` apex + www).
3. ⬜ Wait for Railway to verify the domain (5–30 min, occasionally longer).
4. ⬜ On Railway, update `NEXT_PUBLIC_BASE_URL` → `https://www.wynwoodschoolofmusic.com`. Service will redeploy.
5. ⬜ Swap Stripe test → live keys on Railway (`STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`). Create the live webhook endpoint in Stripe dashboard pointing at `https://www.wynwoodschoolofmusic.com/api/stripe-webhook`.
6. ⬜ Confirm site loads at the real domain. Submit one real form + one Stripe checkout to verify end-to-end.
7. ⬜ Disable / take down the Squarespace site, OR set Squarespace to redirect to the new domain.

---

## ✅ Already verified working (leave alone)

- All 5 form thank-you / confirmation pages exist (`/thank-you`, `/summer-camp-thank-you`, `/your-trial`, plus `not-found.tsx`).
- `sitemap.ts`, `robots.ts`, `layout.tsx metadataBase` all already point at `https://www.wynwoodschoolofmusic.com`.
- Real phone (`305-359-5515`) and emails (`info@wynwoodschoolofmusic.com`, `info@friendsofwsm.org`) are referenced — no placeholder values.
- Old Squarespace URL redirects in `next.config.ts` are in place.
- All 5 forms wired: Airtable + Resend + Mailchimp (with full merge fields + tags) + Zapier→Basecamp.
- Stripe camp checkout itself works (only the post-payment notification is the gap — item #1).
