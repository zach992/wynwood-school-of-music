# Camp Deposit Birthday Field — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the camper **Age** field in the live "Reserve Your Spot" deposit modal with a **Birthday** date picker, capturing the birthday (plus an auto-computed age) all the way through to Airtable and the staff email.

**Architecture:** The only live signup is the deposit modal in `CampPageClient.tsx` → `/api/checkout` → Stripe metadata → `/api/stripe-webhook` → Airtable + staff email. We swap the client field to a native `<input type="date">`, thread `camperDob` through the API and Stripe metadata, and compute age server-side with the existing `calcAge()` helper. The webhook stays backward-compatible with in-flight sessions that only have the legacy `camper_age`.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, scoped CSS (camp page), Stripe, Airtable. No test framework in this repo — verification is `npx tsc --noEmit`, `npm run lint`, `npm run build`, and Playwright MCP screenshots against `localhost:3000`.

## Global Constraints

- **Live page handling real payments.** The Stripe checkout + webhook path must never throw on missing/changed fields. Preserve every existing behavior except the Age→Birthday swap.
- **Backward compatibility (critical):** the webhook may receive a `checkout.session.completed` for a session created *before* this deploy — its metadata has `camper_age` but no `camper_dob`. Code must handle both.
- **Deploy via git only** (push branch → PR → merge to `main` → Railway). Never `railway up`. Do NOT push/merge as part of execution — stop at "ready for PR" for user review.
- **All changes on a dedicated branch off `main`**, not on `fix-team-mobile-layout`.
- **Reuse, don't reinvent:** `calcAge` from `src/lib/form-utils.ts`; `fmtDate` from `src/lib/email-templates.ts`. Match the camp page's scoped-CSS idiom (no Tailwind/shadcn in this component).
- Birthday value format is ISO `YYYY-MM-DD` (native date input output), consistent with how `calcAge`/`fmtDate` already parse dates.

---

### Task 0: Branch setup

**Files:** none (git only)

- [ ] **Step 1: Create a dedicated branch off `main` and carry the spec commit over**

The spec commit `a17ff32` currently sits on `fix-team-mobile-layout`. Branch off `main` and cherry-pick it so this work is independent.

```bash
cd "/Users/zachlarmer/Desktop/Claude Projects/WSM/WSM Website Clone"
git checkout main
git checkout -b feat/camp-deposit-birthday
git cherry-pick a17ff32
```

- [ ] **Step 2: Confirm clean starting point**

Run: `git log --oneline -3 && git status --short`
Expected: HEAD is the spec commit on `feat/camp-deposit-birthday`; working tree clean.

---

### Task 1: Checkout API — accept `camperDob`, compute age, persist both

**Files:**
- Modify: `src/app/api/checkout/route.ts`

**Interfaces:**
- Consumes: `calcAge(value: unknown): number | null` from `@/lib/form-utils`.
- Produces: request body field `camperDob: string` (ISO date); Stripe metadata keys `camper_dob` and `camper_age`; Airtable fields `"Student DOB"`, `"Student Age"`.

- [ ] **Step 1: Import the age helper**

At the top of `src/app/api/checkout/route.ts`, add to the existing imports:

```ts
import { calcAge } from "@/lib/form-utils";
```

- [ ] **Step 2: Replace `camperAge` with `camperDob` in the type and validator**

In `type CheckoutBody`, change `camperAge: string;` to:

```ts
  camperDob: string;
```

In `isValidBody`, change the line that reads
`if (!reqStr(o.camperName) || !reqStr(o.camperAge) || !reqStr(o.instrument)) return false;`
to:

```ts
  if (!reqStr(o.camperName) || !reqStr(o.camperDob) || !reqStr(o.instrument)) return false;
```

- [ ] **Step 3: Compute age once, after validation passes**

Immediately after `const cart = computeCart(...)` (or any point after `isValidBody` has returned true and before the Airtable write), add:

```ts
  const camperAge = calcAge(body.camperDob); // number | null
```

