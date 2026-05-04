#!/usr/bin/env node
// Crawl the live Squarespace sitemap, extract every URL, and diff against
// the new Next.js routes + redirects. Print URLs that would 404 after cutover.
//
// Usage:
//   node scripts/diff-squarespace-redirects.mjs
//   node scripts/diff-squarespace-redirects.mjs --source https://www.wynwoodschoolofmusic.com/sitemap.xml
//
// Notes:
// - Run this BEFORE flipping DNS, while the live site is still Squarespace.
// - If the site is already cut over, point --source at a Wayback snapshot
//   (e.g. https://web.archive.org/web/2026*/wynwoodschoolofmusic.com/sitemap.xml)
//   or pass --source path/to/saved-sitemap.xml to read from disk.

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");

const args = process.argv.slice(2);
const sourceArgIndex = args.indexOf("--source");
const source =
  sourceArgIndex >= 0 && args[sourceArgIndex + 1]
    ? args[sourceArgIndex + 1]
    : "https://www.wynwoodschoolofmusic.com/sitemap.xml";

const SITE_HOST = "wynwoodschoolofmusic.com";

async function loadSitemap(src) {
  if (/^https?:\/\//.test(src)) {
    const res = await fetch(src, { redirect: "follow" });
    if (!res.ok) throw new Error(`Failed to fetch ${src}: ${res.status}`);
    return await res.text();
  }
  return await fs.readFile(src, "utf8");
}

function extractUrls(xml) {
  const matches = xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/gi);
  return Array.from(matches, (m) => m[1]);
}

// Recursively expand sitemap-index files.
async function collectUrls(src, seen = new Set()) {
  if (seen.has(src)) return [];
  seen.add(src);
  const xml = await loadSitemap(src);
  const urls = extractUrls(xml);
  const isIndex = /<sitemapindex[\s>]/i.test(xml);
  if (!isIndex) return urls;
  const out = [];
  for (const child of urls) {
    out.push(...(await collectUrls(child, seen)));
  }
  return out;
}

function toPath(url) {
  try {
    const u = new URL(url);
    if (!u.hostname.includes(SITE_HOST)) return null;
    let p = u.pathname.replace(/\/+$/, "");
    if (p === "") p = "/";
    return p;
  } catch {
    return null;
  }
}

// Walk src/app and collect every static route and dynamic-route shape.
async function collectAppRoutes() {
  const appDir = path.join(projectRoot, "src", "app");
  const staticRoutes = new Set();
  const dynamicRoutes = []; // { regex: RegExp }

  async function walk(dir, routeParts) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    const hasPage = entries.some((e) => e.isFile() && e.name === "page.tsx");
    if (hasPage) {
      const segs = routeParts.filter((s) => !s.startsWith("(")); // strip route groups
      const route = "/" + segs.join("/");
      const isDynamic = segs.some((s) => s.startsWith("[") && s.endsWith("]"));
      if (isDynamic) {
        const pattern = segs
          .map((s) =>
            s.startsWith("[...") ? ".+" : s.startsWith("[") ? "[^/]+" : escapeRegex(s),
          )
          .join("/");
        dynamicRoutes.push({ regex: new RegExp("^/" + pattern + "$") });
      } else {
        staticRoutes.add(route === "/" ? "/" : route);
      }
    }
    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      if (entry.name.startsWith("_") || entry.name === "api") continue;
      await walk(path.join(dir, entry.name), [...routeParts, entry.name]);
    }
  }
  await walk(appDir, []);
  return { staticRoutes, dynamicRoutes };
}

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Load redirect sources from next.config.ts. We import the compiled config via
// a tiny TS-stripping trick: read the file as text and pull `source:` strings
// out with regex. (We don't want to add a TS loader dep just for this.)
async function collectRedirectSources() {
  const configPath = path.join(projectRoot, "next.config.ts");
  const text = await fs.readFile(configPath, "utf8");
  const sources = new Set();
  for (const m of text.matchAll(/source:\s*[`"']([^`"']+)[`"']/g)) {
    sources.add(m[1]);
  }
  // Also resolve template-literal slugs like `/${slug}` against the
  // instructorSlugs array declared in the same file.
  const slugListMatch = text.match(
    /const\s+instructorSlugs\s*=\s*\[([\s\S]*?)\]/,
  );
  if (slugListMatch) {
    const slugs = Array.from(
      slugListMatch[1].matchAll(/["']([a-z0-9-]+)["']/gi),
      (m) => m[1],
    );
    for (const slug of slugs) sources.add(`/${slug}`);
  }
  return sources;
}

function normalize(p) {
  if (!p) return p;
  let n = p.replace(/\/+$/, "");
  if (n === "") n = "/";
  return n;
}

async function main() {
  console.log(`📡 Loading sitemap from: ${source}\n`);
  const oldUrls = await collectUrls(source);
  const oldPaths = Array.from(
    new Set(oldUrls.map(toPath).filter(Boolean).map(normalize)),
  ).sort();
  console.log(`Found ${oldPaths.length} unique paths in old sitemap.\n`);

  const { staticRoutes, dynamicRoutes } = await collectAppRoutes();
  const redirects = await collectRedirectSources();

  const covered = [];
  const missing = [];

  for (const p of oldPaths) {
    const np = normalize(p);
    if (staticRoutes.has(np) || staticRoutes.has(np + "/")) {
      covered.push([p, "route"]);
      continue;
    }
    if (dynamicRoutes.some(({ regex }) => regex.test(np))) {
      covered.push([p, "dynamic-route"]);
      continue;
    }
    if (redirects.has(np)) {
      covered.push([p, "redirect"]);
      continue;
    }
    missing.push(p);
  }

  console.log(`✅ Covered: ${covered.length}`);
  console.log(`❌ Missing: ${missing.length}\n`);

  if (missing.length) {
    console.log("URLs that will 404 after cutover (add redirects in next.config.ts):\n");
    for (const p of missing) console.log("  " + p);
    console.log("\nSuggested next.config.ts entries (edit destination):\n");
    for (const p of missing) {
      console.log(
        `  { source: "${p}", destination: "/", permanent: true },`,
      );
    }
    process.exitCode = 1;
  } else {
    console.log("Every old URL has a route or redirect. 🎉");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(2);
});
