import { NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { runPatternEngine } from "@/lib/patternEngine";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ petId: string }> }
) {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { petId } = await params;
  const pet = await prisma.pet.findFirst({ where: { id: petId, userId } });
  if (!pet) return NextResponse.json({ error: "Pet not found" }, { status: 403 });
  const result = await runPatternEngine(petId);
  return NextResponse.json(result);
}
