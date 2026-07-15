import { redirect } from "next/navigation";
import { getVerifiedSession } from "@/lib/session";
import { AppHeader } from "@/components/AppHeader";
import { AuthOriginBanner } from "@/components/AuthOriginBanner";

export const dynamic = "force-dynamic";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await getVerifiedSession();
  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen pet-bg">
      <AuthOriginBanner />
      <AppHeader />
      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-8 min-h-[60vh]">{children}</main>
      <footer className="border-t border-[var(--border)]/60 bg-transparent py-4">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 text-center text-xs text-[var(--muted)]/70">
          © {new Date().getFullYear()} Furlytics. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
