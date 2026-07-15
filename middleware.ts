export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/home/:path*",
    "/pets/:path*",
    "/log-incident/:path*",
    "/profile/:path*",
    "/incidents/:path*",
  ],
};
