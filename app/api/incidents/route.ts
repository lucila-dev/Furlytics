import { NextResponse } from "next/server";
import { z } from "zod";
import { getSessionUserId } from "@/lib/session";
import { prisma } from "@/lib/prisma";

const createBodySchema = z.object({
  petId: z.string(),
  category: z.enum(["symptom", "behaviour"]),
  title: z.string().min(1),
  description: z.string().optional(),
  appetiteLoss: z.boolean().optional(),
  vomiting: z.boolean().optional(),
  lethargy: z.boolean().optional(),
  aggression: z.boolean().optional(),
  anxiety: z.boolean().optional(),
  timestamp: z.string().datetime().optional(),
});

export async function GET(request: Request) {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(request.url);
  const petId = searchParams.get("petId");
  if (!petId) return NextResponse.json({ error: "petId required" }, { status: 400 });
  const pet = await prisma.pet.findFirst({ where: { id: petId, userId } });
  if (!pet) return NextResponse.json({ error: "Pet not found" }, { status: 403 });
  const incidents = await prisma.incident.findMany({
    where: { petId },
    orderBy: { timestamp: "desc" },
    include: { aiInsight: true },
  });
  return NextResponse.json(incidents);
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
  const pet = await prisma.pet.findFirst({ where: { id: parsed.data.petId, userId } });
  if (!pet) return NextResponse.json({ error: "Pet not found" }, { status: 403 });
  const timestamp = parsed.data.timestamp ? new Date(parsed.data.timestamp) : new Date();
  const incident = await prisma.incident.create({
    data: {
      petId: parsed.data.petId,
      category: parsed.data.category,
      title: parsed.data.title,
      description: parsed.data.description ?? null,
      appetiteLoss: parsed.data.appetiteLoss ?? false,
      vomiting: parsed.data.vomiting ?? false,
      lethargy: parsed.data.lethargy ?? false,
      aggression: parsed.data.aggression ?? false,
      anxiety: parsed.data.anxiety ?? false,
      timestamp,
    },
  });
  return NextResponse.json(incident);
}
