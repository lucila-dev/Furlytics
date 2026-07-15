"use client";

import { authClient } from "@/lib/auth/client";

export function SignOutButton() {
  return (
    <button
      type="button"
      onClick={async () => {
        await authClient.signOut();
        window.location.href = "/login";
      }}
      className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-sm font-medium text-[var(--foreground)] hover:bg-black/5 transition-colors"
    >
      Sign out
    </button>
  );
}
