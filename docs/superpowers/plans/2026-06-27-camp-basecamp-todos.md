# Camp Basecamp To-Dos (Paid vs Unpaid) — Plan

> **Status:** Plan for review. Hand this whole file to a fresh Claude session to execute.
> **Manager request:** "We need a Basecamp to-do for each new summer-camp person, differentiated based on whether or not they have paid."

---

## 0. Context a fresh session needs

**Project:** Wynwood School of Music marketing site. Next.js 16 App Router + TS, deployed on Railway. Deploy ONLY via git push to `main` (Railway auto-builds). Never `railway up`. Env vars MAY be set with `railway variables --set`. Every change goes through a branch → PR → merge (branch protection on `main`).

**The live camp signup is the deposit/checkout modal** on `/musicperformancecamp` (`src/app/musicperformancecamp/CampPageClient.tsx`). It is the ONLY live camp signup. (`src/components/CampSignupForm.tsx` + `src/app/_archive/camp-signup-old/` are dead code; ignore them.)

**The deposit flow has two server stages:**
1. `src/app/api/checkout/route.ts` — when the parent clicks "Proceed to Secure Checkout", this **pre-creates an Airtable "Cart Started" row** (Lead Status = `"Cart Started"`), then creates a Stripe Checkout Session and returns its URL. All camper/parent info is stashed in Stripe **session metadata** (`camper_name`, `camper_dob`, `camper_age`, `instrument`, `parent_name`, `parent_email`, `parent_phone`, `session_codes`, `cart_total`, `cart_deposit`, `balance_owed`, `airtable_record_id`, `kind: "camp_deposit"`).
2. `src/app/api/stripe-webhook/route.ts` — on `checkout.session.completed`, flips that row to Lead Status = `"Enrolled"`, writes deposit amounts, and sends staff + parent emails. Currently it handles **only** `checkout.session.completed`.

**Existing Zapier→Basecamp pattern (this is what to mirror):** the five legacy form routes each fire-and-forget a POST to a Zapier Catch Hook, and a Zap turns it into a Basecamp to-do. Example — `src/app/api/camp-signup/route.ts`:
```ts
const webhookUrl = process.env.ZAPIER_CAMP_WEBHOOK_URL;
if (webhookUrl) {
  fetch(webhookUrl, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ ...p, _form: "camp", _submittedAt: new Date().toISOString() }),
  }).catch((err) => console.error("[api/camp-signup] Zapier forward failed:", err));
}
```
So: **the site posts JSON to a Zapier hook; Zapier (no-code) builds the Basecamp to-do.** We do NOT call the Basecamp API directly. See `FORMS.md` for the full per-form destination matrix.

**Relevant already-merged context:**
- Birthday field (`camperDob`) + derived age now flow through checkout → metadata → webhook → Airtable + staff email (merged, live).
- PR #15 (`feat/camp-parent-name`, may or may not be merged when you run this) adds a required **Parent / Guardian Name** field to the modal and sends `parentName`, so `parent_name` is in Stripe metadata. The Basecamp to-do should include it — this also satisfies the "...in the to-do" half of the parent-name request. **Verify `parent_name` is present in checkout metadata before relying on it; if PR #15 isn't merged yet, coordinate or include it as part of this work.**

---

## 1. Recommended design

**Two distinct triggers, mapped to the two real Stripe outcomes — no duplicate to-dos:**

| Outcome | Stripe event | Where | Basecamp to-do |
|---|---|---|---|
| **PAID** | `checkout.session.completed` | webhook (already handled) | "✅ PAID — enroll {camper}" |
| **NOT PAID** (abandoned) | `checkout.session.expired` | webhook (NEW handler) | "⏳ UNPAID lead — follow up {camper}" |

