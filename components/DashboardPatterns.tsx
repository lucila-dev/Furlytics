"use client";

import { useState, useEffect } from "react";
import { fetchIncidents, getPatternsFromIncidents } from "@/lib/incidentStorage";

export function DashboardPatterns() {
  const [patterns, setPatterns] = useState<
    ReturnType<typeof getPatternsFromIncidents>
  >([]);

  useEffect(() => {
    fetchIncidents().then((incs) => setPatterns(getPatternsFromIncidents(incs)));
  }, []);

  if (patterns.length === 0) return null;

  return (
    <section>
      <h2 className="text-lg font-semibold text-[var(--foreground)]">Patterns spotted</h2>
      <p className="mt-1 text-sm text-[var(--muted)]">Signs reported in the last 14 days.</p>
      <ul className="mt-3 flex flex-wrap gap-3">
        {patterns.map((p) => (
          <li
            key={p.symptom}
            className="rounded-xl border-2 border-[var(--secondary)]/40 bg-gradient-to-br from-[var(--secondary)]/15 to-[var(--tertiary)]/15 px-4 py-2.5 shadow-sm"
          >
            <span className="font-medium text-[var(--foreground)]">{p.label}</span>
            <span className="ml-2 text-sm text-[var(--muted)]">
              {p.count} {p.count === 1 ? "time" : "times"}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
