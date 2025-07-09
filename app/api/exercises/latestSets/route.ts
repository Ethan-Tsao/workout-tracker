import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// /api/exercises/latestSets?name=Bench%20Press
export async function GET(req: NextRequest) {
  const name = req.nextUrl.searchParams.get("name");
  if (!name) return NextResponse.json({ error: "No name" }, { status: 400 });

  // Find most recent Exercise with this name
  const exercise = await prisma.exercise.findFirst({
    where: { name },
    orderBy: { id: "desc" },
    include: {
      sets: { orderBy: { setNumber: "asc" } },
    },
  });

  if (!exercise) {
    return NextResponse.json([], { status: 200 });
  }
  return NextResponse.json(exercise.sets, { status: 200 });
}
