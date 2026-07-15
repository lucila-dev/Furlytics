import { auth } from "@/lib/auth/server";

export default auth.middleware({
  loginUrl: "/login",
});

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
