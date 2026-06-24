# Camp Deposit Modal: Replace "Age" with "Birthday"

**Date:** 2026-06-24
**Status:** Approved (design)
**Branch:** `fix-team-mobile-layout` (current) — implementation may move to a dedicated branch per BRANCHING.md

## Problem

The live camp signup is the **"Reserve Your Spot" deposit/checkout modal** on
`/musicperformancecamp` (rendered by `src/app/musicperformancecamp/CampPageClient.tsx`).
It currently collects the camper's **Age** as a number (8–14). The team needs the
camper's **birthday**, not a free-typed age.

This is the *only* live camp signup path. (`src/components/CampSignupForm.tsx` and
`src/app/_archive/camp-signup-old/` are dead/archived code — referenced only as the
existing precedent for the DOB→age pattern, not modified here.)

## Goal

Replace the Age field with a **Birthday** field that is, from the parent's
perspective, the easiest / simplest / most reliable option — while giving the team
both the birthday and an auto-computed age downstream. No added friction vs. typing
an age.

## Decisions (confirmed with user)

1. **Picker:** native `<input type="date">` — chosen over a custom calendar
   specifically because the priority is *easiest / simplest / most reliable for the
   end user*. Native is the OS/browser control (no modal z-index/focus/touch/a11y
   bugs), gives parents the picker they already know on their device, lets desktop
   users type the date, and is a zero-dependency pattern already proven elsewhere in
   the repo. Polished with `color-scheme: dark`, an accent calendar icon, and
   `min`/`max` so impossible dates aren't offered.
2. **Age limits:** soft warning, never block. If the birthday implies an age outside
   8–14, show a gentle inline note but keep checkout enabled.
3. **Keep age:** store the **birthday AND an auto-computed age** (reusing
   `calcAge()` from `src/lib/form-utils.ts`) so existing age-based views/reports keep
   working.

## Data flow (today → after)

```
Modal field        Checkout API            Stripe metadata     Webhook (on pay)        Lands at
-----------        ------------            ---------------     ----------------        --------
Age (number)   →   camperAge: string   →   camper_age      →   meta.camper_age     →   staff email "Age"
                   (NOT written to Airtable cart-started row at all today)
```

becomes

```
Birthday       →   camperDob: string   →   camper_dob       →  meta.camper_dob     →   Airtable "Student DOB"
(date input)       + server calcAge        + camper_age        + recompute age          + "Student Age"
                   → Airtable cart row                                                  + staff email DOB & Age
```

## Changes by file

### 1. `src/app/musicperformancecamp/CampPageClient.tsx`
- Replace `camperAge` state with `camperDob` (string, ISO `YYYY-MM-DD`).
- Swap the `Age` `<input type="number">` (lines ~823–834) for a
  `Camper's Birthday` `<input type="date">` with `max={today}` and a sane `min`
  floor (e.g. `2000-01-01`).
- Update the `canCheckout` gate: `camperAge.trim().length > 0` → `camperDob !== ""`.
- Send `camperDob` (not `camperAge`) in the `/api/checkout` POST body.
- **Soft age warning:** derive age from `camperDob` on the client; if set and
  outside 8–14, render a small inline note near the field
  (e.g. "Camp is designed for ages 8–14 — you can still reserve a spot.").
  Does NOT affect `canCheckout`.
- Style the date input to match the dark modal (`color-scheme: dark`, accent icon)
  via the camp page's scoped CSS (locate the `.modal-field` rules and add an
  `input[type="date"]` treatment). No Tailwind/shadcn — match existing idiom.

### 2. `src/app/api/checkout/route.ts`
- `CheckoutBody`: `camperAge` → `camperDob`. Update `isValidBody` accordingly
  (require non-empty `camperDob`).
- Import `calcAge` from `@/lib/form-utils`; compute `const camperAge = calcAge(body.camperDob)`.
- Add to the Airtable "Cart Started" pre-create row:
  `"Student DOB": body.camperDob` and `"Student Age": camperAge`.
  (Age is currently not written here at all — this also benefits abandoned-cart rows.)
- Stripe metadata: add `camper_dob: body.camperDob`; keep
  `camper_age: String(camperAge ?? "")` for continuity.

### 3. `src/app/api/stripe-webhook/route.ts`
- Build `registration.camperDob = meta.camper_dob` (keep `camperAge` too, recomputed
  via `calcAge(meta.camper_dob)` as the source of truth so it can't drift).
- Add `"Student DOB"` and `"Student Age"` to **both** `updatePayload` and
  `createPayload` so paid registrations carry them regardless of the create-vs-update
  path.
- Pass DOB (and age) into the email template payload.

### 4. `src/lib/email-templates.ts`
- `CampDepositPayload`: add `camperDob?: string`.
- `buildCampDepositStaffEmail`: show **both** a `row("Date of Birth", esc(fmtDate(p.camperDob)))`
  and the existing `row("Age", ...)` (age computed via `calcAge(p.camperDob)`), matching
  how `buildCampEmail`/`buildContactEmail` already render DOB + Age together.

## Reuse

- `calcAge(value)` — `src/lib/form-utils.ts` (UTC-safe age from ISO date).
- `fmtDate(value)` — `src/lib/email-templates.ts` (human date for emails).
- Native `<input type="date">` — same control the archived long form used.

## Out of scope

- No changes to the archived long form, its component, or `/api/camp-signup`.
- Dead-code cleanup (`_archive/camp-signup-old`, `CampSignupForm.tsx`, possibly
  `/api/camp-signup`) is noted as a *possible separate pass*, not part of this change.
- Mailchimp: the deposit path does not currently push to Mailchimp; not adding it here.

## Testing / verification

- `npx tsc --noEmit` and `npm run lint` clean.
- Local dev: open the camp modal, confirm the birthday field opens the native picker,
  renders dark, and that an out-of-8–14 birthday shows the soft warning without
  disabling checkout.
- Playwright MCP screenshot against `localhost:3000` (desktop + mobile viewport),
  saved to `.playwright-screenshots/`, deleted after verification (per global conventions).
- Spot-check the `/api/checkout` payload (Stripe metadata `camper_dob`/`camper_age`)
  and confirm the Airtable cart-started row gains Student DOB / Student Age. Webhook +
  email verified by reading the code paths (no live Stripe event needed for this change).
