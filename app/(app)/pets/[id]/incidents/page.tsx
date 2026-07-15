"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { fetchPetById, type StoredPet } from "@/lib/petStorage";
import { fetchIncidents, type StoredIncident } from "@/lib/incidentStorage";

export default function PetIncidentsPage() {
  const params = useParams();
  const petId = params.id as string;
  const [pet, setPet] = useState<StoredPet | null>(null);
  const [incidents, setIncidents] = useState<StoredIncident[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    Promise.all([fetchPetById(petId), fetchIncidents(petId)]).then(([p, incs]) => {
      setPet(p);
      setIncidents(incs);
      setLoaded(true);
    });
  }, [petId]);

  if (!loaded) return null;
  if (!pet) {
    return (
      <div>
        <p className="text-[var(--muted)]">Pet not found.</p>
        <Link href="/pets" className="mt-4 inline-block text-[var(--accent)] hover:text-[var(--accent-hover)]">
          ← Back to pets
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <Link href={`/pets/${petId}`} className="text-sm text-[var(--accent)] hover:text-[var(--accent-hover)]">
            ← {pet.name}
          </Link>
          <h1 className="mt-1 text-2xl font-semibold text-[var(--foreground)]">Incidents</h1>
        </div>
        <Link
          href={`/log-incident?petId=${petId}`}
          className="rounded-xl bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--accent-hover)] transition-colors"
        >
          Log incident
        </Link>
      </div>
      {incidents.length === 0 ? (
        <p className="mt-6 text-[var(--muted)]">No incidents yet. Log one to track symptoms and behaviour.</p>
      ) : (
        <ul className="mt-6 space-y-2">
          {incidents.map((incident) => (
            <li
              key={incident.id}
              className="rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-3 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-medium text-[var(--foreground)]">{incident.title}</span>
                  <span className="ml-2 text-sm text-[var(--muted)] capitalize">{incident.category}</span>
                </div>
                <span className="text-sm text-[var(--muted)]">
                  {new Date(incident.timestamp).toLocaleString()}
                </span>
              </div>
              {incident.description && (
                <p className="mt-1 text-sm text-[var(--muted)]">{incident.description}</p>
              )}
              {Object.entries(incident.symptoms).some(([, v]) => v) && (
                <p className="mt-1 text-xs text-[var(--muted)]">
                  Signs: {Object.entries(incident.symptoms)
                    .filter(([, v]) => v)
                    .map(([k]) => k.replace(/([A-Z])/g, " $1").trim())
                    .join(", ")}
                </p>
              )}
              <div className="mt-2">
                <Link
                  href={`/incidents/${incident.id}/report`}
                  className="text-sm font-medium text-[var(--accent)] hover:text-[var(--accent-hover)]"
                >
                  {incident.report ? "View report" : "Generate report"}
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
