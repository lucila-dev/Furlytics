import { NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/session";
import { prisma } from "@/lib/prisma";

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
