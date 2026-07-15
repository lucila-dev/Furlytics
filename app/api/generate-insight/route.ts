import { NextResponse } from "next/server";
import { z } from "zod";
import { getSessionUserId } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { generateStructuredInsight } from "@/lib/openai";

const bodySchema = z.object({ incidentId: z.string() });

export async function POST(request: Request) {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "incidentId required" }, { status: 400 });
  }
  const incident = await prisma.incident.findFirst({
    where: { id: parsed.data.incidentId },
    include: { pet: true },
  });
  if (!incident) return NextResponse.json({ error: "Incident not found" }, { status: 404 });
  if (incident.pet.userId !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const existing = await prisma.aIInsight.findUnique({
    where: { incidentId: incident.id },
  });
  if (existing) {
    return NextResponse.json(existing);
  }
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: "OpenAI not configured" }, { status: 503 });
  }
  let payload;
  try {
    payload = await generateStructuredInsight(incident.pet, incident);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to generate insight" }, { status: 500 });
  }
  const insight = await prisma.aIInsight.create({
    data: {
      incidentId: incident.id,
      behaviourCategory: payload.behaviour_category,
      urgencyLevel: payload.urgency_level,
      potentialCauses: payload.potential_causes,
      monitoringAdvice: payload.monitoring_advice,
      vetQuestions: payload.vet_questions,
    },
  });
  return NextResponse.json(insight);
}
