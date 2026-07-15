import { NextResponse } from "next/server";
import { z } from "zod";
import { getSessionUserId } from "@/lib/session";
import { prisma } from "@/lib/prisma";

const updateBodySchema = z.object({
  name: z.string().min(1).optional(),
  animalType: z.string().nullable().optional(),
  breed: z.string().nullable().optional(),
  age: z.number().int().min(0).nullable().optional(),
  weight: z.number().min(0).nullable().optional(),
  knownConditions: z.string().nullable().optional(),
  microchipNumber: z.string().nullable().optional(),
  vaccinated: z.boolean().optional(),
  lastVaccinationDate: z.string().nullable().optional(),
});

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const pet = await prisma.pet.findFirst({
    where: { id, userId },
    include: {
      incidents: { orderBy: { timestamp: "desc" }, take: 10 },
    },
  });
  if (!pet) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(pet);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const existing = await prisma.pet.findFirst({ where: { id, userId } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const parsed = updateBodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body", details: parsed.error.flatten() }, { status: 400 });
  }

  const pet = await prisma.pet.update({
    where: { id },
    data: parsed.data,
  });
  return NextResponse.json(pet);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const existing = await prisma.pet.findFirst({ where: { id, userId } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
  await prisma.pet.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
