"use client";

import { signOut } from "next-auth/react";

export function SignOutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
    >
      Sign out
    </button>
  );
}