**Why `checkout.session.expired` for the unpaid case (instead of firing at cart-started):**
- It fires **only for sessions that were never completed** — so someone who pays does NOT also generate an "unpaid" to-do. Clean, automatic dedup with zero double-counting.
- Firing "unpaid" at cart-started time (in `/api/checkout`) would create a to-do for *every* checkout click, including people who pay 20 seconds later, and would spam to-dos on retries/abandoned tabs. Avoid.
- Tradeoff: the "unpaid" to-do is delayed until the session expires. Stripe Checkout Sessions expire after **24h** by default. The team still has **immediate** visibility of unpaid intent via the existing Airtable "Cart Started" row; the Basecamp "unpaid" to-do is specifically the *abandoned-cart follow-up* nudge. This matches `after_expiration.recovery` already being enabled in `checkout/route.ts`.

**Transport:** mirror the existing fire-and-forget Zapier pattern. **Two Catch Hook URLs**, one per outcome, so each maps to its own Zap → Basecamp to-do (cleanest for the no-code side; no Zapier filters/paths needed):
- `ZAPIER_CAMP_DEPOSIT_PAID_WEBHOOK_URL`
- `ZAPIER_CAMP_DEPOSIT_UNPAID_WEBHOOK_URL`

(Alternative considered: one URL + a `status` field and Zapier "Paths". Rejected — two URLs are simpler to configure and reason about. Use the alternative only if the team prefers a single Zap.)

---

## 2. Code changes (one PR, branch off latest `main`)

All changes are in `src/app/api/stripe-webhook/route.ts` plus a tiny shared helper.

### 2a. Shared Zapier helper
Add `forwardToZapier(url: string | undefined, payload: object, tag: string)` (e.g. in `src/lib/` or inline in the webhook). Fire-and-forget, never throws, logs on failure — same shape as the legacy routes.

