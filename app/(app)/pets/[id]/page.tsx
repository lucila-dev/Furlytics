"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getPetById, deletePet } from "@/lib/petStorage";

export default function PetDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [pet, setPet] = useState<ReturnType<typeof getPetById>>(null);
  const [confirmRemove, setConfirmRemove] = useState(false);

  useEffect(() => {
    setPet(getPetById(id));
  }, [id]);

  function handleRemove() {
    if (!pet) return;
    if (!confirmRemove) {
      setConfirmRemove(true);
      return;
    }
    deletePet(pet.id);
    router.push("/pets");
    router.refresh();
  }

  if (pet === null) return null;
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
          <h1 className="text-2xl font-semibold text-[var(--foreground)]">{pet.name}</h1>
          {pet.animalType && <p className="text-[var(--muted)]">{pet.animalType}</p>}
          {pet.breed && <p className="text-[var(--muted)]">{pet.breed}</p>}
          <p className="mt-1 text-sm text-[var(--muted)]">
            {pet.age != null && `Age ${pet.age} yrs`}
            {pet.weight != null && ` · ${pet.weight} kg`}
            {pet.knownConditions && ` · ${pet.knownConditions}`}
          </p>
          {pet.microchipNumber && (
            <p className="mt-1 text-sm text-[var(--muted)]">Microchip: {pet.microchipNumber}</p>
          )}
          <p className="mt-1 text-sm text-[var(--muted)]">
            Vaccinated: {pet.vaccinated ? "Yes" : "No"}
            {pet.vaccinated && pet.lastVaccinationDate && (
              <> · Last vaccination: {new Date(pet.lastVaccinationDate).toLocaleDateString()}</>
            )}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/pets/${pet.id}/incidents`}
            className="rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-sm font-medium text-[var(--foreground)] hover:bg-[var(--background)] transition-colors"
          >
            View incidents
          </Link>
          <Link
            href={`/pets/${pet.id}/edit`}
            className="rounded-xl bg-[var(--secondary)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--secondary-hover)] transition-colors"
          >
            Edit pet
          </Link>
        </div>
      </div>

      <div className="mt-10 border-t border-[var(--border)] pt-6">
        <p className="text-sm text-[var(--muted)]">Remove this pet from your account. This cannot be undone.</p>
        {confirmRemove ? (
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleRemove}
              className="rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors"
            >
              Yes, remove pet
            </button>
            <button
              type="button"
              onClick={() => setConfirmRemove(false)}
              className="rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-sm font-medium text-[var(--foreground)] hover:bg-[var(--background)] transition-colors"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleRemove}
            className="mt-2 rounded-xl border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            Remove pet
          </button>
        )}
      </div>
    </div>
  );
}
