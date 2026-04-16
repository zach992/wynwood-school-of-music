# WSM Website Clone - Design Spec

## Goal
Rebuild wynwoodschoolofmusic.com (currently on Squarespace) as a Next.js application that is visually very close to the original, fully editable in code, and ready for future backend features (form submissions, etc.).

## Architecture
- Next.js 14+ App Router with TypeScript and Tailwind CSS
- Full server-side rendering (not static export) — ready for API routes
- Shared layout: announcement banner, navigation header, footer
- Images downloaded from Squarespace CDN into `/public/images/`
- Forms render with client-side validation, submission handler stubbed

## Pages (13 routes)
| Route | Page | Source URL |
|-------|------|-----------|
| `/` | Homepage | wynwoodschoolofmusic.com |
| `/our-story` | Our Story | /our-story |
| `/team` | Team | /team |
| `/programs-and-pricing` | Programs & Pricing | /programs-and-pricing |
| `/private-lessons` | Private Lessons | /private-lessons |
| `/our-bands` | Our Bands / Band Programs | /our-bands |
| `/musicperformancecamp` | Music Performance Camp | /musicperformancecamp |
| `/recitals` | Recitals / Tickets | /recitals |
| `/testimonials` | Testimonials | /testimonials |
| `/repair` | Repair Shop | /repair |
| `/friendsofwsm` | Friends of WSM | /friendsofwsm |
| `/contact` | Contact | /contact |
| `/privacy-policy` | Privacy Policy | /privacy-policy |

**Redirect:** `/summercamp` → `/musicperformancecamp`

## Design System
- **Background:** Dark/near-black (#1a1a1a or similar)
- **Text:** White (#ffffff) and light gray for secondary
- **Accent:** Muted mauve/purple (extracted from site — the pink-purple on buttons, announcement bar)
- **Typography:** Bold uppercase serif headings, clean sans-serif body text
- **Buttons:** Rounded pill shape with mauve accent color
- **Cards/Sections:** Dark backgrounds with subtle separators
- **Footer:** 3-column — Free Trial CTA, Quick Links, Contact Info (hours, holiday closures)
- **Announcement Banner:** Full-width top bar with accent background, dismissible

## Navigation Structure
- **Logo** (links to /)
- Home
- About Us (dropdown): Our Story, Team, Testimonials, Friends of WSM
- Programs (dropdown): Programs & Pricing, Private Lessons, Band Programs
- Summer Camp (dropdown): Music Performance Camp
- Recitals (dropdown): Tickets - Spring 2026
- Repair
- Contact Us

## Forms (stubbed for now)
- **Contact page:** Student Name, DOB, Private/Band selection, Subjects checkboxes, Experience, Parent info, "How did you hear about us"
- **Repair page:** Name, Email, Phone, Service type checkboxes, Submit
- Both validate client-side, log to console on submit, easy to wire to API route later

## Reference Screenshots
All in `.playwright-screenshots/` — per-page subfolders with Playwright captures and manual screenshots for pages where Playwright missed images.

## Out of Scope
- Camp Gallery and Gallery pages (dropped)
- Blog or store functionality
- Actual form submission backends (stubbed only)
- SEO/meta tags optimization (basic only)
