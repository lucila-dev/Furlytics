"use client";

import Link from "next/link";

export function SignOutButton() {
  return (
    <Link
      href="/"
      className="text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
    >
      Sign out
    </Link>
  );
}
