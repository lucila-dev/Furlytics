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
      className="text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
    >
      Sign out
    </button>
  );
}
