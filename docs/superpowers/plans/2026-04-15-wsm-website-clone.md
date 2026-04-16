# WSM Website Clone Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild wynwoodschoolofmusic.com as a Next.js app that is visually close to the original Squarespace site, with 13 pages, shared layout, and stubbed forms.

**Architecture:** Next.js 14+ App Router with TypeScript and Tailwind CSS. Shared layout with announcement banner, nav header with dropdowns, and 3-column footer. Images served from `/public/images/`. Forms validate client-side with stubbed submission handlers.

**Tech Stack:** Next.js 14+, TypeScript, Tailwind CSS, React 18+

---

## File Structure

```
src/
  app/
    layout.tsx              — Root layout (announcement banner, nav, footer)
    page.tsx                — Homepage
    globals.css             — Tailwind imports + custom CSS (fonts, animations)
    our-story/page.tsx
    team/page.tsx
    programs-and-pricing/page.tsx
    private-lessons/page.tsx
    our-bands/page.tsx
    musicperformancecamp/page.tsx
    recitals/page.tsx
    testimonials/page.tsx
    repair/page.tsx
    friendsofwsm/page.tsx
    contact/page.tsx
    privacy-policy/page.tsx
  components/
    AnnouncementBar.tsx     — Dismissible top banner
    Header.tsx              — Logo + nav with dropdowns
    Footer.tsx              — 3-column footer
    MobileMenu.tsx          — Mobile hamburger menu
    Button.tsx              — Reusable pill button
    TestimonialCard.tsx     — Quote card with attribution
    TeamMemberCard.tsx      — Instructor photo + bio + button
    ContactForm.tsx         — Contact/signup form
    RepairForm.tsx          — Repair inquiry form
    ImageCarousel.tsx       — Homepage hero carousel
    SectionHeading.tsx      — Styled section heading
  lib/
    site-data.ts            — Centralized site content (hours, address, phone, etc.)
public/
  images/                   — All site images organized by page
    logo.png
    homepage/
    our-story/
    team/
    ...etc
tailwind.config.ts          — Custom colors, fonts
next.config.ts              — Redirects (/summercamp -> /musicperformancecamp)
```

---

## Task 1: Project Scaffold & Configuration

**Files:**
- Create: `package.json`, `tsconfig.json`, `tailwind.config.ts`, `next.config.ts`, `src/app/layout.tsx`, `src/app/globals.css`, `src/app/page.tsx`, `.gitignore`

- [ ] **Step 1: Initialize Next.js project**

```bash
cd "/Users/zachlarmer/Desktop/Claude Projects/WSM Website Clone"
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm
```

Accept defaults. This scaffolds the project with App Router, TypeScript, Tailwind, and src directory.

- [ ] **Step 2: Configure Tailwind with WSM design tokens**

