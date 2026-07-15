import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
      <h1 className="text-2xl font-semibold text-[var(--foreground)]">Page not found</h1>
      <p className="mt-2 text-[var(--muted)]">The page you’re looking for doesn’t exist.</p>
      <Link href="/dashboard" className="mt-6 text-[var(--accent)] hover:text-[var(--accent-hover)]">
        Back to Dashboard
      </Link>
    </div>
  );
}
