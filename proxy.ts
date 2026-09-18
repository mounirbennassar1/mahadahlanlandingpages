import { NextResponse, type NextRequest } from "next/server";
import { PAGES } from "@/lib/pages/registry";

/**
 * lp.mahadahlan.com serves only the campaign landings. This proxy (Next 16
 * middleware) does two things:
 *
 * 1. **Sends everything else to the website.** The public site, its blog,
 *    booking, offers and the admin portal live in the separate website
 *    deployment (www.mahadahlan.com). Any path that is not a landing, an API
 *    route or a static asset is redirected there with the same path and query,
 *    so old links keep working on either host.
 *
 * 2. **Optional noindex.** The landings carry a canonical to the website, so
 *    they can stay crawlable for AdsBot. Once the website is indexed in Search
 *    Console, set NOINDEX_ADS_HOST=true to add `X-Robots-Tag: noindex` here.
 */

const WEBSITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.mahadahlan.com").replace(/\/+$/, "");

/** `/acne`, `/glass-skin`, ... straight from the content registry. */
const LANDING_PATHS = new Set(PAGES.map((page) => page.path.replace(/\/+$/, "") || "/"));

/** Files served from public/ (logos, videos, fonts) are never redirected. */
function isAsset(pathname: string) {
  return /\.[a-z0-9]+$/i.test(pathname.split("/").pop() ?? "");
}

export default function proxy(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  if (pathname.startsWith("/api/") || pathname === "/robots.txt" || isAsset(pathname)) {
    return NextResponse.next();
  }

  const path = pathname.replace(/\/+$/, "") || "/";
  if (LANDING_PATHS.has(path)) {
    const res = NextResponse.next();
    if (process.env.NOINDEX_ADS_HOST === "true") res.headers.set("X-Robots-Tag", "noindex");
    return res;
  }

  // Never bounce a host to itself (misconfigured NEXT_PUBLIC_SITE_URL).
  const website = new URL(WEBSITE_URL);
  const host = (req.headers.get("host") ?? "").toLowerCase();
  if (host === website.host.toLowerCase()) {
    return new NextResponse("Not found", { status: 404 });
  }

  return NextResponse.redirect(new URL(`${path === "/" ? "/" : path}${search}`, website), 307);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|mp4|webm|woff2|ico|txt|json)$).*)",
  ],
};
