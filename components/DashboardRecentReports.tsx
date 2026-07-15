"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { fetchIncidents, type StoredIncident } from "@/lib/incidentStorage";
import { fetchPets } from "@/lib/petStorage";

export function DashboardRecentReports() {
  const [incidents, setIncidents] = useState<StoredIncident[]>([]);
  const [petNames, setPetNames] = useState<Record<string, string>>({});

  useEffect(() => {
    Promise.all([fetchIncidents(), fetchPets()]).then(([incs, pets]) => {
      setIncidents(incs.filter((i) => i.report));
      setPetNames(Object.fromEntries(pets.map((p) => [p.id, p.name])));
    });
  }, []);

  const recent = incidents.slice(0, 8);
  if (recent.length === 0) return null;

  return (
    <section>
      <h2 className="text-lg font-semibold text-[var(--foreground)]">Recent reports</h2>
      <p className="mt-1 text-sm text-[var(--muted)]">Report summaries you’ve generated. Open to view or download PDF.</p>
      <ul className="mt-3 grid gap-3 sm:grid-cols-2">
        {recent.map((inc) => (
          <li key={inc.id}>
            <Link
              href={`/incidents/${inc.id}/report`}
              className="block rounded-2xl border-2 border-[var(--border)] bg-[var(--card)] p-4 shadow-md transition-all hover:border-[var(--accent)]/40 hover:shadow-lg"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="font-medium text-[var(--foreground)]">{inc.title}</span>
                  <p className="mt-0.5 text-sm text-[var(--muted)]">
                    {petNames[inc.petId] ?? "Pet"} · {new Date(inc.timestamp).toLocaleDateString()}
                  </p>
                  {inc.report && (
                    <p className="mt-2 line-clamp-2 text-xs text-[var(--foreground)]">
                      {inc.report.summary}
                    </p>
                  )}
                </div>
                <span className="shrink-0 rounded-full bg-[var(--accent)]/20 px-2 py-0.5 text-xs font-medium text-[var(--accent)]">
                  {inc.report?.vetNeed ?? "—"}
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
