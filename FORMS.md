# Forms Reference

Inventory of every form on the site, where it currently sends data, and where it needs to be wired up. Use this as the checklist when we set up real submission handling (email, database, Mailchimp, Zapier, etc.).

Last updated: 2026-05-04

---

## Status legend

- ⚠️  **Stubbed** — submit handler only `console.log`s and routes to a thank-you page. No email, no storage.
- ✅  **Wired** — fully connected to its production destination.

## Spam protection (already baked in)

Every form ships with two invisible spam guards via `src/components/FormGuard.tsx`:

1. **Honeypot field** — a hidden `<input name="website">` off-screen. Real users never see it; scripted bots fill every field they encounter.
2. **Time-to-submit check** — submissions arriving within 3 seconds of the form rendering are dropped. Bots fill forms in milliseconds.

Both checks run client-side today (silent no-op if either trips). When we wire the API routes, the **server must enforce them too** — client checks alone are bypassable.

### API contract for the future server route

Each form's `handleSubmit` already includes the guard fields in its payload:

```ts
{
  // ...real form fields...
  website: string,        // honeypot — should always be ""
  _renderedAt: number,    // ms timestamp from form render
}
```

In every API route (`src/app/api/<form>/route.ts`):

```ts
const body = await req.json();

// Honeypot tripped — return success to avoid signaling the bot
if (body.website && body.website.length > 0) {
  return new Response(null, { status: 200 });
}

// Submitted too fast to be human (< 3 seconds)
if (typeof body._renderedAt !== "number" || Date.now() - body._renderedAt < 3_000) {
  return new Response(null, { status: 200 });
}

// Strip guard fields before forwarding to email/storage
const { website: _hp, _renderedAt: _t, ...payload } = body;
// ... send `payload` to Resend / Sheet / Mailchimp / etc.
```

Always return `200 OK` on rejection — never tell the bot why. Logging the rejection internally is fine and useful for tuning.

---

## Form inventory

### 1. Contact Form

| | |
|---|---|
| **Page** | `/contact` |
| **Component** | `src/components/ContactForm.tsx` |
| **API route** | `src/app/api/contact/route.ts` |
| **Submit redirect** | `/thank-you` |
| **Squarespace formId** | `5d14ffd99951790001e3549b` (legacy) |
| **Status** | ✅ Wired |

**Active destinations** (all fired in parallel by `/api/contact`):
- 📊 **Airtable** — `ALL WSM Leads` base → `Main Contact Form Leads` table.
- 📧 **Resend email** — formatted HTML notification to `RESEND_NOTIFY_TO` (default `info@wynwoodschoolofmusic.com`).
- 📬 **Mailchimp** — adds parent as subscriber to audience "Wynwood School of Music" with tags `Lead — Contact Form` + per-instrument tags.
- 🔁 **Zapier** — webhook (`ZAPIER_CONTACT_WEBHOOK_URL`) → Basecamp to-do for the team.

**Fields:**
1. Student Name (first + last) — required
2. Student's Date of Birth — required
3. Private lessons or band program? — radio: `Private Lessons` / `Band and Private Lesson` — required
4. Subject(s) — checkbox (17 instruments) — required
5. Years of experience — text — required
6. Parent / Guardian Name (first + last) — required
7. Parent / Guardian Phone — required
8. Parent / Guardian Email — required
9. How did you hear about us? — text — required

---

### 2. Repair Request

| | |
|---|---|
| **Page** | `/repair` |
| **Component** | `src/components/RepairForm.tsx` |
| **API route** | `src/app/api/repair/route.ts` |
| **Submit behavior** | Inline "Thank You!" message (no redirect) |
| **Squarespace formId** | `5fa466058043f470711a8bc9` (legacy) |
| **Status** | ✅ Wired |

**Active destinations** (all fired in parallel by `/api/repair`):
- 📊 Airtable → `Repair Requests` table.
- 📧 Resend email → `RESEND_NOTIFY_TO`.
- 📬 Mailchimp → tag `Lead — Repair Request`.
- 🔁 Zapier (`ZAPIER_REPAIR_WEBHOOK_URL`) → Basecamp to-do.

