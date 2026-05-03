# Post-Deploy Checklist

Things to do once `wynwoodschoolofmusic.com` points at the new Next.js build.

## 1. Verify production redirects

Hit each old URL in incognito; confirm a 301/308 redirect lands on the new path with a 200.

```bash
# 12 instructor URLs (root → /team/[slug])
curl -sI https://www.wynwoodschoolofmusic.com/leo-cattani | head -3
# repeat for: alex-ibanez, vale-penaranda, augusto-di-catarina, renzo-vargas,
# angel-perez, yamil-granda, patricio-acevedo, sergio-zavala, aj-hill,
# jake-mongin, nestor-rigaud

# Other redirects
curl -sI https://www.wynwoodschoolofmusic.com/summercamp | head -3
curl -sI https://www.wynwoodschoolofmusic.com/thania-sanz | head -3
```

Each should show `HTTP/.. 308` (or `301`) with a `Location:` header pointing to the new path.

## 2. Submit sitemap to Google Search Console

The site auto-generates a sitemap at `/sitemap.xml` listing all 25 canonical URLs (13 static pages + 12 instructor bios).

1. Open https://search.google.com/search-console
2. Pick the `wynwoodschoolofmusic.com` property (re-verify ownership if Squarespace's verification breaks during the cutover)
3. Sidebar → **Sitemaps** → enter `sitemap.xml` → **Submit**
4. Status should move from "Discovered" → "Success" within ~24 hours

This accelerates Google re-crawling the new pages and recognizing the redirects.

## 3. Monitor 404s in Coverage Report (first 30 days)

After Google starts crawling:

1. Search Console → **Pages** report → filter for "Not found (404)"
2. Anything that shows up is an old Squarespace URL we didn't redirect — common culprits:
   - Anchor-linked Squarespace blog/news posts
   - Old gallery/album URLs
   - Squarespace-internal URLs like `/s/...` or `/_assets/...`
3. For each that's worth preserving, add a redirect to `next.config.ts`, push, and they'll be picked up on the next crawl.

## 4. Update Google Ads landing page URLs

If any active ad campaigns point to old Squarespace URLs (e.g. `/leo-cattani`, `/summercamp`), update them in Google Ads to the canonical new URLs (`/team/leo-cattani`, `/musicperformancecamp`). Redirects work, but direct-pointing avoids the redirect hop and slightly improves Quality Score.

Path: Google Ads → Campaigns → Ads & extensions → audit each ad's Final URL.

## 5. Update social profiles (low priority)

If any of the social profiles in the footer link to URLs that have changed, update them:
- Facebook
- Instagram
- YouTube
- Spotify

Most likely the homepage URL is the only one referenced — no action needed unless a profile points to a moved page.

## 6. Test Open Graph card previews

Once live, paste the homepage URL into:
- **Facebook Sharing Debugger:** https://developers.facebook.com/tools/debug/
- **X/Twitter Card Validator:** https://cards-dev.twitter.com/validator (or paste URL into a tweet draft)
- **LinkedIn Post Inspector:** https://www.linkedin.com/post-inspector/

Each should pull the dark `/og-image.png` (1200×630) with the WSM logo + tagline. If a platform shows a stale or missing card, click "Scrape again" / "Refresh" to invalidate its cache.

## 7. Set up Search Console & Analytics (optional, recommended)

If not already configured:
- **Google Search Console** — for the steps above (#2, #3)
- **Google Analytics 4** — drop the GA4 measurement ID into a `<script>` in `src/app/layout.tsx` (or use `next/script`)
- **Vercel Analytics** / **Railway metrics** — built-in if hosting there
