"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getPets } from "@/lib/petStorage";

export default function PetsListPage() {
  const [pets, setPets] = useState(getPets());

  useEffect(() => {
    setPets(getPets());
    const onStorage = () => setPets(getPets());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-[var(--foreground)]">Pets</h1>
        <Link
          href="/pets/new"
          className="rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-2 font-medium text-[var(--foreground)] hover:bg-[var(--background)] transition-colors"
        >
          Add pet
        </Link>
      </div>
      {pets.length === 0 ? (
        <p className="mt-4 text-[var(--muted)]">
          No pets yet.{" "}
          <Link href="/pets/new" className="font-medium text-[var(--accent)] hover:text-[var(--accent-hover)]">
            Add a pet
          </Link>{" "}
          to get started.
        </p>
      ) : (
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pets.map((pet) => (
            <li key={pet.id}>
              <Link
                href={`/pets/${pet.id}`}
                className="block rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm transition hover:border-[var(--accent)]/30 hover:shadow-md"
              >
                <h2 className="font-semibold text-[var(--foreground)]">{pet.name}</h2>
                {pet.breed && <p className="mt-1 text-sm text-[var(--muted)]">{pet.breed}</p>}
                <p className="mt-2 text-sm text-[var(--muted)]">
                  {pet.age != null && `${pet.age} yrs`}
                  {pet.weight != null && ` · ${pet.weight} kg`}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
