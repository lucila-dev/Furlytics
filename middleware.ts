import { auth } from "@/lib/auth/server";

/**
 * Protect account routes. Exact paths must be listed separately from
 * `/:path*` patterns — Next.js matchers do not treat `/home/:path*` as `/home`.
 */
export default auth.middleware({
  loginUrl: "/login",
});

export const config = {
  matcher: [
    "/home",
    "/home/:path*",
    "/dashboard",
    "/dashboard/:path*",
    "/pets",
    "/pets/:path*",
    "/log-incident",
    "/log-incident/:path*",
    "/profile",
    "/profile/:path*",
    "/incidents",
    "/incidents/:path*",
  ],
};
