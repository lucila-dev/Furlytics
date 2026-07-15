import Link from "next/link";

export default function AppHomePage() {
  return (
    <div className="space-y-16 pb-12">
      {/* Hero — photo behind copy */}
      <section className="relative -mx-4 overflow-hidden text-center sm:mx-0 sm:h-[400px] sm:rounded-[2.5rem]">
        <div className="absolute inset-0 bg-[var(--background)]" aria-hidden />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/home-hero-dogs.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-[center_45%]"
          aria-hidden
        />
        <div
          className="absolute inset-0"
          style={{ backgroundColor: "color-mix(in srgb, var(--background) 50%, transparent)" }}
          aria-hidden
        />
        <div className="relative flex min-h-[min(52vh,420px)] flex-col items-center justify-center px-5 py-10 sm:h-full sm:min-h-0 sm:px-10 sm:py-8">
          <h1 className="max-w-xl text-3xl font-bold tracking-tight text-[var(--foreground)] sm:text-4xl md:text-5xl">
            Welcome to{" "}
            <span className="bg-gradient-to-r from-[var(--accent)] to-[var(--secondary)] bg-clip-text text-transparent">
              Furlytics
            </span>
          </h1>
          <p className="mx-auto mt-3 max-w-md text-base leading-relaxed text-[var(--foreground)]/85 sm:mt-4 sm:max-w-2xl sm:text-lg">
            Your place to track your pets’ health and behaviour, spot patterns, and go to the vet with clear summaries.
          </p>
          <div className="mt-6 flex w-full max-w-sm flex-col gap-3 sm:mt-8 sm:max-w-none sm:w-auto sm:flex-row sm:flex-wrap sm:items-center sm:justify-center sm:gap-4">
            <Link
              href="/dashboard"
              className="rounded-xl bg-[var(--accent)] px-6 py-3 text-center font-medium text-white shadow-md hover:bg-[var(--accent-hover)] transition-colors"
            >
              Go to Dashboard
            </Link>
            <Link
              href="/pets"
              className="rounded-xl border-2 border-[var(--secondary)] bg-white/95 px-6 py-3 text-center font-medium text-[var(--secondary)] hover:bg-white transition-colors"
            >
              My Pets
            </Link>
            <Link
              href="/log-incident"
              className="rounded-xl border-2 border-[var(--border)] bg-white/95 px-6 py-3 text-center font-medium text-[var(--foreground)] hover:border-[var(--accent)] hover:bg-white transition-colors"
            >
              Log Incident
            </Link>
          </div>
        </div>
      </section>

      {/* What the app does */}
      <section>
        <h2 className="text-2xl font-bold text-[var(--foreground)]">What Furlytics does</h2>
        <p className="mt-2 text-[var(--muted)]">
          Furlytics helps you record symptoms, behaviour, and accidents for each pet, see how they change over time, and prepare clear notes for vet visits.
        </p>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <li className="card-accent-1 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-md">
            <span className="text-2xl" aria-hidden>📋</span>
            <h3 className="mt-3 font-semibold text-[var(--accent)]">Log incidents</h3>
            <p className="mt-1 text-sm text-[var(--muted)]">
              Record symptoms, behaviour, or accidents with optional signs (vomiting, lethargy, anxiety, etc.) and notes.
            </p>
          </li>
          <li className="card-accent-2 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-md">
            <span className="text-2xl" aria-hidden>📊</span>
            <h3 className="mt-3 font-semibold text-[var(--secondary)]">Symptom overview</h3>
            <p className="mt-1 text-sm text-[var(--muted)]">
              Your dashboard shows recent incidents and a symptom overview for the last 6 weeks based only on what you’ve reported.
            </p>
          </li>
          <li className="card-accent-3 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-md">
            <span className="text-2xl" aria-hidden>💬</span>
            <h3 className="mt-3 font-semibold text-[var(--tertiary)]">Quick chat</h3>
            <p className="mt-1 text-sm text-[var(--muted)]">
              Use the chat button at the bottom right for quick questions about your pet.
            </p>
          </li>
        </ul>
      </section>

      {/* How to use it */}
      <section>
        <h2 className="text-2xl font-bold text-[var(--foreground)]">How to use it</h2>
        <ol className="mt-6 space-y-6">
          <li className="flex gap-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--accent)]/25 text-[var(--accent)] font-semibold">
              1
            </span>
            <div>
              <h3 className="font-semibold text-[var(--foreground)]">Add your pets</h3>
              <p className="mt-1 text-sm text-[var(--muted)]">
                Go to <Link href="/pets" className="font-medium text-[var(--accent)] hover:text-[var(--accent-hover)]">Pets</Link> and add each pet with name, breed, age, weight, microchip, vaccination info, and any known conditions.
              </p>
            </div>
          </li>
          <li className="flex gap-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--secondary)]/25 text-[var(--secondary)] font-semibold">
              2
            </span>
            <div>
              <h3 className="font-semibold text-[var(--foreground)]">Log when something happens</h3>
              <p className="mt-1 text-sm text-[var(--muted)]">
                Use <Link href="/log-incident" className="font-medium text-[var(--accent)] hover:text-[var(--accent-hover)]">Log Incident</Link> to record symptoms, behaviour changes, or accidents. Pick the pet, add a title and optional description, and tick any signs that apply.
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
                Your <Link href="/dashboard" className="font-medium text-[var(--accent)] hover:text-[var(--accent-hover)]">Dashboard</Link> shows your pets, recent incidents, and a symptom overview. From each pet’s page you can view their incident history.
              </p>
            </div>
          </li>
          <li className="flex gap-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--accent)]/25 text-[var(--accent)] font-semibold">
              4
            </span>
            <div>
              <h3 className="font-semibold text-[var(--foreground)]">Quick questions</h3>
              <p className="mt-1 text-sm text-[var(--muted)]">
                Open the chat icon at the bottom right to ask quick questions about your pet.
              </p>
            </div>
          </li>
        </ol>
      </section>

      {/* CTA */}
      <section className="rounded-2xl border border-[var(--border)] bg-gradient-to-br from-[var(--accent)]/15 via-[var(--secondary)]/10 to-[var(--tertiary)]/15 p-8 text-center">
        <h2 className="text-xl font-bold text-[var(--foreground)]">Ready to get started?</h2>
        <p className="mt-2 text-[var(--muted)]">Head to your dashboard or add a pet and log your first incident.</p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/dashboard"
            className="rounded-xl bg-[var(--accent)] px-6 py-2.5 font-medium text-white hover:bg-[var(--accent-hover)] transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href="/pets/new"
            className="rounded-xl border-2 border-[var(--secondary)] bg-[var(--card)] px-6 py-2.5 font-medium text-[var(--secondary)] hover:bg-[var(--secondary)]/10 transition-colors"
          >
            Add a pet
          </Link>
        </div>
      </section>
    </div>
  );
}
