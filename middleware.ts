import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ token }) => Boolean(token?.email || token?.sub),
  },
  pages: {
    signIn: "/login",
  },
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
