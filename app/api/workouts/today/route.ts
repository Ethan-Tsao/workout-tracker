import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  // Today at midnight
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Try to find today's workout
  let workout = await prisma.workout.findFirst({
    where: { date: today },
    include: {
      exercises: {
        include: {
          sets: { orderBy: { setNumber: "asc" } }
        }
      }
    }
  });

  // If not found, create it
  if (!workout) {
    workout = await prisma.workout.create({
      data: { date: today },
      include: {
        exercises: { include: { sets: true } }
      }
    });
  }

  return NextResponse.json(workout, { status: 200 });
}