Replace `tailwind.config.ts`:

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        wsm: {
          dark: "#1a1a1a",
          darker: "#111111",
          accent: "#8b5a6b",
          "accent-hover": "#a06b7d",
          "accent-light": "#c49aaa",
          white: "#ffffff",
          gray: "#cccccc",
          "gray-dark": "#888888",
        },
      },
      fontFamily: {
        heading: ['"Oswald"', "sans-serif"],
        body: ['"Open Sans"', "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
```

Note: The exact accent color and fonts will be refined when comparing against screenshots. Oswald + Open Sans are a best guess from the site's visual style — update if different during implementation.

- [ ] **Step 3: Configure Next.js with redirect**

Replace `next.config.ts`:

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/summercamp",
        destination: "/musicperformancecamp",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
```

- [ ] **Step 4: Set up globals.css**

Replace `src/app/globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Open+Sans:wght@400;500;600;700&display=swap');

html {
  scroll-behavior: smooth;
}

body {
  background-color: #1a1a1a;
  color: #ffffff;
}

/* Smooth transitions for interactive elements */
a, button {
  transition: opacity 0.2s ease, background-color 0.2s ease;
}
```

- [ ] **Step 5: Create site data file**

Create `src/lib/site-data.ts`:

```typescript
export const siteData = {
  name: "Wynwood School of Music",
  phone: "305-359-5515",
  email: "info@wynwoodschoolofmusic.com",
  address: {
    street: "1260 NW 29th St. Unit 103",
    city: "Miami",
    state: "FL",
    zip: "33142",
  },
  hours: {
    regular: [
      { days: "Monday-Thursday", time: "2-9PM" },
      { days: "Friday", time: "2-7:30PM" },
      { days: "Saturday", time: "CLOSED" },
      { days: "Sunday", time: "11AM-8PM" },
    ],
    holidayClosures: {
      "Fall 2025": [
        'Monday, September 1st "Labor Day"',
        'Friday, October 31st "Halloween"',
      ],
      "Spring 2026": [
        'Sunday, April 5th "Easter Sunday"',
        'Sunday, May 10th "Mother\'s Day"',
        'Monday, May 25th "Memorial Day"',
      ],
      "Summer 2026": [
        'Sunday, June 21st "Father\'s Day"',
      ],
    },
  },
  social: {
    facebook: "https://www.facebook.com/wynwoodschoolofmusic",
    instagram: "https://www.instagram.com/wynwoodschoolofmusic",
    youtube: "https://www.youtube.com/@wynwoodschoolofmusic",
    spotify: "https://open.spotify.com/artist/wynwoodschoolofmusic",
  },
  announcement: {
    text: "YOUR FIRST MUSIC LESSON IS ON US - CLICK TO START!",
    link: "/contact",
  },
};

export const navLinks = [
  { label: "Home", href: "/" },
  {
    label: "About Us",
    href: "/our-story",
    children: [
      { label: "Our Story", href: "/our-story" },
      { label: "Team", href: "/team" },
      { label: "Testimonials", href: "/testimonials" },
      { label: "Friends of WSM", href: "/friendsofwsm" },
    ],
  },
  {
    label: "Programs",
    href: "/programs-and-pricing",
    children: [
      { label: "Programs & Pricing", href: "/programs-and-pricing" },
      { label: "Private Lessons", href: "/private-lessons" },
      { label: "Band Programs", href: "/our-bands" },
    ],
  },
  {
    label: "Summer Camp",
    href: "/musicperformancecamp",
    children: [
      { label: "Music Performance Camp", href: "/musicperformancecamp" },
    ],
  },
  {
    label: "Recitals",
    href: "/recitals",
    children: [
      { label: "Tickets - Spring 2026", href: "/recitals" },
    ],
  },
  { label: "Repair", href: "/repair" },
  { label: "Contact Us", href: "/contact" },
];
```

- [ ] **Step 6: Create placeholder root layout and homepage**

Replace `src/app/layout.tsx`:

```typescript
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Wynwood School of Music",
  description: "Music lessons and band programs in the heart of Miami's art district",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-wsm-dark text-white font-body min-h-screen">
        {/* AnnouncementBar, Header, Footer will be added in Task 2 */}
        <main>{children}</main>
      </body>
    </html>
  );
}
```

Replace `src/app/page.tsx`:

```typescript
export default function HomePage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <h1 className="font-heading text-4xl uppercase">Wynwood School of Music</h1>
    </div>
  );
}
```

- [ ] **Step 7: Create .gitignore additions**

Append to `.gitignore`:

```
.playwright-screenshots/
.playwright-mcp/
.superpowers/
```

- [ ] **Step 8: Verify dev server starts**

```bash
npm run dev
```

Visit http://localhost:3000 — should show "Wynwood School of Music" centered on dark background.

- [ ] **Step 9: Initialize git and commit**

```bash
git init
git add -A
git commit -m "feat: scaffold Next.js project with WSM design tokens"
```

---

## Task 2: Shared Layout Components (Announcement Bar, Header, Footer)

**Files:**
- Create: `src/components/AnnouncementBar.tsx`, `src/components/Header.tsx`, `src/components/Footer.tsx`, `src/components/MobileMenu.tsx`, `src/components/Button.tsx`
- Modify: `src/app/layout.tsx`

**Reference screenshots:** Any page — the announcement bar, nav, and footer are consistent across all pages. Use `.playwright-screenshots/01-homepage/` and `.playwright-screenshots/02-our-story/` for reference.

- [ ] **Step 1: Create the Button component**

Create `src/components/Button.tsx`:

```typescript
import Link from "next/link";

interface ButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "outline";
  className?: string;
}

export default function Button({ href, children, variant = "primary", className = "" }: ButtonProps) {
  const base = "inline-block rounded-full px-8 py-3 text-sm font-semibold uppercase tracking-wider transition-colors";
  const variants = {
    primary: "bg-wsm-accent text-white hover:bg-wsm-accent-hover",
    outline: "border-2 border-wsm-accent text-wsm-accent hover:bg-wsm-accent hover:text-white",
  };

  return (
    <Link href={href} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </Link>
  );
}
```

- [ ] **Step 2: Create the AnnouncementBar component**

Create `src/components/AnnouncementBar.tsx`:

```typescript
"use client";

import { useState } from "react";
import Link from "next/link";
import { siteData } from "@/lib/site-data";

export default function AnnouncementBar() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="bg-wsm-accent text-white text-center py-2 px-4 text-sm font-semibold relative">
      <Link href={siteData.announcement.link} className="hover:underline">
        {siteData.announcement.text}
      </Link>
      <button
        onClick={() => setVisible(false)}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:opacity-70"
        aria-label="Close Announcement"
      >
        &times;
      </button>
    </div>
  );
}
```

- [ ] **Step 3: Create the Header component with desktop dropdowns**

Create `src/components/Header.tsx`:

```typescript
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { navLinks } from "@/lib/site-data";
import MobileMenu from "./MobileMenu";

export default function Header() {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="bg-wsm-dark border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        <Link href="/" className="flex-shrink-0">
          <Image
            src="/images/logo.png"
            alt="Wynwood School of Music"
            width={120}
            height={50}
            className="h-12 w-auto"
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <div
              key={link.label}
              className="relative"
              onMouseEnter={() => link.children && setOpenDropdown(link.label)}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <Link
                href={link.href}
                className={`px-3 py-2 text-sm font-semibold uppercase tracking-wider transition-colors hover:text-wsm-accent ${
                  pathname === link.href ? "text-wsm-accent" : "text-white"
                }`}
              >
                {link.label}
              </Link>
              {link.children && openDropdown === link.label && (
                <div className="absolute top-full left-0 bg-wsm-darker border border-white/10 rounded-md py-2 min-w-[220px] z-50">
                  {link.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className="block px-4 py-2 text-sm text-white hover:bg-wsm-accent/20 hover:text-wsm-accent transition-colors"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden text-white p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {mobileOpen && <MobileMenu onClose={() => setMobileOpen(false)} />}
    </header>
  );
}
```

- [ ] **Step 4: Create MobileMenu component**

Create `src/components/MobileMenu.tsx`:

```typescript
"use client";

import { useState } from "react";
import Link from "next/link";
import { navLinks } from "@/lib/site-data";

interface MobileMenuProps {
  onClose: () => void;
}

export default function MobileMenu({ onClose }: MobileMenuProps) {
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  return (
    <nav className="lg:hidden bg-wsm-darker border-t border-white/10">
      {navLinks.map((link) => (
        <div key={link.label} className="border-b border-white/5">
          {link.children ? (
            <>
              <button
                onClick={() => setExpandedItem(expandedItem === link.label ? null : link.label)}
                className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold uppercase tracking-wider text-white"
              >
                {link.label}
                <svg
                  className={`w-4 h-4 transition-transform ${expandedItem === link.label ? "rotate-180" : ""}`}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {expandedItem === link.label && (
                <div className="bg-wsm-dark">
                  {link.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      onClick={onClose}
                      className="block px-8 py-2 text-sm text-wsm-gray hover:text-wsm-accent"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </>
          ) : (
            <Link
              href={link.href}
              onClick={onClose}
              className="block px-4 py-3 text-sm font-semibold uppercase tracking-wider text-white hover:text-wsm-accent"
            >
              {link.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
}
```

- [ ] **Step 5: Create the Footer component**

Create `src/components/Footer.tsx`:

```typescript
import Link from "next/link";
import { siteData } from "@/lib/site-data";
import Button from "./Button";

export default function Footer() {
  return (
    <footer className="bg-white text-black">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Free Trial Column */}
          <div>
            <h3 className="font-heading text-xl font-bold uppercase mb-4">Free Trial Lesson</h3>
            <p className="text-sm mb-4">Your first lesson is on us, sign up and start today!</p>
            <Button href="/contact">Sign Up!</Button>
          </div>

          {/* Quick Links Column */}
          <div>
            <h3 className="font-heading text-xl font-bold uppercase mb-4">Quick Links</h3>
            <nav className="flex flex-col gap-2">
              {[
                { label: "Home", href: "/" },
                { label: "Contact Us", href: "/contact" },
                { label: "About Us", href: "/our-story" },
                { label: "Team", href: "/team" },
                { label: "Programs", href: "/programs-and-pricing" },
                { label: "Privacy Policy", href: "/privacy-policy" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm underline hover:text-wsm-accent transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            {/* Social Icons */}
            <div className="flex gap-3 mt-6">
              {Object.entries(siteData.social).map(([platform, url]) => (
                <a
                  key={platform}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center hover:bg-wsm-accent transition-colors"
                  aria-label={platform}
                >
                  {/* Simple letter icon fallback — replace with proper icons */}
                  <span className="text-xs font-bold uppercase">{platform[0]}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Contact Column */}
          <div>
            <h3 className="font-heading text-xl font-bold uppercase mb-4">Contact Us</h3>
            <div className="space-y-4 text-sm">
              <div>
                <p className="font-bold uppercase">Wynwood School of Music</p>
                <p>{siteData.address.street}</p>
                <p>{siteData.address.city}, {siteData.address.state} {siteData.address.zip}</p>
              </div>
              <div>
                <p className="font-bold uppercase">Phone Number</p>
                <p>{siteData.phone}</p>
              </div>
              <div>
                <p className="font-bold uppercase">Email</p>
                <p>{siteData.email}</p>
              </div>
              <div>
                <p className="font-bold uppercase">Hours</p>
                {siteData.hours.regular.map((h) => (
                  <p key={h.days}>{h.days} {h.time}</p>
                ))}
              </div>
              <div>
                <p className="font-bold uppercase">Holiday Closures</p>
                {Object.entries(siteData.hours.holidayClosures).map(([season, dates]) => (
                  <div key={season} className="mt-1">
                    <p className="font-bold">{season}:</p>
                    {dates.map((d) => (
                      <p key={d}>{d}</p>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-12 pt-6 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Wynwood School of Music. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 6: Wire layout components into root layout**

Update `src/app/layout.tsx`:

```typescript
import type { Metadata } from "next";
import "./globals.css";
import AnnouncementBar from "@/components/AnnouncementBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Wynwood School of Music",
  description: "Music lessons and band programs in the heart of Miami's art district",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-wsm-dark text-white font-body min-h-screen flex flex-col">
        <AnnouncementBar />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
```

- [ ] **Step 7: Download the logo image**

```bash
mkdir -p public/images
curl -L "https://images.squarespace-cdn.com/content/v1/5d122e5ca5575c000175b8c5/1565627934716-LTM0ZUTIULE101ZZQEOW/Wynwood+School+og+Music+Logo.png" -o public/images/logo.png
```

- [ ] **Step 8: Verify layout renders correctly**

```bash
npm run dev
```

Visit http://localhost:3000. Check:
- Announcement bar visible at top with mauve background
- Navigation shows all links with dropdowns on hover
- Footer shows all three columns with correct content
- Mobile menu works at small viewport

Screenshot and compare against reference screenshots.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: add shared layout — announcement bar, header with dropdowns, footer"
```

---

## Task 3: Homepage

**Files:**
- Modify: `src/app/page.tsx`
- Create: `src/components/ImageCarousel.tsx`, `src/components/TestimonialCard.tsx`
- Create: `public/images/homepage/` (download hero images and section images)

**Reference screenshots:** `.playwright-screenshots/01-homepage/`

The homepage has these sections (top to bottom):
1. Hero with background image carousel + "A lifelong love of music starts here" + Sign Up button
2. Introduction text block (headline about Sammy Gonzalez and Zach Larmer + paragraph)
3. Two testimonial quotes (Google review + Thumbtack review) + "Read More Testimonies" link
4. Two cards side by side: Private Lessons + Band Programs (each with image, heading, Learn More button)
5. "Need a Repair?" banner with image and Learn More link
6. "Play Together. Grow Together. Perform Together." banner with Learn More link

- [ ] **Step 1: Download homepage images from Squarespace CDN**

Use Playwright or curl to download hero images and section images. Save to `public/images/homepage/`. The implementing agent should navigate to the live homepage, extract all `<img>` src URLs and CSS `background-image` URLs, download each one, and save with descriptive names.

- [ ] **Step 2: Create ImageCarousel component**

Create `src/components/ImageCarousel.tsx` — a simple auto-advancing carousel with crossfade transition. Takes an array of image paths. Uses `useState` and `useEffect` for auto-advance with `setInterval`.

- [ ] **Step 3: Create TestimonialCard component**

Create `src/components/TestimonialCard.tsx`:

```typescript
interface TestimonialCardProps {
  quote: string;
  attribution: string;
}

export default function TestimonialCard({ quote, attribution }: TestimonialCardProps) {
  return (
    <div className="flex flex-col items-start">
      <p className="text-lg md:text-xl italic font-heading leading-relaxed">
        &ldquo;{quote}&rdquo;
      </p>
      <p className="mt-4 text-sm text-wsm-gray">&mdash; {attribution}</p>
    </div>
  );
}
```

- [ ] **Step 4: Build the full homepage**

Replace `src/app/page.tsx` with all 6 sections. Reference the manual screenshots in `01-homepage/` for exact layout. The agent building this should read the screenshots and the Playwright snapshot to get exact text content.

Key sections:
- Hero: full-width background carousel with centered heading and CTA button
- Intro: constrained-width text block with bold heading and body paragraph
- Testimonials: two-column quote layout with link to `/testimonials`
- Programs: two equal cards side by side linking to `/private-lessons` and `/our-bands`
- Repair banner: image left/right with text overlay, links to `/repair`
- Band banner: similar treatment, links to `/our-bands`

- [ ] **Step 5: Verify against screenshots**

Start dev server, navigate to homepage, take screenshot. Compare layout, spacing, and content against reference screenshots.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: build homepage with hero carousel, testimonials, program cards"
```

---

## Task 4: Our Story Page

**Files:**
- Create: `src/app/our-story/page.tsx`
- Create: `public/images/our-story/` (download images)

**Reference screenshots:** `.playwright-screenshots/02-our-story/`

Sections:
1. "Our Story" page heading
2. Photo of founders + "We Believe in the Power of Music Education" text block with bio
3. "Facility" section with description + image carousel of the facility
4. "Location" section with address and proximity info
5. "Parking" section with parking info

- [ ] **Step 1: Download our-story images from live site**
- [ ] **Step 2: Build the page with all sections matching the reference screenshot**
- [ ] **Step 3: Verify against screenshots and commit**

```bash
git add -A
git commit -m "feat: add Our Story page"
```

---

## Task 5: Team Page

**Files:**
- Create: `src/app/team/page.tsx`
- Create: `src/components/TeamMemberCard.tsx`
- Create: `public/images/team/` (download headshots)

**Reference screenshots:** `.playwright-screenshots/03-team/` (manual screenshots have headshots visible)

Sections:
1. "Team" heading + subheading about combined experience
2. Founders section: Zach Larmer and Sammy Gonzalez Zeira — side-by-side bios
3. "Instructors" grid: cards with photo, name, instruments, and "About [Name]" button
   - Instructors visible in screenshots: Lex Kittai, Alex Kayze, Ali Shanbaneh, Salvatore Di Giovanni, Fredi Albenas, Angel Perez, Mark Sinatra, Patrice Agboste, Trevor Sage, Senko Zabala, AJ Hill, Victor Buono, Fadi Shamoun

- [ ] **Step 1: Create TeamMemberCard component**

```typescript
import Image from "next/image";
import Button from "./Button";

interface TeamMemberCardProps {
  name: string;
  role: string;
  imageSrc: string;
  buttonLabel?: string;
  buttonHref?: string;
}

export default function TeamMemberCard({ name, role, imageSrc, buttonLabel, buttonHref }: TeamMemberCardProps) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="w-48 h-48 rounded-full overflow-hidden mb-4 bg-wsm-darker">
        <Image src={imageSrc} alt={name} width={192} height={192} className="object-cover w-full h-full" />
      </div>
      <h4 className="font-heading text-lg font-bold uppercase">{name}</h4>
      <p className="text-sm text-wsm-gray mt-1">{role}</p>
      {buttonLabel && buttonHref && (
        <div className="mt-3">
          <Button href={buttonHref}>{buttonLabel}</Button>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Download team headshots from live site**
- [ ] **Step 3: Build the team page with founders section and instructor grid**
- [ ] **Step 4: Verify against manual screenshots and commit**

```bash
git add -A
git commit -m "feat: add Team page with founder bios and instructor grid"
```

---

## Task 6: Programs & Pricing Page

**Files:**
- Create: `src/app/programs-and-pricing/page.tsx`
- Create: `public/images/programs/` (download images)

**Reference screenshots:** `.playwright-screenshots/04-programs-and-pricing/`

Sections:
1. "Programs & Pricing" heading
2. "Learn From Professional Musicians" intro text
3. Testimonial quote block (italic, with purple overlay background)
4. "Program Pillars" — Private Lessons description + Band Programs description with image
5. Pricing table: two columns — Private Lessons (ages, durations, prices, instruments) and Band Programs (ages, genres, levels, price)
6. "Calendar + Pricing" and "Payment + Cancellation Policies" buttons
7. "Sign Up" button

- [ ] **Step 1: Download images from live site**
- [ ] **Step 2: Build the full page matching reference screenshots**
- [ ] **Step 3: Verify and commit**

```bash
git add -A
git commit -m "feat: add Programs & Pricing page"
```

---

## Task 7: Private Lessons Page

**Files:**
- Create: `src/app/private-lessons/page.tsx`

**Reference screenshots:** `.playwright-screenshots/05-private-lessons/`

Sections:
1. "Private Lessons" heading
2. "Learn. Grow. Perform." subheading + intro paragraph
3. Quote block with purple overlay
4. "Private Lesson Pillars" — Youth Private Lessons, Adult Private Lessons
5. "Measured Achievement in Private Lessons" — Technique, Music Literacy, Repertoire, Recitals & Performances
6. Sign Up button

- [ ] **Step 1: Build the page**
- [ ] **Step 2: Verify and commit**

```bash
git add -A
git commit -m "feat: add Private Lessons page"
```

---

## Task 8: Our Bands Page

**Files:**
- Create: `src/app/our-bands/page.tsx`
- Create: `public/images/bands/` (download images)

**Reference screenshots:** `.playwright-screenshots/06-our-bands/`

Sections:
1. "Band Programs" heading
2. "Play Together. Grow Together. Perform Together." intro text + Sign Up button
3. "Band Pathways" — 4 levels, each with image, heading, level description:
   - Rock Ambassadors (Advanced - Audition Only)
   - Rock Legends (Intermediate)
   - Rising Stars (Beginner)
   - Rock Juniors (Intro)
4. "Ready to Join a Band?" CTA
5. Testimonial quote block

- [ ] **Step 1: Download band images**
- [ ] **Step 2: Build the page**
- [ ] **Step 3: Verify and commit**

```bash
git add -A
git commit -m "feat: add Our Bands page with band pathways"
```

---

## Task 9: Music Performance Camp Page

**Files:**
- Create: `src/app/musicperformancecamp/page.tsx`

**Reference screenshots:** `.playwright-screenshots/07-music-performance-camp/`

Sections:
1. "Your Camp Experience" heading
2. Camp details: times, ages, pricing, early bird discount
3. Session dates table (Sessions A through F with dates)
4. Daily sample schedule
5. "Answers to All Your Questions" FAQ section (multiple Q&A items)
6. "Save Your Spot" button

- [ ] **Step 1: Build the page**
- [ ] **Step 2: Verify and commit**

```bash
git add -A
git commit -m "feat: add Music Performance Camp page"
```

---

## Task 10: Recitals Page

**Files:**
- Create: `src/app/recitals/page.tsx`
- Create: `public/images/recitals/` (download images)

**Reference screenshots:** `.playwright-screenshots/09-recitals/` (manual screenshots needed for background images)

Sections:
1. Two event cards with background images and "Tickets" buttons
2. "We'll See You at the Shows!" heading

- [ ] **Step 1: Download recital images**
- [ ] **Step 2: Build the page**
- [ ] **Step 3: Verify and commit**

```bash
git add -A
git commit -m "feat: add Recitals page"
```

---

## Task 11: Testimonials Page

**Files:**
- Create: `src/app/testimonials/page.tsx`

**Reference screenshots:** `.playwright-screenshots/11-testimonials/`

Sections:
1. "Our Success" heading + intro text
2. "Current Students" section — featured student profiles with photos and bios
3. "Alumni" section — featured alumni with photos and bios
4. "Testimonials" section — list of text-only testimonials with name and attribution

- [ ] **Step 1: Download profile photos**
- [ ] **Step 2: Build the page with all three sections**
- [ ] **Step 3: Verify and commit**

```bash
git add -A
git commit -m "feat: add Testimonials page"
```

---

## Task 12: Repair Page

**Files:**
- Create: `src/app/repair/page.tsx`
- Create: `src/components/RepairForm.tsx`
- Create: `public/images/repair/` (download images)

**Reference screenshots:** `.playwright-screenshots/12-repair/`

Sections:
1. Hero banner with "Repair Shop is Open!" and image
2. Two shop photos
3. Address, hours, and turnaround time info
4. Testimonial quote
5. "Repairs & Services" — two columns: Guitar & Bass Restringing/Setup pricing and Guitar & Bass Additional Services/Repairs pricing
6. Photo gallery strip
7. "Need a Repair or Service? Contact Us Today!" form (Name, Email, Phone, Service checkboxes, Submit)

- [ ] **Step 1: Create RepairForm component**

Create `src/components/RepairForm.tsx` — form with fields: Name (first/last), Email, Phone, service type checkboxes (matching the list on the live site). On submit, `console.log` the form data and show a success message. Use controlled form state with `useState`.

- [ ] **Step 2: Download repair page images**
- [ ] **Step 3: Build the full page with pricing tables and form**
- [ ] **Step 4: Verify and commit**

```bash
git add -A
git commit -m "feat: add Repair page with service pricing and contact form"
```

---

## Task 13: Friends of WSM Page

**Files:**
- Create: `src/app/friendsofwsm/page.tsx`
- Create: `public/images/friendsofwsm/` (download images)

**Reference screenshots:** `.playwright-screenshots/13-friendsofwsm/`

Sections:
1. Hero with "Friends of Wynwood School of Music" overlay + Donate button
2. "Our Impact" section with image and text
3. "Mission" section
4. "History" section with image
5. "Current Scholarship Recipients" photo grid
6. "Alumni Scholarship Recipients" photo grid
7. Contact info (address, phone, email, EIN)

- [ ] **Step 1: Download images**
- [ ] **Step 2: Build the page**
- [ ] **Step 3: Verify and commit**

```bash
git add -A
git commit -m "feat: add Friends of WSM page"
```

---

## Task 14: Contact Page

**Files:**
- Create: `src/app/contact/page.tsx`
- Create: `src/components/ContactForm.tsx`
- Create: `public/images/contact/` (download images)

**Reference screenshots:** `.playwright-screenshots/14-contact/`

Two-column layout:
- Left: "Start Your Musical Journey Today" heading + contact form
- Right: Contact info block + two photos

Form fields (from screenshot):
- Student Name (First, Last) — required
- Student's Date of Birth — required
- Private Lessons or Band Program? (radio: Private Lessons, Band and Private Lesson)
- Subjects checkboxes: Acoustic Guitar, Cello, Drums, Electric Bass, Electric Guitar, Keyboard, Music Production, Music Theory, Musical Theater (Voice), Saxophone, Songwriting, Spoken Word / Poetry, Trumpet, Ukulele, Viola, Violin, Voice
- How many years of experience? — required
- Parent / Guardian Name (First, Last)
- Parent / Guardian Phone Number — required
- Parent / Guardian Email — required
- How did you hear about us? — required (hint: Referred by a friend, Facebook, Instagram, Google, Print Advertising, Other)
- Sign Up button

- [ ] **Step 1: Create ContactForm component**

Create `src/components/ContactForm.tsx` with all fields above. Use controlled state. On submit, `console.log` the data and show success. All required fields should validate before submission.

- [ ] **Step 2: Download contact page images**
- [ ] **Step 3: Build the contact page with two-column layout**
- [ ] **Step 4: Verify and commit**

```bash
git add -A
git commit -m "feat: add Contact page with signup form"
```

---

## Task 15: Privacy Policy Page

**Files:**
- Create: `src/app/privacy-policy/page.tsx`

**Reference screenshots:** `.playwright-screenshots/15-privacy-policy/`

Simple text page — "Privacy Policy" heading followed by the full privacy policy text. The implementing agent should scrape the text content from the live page.

- [ ] **Step 1: Scrape privacy policy text from live site**
- [ ] **Step 2: Build the page**
- [ ] **Step 3: Verify and commit**

```bash
git add -A
git commit -m "feat: add Privacy Policy page"
```

---

## Task 16: Visual Polish & Cross-Page Review

**Files:**
- Modify: Various — fixing spacing, colors, fonts, responsive issues

- [ ] **Step 1: Compare every page against reference screenshots**

Navigate to each page on localhost, take a Playwright screenshot, compare side-by-side with the reference. Note discrepancies in:
- Colors (accent color, backgrounds)
- Fonts (heading vs body, weights, sizes)
- Spacing (section padding, element margins)
- Responsive behavior (mobile nav, stacked layouts)

- [ ] **Step 2: Fix discrepancies found**
- [ ] **Step 3: Test mobile responsiveness on all pages**
- [ ] **Step 4: Verify all internal links work (no 404s)**
- [ ] **Step 5: Final commit**

```bash
git add -A
git commit -m "fix: visual polish — colors, fonts, spacing, responsive fixes"
```

---

## Task 17: GitHub Repo & Railway Deployment

**Files:**
- No new files

- [ ] **Step 1: Create GitHub repo**

```bash
gh repo create wynwood-school-of-music --public --source=. --remote=origin --push
```

- [ ] **Step 2: Push all code**

```bash
git push -u origin main
```

- [ ] **Step 3: Deploy to Railway**

```bash
railway login
railway init
railway up
```

Configure the domain if needed.

- [ ] **Step 4: Verify production deployment**

Visit the Railway URL and spot-check 3-4 pages.

- [ ] **Step 5: Commit any deployment config changes**
