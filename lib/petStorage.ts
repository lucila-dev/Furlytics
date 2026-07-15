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

export type PetFetchResult = {
  pets: StoredPet[];
  error: "unauthorized" | "failed" | null;
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

const fetchOpts: RequestInit = { credentials: "same-origin", cache: "no-store" };

export async function fetchPetsResult(): Promise<PetFetchResult> {
  try {
    const res = await fetch("/api/pets", fetchOpts);
    if (res.status === 401) return { pets: [], error: "unauthorized" };
    if (!res.ok) return { pets: [], error: "failed" };
    const data = await res.json();
    return {
      pets: Array.isArray(data) ? data.map(mapPet) : [],
      error: null,
    };
  } catch {
    return { pets: [], error: "failed" };
  }
}

export async function fetchPets(): Promise<StoredPet[]> {
  const { pets } = await fetchPetsResult();
  return pets;
}

export async function fetchPetById(id: string): Promise<StoredPet | null> {
  const res = await fetch(`/api/pets/${id}`, fetchOpts);
  if (!res.ok) return null;
  return mapPet(await res.json());
}

export async function createPet(
  pet: Omit<StoredPet, "id">
): Promise<StoredPet | null> {
  const res = await fetch("/api/pets", {
    ...fetchOpts,
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
    ...fetchOpts,
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  if (!res.ok) return null;
  return mapPet(await res.json());
}

export async function removePet(id: string): Promise<boolean> {
  const res = await fetch(`/api/pets/${id}`, { ...fetchOpts, method: "DELETE" });
  return res.ok;
}
