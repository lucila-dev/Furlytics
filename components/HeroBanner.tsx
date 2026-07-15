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
  /** Bleed past padded layout on small screens (app /home). */
  breakout?: boolean;
};

const variantClass: Record<Cta["variant"], string> = {
  primary:
    "rounded-xl bg-[var(--accent)] px-6 py-3 text-center font-medium text-white shadow-md hover:bg-[var(--accent-hover)] transition-colors",
  secondary:
    "rounded-xl border-2 border-[var(--secondary)] bg-white/95 px-6 py-3 text-center font-medium text-[var(--secondary)] shadow-sm hover:bg-white transition-colors",
  ghost:
    "rounded-xl border-2 border-white/80 bg-white/95 px-6 py-3 text-center font-medium text-[var(--foreground)] shadow-sm hover:bg-white transition-colors",
};

export function HeroBanner({ title, subtitle, ctas, breakout = false }: HeroBannerProps) {
  return (
    <section
      className={
        breakout
          ? "relative -mx-4 h-[320px] overflow-hidden text-center sm:mx-0 sm:h-[400px] sm:rounded-[2.5rem]"
          : "relative h-[320px] overflow-hidden text-center sm:h-[400px] sm:rounded-[2.5rem]"
      }
    >
      <div
        className="absolute inset-0 bg-cover bg-[70%_40%] sm:bg-[center_42%]"
        style={{ backgroundImage: "url(/home-hero-dogs.jpg)" }}
        aria-hidden
      />
      {/* Light wash only — photo stays clear */}
      <div className="absolute inset-0 bg-[#f8f6fc]/35" aria-hidden />
      <div className="relative mx-auto flex h-full max-w-6xl flex-col items-center justify-center px-5 py-6 sm:px-10">
        <h1 className="max-w-3xl text-3xl font-bold tracking-tight text-[var(--foreground)] [text-shadow:0_1px_2px_rgba(255,255,255,0.9),0_0_24px_rgba(248,246,252,0.85)] sm:text-4xl md:text-5xl">
          {title}
        </h1>
        <p className="mx-auto mt-3 max-w-md text-base font-medium leading-relaxed text-[var(--foreground)] [text-shadow:0_1px_2px_rgba(255,255,255,0.9),0_0_20px_rgba(248,246,252,0.8)] sm:mt-4 sm:max-w-xl sm:text-lg">
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
