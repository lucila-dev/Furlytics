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
          ? "relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen h-[320px] overflow-hidden text-center sm:h-[400px]"
          : "relative h-[320px] overflow-hidden text-center sm:h-[400px]"
      }
    >
      <div
        className="absolute inset-0 bg-cover bg-[70%_40%] sm:bg-[center_42%]"
        style={{ backgroundImage: "url(/home-hero-dogs.jpg)" }}
        aria-hidden
      />
      <div className="absolute inset-0 bg-[#f8f6fc]/55" aria-hidden />
      <div className="relative mx-auto flex h-full max-w-6xl flex-col items-center justify-center px-5 py-6 sm:px-10">
        <h1 className="max-w-3xl text-3xl font-bold tracking-tight text-[var(--foreground)] sm:text-4xl md:text-5xl">
          {title}
        </h1>
        <p className="mx-auto mt-3 max-w-md text-base leading-relaxed text-[var(--foreground)]/90 sm:mt-4 sm:max-w-xl sm:text-lg">
          {subtitle}
        </p>
        <div className="mt-5 flex w-full max-w-sm flex-col gap-3 sm:mt-6 sm:max-w-none sm:w-auto sm:flex-row sm:flex-wrap sm:items-center sm:justify-center sm:gap-3">
          {ctas.map((cta) => (
            <Link key={cta.href + cta.label} href={cta.href} className={variantClass[cta.variant]}>
              {cta.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