### 2b. PAID to-do — in the existing `checkout.session.completed` branch
After the Airtable update + email sends (near the end of the `meta.kind === "camp_deposit"` block), fire:
```ts
forwardToZapier(process.env.ZAPIER_CAMP_DEPOSIT_PAID_WEBHOOK_URL, {
  _form: "camp-deposit",
  _status: "paid",
  _submittedAt: new Date().toISOString(),
  camperName: registration.camperName,
  camperDob: registration.camperDob,
  camperAge: registration.camperAge,
  parentName: registration.parentName,
  parentEmail: registration.parentEmail,
  parentPhone: registration.parentPhone,
  instrument: registration.instrument,
  sessionCodes: registration.sessionCodes,
  cartTotal: registration.cartTotal,
  depositPaid: registration.depositPaid,
  balanceOwed: registration.balanceOwed,
  stripeSessionId: registration.stripeSessionId,
}, "paid");
```
**Dedup safeguard (recommended):** Stripe delivers events at-least-once, so `completed` can arrive twice. Only fire the paid to-do when the row actually transitions to Enrolled (i.e. not a redelivery). Simplest: before the Airtable update, read the row's current `Lead Status`; if it's already `"Enrolled"`, skip BOTH the to-do and the emails (it's a redelivery). If reading status is awkward, accept rare duplicate to-dos and note it — a duplicate Basecamp to-do is low-harm.

### 2c. UNPAID to-do — NEW `checkout.session.expired` handler
Add a sibling branch:
```ts
if (event.type === "checkout.session.expired") {
  const session = event.data.object as Stripe.Checkout.Session;
  const meta = session.metadata ?? {};
  if (meta.kind === "camp_deposit") {
    // Optional: flip the Airtable "Cart Started" row to "Abandoned" via meta.airtable_record_id.
    forwardToZapier(process.env.ZAPIER_CAMP_DEPOSIT_UNPAID_WEBHOOK_URL, {
      _form: "camp-deposit",
      _status: "unpaid",
      _submittedAt: new Date().toISOString(),
      camperName: meta.camper_name,
      camperDob: meta.camper_dob,
      camperAge: meta.camper_age,
      parentName: meta.parent_name,
      parentEmail: meta.parent_email,
      parentPhone: meta.parent_phone,
      instrument: meta.instrument,
      sessionCodes: (meta.session_codes ?? "").split(",").filter(Boolean),
      cartTotal: Number(meta.cart_total ?? 0),
      recoveryUrl: session.after_expiration?.recovery?.url ?? "",
    }, "unpaid");
  }
}
```
Note `session.after_expiration.recovery.url` gives Stripe's fresh recovery link — useful to drop into the follow-up to-do so staff can re-send checkout.

### 2d. No changes needed in `checkout/route.ts`
Cart-started Airtable row + metadata already exist. (If 2c chooses to mark the row "Abandoned", that's done in the webhook, not here.)

---

## 3. Config tasks (NOT code — must be done for the feature to work)

### 3a. Stripe Dashboard — subscribe the webhook to the new event
The webhook endpoint must receive `checkout.session.expired`. Today it's almost certainly subscribed only to `checkout.session.completed`.
- Stripe Dashboard → Developers → Webhooks → the WSM endpoint → add event **`checkout.session.expired`**.
- Do this in **both test and live** modes.

### 3b. Zapier — create two Zaps (no-code, done by Zach/team)
For each (`PAID`, `UNPAID`):
1. Trigger: **Webhooks by Zapier → Catch Hook** → copy the generated URL.
2. Action: **Basecamp → Create a To-do** → pick the project + to-do list, set assignee.
3. Map fields into the to-do title/notes, e.g.
   - PAID title: `✅ PAID — {{camperName}} ({{sessionCodes}})`
   - UNPAID title: `⏳ Unpaid lead — {{camperName}} ({{sessionCodes}})`
   - Notes: parent name/email/phone, camper DOB + age, instrument, amounts, recovery URL.
4. Turn each Zap on.

### 3c. Railway — set the two env vars
```
railway variables --set ZAPIER_CAMP_DEPOSIT_PAID_WEBHOOK_URL="<paid catch-hook url>"
railway variables --set ZAPIER_CAMP_DEPOSIT_UNPAID_WEBHOOK_URL="<unpaid catch-hook url>"
```
(Also add to local `.env.local` for testing.) Code must no-op cleanly if a var is unset (mirror the legacy `if (webhookUrl)` guard).

---

## 4. Testing

1. **Payload shape first, before wiring the real Zap:** point the env vars at a `https://webhook.site` URL and verify the JSON for both paid and unpaid.
2. **Drive the events** with the Stripe CLI:
   - `stripe listen --forward-to localhost:3000/api/stripe-webhook`
   - `stripe trigger checkout.session.completed` and `stripe trigger checkout.session.expired` — note: triggered test events won't carry our `metadata.kind`, so either (a) temporarily relax the `kind` guard while testing, or (b) do a real test-mode checkout and let it complete / expire, or (c) use the Stripe Dashboard "Resend" on a real test-mode camp session.
   - Best end-to-end: a **test-mode** checkout from the local site → complete it (paid path), and a second one left to expire (unpaid path; can shorten via `expires_at` in `checkout/route.ts` temporarily, or use Dashboard to expire it).
3. Verify the dedup safeguard: resend a `completed` event and confirm only one to-do / no second email.
4. `npx tsc --noEmit`, `npm run lint`, `npm run build` green.

---

## 5. Open questions for Zach (confirm before/while building)

1. **Is the 24h-delayed "unpaid" to-do acceptable**, given Airtable already shows cart-started immediately? (If the team wants an *immediate* unpaid to-do per checkout click, switch to firing from `/api/checkout` and accept duplicate/abandoned-tab noise — not recommended.)
2. **Which Basecamp project + to-do list** should these land in, and **who is assigned**?
3. **One Zap with Paths or two Zaps?** Plan assumes two (simpler).
4. **Mark abandoned carts as "Abandoned" in Airtable** on `expired` (2c optional step) — yes/no?

---

## 6. Deliverable summary
- 1 PR: webhook gains an `expired` handler + two fire-and-forget Zapier posts + dedup safeguard; small shared helper.
- 2 Railway env vars.
- 1 Stripe webhook event subscription (`checkout.session.expired`).
- 2 Zapier Zaps (Catch Hook → Basecamp To-do), built by the team.
- Net result: every camp checkout produces exactly one Basecamp to-do — a "paid/enroll" one when they pay, or an "unpaid/follow-up" one (with a recovery link) when they abandon.
