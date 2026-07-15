"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getPetById, updatePet } from "@/lib/petStorage";

const ANIMAL_OPTIONS = ["Dog", "Cat", "Rabbit", "Bird", "Hamster", "Guinea pig", "Other"];

export default function EditPetPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [pet, setPet] = useState<ReturnType<typeof getPetById>>(null);
  const [name, setName] = useState("");
  const [animalType, setAnimalType] = useState("");
  const [animalTypeOther, setAnimalTypeOther] = useState("");
  const [breed, setBreed] = useState("");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [knownConditions, setKnownConditions] = useState("");
  const [microchipNumber, setMicrochipNumber] = useState("");
  const [vaccinated, setVaccinated] = useState(false);
  const [lastVaccinationDate, setLastVaccinationDate] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const p = getPetById(id);
    setPet(p ?? null);
    if (p) {
      setName(p.name);
      const isOther = p.animalType && !ANIMAL_OPTIONS.slice(0, -1).includes(p.animalType);
      setAnimalType(isOther ? "Other" : (p.animalType ?? ""));
      setAnimalTypeOther(isOther && p.animalType ? p.animalType : "");
      setBreed(p.breed ?? "");
      setAge(p.age != null ? String(p.age) : "");
      setWeight(p.weight != null ? String(p.weight) : "");
      setKnownConditions(p.knownConditions ?? "");
      setMicrochipNumber(p.microchipNumber ?? "");
      setVaccinated(p.vaccinated);
      setLastVaccinationDate(p.lastVaccinationDate ?? "");
    }
  }, [id]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!pet) return;
    setLoading(true);
    const resolvedAnimalType = animalType === "Other" ? (animalTypeOther.trim() || null) : (animalType || null);
    updatePet(pet.id, {
      name,
      animalType: resolvedAnimalType,
      breed: breed || null,
      age: age ? parseInt(age, 10) : null,
      weight: weight ? parseFloat(weight) : null,
      knownConditions: knownConditions || null,
      microchipNumber: microchipNumber || null,
      vaccinated,
      lastVaccinationDate: lastVaccinationDate || null,
    });
    setLoading(false);
    router.push(`/pets/${pet.id}`);
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
    <div className="max-w-xl">
      <Link href={`/pets/${id}`} className="text-sm text-[var(--accent)] hover:text-[var(--accent-hover)]">
        ← {pet.name}
      </Link>
      <h1 className="mt-2 text-2xl font-semibold text-[var(--foreground)]">Edit pet</h1>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-[var(--foreground)]">Name *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-1 block w-full rounded-xl border border-[var(--border)] px-3 py-2.5 text-[var(--foreground)] shadow-sm focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--foreground)]">Type of animal</label>
          <select
            value={animalType}
            onChange={(e) => setAnimalType(e.target.value)}
            className="mt-1 block w-full rounded-xl border border-[var(--border)] px-3 py-2.5 text-[var(--foreground)] shadow-sm focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20"
          >
            <option value="">Select type</option>
            {ANIMAL_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
          {animalType === "Other" && (
            <input
              type="text"
              value={animalTypeOther}
              onChange={(e) => setAnimalTypeOther(e.target.value)}
              placeholder="Specify animal type"
              className="mt-2 block w-full rounded-xl border border-[var(--border)] px-3 py-2.5 text-[var(--foreground)] shadow-sm focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20"
            />
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--foreground)]">Breed</label>
          <input
            type="text"
            value={breed}
            onChange={(e) => setBreed(e.target.value)}
            className="mt-1 block w-full rounded-xl border border-[var(--border)] px-3 py-2.5 text-[var(--foreground)] shadow-sm focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)]">Age (years)</label>
            <input
              type="number"
              min={0}
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="mt-1 block w-full rounded-xl border border-[var(--border)] px-3 py-2.5 text-[var(--foreground)] shadow-sm focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)]">Weight (kg)</label>
            <input
              type="number"
              min={0}
              step={0.1}
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="mt-1 block w-full rounded-xl border border-[var(--border)] px-3 py-2.5 text-[var(--foreground)] shadow-sm focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--foreground)]">Known conditions</label>
          <input
            type="text"
            value={knownConditions}
            onChange={(e) => setKnownConditions(e.target.value)}
            placeholder="e.g. None, arthritis"
            className="mt-1 block w-full rounded-xl border border-[var(--border)] px-3 py-2.5 text-[var(--foreground)] shadow-sm focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--foreground)]">Microchip number</label>
          <input
            type="text"
            value={microchipNumber}
            onChange={(e) => setMicrochipNumber(e.target.value)}
            placeholder="e.g. 985112345678901"
            className="mt-1 block w-full rounded-xl border border-[var(--border)] px-3 py-2.5 text-[var(--foreground)] shadow-sm focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20"
          />
        </div>
        <div>
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={vaccinated}
              onChange={(e) => setVaccinated(e.target.checked)}
              className="rounded border-[var(--border)] text-[var(--accent)] focus:ring-[var(--accent)]"
            />
            <span className="text-sm font-medium text-[var(--foreground)]">Vaccinated</span>
          </label>
          {vaccinated && (
            <div className="mt-2">
              <label className="block text-sm font-medium text-[var(--foreground)]">Last vaccination date</label>
              <input
                type="date"
                value={lastVaccinationDate}
                onChange={(e) => setLastVaccinationDate(e.target.value)}
                className="mt-1 block w-full rounded-xl border border-[var(--border)] px-3 py-2.5 text-[var(--foreground)] shadow-sm focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20"
              />
            </div>
          )}
        </div>
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-[var(--accent)] px-4 py-2 font-medium text-white hover:bg-[var(--accent-hover)] disabled:opacity-50 transition-colors"
          >
            {loading ? "Saving…" : "Save changes"}
          </button>
          <Link
            href={`/pets/${id}`}
            className="rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-2 font-medium text-[var(--foreground)] hover:bg-[var(--background)] transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
