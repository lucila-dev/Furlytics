export type StoredPet = {
  id: string;
  name: string;
  animalType: string | null;
  breed: string | null;
  age: number | null;
  weight: number | null;
  knownConditions: string | null;
  microchipNumber: string | null;
  vaccinated: boolean;
  lastVaccinationDate: string | null;
};

function mapPet(raw: Record<string, unknown>): StoredPet {
  return {
    id: String(raw.id),
    name: String(raw.name),
    animalType: (raw.animalType as string | null) ?? null,
    breed: (raw.breed as string | null) ?? null,
    age: (raw.age as number | null) ?? null,
    weight: (raw.weight as number | null) ?? null,
    knownConditions: (raw.knownConditions as string | null) ?? null,
    microchipNumber: (raw.microchipNumber as string | null) ?? null,
    vaccinated: Boolean(raw.vaccinated),
    lastVaccinationDate: (raw.lastVaccinationDate as string | null) ?? null,
  };
}

export async function fetchPets(): Promise<StoredPet[]> {
  const res = await fetch("/api/pets");
  if (!res.ok) return [];
  const data = await res.json();
  return Array.isArray(data) ? data.map(mapPet) : [];
}

export async function fetchPetById(id: string): Promise<StoredPet | null> {
  const res = await fetch(`/api/pets/${id}`);
  if (!res.ok) return null;
  return mapPet(await res.json());
}

export async function createPet(
  pet: Omit<StoredPet, "id">
): Promise<StoredPet | null> {
  const res = await fetch("/api/pets", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(pet),
  });
  if (!res.ok) return null;
  return mapPet(await res.json());
}

export async function patchPet(
  id: string,
  updates: Partial<Omit<StoredPet, "id">>
): Promise<StoredPet | null> {
  const res = await fetch(`/api/pets/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  if (!res.ok) return null;
  return mapPet(await res.json());
}

export async function removePet(id: string): Promise<boolean> {
  const res = await fetch(`/api/pets/${id}`, { method: "DELETE" });
  return res.ok;
}
