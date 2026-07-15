import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth/server";
import { isNonCanonicalHost, PRODUCTION_ORIGIN } from "@/lib/authOrigin";

const protectAppRoutes = auth.middleware({
  loginUrl: "/login",
});

const APP_ROUTE =
  /^\/(home|dashboard|pets|log-incident|profile|incidents)(\/.*)?$/;

export default async function middleware(request: NextRequest) {
  const host = request.headers.get("host") ?? "";
  const hostname = host.split(":")[0]?.toLowerCase() ?? "";

  // Never use preview/alias URLs for auth or account data
  if (isNonCanonicalHost(hostname)) {
    const url = new URL(request.url);
    const target = new URL(url.pathname + url.search, PRODUCTION_ORIGIN);
    return NextResponse.redirect(target, 308);
  }

  if (APP_ROUTE.test(request.nextUrl.pathname)) {
    return protectAppRoutes(request);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Run on pages we care about; skip static assets and Next internals.
     */
    "/((?!_next/static|_next/image|favicon.ico|icons/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