- [ ] **Step 4: Persist DOB + age on the Airtable "Cart Started" row**

In the `airtableCreate(airtableTable, { ... })` call, add these two fields (e.g. right after `"Primary Instrument": body.instrument,`):

```ts
        "Student DOB": body.camperDob,
        "Student Age": camperAge ?? "",
```

- [ ] **Step 5: Add DOB to Stripe metadata (keep age)**

In the `metadata: { ... }` object, replace `camper_age: body.camperAge,` with:

```ts
        camper_dob: body.camperDob,
        camper_age: camperAge != null ? String(camperAge) : "",
```

- [ ] **Step 6: Type-check, lint, build**

Run: `npx tsc --noEmit && npm run lint`
Expected: no errors. (`camperAge` no longer referenced anywhere in this file except the new computed const.)

- [ ] **Step 7: Commit**

```bash
git add src/app/api/checkout/route.ts
git commit -m "Camp checkout: accept camper birthday, derive age, store both"
```

---

### Task 2: Webhook — record DOB + age, backward-compatible with legacy carts

**Files:**
- Modify: `src/app/api/stripe-webhook/route.ts`

**Interfaces:**
- Consumes: Stripe session metadata `camper_dob` (new) and `camper_age` (legacy); `calcAge` from `@/lib/form-utils`.
- Produces: `registration.camperDob: string`, `registration.camperAge: number | null`; Airtable fields `"Student DOB"`, `"Student Age"` on update + create payloads; email payload field `camperDob`.

- [ ] **Step 1: Import the age helper**

At the top of `src/app/api/stripe-webhook/route.ts`, add:

```ts
import { calcAge } from "@/lib/form-utils";
```

- [ ] **Step 2: Build DOB + age into the `registration` object (legacy fallback)**

In the `registration` object, replace the line `camperAge: meta.camper_age,` with:

```ts
        camperDob: meta.camper_dob ?? "",
        // Prefer recomputing from DOB; fall back to the legacy numeric age for
        // sessions created before the birthday rollout (metadata has camper_age only).
        camperAge:
          calcAge(meta.camper_dob) ??
          (meta.camper_age && meta.camper_age.trim() !== ""
            ? Number(meta.camper_age)
            : null),
```

- [ ] **Step 3: Write DOB + age to the shared Airtable update payload**

In `updatePayload`, add (e.g. after `"Primary Instrument": registration.instrument,`):

```ts
        "Student DOB": registration.camperDob || "",
        "Student Age": registration.camperAge ?? "",
```

(`createPayload` spreads `...updatePayload`, so it inherits these — no separate edit needed.)

- [ ] **Step 4: Pass DOB into the email template payload**

The email builders receive `registration`. Since we added `camperDob`/`camperAge` to `registration`, no call-site change is needed here — confirm `buildCampDepositStaffEmail(registration)` is still called with the whole object (it is). Proceed.

- [ ] **Step 5: Type-check, lint, build**

Run: `npx tsc --noEmit && npm run lint`
Expected: no errors. (`registration.camperAge` is now `number | null`; ensure no code does string ops on it — the staff email handles formatting in Task 3.)

- [ ] **Step 6: Commit**

```bash
git add src/app/api/stripe-webhook/route.ts
git commit -m "Camp webhook: record birthday + age, fall back to legacy age field"
```

---

### Task 3: Staff email — show Date of Birth and Age

**Files:**
- Modify: `src/lib/email-templates.ts`

**Interfaces:**
- Consumes: `CampDepositPayload` (extended with `camperDob`), `registration.camperAge: number | null`; existing `fmtDate`, `esc`, `row` helpers; `calcAge`.
- Produces: staff email rows "Date of Birth" and "Age".

- [ ] **Step 1: Extend the payload type**

In `CampDepositPayload`, change `camperAge?: string;` to:

```ts
  camperDob?: string;
  camperAge?: number | null;
```

- [ ] **Step 2: Render DOB + Age rows in the staff email**

