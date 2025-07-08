import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST /api/sets
export async function POST(req: NextRequest) {
  const data = await req.json();
  // expects { exerciseId, setNumber }
  if (!data.exerciseId) {
    return NextResponse.json({ error: "Missing exerciseId" }, { status: 400 });
  }

  // Default set values
  const newSet = await prisma.set.create({
    data: {
      exerciseId: data.exerciseId,
      setNumber: data.setNumber ?? 1,
      weight: 0,
      reps: 0,
      rpe: 0,
    },
  });

  return NextResponse.json(newSet, { status: 201 });
}
