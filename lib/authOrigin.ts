/** Production site — use this for login and data (Neon Auth trusted domain). */
export const PRODUCTION_ORIGIN = "https://furlytics.vercel.app";

export function isVercelPreviewHost(hostname: string): boolean {
  return (
    hostname.endsWith(".vercel.app") &&
    hostname !== "furlytics.vercel.app" &&
    !hostname.startsWith("localhost")
  );
}

export function friendlyAuthError(message: string): string {
  if (/invalid origin/i.test(message)) {
    return `This page isn’t allowed to sign you in. Open ${PRODUCTION_ORIGIN}/login instead (not a preview link).`;
  }
  return message;
}
