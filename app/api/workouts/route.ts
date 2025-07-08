// app/api/workouts/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  const data = await req.json();
  try {
    const workout = await prisma.workout.create({
      data: {
        date: new Date(data.date),
        exercises: {
          create: data.exercises.map((ex: any) => ({
            name: ex.name,
            sets: {
              create: ex.sets.map((set: any) => ({
                setNumber: set.setNumber,
                weight: set.weight,
                reps: set.reps,
                rpe: set.rpe,
              })),
            },
          })),
        },
      },
      include: {
        exercises: { include: { sets: true } },
      },
    });
    return NextResponse.json(workout, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const workouts = await prisma.workout.findMany({
      orderBy: { date: 'desc' },
      include: {
        exercises: {
          include: {
            sets: {
              orderBy: { setNumber: 'asc' }
            }
          }
        }
      }
    });
    return NextResponse.json(workouts, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
