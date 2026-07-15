import { NextResponse } from "next/server";
import { z } from "zod";
import { getSessionUserId } from "@/lib/session";
import { prisma } from "@/lib/prisma";

const createBodySchema = z.object({
  name: z.string().min(1),
  breed: z.string().optional(),
  age: z.number().int().min(0).optional(),
  weight: z.number().min(0).optional(),
  knownConditions: z.string().optional(),
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
  const pet = await prisma.pet.create({
    data: {
      userId,
      name: parsed.data.name,
      breed: parsed.data.breed ?? null,
      age: parsed.data.age ?? null,
      weight: parsed.data.weight ?? null,
      knownConditions: parsed.data.knownConditions ?? null,
    },
  });
  return NextResponse.json(pet);
}
