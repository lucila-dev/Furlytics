import Link from "next/link";
import { MarketingHeader } from "@/components/MarketingHeader";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col pet-bg">
      <MarketingHeader />

      <main className="flex-1">
        {/* Hero — full photo on mobile so all animals are visible */}
        <section className="mx-auto max-w-6xl px-4 sm:px-6 sm:py-10">
          <div className="sm:relative sm:h-[400px] sm:overflow-hidden sm:rounded-[2.5rem] sm:text-center">
            <div className="-mx-4 overflow-hidden sm:absolute sm:inset-0 sm:mx-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/home-hero-dogs.jpg"
                alt="Three puppies and a duckling on the grass"
                className="block h-auto w-full object-contain object-center sm:h-full sm:object-cover sm:object-[center_45%]"
              />
            </div>
            <div
              className="pointer-events-none absolute inset-0 hidden sm:block"
              style={{ backgroundColor: "color-mix(in srgb, var(--background) 55%, transparent)" }}
              aria-hidden
            />
            <div className="relative flex flex-col items-center px-1 py-8 text-center sm:h-full sm:justify-center sm:px-10">
              <h1 className="max-w-3xl text-3xl font-bold tracking-tight text-[var(--foreground)] sm:text-5xl md:text-6xl">
                Pet behaviour & health,{" "}
                <span className="bg-gradient-to-r from-[var(--accent)] to-[var(--secondary)] bg-clip-text text-transparent">
                  simplified
                </span>
              </h1>
              <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-[var(--foreground)]/80 sm:mt-6 sm:text-xl">
                Log symptoms and behaviour, spot patterns over time, and walk into the vet with clear summaries. Built
                for pet owners who care.
              </p>
              <div className="mt-6 flex w-full max-w-sm flex-col gap-3 sm:mt-10 sm:max-w-none sm:w-auto sm:flex-row sm:flex-wrap sm:items-center sm:justify-center sm:gap-4">
                <Link
                  href="/login"
                  className="rounded-xl bg-[var(--accent)] px-6 py-3.5 text-center text-base font-medium text-white shadow-lg hover:bg-[var(--accent-hover)] transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  className="rounded-xl border-2 border-[var(--secondary)] bg-white/95 px-6 py-3.5 text-center text-base font-medium text-[var(--secondary)] hover:bg-white transition-colors"
                >
                  Register
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="border-t border-[var(--border)] bg-white/60 py-20 sm:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <h2 className="text-center text-3xl font-bold text-[var(--foreground)]">What you can do</h2>
            <p className="mx-auto mt-4 max-w-2xl text-center text-[var(--muted)]">
              One place to track your pet’s health and behaviour and prepare for vet visits.
            </p>
            <ul className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <li className="card-accent-1 rounded-2xl border border-[var(--border)] bg-white p-6 shadow-md hover:shadow-lg transition-shadow">
                <span className="text-3xl" aria-hidden>
                  📋
                </span>
                <h3 className="mt-4 text-lg font-semibold text-[var(--accent)]">Log incidents</h3>
                <p className="mt-2 text-sm text-[var(--muted)]">
                  Record symptoms and behaviour with a few taps. Add notes and timestamps so nothing is forgotten.
                </p>
              </li>
              <li className="card-accent-2 rounded-2xl border border-[var(--border)] bg-white p-6 shadow-md hover:shadow-lg transition-shadow">
                <span className="text-3xl" aria-hidden>
                  📊
                </span>
                <h3 className="mt-4 text-lg font-semibold text-[var(--secondary)]">Spot patterns</h3>
                <p className="mt-2 text-sm text-[var(--muted)]">
                  See when issues repeat or escalate. Get a simple view of symptoms over time to share with your vet.
                </p>
              </li>
              <li className="card-accent-3 rounded-2xl border border-[var(--border)] bg-white p-6 shadow-md hover:shadow-lg transition-shadow">
                <span className="text-3xl" aria-hidden>
                  🏥
                </span>
                <h3 className="mt-4 text-lg font-semibold text-[var(--tertiary)]">Vet-ready summaries</h3>
                <p className="mt-2 text-sm text-[var(--muted)]">
                  Turn your logs into clear summaries and questions so your vet has the full picture.
                </p>
              </li>
            </ul>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="border-t border-[var(--border)] py-20 sm:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <h2 className="text-center text-3xl font-bold text-[var(--foreground)]">How it works</h2>
            <p className="mx-auto mt-4 max-w-2xl text-center text-[var(--muted)]">
              Add your pets, log when something happens, and use the dashboard to see the big picture.
            </p>
            <ol className="mx-auto mt-12 max-w-2xl space-y-8">
              <li className="flex gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--accent)]/25 text-[var(--accent)] font-semibold">
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
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--secondary)]/25 text-[var(--secondary)] font-semibold">
                  2
                </span>
                <div>
                  <h3 className="font-semibold text-[var(--foreground)]">Log incidents</h3>
                  <p className="mt-1 text-sm text-[var(--muted)]">
                    Whenever you notice a symptom, behaviour change, or accident, log it with a quick form.
                  </p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--tertiary)]/25 text-[var(--tertiary)] font-semibold">
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
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-[var(--border)] bg-gradient-to-br from-[var(--accent)]/15 via-[var(--secondary)]/10 to-[var(--tertiary)]/15 py-20 sm:py-24">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
            <h2 className="text-2xl font-bold text-[var(--foreground)] sm:text-3xl">Ready to keep track?</h2>
            <p className="mt-4 text-[var(--muted)]">Sign in or create an account to get started.</p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/login"
                className="rounded-xl bg-[var(--accent)] px-8 py-3.5 text-base font-medium text-white shadow-md hover:bg-[var(--accent-hover)] transition-colors"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className="rounded-xl border-2 border-[var(--secondary)] bg-white px-8 py-3.5 text-base font-medium text-[var(--secondary)] hover:bg-[var(--secondary)]/10 transition-colors"
              >
                Register
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[var(--border)] bg-white py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <Link href="/" className="flex items-center gap-2 text-lg font-semibold text-[var(--foreground)]">
              <span aria-hidden>🐾</span>
              Furlytics
            </Link>
            <nav className="flex gap-8">
              <Link href="/login" className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]">
                Sign in
              </Link>
              <Link href="/register" className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]">
                Register
              </Link>
              <a href="#features" className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]">
                Features
              </a>
              <a href="#how-it-works" className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]">
                How it works
              </a>
            </nav>
          </div>
          <p className="mt-8 text-center text-sm text-[var(--muted)] sm:text-left">
            Pet behaviour & health intelligence, made simple for owners who care.
          </p>
          <p className="mt-2 text-center text-xs text-[var(--muted)]/70 sm:text-left">
            © {new Date().getFullYear()} Furlytics. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
