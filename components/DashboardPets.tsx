"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { fetchPets, type StoredPet } from "@/lib/petStorage";

export function DashboardPets() {
  const [pets, setPets] = useState<StoredPet[]>([]);

  useEffect(() => {
    fetchPets().then(setPets);
  }, []);

  if (pets.length === 0) {
    return (
      <p className="text-[var(--muted)]">
        <Link href="/pets/new" className="font-medium text-[var(--accent)] hover:text-[var(--accent-hover)]">
          Add a pet
        </Link>{" "}
        to start logging incidents and preparing vet summaries.
      </p>
    );
  }

  return (
    <section>
      <h2 className="text-lg font-medium text-[var(--foreground)]">Pets</h2>
      <ul className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {pets.map((pet, i) => (
          <li key={pet.id}>
            <Link
              href={`/pets/${pet.id}`}
              className={`block rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-md hover:shadow-lg transition-all ${i % 3 === 0 ? "card-accent-1" : i % 3 === 1 ? "card-accent-2" : "card-accent-3"}`}
            >
              <h3 className="font-semibold text-[var(--foreground)]">{pet.name}</h3>
              {(pet.animalType || pet.breed) && (
                <p className="mt-1 text-sm text-[var(--muted)]">
                  {[pet.animalType, pet.breed].filter(Boolean).join(" · ")}
                </p>
              )}
              <p className="mt-2 text-sm text-[var(--muted)]">View profile & incidents</p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
