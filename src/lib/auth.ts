import { NextResponse, type NextRequest } from "next/server";

/**
 * Route protection.
 *
 * There is no backend yet, so "auth" here is a cookie flag set by the login
 * screen. That is deliberately NOT security - anyone can set the cookie by
 * hand. Its purpose is to stop residents wandering into internal pages by
 * typing URLs, and to make sign-out meaningful in the UI.
 *
 * When a real backend lands, replace `hasSessionCookie` with a server-side
 * session check and drop the `authorized` cookie write in the login route.
 */

/** Routes a signed-out visitor may see. */
const PUBLIC_PATHS = ["/", "/login"];

/** Cookie the login route sets on submit. */
const SESSION_COOKIE = "barangay_session";

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

  const isPublic = PUBLIC_PATHS.includes(pathname);
  const hasSession = request.cookies.get(SESSION_COOKIE)?.value === "1";

  // Signed-in users hitting /login go straight to the dashboard.
  if (pathname === "/login" && hasSession) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (isPublic || hasSession) return NextResponse.next();

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

export { SESSION_COOKIE };