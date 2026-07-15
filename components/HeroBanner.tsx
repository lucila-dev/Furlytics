import type { ReactNode } from "react";
import Link from "next/link";

type Cta = {
  href: string;
  label: string;
  variant: "primary" | "secondary" | "ghost";
};

type HeroBannerProps = {
  title: ReactNode;
  subtitle: string;
  ctas: Cta[];
  /**
   * Break out of a padded/centered layout so the photo is full-bleed
   * (same look on / and /home).
   */
  breakout?: boolean;
};

const variantClass: Record<Cta["variant"], string> = {
  primary:
    "rounded-xl bg-[var(--accent)] px-6 py-3 text-center font-medium text-white shadow-md hover:bg-[var(--accent-hover)] transition-colors",
  secondary:
    "rounded-xl border-2 border-[var(--secondary)] bg-white px-6 py-3 text-center font-medium text-[var(--secondary)] hover:bg-white transition-colors",
  ghost:
    "rounded-xl border-2 border-[var(--border)] bg-white px-6 py-3 text-center font-medium text-[var(--foreground)] hover:border-[var(--accent)] transition-colors",
};

export function HeroBanner({ title, subtitle, ctas, breakout = false }: HeroBannerProps) {
  return (
    <section
      className={
        breakout
          ? "relative -mx-4 h-[340px] overflow-hidden text-center sm:mx-0 sm:h-[420px] sm:rounded-[2.5rem]"
          : "relative h-[340px] overflow-hidden text-center sm:h-[420px] sm:rounded-[2.5rem]"
      }
    >
      <div
        className="absolute inset-0 bg-cover bg-[70%_40%] sm:bg-[center_42%]"
        style={{ backgroundImage: "url(/home-hero-dogs.jpg)" }}
        aria-hidden
      />
      {/* Soft veil so the photo stays visible but text contrast improves */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-[#f8f6fc]/80 via-[#f8f6fc]/65 to-[#f8f6fc]/80"
        aria-hidden
      />
      <div className="relative mx-auto flex h-full max-w-6xl flex-col items-center justify-center px-4 py-6 sm:px-10">
        <div className="w-full max-w-2xl rounded-2xl bg-white/85 px-5 py-6 shadow-lg backdrop-blur-md sm:px-8 sm:py-8">
          <h1 className="text-3xl font-bold tracking-tight text-[var(--foreground)] sm:text-4xl md:text-5xl">
            {title}
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-base leading-relaxed text-[var(--muted)] sm:mt-4 sm:text-lg">
            {subtitle}
          </p>
          <div className="mt-5 flex w-full flex-col gap-3 sm:mt-6 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center sm:gap-3">
            {ctas.map((cta) => (
              <Link key={cta.href + cta.label} href={cta.href} className={variantClass[cta.variant]}>
                {cta.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
