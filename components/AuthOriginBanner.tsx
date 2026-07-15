"use client";

import { useEffect, useState } from "react";
import { isVercelPreviewHost, PRODUCTION_ORIGIN } from "@/lib/authOrigin";

export function AuthOriginBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(isVercelPreviewHost(window.location.hostname));
  }, []);

  if (!show) return null;

  return (
    <div className="border-b border-amber-200 bg-amber-50 px-4 py-3 text-center text-sm text-amber-950">
      You’re on a temporary preview link — login and pets won’t work here. Use{" "}
      <a href={`${PRODUCTION_ORIGIN}/login`} className="font-semibold underline">
        {PRODUCTION_ORIGIN}
      </a>
      .
    </div>
  );
}