In `buildCampDepositStaffEmail`, find `row("Age", esc(p.camperAge))` and replace it with two rows:

```ts
      row("Date of Birth", esc(fmtDate(p.camperDob))),
      row("Age", p.camperAge != null ? esc(String(p.camperAge)) : ""),
```

- [ ] **Step 3: Type-check, lint, build**

Run: `npx tsc --noEmit && npm run lint && npm run build`
Expected: all pass. (`fmtDate` already exists in this file and tolerates `undefined`.)

- [ ] **Step 4: Commit**

```bash
git add src/lib/email-templates.ts
git commit -m "Camp staff email: show camper date of birth + age"
```

---

### Task 4: Modal field — Birthday date picker, soft age warning, dark styling

**Files:**
- Modify: `src/app/musicperformancecamp/CampPageClient.tsx`
- Modify: `src/app/musicperformancecamp/camp.css` (imported by `page.tsx`; holds the `.camp-page .modal-field` rules around line 1280).

**Interfaces:**
- Consumes: `/api/checkout` now expects `camperDob` (Task 1).
- Produces: nothing downstream in the client.

- [ ] **Step 1: Confirm the CSS target**

The `.camp-page .modal-field` rules live in `src/app/musicperformancecamp/camp.css` (~line 1280), imported by `page.tsx`. Open it to see the existing input styling you'll extend.
Run: `grep -n "modal-field" src/app/musicperformancecamp/camp.css`

- [ ] **Step 2: Replace the age state with a birthday state**

In `CampPageClient.tsx`, change:

```ts
  const [camperAge, setCamperAge] = useState("");
```

to:

```ts
  const [camperDob, setCamperDob] = useState("");
```

- [ ] **Step 3: Update the checkout-ready gate**

In the `canCheckout` expression, change `camperAge.trim().length > 0 &&` to:

```ts
    camperDob.trim().length > 0 &&
```

- [ ] **Step 4: Send the birthday in the checkout POST body**

In `handleCheckout`, change `camperAge: camperAge.trim(),` to:

```ts
          camperDob: camperDob.trim(),
```

- [ ] **Step 5: Compute a client-side soft age warning**

Just above the `return (` of the component (with the other derived values), add a small helper that mirrors `calcAge` (kept local to avoid importing a server util into the client bundle unnecessarily — `calcAge` is pure and safe to import, but inlining keeps the client lean; either is acceptable):

```ts
  const camperAgeFromDob = (() => {
    if (!camperDob) return null;
    const d = new Date(camperDob);
    if (isNaN(d.getTime())) return null;
    const now = new Date();
    let age = now.getUTCFullYear() - d.getUTCFullYear();
    const m = now.getUTCMonth() - d.getUTCMonth();
    if (m < 0 || (m === 0 && now.getUTCDate() < d.getUTCDate())) age--;
    return age >= 0 && age <= 120 ? age : null;
  })();
  const ageOutOfRange =
    camperAgeFromDob != null && (camperAgeFromDob < 8 || camperAgeFromDob > 14);
```

- [ ] **Step 6: Replace the Age input markup with a Birthday date input + warning**

Replace the `<div className="modal-field">` containing the Age `<label>`/`<input type="number">` (the block around lines 823–834) with:

```tsx
            <div className="modal-field">
              <label>Camper&rsquo;s Birthday</label>
              <input
                type="date"
                max={new Date().toISOString().slice(0, 10)}
                min="2000-01-01"
                value={camperDob}
                onChange={(e) => setCamperDob(e.target.value)}
                disabled={submitting}
              />
              {ageOutOfRange && (
                <p className="modal-hint">
                  Camp is designed for ages 8&ndash;14 &mdash; you can still reserve a spot.
                </p>
              )}
            </div>
```

- [ ] **Step 7: Style the date input + hint to match the dark modal**

