import { NextResponse } from "next/server";
import { z } from "zod";
import { getSessionUserId } from "@/lib/session";
import { prisma } from "@/lib/prisma";

const createBodySchema = z.object({
  name: z.string().min(1),
  animalType: z.string().nullable().optional(),
  breed: z.string().nullable().optional(),
  age: z.number().int().min(0).nullable().optional(),
  weight: z.number().min(0).nullable().optional(),
  knownConditions: z.string().nullable().optional(),
  microchipNumber: z.string().nullable().optional(),
  vaccinated: z.boolean().optional(),
  lastVaccinationDate: z.string().nullable().optional(),
});

export async function GET() {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const pets = await prisma.pet.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(pets);
}

export async function POST(request: Request) {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const parsed = createBodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body", details: parsed.error.flatten() }, { status: 400 });
  }
  const d = parsed.data;
  const pet = await prisma.pet.create({
    data: {
      userId,
      name: d.name,
      animalType: d.animalType ?? null,
      breed: d.breed ?? null,
      age: d.age ?? null,
      weight: d.weight ?? null,
      knownConditions: d.knownConditions ?? null,
      microchipNumber: d.microchipNumber ?? null,
      vaccinated: d.vaccinated ?? false,
      lastVaccinationDate: d.lastVaccinationDate ?? null,
    },
  });
  return NextResponse.json(pet);
}
