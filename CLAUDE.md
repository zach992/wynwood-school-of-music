# Wynwood School of Music — Website

Marketing site for Wynwood School of Music (rebuild of the original Squarespace site in Next.js).

## Tech Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind v4 · deployed on Railway.

## Commands

```
npm run dev         # local dev server (http://localhost:3000)
npm run build       # production build
npm run lint        # eslint
npx tsc --noEmit    # type check only
```

Only one dev server at a time — check `lsof -i :3000` before starting.

## Key Files

- `src/app/` — App Router pages (one folder per route; `page.tsx` per route)
- `src/components/` — shared UI (Header, Footer, HeroCarousel, form components, …)
- `src/lib/site-data.ts` — programs, pricing, testimonials, recitals, hero slides
- `src/lib/team-bios.ts` — instructor bios (drives `/team/[slug]` pages)
- `next.config.ts` — SEO redirects from old Squarespace URLs (do not remove without checking analytics)
- `public/` — images, favicon, OG image, robots assets

## Forms

All 5 public forms (contact, trial lesson, camp signup, WGV, repair) plus the camp interest form and Stripe deposit checkout are wired end-to-end. Each submission fans out to Airtable + Resend + Mailchimp + (where applicable) Zapier→Basecamp.

`FORMS.md` is the source of truth for the full destination matrix per form.
`CUTOVER_CHECKLIST.md` tracks remaining pre-DNS-cutover work.

## Deploy

- GitHub: `zach992/wynwood-school-of-music` (main branch)
- **Always deploy via git** — push to `main` and Railway auto-rebuilds. Never use `railway up` or any direct-deploy command. Code changes only flow through git so every prod build is reproducible from the repo.
- Env vars CAN be updated via `railway variables --set` (they aren't tracked in git), but everything else is git-only.
- Live (staging): https://wsm-website-production.up.railway.app
- After visual changes, screenshot via Playwright MCP against `localhost:3000` (do not push live to test)

## Conventions

- Match the existing design tokens (colors, fonts, type scale) — do not introduce new ones casually; they were tuned to match the original site.
- Use `next/image` for all images. Use `next/link` for internal navigation.
- New routes: add a folder under `src/app/<slug>/` with `page.tsx`. If it replaces an old Squarespace URL, add a 301 redirect in `next.config.ts`.
- Update `src/app/sitemap.ts` when adding indexable pages.
