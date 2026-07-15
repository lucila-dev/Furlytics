/** Canonical production sites Neon Auth must trust. */
export const PRODUCTION_ORIGIN = "https://furlytics.vercel.app";

export const ALLOWED_HOSTNAMES = new Set([
  "furlytics.vercel.app",
  "furlytics-kappa.vercel.app",
  "localhost",
  "127.0.0.1",
]);

export function hostnameFromHost(host: string): string {
  return host.split(":")[0]?.toLowerCase() ?? host;
}

export function isAllowedAppHost(hostname: string): boolean {
  return ALLOWED_HOSTNAMES.has(hostnameFromHost(hostname));
}

/** Deployment preview / alias hosts that are not the real site. */
export function isNonCanonicalHost(hostname: string): boolean {
  const h = hostnameFromHost(hostname);
  if (isAllowedAppHost(h)) return false;
  return h.endsWith(".vercel.app");
}

export function canonicalLoginUrl(path = "/login"): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${PRODUCTION_ORIGIN}${clean}`;
}

export function friendlyAuthError(message: string): string {
  if (/invalid origin/i.test(message)) {
    return `Login is blocked on this link (Invalid origin). Use ${PRODUCTION_ORIGIN}/login — and in Neon → Auth → Domains add https://furlytics.vercel.app and https://furlytics-kappa.vercel.app.`;
  }
  return message;
}
