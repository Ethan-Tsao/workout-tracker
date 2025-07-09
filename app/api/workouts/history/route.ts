import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const workouts = await prisma.workout.findMany({
    orderBy: { date: "desc" },
    include: {
      exercises: true, // Or set to false if you only want summary data here!
    },
  });

  // Map to a simpler format if you want
  const data = workouts.map(w => ({
    id: w.id,
    date: w.date,
    exerciseCount: w.exercises.length,
  }));

  return NextResponse.json(data, { status: 200 });
}
