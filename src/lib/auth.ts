import { NextResponse, type NextRequest } from "next/server";

/**
 * Route protection.
 *
 * There is no backend yet, so "auth" here is a cookie flag set by the login
 * screen. That is deliberately NOT security - anyone can set the cookie by
 * hand. Its purpose is to stop visitors wandering into internal pages by
 * typing URLs, and to make sign-out meaningful in the UI.
 *
 * Residents and barangay officials now get separate session cookies, and each
 * role lands on its own dashboard after sign-in:
 *   - resident  -> /resident
 *   - official  -> /officials
 *
 * When a real backend lands, replace these cookie checks with a server-side
 * session check and drop the cookie writes in the login routes.
 */

/** Routes a signed-out visitor may see without a session. */
const PUBLIC_PATHS = ["/", "/login"];

/** Routes restricted to authenticated barangay officials. */
const OFFICIAL_PATHS = ["/officials"];

/** Resident session cookie, set by the resident form on /login. */
const RESIDENT_SESSION_COOKIE = "barangay_session";

/** Official session cookie, set by the official flip form on /login. */
const OFFICIAL_SESSION_COOKIE = "barangay_official_session";

/** Anything with a file extension is a static asset, not a page. */
const STATIC_FILE = /\.[a-z0-9]+$/i;

/**
 * True when a path is a real page that should be guarded.
 * Static files and Next internals always pass through.
 */
function isProtectedPath(pathname: string) {
  if (STATIC_FILE.test(pathname)) return false;
  return true;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Real assets are served as-is; guarding them would hand the browser HTML
  // in place of JS/CSS and break hydration.
  if (!isProtectedPath(pathname)) return NextResponse.next();

  const residentSession = request.cookies.get(RESIDENT_SESSION_COOKIE)?.value === "1";
  const officialSession = request.cookies.get(OFFICIAL_SESSION_COOKIE)?.value === "1";
  const hasSession = residentSession || officialSession;

  // Signed-in visitors hitting /login go straight to their own dashboard.
  if (pathname === "/login") {
    if (officialSession) {
      return NextResponse.redirect(new URL("/officials", request.url));
    }
    if (residentSession) {
      return NextResponse.redirect(new URL("/resident", request.url));
    }
    return NextResponse.next();
  }

  // /officials is the officials' dashboard - officials only.
  if (OFFICIAL_PATHS.includes(pathname)) {
    if (officialSession) return NextResponse.next();
    // A resident with a session belongs on the resident dashboard.
    if (residentSession) {
      return NextResponse.redirect(new URL("/resident", request.url));
    }
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (PUBLIC_PATHS.includes(pathname) || hasSession) return NextResponse.next();

  const loginUrl = new URL("/login", request.url);
  // Preserve where they were headed so login can bounce them back.
  if (pathname !== "/") loginUrl.searchParams.set("next", pathname);
  return NextResponse.redirect(loginUrl);
}

/**
 * Middleware matcher.
 *
 * Kept deliberately broad; the real filtering happens inside `middleware`
 * via `isProtectedPath`, because a negative-lookahead matcher is easy to get
 * subtly wrong (an earlier version redirected /_next/static/* assets to
 * /login, which broke hydration).
 */
export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};

export { RESIDENT_SESSION_COOKIE, OFFICIAL_SESSION_COOKIE };