**Fields:**
1. Name (first + last) — required
2. Email — required
3. Phone — required
4. Which Repair Services Are You Inquiring About? — checkbox (21 services) — required

---

### 3. Summer Camp Signup Form

| | |
|---|---|
| **Page** | `/camp-signup` |
| **Component** | `src/components/CampSignupForm.tsx` |
| **API route** | `src/app/api/camp-signup/route.ts` |
| **Submit redirect** | `/summer-camp-thank-you` |
| **Squarespace formId** | `5ef50bf482b8e941cd6cec71` (legacy) |
| **Status** | ✅ Wired |

**Active destinations** (all fired in parallel by `/api/camp-signup`):
- 📊 Airtable → `Summer Camp Signups` table.
- 📧 Resend email → `RESEND_NOTIFY_TO`.
- 📬 Mailchimp → tags `Lead — Summer Camp` + `Instrument — <primary>`.
- 🔁 Zapier (`ZAPIER_CAMP_WEBHOOK_URL`) → Basecamp to-do.

**Fields:**
1. Student Name (first + last) — required
2. Student Date of Birth — required
3. Primary instrument — radio: Voice / Guitar / Keyboard / Bass / Drums — required
4. Experience level — radio: Beginner / Intermediate / Advanced — required
5. Sessions — checkbox (7 weekly sessions, June–August 2026) — required
6. Genres — checkbox: Rock / Jazz / Songwriting / Funk / Pop — required
7. Parent / Guardian Name (first + last) — required
8. Parent / Guardian Phone — required
9. Parent / Guardian Email — required
10. How did you hear about us? — text — required

---

### 4. Walt Grace Lesson Signups

| | |
|---|---|
| **Page** | `/wgv` |
| **Component** | `src/components/WgvForm.tsx` |
| **API route** | `src/app/api/wgv/route.ts` |
| **Submit behavior** | Inline "Thank You!" message (no redirect) |
| **Squarespace formId** | `604a6b309195fb6fdfc1ea04` (legacy) |
| **Status** | ✅ Wired |

**Active destinations** (all fired in parallel by `/api/wgv`):
- 📊 Airtable → `Walt Grace Lesson Signups` table.
- 📧 Resend email → `RESEND_NOTIFY_TO`.
- 📬 Mailchimp → tags `Lead — Walt Grace` + per-instrument tags.
- 🔁 Zapier (`ZAPIER_WGV_WEBHOOK_URL`) → Basecamp to-do.

**Notes:** Co-branded landing page for Walt Grace Vintage customers redeeming a free lesson. May warrant a separate recipient (someone at WGV?) or a tag on the same recipient inbox to distinguish leads.

**Fields:**
1. Name (first + last) — required
2. Phone — required
3. Email — required
4. Date of Birth — required
5. Instrument — checkbox: Guitar / Bass / Ukulele — required
6. Experience level — radio: Beginner / Intermediate / Advanced — required
7. Additional info — textarea — optional

---

### 5. Private Lessons Landing Page Sign Up Form (Trial Lesson)

| | |
|---|---|
| **Page** | `/trial-music-lesson` |
| **Component** | `src/components/TrialLessonForm.tsx` |
| **API route** | `src/app/api/trial-lesson/route.ts` |
| **Submit redirect** | `/your-trial` |
| **Squarespace formId** | `684c72c06f323241b9c962df` (legacy) |
| **Status** | ✅ Wired |

**Active destinations** (all fired in parallel by `/api/trial-lesson`):
- 📊 Airtable → `Pvt Lesson Landing Page Leads` table.
- 📧 Resend email → `RESEND_NOTIFY_TO`.
- 📬 Mailchimp → tags `Lead — Trial Lesson` + `Instrument — <selected>`.
- 🔁 Zapier (`ZAPIER_TRIAL_WEBHOOK_URL`) → Basecamp to-do.

