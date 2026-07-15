"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchPets, type StoredPet } from "@/lib/petStorage";

export default function PetsPage() {
  const [pets, setPets] = useState<StoredPet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPets().then((list) => {
      setPets(list);
      setLoading(false);
    });
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-[var(--foreground)]">Pets</h1>
        <Link
          href="/pets/new"
          className="rounded-xl bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--accent-hover)] transition-colors"
        >
          Add pet
        </Link>
      </div>
      {loading ? (
        <p className="mt-8 text-[var(--muted)]">Loading…</p>
      ) : pets.length === 0 ? (
        <p className="mt-8 text-[var(--muted)]">
          No pets yet.{" "}
          <Link href="/pets/new" className="font-medium text-[var(--accent)] hover:text-[var(--accent-hover)]">
            Add your first pet
          </Link>
        </p>
      ) : (
        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
          {pets.map((pet) => (
            <li key={pet.id}>
              <Link
                href={`/pets/${pet.id}`}
                className="block rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm hover:border-[var(--accent)] transition-colors"
              >
                <h2 className="text-lg font-semibold text-[var(--foreground)]">{pet.name}</h2>
                {pet.breed && <p className="mt-1 text-sm text-[var(--muted)]">{pet.breed}</p>}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
