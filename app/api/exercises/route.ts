import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST /api/exercises
export async function POST(req: NextRequest) {
  const data = await req.json();
  // expects { workoutId, name }
  if (!data.workoutId || !data.name) {
    return NextResponse.json({ error: "Missing workoutId or name" }, { status: 400 });
  }

  const exercise = await prisma.exercise.create({
    data: {
      workoutId: data.workoutId,
      name: data.name,
    },
  });
  return NextResponse.json(exercise, { status: 201 });
}
