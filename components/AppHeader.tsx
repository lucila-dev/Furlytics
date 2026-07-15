"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignOutButton } from "@/components/SignOutButton";

const links: { href: string; label: string; accent?: boolean }[] = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/pets", label: "Pets" },
  { href: "/log-incident", label: "Log Incident", accent: true },
  { href: "/profile", label: "Profile" },
];

function linkClass(accent?: boolean, mobile = false) {
  if (mobile) {
    return accent
      ? "rounded-xl px-3 py-3 text-base font-medium text-[var(--accent)]"
      : "rounded-xl px-3 py-3 text-base text-[var(--foreground)]";
  }
  return accent
    ? "text-sm font-medium text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors"
    : "text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors";
}

export function AppHeader({ userEmail }: { userEmail: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4 sm:h-16 sm:px-6">
        <Link
          href="/home"
          className="flex min-w-0 items-center gap-2 text-xl font-semibold tracking-tight text-[var(--foreground)]"
        >
          <span className="shrink-0 text-2xl" aria-hidden>
            🐾
          </span>
          <span className="truncate bg-gradient-to-r from-[var(--accent)] to-[var(--secondary)] bg-clip-text text-transparent">
            Furlytics
          </span>
        </Link>

        <nav className="hidden items-center gap-4 md:flex lg:gap-6">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className={linkClass(link.accent)}>
              {link.label}
            </Link>
          ))}
          {userEmail && (
            <span className="max-w-[10rem] truncate text-xs text-[var(--muted)] lg:max-w-[14rem]" title={userEmail}>
              {userEmail}
            </span>
          )}
          <SignOutButton />
        </nav>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border)] text-[var(--foreground)] md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          )}
        </button>
      </div>

      {open && (
        <div id="mobile-nav" className="border-t border-[var(--border)] bg-white md:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3">
            {userEmail && (
              <p className="px-3 py-2 text-xs text-[var(--muted)]">Signed in as {userEmail}</p>
            )}
            {links.map((link) => (
              <Link key={link.href} href={link.href} className={linkClass(link.accent, true)}>
                {link.label}
              </Link>
            ))}
            <div className="border-t border-[var(--border)] px-3 py-3">
              <SignOutButton />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
