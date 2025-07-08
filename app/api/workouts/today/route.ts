import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Utility to get today's date as yyyy-mm-dd (midnight)
function getTodayDateString() {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return now.toISOString();
}

export async function GET() {
  // Find (or create) today's workout
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Try to find
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
        exercises: {
          include: { sets: true }
        }
      }
    });
  }

  return NextResponse.json(workout, { status: 200 });
}
