import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  // Get workout id from URL
  const urlParts = req.nextUrl.pathname.split("/");
  const workoutIdStr = urlParts[urlParts.length - 1];
  const workoutId = Number(workoutIdStr);

  if (!workoutId) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  const workout = await prisma.workout.findUnique({
    where: { id: workoutId },
    include: {
      exercises: {
        include: { sets: { orderBy: { setNumber: "asc" } } }
      }
    }
  });

  if (!workout) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(workout, { status: 200 });
}
