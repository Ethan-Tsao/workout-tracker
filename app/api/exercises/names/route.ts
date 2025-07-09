import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  // Get all unique exercise names, most recent first
  const names = await prisma.exercise.findMany({
    distinct: ['name'],
    orderBy: { id: 'desc' },
    select: { name: true },
    take: 20, // Limit to recent 20
  });

  // Just return an array of names
  return NextResponse.json(names.map(x => x.name), { status: 200 });
}
