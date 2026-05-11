import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@/auth";

/**
 * Single proxy (Next 16 middleware) handling two concerns:
 *
 * 1. **Subdomain routing.** The admin panel is hosted at `portal.mahadahlan.com`.
 *    - On the portal host: only admin paths (/login, /dashboard, /api/auth) are
 *      allowed; anything else 404s. Root `/` redirects to /login or /dashboard.
 *    - On the public host: admin paths return 404 so the panel can't be reached
 *      from mahadahlan.com directly.
 *    - Localhost is unrestricted for dev (both panel and landings reachable).
 *
 * 2. **Auth gating** for admin paths. Unauthenticated users hitting an admin
 *    path get redirected to /login; authed users hitting /login get bounced
 *    to /dashboard.
 */

const ADMIN_PATHS = [/^\/login(\/|$)/, /^\/dashboard(\/|$)/];
const ADMIN_API = [/^\/api\/auth(\/|$)/];
const PUBLIC_API = [/^\/api\/leads(\/|$)/];

function isAdminPath(pathname: string) {
  return ADMIN_PATHS.some((r) => r.test(pathname));
}

function isAuthApi(pathname: string) {
  return ADMIN_API.some((r) => r.test(pathname));
}

function isPublicApi(pathname: string) {
  return PUBLIC_API.some((r) => r.test(pathname));
}

export default auth((req: NextRequest & { auth: unknown }) => {
  const host = (req.headers.get("host") ?? "").toLowerCase();
  const { pathname } = req.nextUrl;

  // /api/leads is the public ingest — always allow regardless of host.
  if (isPublicApi(pathname)) return NextResponse.next();

  const isPortal = host.startsWith("portal.");
  const isLocal = host.startsWith("localhost") || host.startsWith("127.");
  const isAdmin = isAdminPath(pathname);
  const isAuth = isAuthApi(pathname);

  // ── Production host gating ─────────────────────────────────────────────
  if (!isLocal) {
    if (isPortal) {
      // On portal: redirect root to /login (or /dashboard if authed).
      if (pathname === "/") {
        const target = req.auth ? "/dashboard" : "/login";
        return NextResponse.redirect(new URL(target, req.nextUrl));
      }
      // Block any non-admin path on the portal subdomain.
      if (!isAdmin && !isAuth) {
        return new NextResponse("Not found", { status: 404 });
      }
    } else {
      // On the main domain: admin paths are hidden completely.
      if (isAdmin || isAuth) {
        return new NextResponse("Not found", { status: 404 });
      }
    }
  }

  // ── Auth gate for admin paths ──────────────────────────────────────────
  if (isAdmin) {
    const isAuthed = Boolean(req.auth);
    const isOnLogin = pathname === "/login";
    if (!isAuthed && !isOnLogin) {
      const url = new URL("/login", req.nextUrl);
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
    if (isAuthed && isOnLogin) {
      return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|mp4)$).*)",
  ],
};
