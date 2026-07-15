const PETS_KEY = "furlytics-pets";

const defaultPetFields: Pick<StoredPet, "microchipNumber" | "vaccinated" | "lastVaccinationDate" | "animalType"> = {
  microchipNumber: null,
  vaccinated: false,
  lastVaccinationDate: null,
  animalType: null,
};

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

export function getPets(): StoredPet[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(PETS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as StoredPet[];
    if (!Array.isArray(parsed)) return [];
    return parsed.map((p) => ({
      ...defaultPetFields,
      ...p,
      animalType: p.animalType ?? null,
      microchipNumber: p.microchipNumber ?? null,
      vaccinated: p.vaccinated ?? false,
      lastVaccinationDate: p.lastVaccinationDate ?? null,
    }));
  } catch {
    return [];
  }
}

export function setPets(pets: StoredPet[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(PETS_KEY, JSON.stringify(pets));
  } catch {
    // ignore
  }
}

export function addPet(pet: Omit<StoredPet, "id">): StoredPet {
  const id = "pet-" + Date.now() + "-" + Math.random().toString(36).slice(2, 9);
  const newPet: StoredPet = { ...defaultPetFields, ...pet, id };
  const pets = getPets();
  pets.push(newPet);
  setPets(pets);
  return newPet;
}

export function getPetById(id: string): StoredPet | null {
  return getPets().find((p) => p.id === id) ?? null;
}

export function updatePet(id: string, updates: Partial<Omit<StoredPet, "id">>): void {
  const pets = getPets();
  const i = pets.findIndex((p) => p.id === id);
  if (i === -1) return;
  pets[i] = { ...pets[i], ...updates };
  setPets(pets);
}

export function deletePet(id: string): void {
  setPets(getPets().filter((p) => p.id !== id));
}
