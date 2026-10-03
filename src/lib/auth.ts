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

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

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

export const config = {
  matcher: [
    // Everything except Next internals and static files.
    "/((?!_next/static|_next/image|favicon.ico|logo.png|logo.svg|.*\\.(?:png|webp|svg|jpg|jpeg|pdf|ico)$).*)",
  ],
};

export { SESSION_COOKIE };