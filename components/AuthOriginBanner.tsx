"use client";

import { useEffect, useState } from "react";
import {
  canonicalLoginUrl,
  isNonCanonicalHost,
  PRODUCTION_ORIGIN,
} from "@/lib/authOrigin";

export function AuthOriginBanner() {
  const [wrongHost, setWrongHost] = useState(false);
  const [href, setHref] = useState(PRODUCTION_ORIGIN);

  useEffect(() => {
    const host = window.location.hostname;
    if (isNonCanonicalHost(host)) {
      setWrongHost(true);
      setHref(canonicalLoginUrl(window.location.pathname));
      // Hard redirect so Neon Auth always sees a trusted origin
      window.location.replace(
        `${PRODUCTION_ORIGIN}${window.location.pathname}${window.location.search}`
      );
    }
  }, []);

  if (!wrongHost) return null;

  return (
    <div className="border-b border-amber-200 bg-amber-50 px-4 py-3 text-center text-sm text-amber-950">
      Redirecting to the real site…{" "}
      <a href={href} className="font-semibold underline">
        {PRODUCTION_ORIGIN}
      </a>
    </div>
  );
}
