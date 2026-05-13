import { NextResponse, type NextRequest } from "next/server";

// Lowercase any uppercase path. Next.js redirects() match case-insensitively,
// so they can't safely express a `/FOO` → `/foo` rule (it would loop on the
// lowercase canonical). The proxy sees the original pathname case and can
// only redirect when there's an actual difference.
export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const lower = pathname.toLowerCase();
  if (pathname !== lower) {
    const url = req.nextUrl.clone();
    url.pathname = lower;
    return NextResponse.redirect(url, 301);
  }
}

export const config = {
  // Skip Next internals, API routes, and anything with a file extension
  // (images, fonts, robots.txt, sitemap.xml, etc).
  matcher: ["/((?!api|_next/static|_next/image|.*\\..*).*)"],
};
