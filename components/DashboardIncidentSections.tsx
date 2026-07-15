"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getIncidents } from "@/lib/incidentStorage";
import { getPets } from "@/lib/petStorage";

export function DashboardIncidentSections() {
  const [incidents, setIncidents] = useState<ReturnType<typeof getIncidents>>([]);
  const [petNames, setPetNames] = useState<Record<string, string>>({});

  useEffect(() => {
    setIncidents(getIncidents());
    const pets = getPets();
    setPetNames(Object.fromEntries(pets.map((p) => [p.id, p.name])));
  }, []);

  const recentIncidents = incidents.slice(0, 10);
  const hasAnyIncidents = incidents.length > 0;

  return (
    <>
      {hasAnyIncidents && recentIncidents.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-[var(--foreground)]">Recent incidents</h2>
          <p className="mt-1 text-sm text-[var(--muted)]">Latest logged incidents. Open to generate or view a report.</p>
          <ul className="mt-3 space-y-2">
            {recentIncidents.map((incident) => (
              <li key={incident.id}>
                <Link
                  href={`/incidents/${incident.id}/report`}
                  className="flex items-center justify-between rounded-xl border-2 border-[var(--border)] bg-[var(--card)] px-4 py-3 shadow-sm transition-all hover:border-[var(--accent)]/30 hover:shadow-md"
                >
                  <div>
                    <span className="font-medium text-[var(--foreground)]">{incident.title}</span>
                    <span className="ml-2 text-sm text-[var(--muted)]">
                      {petNames[incident.petId] ?? "Pet"} · {new Date(incident.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-[var(--accent)]">
                    {incident.report ? "View report" : "Generate report"}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}
