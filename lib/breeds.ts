export const ANIMAL_OPTIONS = [
  "Dog",
  "Cat",
  "Rabbit",
  "Bird",
  "Hamster",
  "Guinea pig",
  "Other",
] as const;

const COMMON = ["Mixed / Crossbreed", "Unknown", "Other"];

const DOG_BREEDS = [
  "Labrador Retriever",
  "Golden Retriever",
  "German Shepherd",
  "French Bulldog",
  "Bulldog",
  "Poodle",
  "Beagle",
  "Rottweiler",
  "Dachshund",
  "German Shorthaired Pointer",
  "Yorkshire Terrier",
  "Boxer",
  "Siberian Husky",
  "Great Dane",
  "Doberman Pinscher",
  "Australian Shepherd",
  "Cavalier King Charles Spaniel",
  "Miniature Schnauzer",
  "Cocker Spaniel",
  "Shih Tzu",
  "Boston Terrier",
  "Pomeranian",
  "Havanese",
  "Shetland Sheepdog",
  "Border Collie",
  "Chihuahua",
  "Pug",
  "Staffordshire Bull Terrier",
  "Jack Russell Terrier",
  "Corgi",
  "Maltese",
  "Whippet",
  "Greyhound",
  "Akita",
  "Bernese Mountain Dog",
  "Newfoundland",
  "Saint Bernard",
  "Basset Hound",
  "Dalmatian",
  ...COMMON,
];

const CAT_BREEDS = [
  "Domestic Shorthair",
  "Domestic Longhair",
  "British Shorthair",
  "Persian",
  "Maine Coon",
  "Siamese",
  "Ragdoll",
  "Bengal",
  "Sphynx",
  "Scottish Fold",
  "Abyssinian",
  "Russian Blue",
  "Birman",
  "Oriental Shorthair",
  "American Shorthair",
  "Norwegian Forest Cat",
  "Devon Rex",
  "Cornish Rex",
  "Exotic Shorthair",
  "Tonkinese",
  "Burmese",
  "Manx",
  "Himalayan",
  ...COMMON,
];

const RABBIT_BREEDS = [
  "Netherland Dwarf",
  "Holland Lop",
  "Mini Lop",
  "Dutch",
  "Lionhead",
  "Flemish Giant",
  "English Lop",
  "Rex",
  "Mini Rex",
  "Angora",
  "Himalayan",
  ...COMMON,
];

const BIRD_TYPES = [
  "Budgerigar",
  "Cockatiel",
  "African Grey",
  "Lovebird",
  "Canary",
  "Finch",
  "Cockatoo",
  "Macaw",
  "Parakeet",
  "Conure",
  ...COMMON,
];

const HAMSTER_BREEDS = [
  "Syrian",
  "Dwarf Campbell",
  "Dwarf Winter White",
  "Roborovski",
  "Chinese",
  ...COMMON,
];

const GUINEA_PIG_BREEDS = [
  "American",
  "Abyssinian",
  "Peruvian",
  "Silkie / Sheltie",
  "Teddy",
  "Skinny",
  "Rex",
  ...COMMON,
];

const GENERIC_BREEDS = [...COMMON];

const BREEDS_BY_ANIMAL: Record<string, string[]> = {
  Dog: DOG_BREEDS,
  Cat: CAT_BREEDS,
  Rabbit: RABBIT_BREEDS,
  Bird: BIRD_TYPES,
  Hamster: HAMSTER_BREEDS,
  "Guinea pig": GUINEA_PIG_BREEDS,
  Other: GENERIC_BREEDS,
};

export function getBreedOptions(animalType: string): string[] {
  if (!animalType) return GENERIC_BREEDS;
  return BREEDS_BY_ANIMAL[animalType] ?? GENERIC_BREEDS;
}

/** Resolve select value + optional custom text into stored breed string. */
export function resolveBreed(selected: string, custom: string): string | null {
  if (!selected) return null;
  if (selected === "Other") return custom.trim() || null;
  return selected;
}

/** Split stored breed into select value + custom field for edit forms. */
export function splitBreed(
  animalType: string,
  breed: string | null
): { selected: string; custom: string } {
  if (!breed) return { selected: "", custom: "" };
  const options = getBreedOptions(animalType);
  if (options.includes(breed)) return { selected: breed, custom: "" };
  return { selected: "Other", custom: breed };
}
