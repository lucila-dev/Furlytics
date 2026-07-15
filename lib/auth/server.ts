import { createNeonAuth } from "@neondatabase/auth/next/server";

const baseUrl = process.env.NEON_AUTH_BASE_URL ?? "";
const cookieSecret = process.env.NEON_AUTH_COOKIE_SECRET ?? "";

/**
 * Neon Auth must not throw during `next build` when env vars are missing.
 * Use placeholders at build time; real values are required at runtime.
 */
export const auth = createNeonAuth({
  baseUrl: baseUrl || "https://placeholder.neonauth.local/auth",
  cookies: {
    secret: cookieSecret || "build-time-placeholder-secret-min-32-chars!!",
  },
});