In `src/app/musicperformancecamp/camp.css`, add near the existing `.camp-page .modal-field` rules (around line 1280–1300). Note the rules are scoped with a `.camp-page` prefix — match that. The shared `.camp-page .modal-field input` rule (line ~1290) already sets background/border/color, so the date input inherits those; we only add the dark picker treatment and the hint:

```css
.camp-page .modal-field input[type="date"] {
  color-scheme: dark; /* native calendar popup + text render dark to match the modal */
  accent-color: var(--accent, #8a5a7a);
}
.camp-page .modal-field .modal-hint {
  margin: 6px 0 0;
  font-size: 13px;
  color: var(--yellow, #e0c060);
}
```

- [ ] **Step 8: Type-check, lint, build**

Run: `npx tsc --noEmit && npm run lint && npm run build`
Expected: all pass. No remaining references to `camperAge`/`setCamperAge` in this file.

- [ ] **Step 9: Commit**

```bash
git add src/app/musicperformancecamp/CampPageClient.tsx src/app/musicperformancecamp/*.css
git commit -m "Camp deposit modal: replace Age with Birthday date picker + soft age note"
```

---

### Task 5: End-to-end verification (build + visual + payload)

**Files:** none (verification only)

- [ ] **Step 1: Ensure no dev server is already running**

Run: `lsof -i :3000`
Expected: empty. If something is running, do not start a second one — reuse it.

- [ ] **Step 2: Start the dev server (background) and wait for ready**

```bash
npm run dev
```
Wait until it logs `Ready` / `compiled` on `http://localhost:3000`.

- [ ] **Step 3: Playwright — desktop view of the modal**

Navigate to `http://localhost:3000/musicperformancecamp`, open the Reserve/Checkout modal, screenshot to `.playwright-screenshots/camp-birthday-desktop.png`. Confirm: the field reads "Camper's Birthday", clicking opens the native calendar, and the control renders dark.

- [ ] **Step 4: Playwright — mobile viewport + out-of-range warning**

Resize to a mobile viewport (e.g. 390×844), reopen the modal, pick a birthday that makes the camper 5 years old, screenshot to `.playwright-screenshots/camp-birthday-mobile-warning.png`. Confirm: the soft "ages 8–14" note appears AND the "Reserve & Checkout" button is still enabled.

- [ ] **Step 5: Confirm the checkout payload carries `camperDob`**

In Playwright, fill the modal with a valid birthday + required fields, and capture the network request to `/api/checkout` (or temporarily log the body). Confirm the JSON body contains `camperDob` and NOT `camperAge`.
(Do NOT complete a real Stripe payment — stop at the request to `/api/checkout`. Use Stripe test mode only if a full run is desired.)

- [ ] **Step 6: Clean up screenshots and dev server**

```bash
rm -f .playwright-screenshots/camp-birthday-*.png
pkill -f "next dev"
```
Keep the `.playwright-screenshots/` folder itself.

- [ ] **Step 7: Final green build**

Run: `npx tsc --noEmit && npm run lint && npm run build`
Expected: all pass.

- [ ] **Step 8: Stop for user review before PR**

Do NOT push or merge. Summarize the diff and ask the user to review / approve opening a PR (push to `feat/camp-deposit-birthday`, open PR against `main`, Railway builds on merge).

---

## Self-Review Notes

- **Spec coverage:** modal field (Task 4), soft warning never blocks (Task 4 Step 5–6), birthday+age to Airtable (Tasks 1, 2), staff email DOB+age (Task 3), Stripe metadata (Task 1), reuse `calcAge`/`fmtDate` (Tasks 1–3). ✓
- **Live-safety additions beyond spec:** webhook legacy `camper_age` fallback (Task 2 Step 2), `max=today` on the date input, "stop before PR" gate. ✓
- **Type consistency:** `registration.camperAge` is `number | null` everywhere after Task 2; `CampDepositPayload.camperAge` updated to `number | null` in Task 3 to match; staff email guards `!= null`. ✓
- **Out of scope (unchanged):** archived long form, `/api/camp-signup`, Mailchimp on the deposit path.