**Notes:** This is the ad/landing-page funnel ("Play Your First Song in 30 Days"). Likely tied to paid traffic and may have its own analytics/conversion tracking requirements.

**Fields:**
1. Student Name (first + last) — required
2. Student Date of Birth — required
3. Instrument — select dropdown (8 options) — required
4. Experience Level — select: Never Played / Some Experience / Currently Taking Lessons — required
5. Parent / Guardian Name (first + last) — required (note: shown only if student is under 18)
6. Parent / Guardian Email — required
7. Parent / Guardian Phone — required
8. How Did You Hear About Us? — text — required
9. Anything Else? — text — optional

---

### 6. Friends of WSM (external Google Form)

| | |
|---|---|
| **Page** | `/friendsofwsm` |
| **Component** | *(none — external Google Form)* |
| **External URL** | `https://docs.google.com/forms/d/e/1FAIpQLSecKLf56CCA-BO4XOjU-E3yn9u-nrZyxVLrWL0Yoyy7ljtr4g/viewform` |
| **Status** | ✅ Wired (already handled separately) |

**Notes:** This form is owned in Google, not Squarespace. Submissions go to whoever has edit access on that Google Form / its linked sheet. No work needed on our side.

---

## mailto links (no form, just `mailto:`)

| Address | Where it appears | Used for |
|---|---|---|
| `info@wynwoodschoolofmusic.com` | Footer + sidebar "Sign Up" CTA on every page | General school inbox |
| `info@friendsofwsm.org` | `/friendsofwsm` page only | Friends of WSM separate inbox |

---

## Wiring checklist (when ready)

When we sit down to actually wire these up, walk through this list:

### Per-form (do this for each of the 5 Squarespace forms)

1. [ ] Open Squarespace → Pages → click form page → Edit → click form block → Storage tab. Note:
   - Email recipient address(es)
   - Google Drive sheet name + Drive account owner
   - Each Zap name + what it does (open Zapier to inspect triggers + actions)
   - Mailchimp audience name + any tag/group
2. [ ] Decide which destinations to preserve on the new site:
   - Email always
   - Mailchimp if list-building still active
   - Sheet only if someone actually reads it
   - Zapier if any of the Zaps are load-bearing automation
3. [ ] Confirm whether different forms route to different recipients (likely — WGV and Trial Lesson may go to different inboxes than `/contact`)

### Site-wide infrastructure

1. [ ] Pick + set up email sender (Resend recommended — generous free tier, easy DKIM/SPF setup for `wynwoodschoolofmusic.com`)
2. [ ] Pick + set up structured store (Google Sheet, Supabase, Airtable, or Zapier webhook fan-out — pending account access decisions)
3. [ ] Verify domain DNS for the email sender
4. [ ] Add server env vars (Resend API key, Sheet/DB credentials)

### Per-form code changes

For each form component listed above, replace the `console.log(...)` in `handleSubmit` with a `fetch('/api/<form-name>', { method: 'POST', body: JSON.stringify(formData) })` and create the corresponding API route in `src/app/api/<form-name>/route.ts` that:

1. Validates the payload
2. Sends notification email via the chosen provider
3. (Optional) Writes to structured store
4. (Optional) Fires Zapier webhook
5. Returns 200 OK so the client can redirect to the thank-you page

### Verification after wiring

- [ ] Submit each form with test data
- [ ] Confirm email arrives at the configured recipient
- [ ] Confirm row appears in the structured store (if applicable)
- [ ] Confirm thank-you redirect still works
- [ ] Confirm honeypot + time-check enforcement is wired into the server route (see "Spam protection" section above). Client-side checks are already in place.
- [ ] (Optional) Add IP rate-limit (e.g. `@upstash/ratelimit`, ~5 submissions/hour/IP) if real spam volume requires it
- [ ] (Optional) Add Cloudflare Turnstile only if 1–4 above prove insufficient
