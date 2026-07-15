import Link from "next/link";
import { redirect } from "next/navigation";
import { getVerifiedSession } from "@/lib/session";
import { SignOutButton } from "@/components/SignOutButton";
import { QuickChat } from "@/components/QuickChat";

export const dynamic = "force-dynamic";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await getVerifiedSession();
  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen pet-bg">
      <QuickChat />
      <header className="sticky top-0 z-10 border-b border-[var(--border)] bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/home" className="flex items-center gap-2 text-xl font-semibold text-[var(--foreground)] tracking-tight">
            <span className="text-2xl" aria-hidden>🐾</span>
            <span className="bg-gradient-to-r from-[var(--accent)] to-[var(--secondary)] bg-clip-text text-transparent">Furlytics</span>
          </Link>
          <nav className="flex items-center gap-5 sm:gap-6">
            <Link href="/dashboard" className="text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">
              Dashboard
            </Link>
            <Link href="/pets" className="text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">
              Pets
            </Link>
            <Link href="/log-incident" className="text-sm font-medium text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors">
              Log Incident
            </Link>
            <Link href="/profile" className="text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">
              Profile
            </Link>
            <SignOutButton />
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-8 min-h-[60vh]">{children}</main>
      <footer className="border-t border-[var(--border)]/60 bg-transparent py-4">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 text-center text-xs text-[var(--muted)]/70">
          © {new Date().getFullYear()} Furlytics. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
