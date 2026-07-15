import Link from "next/link";
import { redirect } from "next/navigation";
import { MarketingHeader } from "@/components/MarketingHeader";
import { HeroBanner } from "@/components/HeroBanner";
import { getVerifiedSession } from "@/lib/session";

export default async function HomePage() {
  const session = await getVerifiedSession();
  if (session?.user) {
    redirect("/home");
  }

  return (
    <div className="flex min-h-screen flex-col pet-bg">
      <MarketingHeader />

      {/* Same layout shell as signed-in pages so the hero matches /home */}
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
        <div className="space-y-16 pb-12">
          <HeroBanner
            breakout
            title={
              <>
                Welcome to{" "}
                <span className="bg-gradient-to-r from-[var(--accent)] to-[var(--secondary)] bg-clip-text text-transparent">
                  Furlytics
                </span>
              </>
            }
            subtitle="Your place to track your pets’ health and behaviour, spot patterns, and go to the vet with clear summaries."
            ctas={[
              { href: "/login", label: "Sign in", variant: "primary" },
              { href: "/register", label: "Register", variant: "secondary" },
              { href: "/login", label: "Log Incident", variant: "ghost" },
            ]}
          />

          <section>
            <h2 className="text-2xl font-bold text-[var(--foreground)]">What Furlytics does</h2>
            <p className="mt-2 text-[var(--muted)]">
              Furlytics helps you record symptoms, behaviour, and accidents for each pet, see how they change over time,
              and prepare clear notes for vet visits.
            </p>
            <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <li className="card-accent-1 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-md">
                <span className="text-2xl" aria-hidden>
                  📋
                </span>
                <h3 className="mt-3 font-semibold text-[var(--accent)]">Log incidents</h3>
                <p className="mt-1 text-sm text-[var(--muted)]">
                  Record symptoms, behaviour, or accidents with optional signs (vomiting, lethargy, anxiety, etc.) and
                  notes.
                </p>
              </li>
              <li className="card-accent-2 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-md">
                <span className="text-2xl" aria-hidden>
                  📊
                </span>
                <h3 className="mt-3 font-semibold text-[var(--secondary)]">Symptom overview</h3>
                <p className="mt-1 text-sm text-[var(--muted)]">
                  Your dashboard shows recent incidents and a symptom overview for the last 6 weeks based only on what
                  you’ve reported.
                </p>
              </li>
              <li className="card-accent-3 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-md">
                <span className="text-2xl" aria-hidden>
                  💬
                </span>
                <h3 className="mt-3 font-semibold text-[var(--tertiary)]">Quick chat</h3>
                <p className="mt-1 text-sm text-[var(--muted)]">
                  Use the chat button at the bottom right for quick questions about your pet.
                </p>
              </li>
            </ul>
          </section>

          <section id="how-it-works">
            <h2 className="text-2xl font-bold text-[var(--foreground)]">How to use it</h2>
            <ol className="mt-6 space-y-6">
              <li className="flex gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--accent)]/25 font-semibold text-[var(--accent)]">
                  1
                </span>
                <div>
                  <h3 className="font-semibold text-[var(--foreground)]">Add your pets</h3>
                  <p className="mt-1 text-sm text-[var(--muted)]">
                    Create a profile for each pet with name, breed, age, microchip, vaccination info, and any known
                    conditions.
                  </p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--secondary)]/25 font-semibold text-[var(--secondary)]">
                  2
                </span>
                <div>
                  <h3 className="font-semibold text-[var(--foreground)]">Log when something happens</h3>
                  <p className="mt-1 text-sm text-[var(--muted)]">
                    Record symptoms, behaviour changes, or accidents with a quick form.
                  </p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--tertiary)]/25 font-semibold text-[var(--tertiary)]">
                  3
                </span>
                <div>
                  <h3 className="font-semibold text-[var(--foreground)]">Use your dashboard</h3>
                  <p className="mt-1 text-sm text-[var(--muted)]">
                    See recent incidents, symptom overview from your logs, and use quick chat for fast questions.
                  </p>
                </div>
              </li>
            </ol>
          </section>

          <section
            id="features"
            className="rounded-2xl border border-[var(--border)] bg-gradient-to-br from-[var(--accent)]/15 via-[var(--secondary)]/10 to-[var(--tertiary)]/15 p-8 text-center"
          >
            <h2 className="text-xl font-bold text-[var(--foreground)]">Ready to get started?</h2>
            <p className="mt-2 text-[var(--muted)]">Sign in or create an account to add pets and log incidents.</p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/login"
                className="rounded-xl bg-[var(--accent)] px-6 py-2.5 font-medium text-white hover:bg-[var(--accent-hover)] transition-colors"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className="rounded-xl border-2 border-[var(--secondary)] bg-[var(--card)] px-6 py-2.5 font-medium text-[var(--secondary)] hover:bg-[var(--secondary)]/10 transition-colors"
              >
                Register
              </Link>
            </div>
          </section>
        </div>
      </main>

      <footer className="border-t border-[var(--border)]/60 bg-transparent py-4">
        <div className="mx-auto max-w-6xl px-4 text-center text-xs text-[var(--muted)]/70 sm:px-6">
          © {new Date().getFullYear()} Furlytics. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
