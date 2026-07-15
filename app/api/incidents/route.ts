import { NextResponse } from "next/server";
import { z } from "zod";
import { getSessionUserId } from "@/lib/session";
import { prisma } from "@/lib/prisma";

const symptomsSchema = z.object({
  appetiteLoss: z.boolean().optional(),
  vomiting: z.boolean().optional(),
  lethargy: z.boolean().optional(),
  aggression: z.boolean().optional(),
  anxiety: z.boolean().optional(),
  diarrhea: z.boolean().optional(),
  coughing: z.boolean().optional(),
  limping: z.boolean().optional(),
  itching: z.boolean().optional(),
  excessiveThirst: z.boolean().optional(),
  lossOfBalance: z.boolean().optional(),
  difficultyBreathing: z.boolean().optional(),
  other: z.boolean().optional(),
});

const createBodySchema = z.object({
  petId: z.string(),
  category: z.enum(["symptom", "behaviour", "accident"]),
  title: z.string().min(1),
  description: z.string().nullable().optional(),
  symptoms: symptomsSchema.optional(),
  otherSymptoms: z.array(z.string()).optional(),
  timestamp: z.string().optional(),
});

const reportSchema = z.object({
  summary: z.string(),
  potentialCauses: z.array(z.string()),
  vetNeed: z.enum(["urgent", "soon", "monitor", "optional"]),
  vetNeedReason: z.string(),
  possibleConditions: z.array(z.string()),
  monitoringAdvice: z.string(),
  whenToSeekVet: z.string(),
});

export async function GET(request: Request) {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(request.url);
  const petId = searchParams.get("petId");

  if (petId) {
    const pet = await prisma.pet.findFirst({ where: { id: petId, userId } });
    if (!pet) return NextResponse.json({ error: "Pet not found" }, { status: 403 });
    const incidents = await prisma.incident.findMany({
      where: { petId },
      orderBy: { timestamp: "desc" },
      include: { aiInsight: true },
    });
    return NextResponse.json(incidents);
  }

  const pets = await prisma.pet.findMany({ where: { userId }, select: { id: true } });
  const petIds = pets.map((p) => p.id);
  const incidents = await prisma.incident.findMany({
    where: { petId: { in: petIds } },
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

  const symptoms = parsed.data.symptoms ?? {};
  const timestamp = parsed.data.timestamp ? new Date(parsed.data.timestamp) : new Date();

  const incident = await prisma.incident.create({
    data: {
      petId: parsed.data.petId,
      category: parsed.data.category,
      title: parsed.data.title,
      description: parsed.data.description ?? null,
      appetiteLoss: symptoms.appetiteLoss ?? false,
      vomiting: symptoms.vomiting ?? false,
      lethargy: symptoms.lethargy ?? false,
      aggression: symptoms.aggression ?? false,
      anxiety: symptoms.anxiety ?? false,
      symptoms: symptoms as object,
      otherSymptoms: parsed.data.otherSymptoms ?? [],
      timestamp,
    },
  });
  return NextResponse.json(incident);
}

export async function PATCH(request: Request) {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const schema = z.object({
    id: z.string(),
    report: reportSchema,
  });
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const incident = await prisma.incident.findFirst({
    where: { id: parsed.data.id, pet: { userId } },
  });
  if (!incident) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const updated = await prisma.incident.update({
    where: { id: parsed.data.id },
    data: { report: parsed.data.report },
  });
  return NextResponse.json(updated);
}
