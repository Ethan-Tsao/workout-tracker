// /app/api/templates/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const templates = await prisma.template.findMany({
    orderBy: { createdAt: "desc" },
    include: { exercises: true },
  });
  return NextResponse.json(templates, { status: 200 });
}

export async function POST(req: Request) {
  const { name, exercises } = await req.json();
  if (!name || !Array.isArray(exercises) || !exercises.length)
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });

  const template = await prisma.template.create({
    data: {
      name,
      exercises: { create: exercises.map((name: string) => ({ name })) },
    },
    include: { exercises: true },
  });

  return NextResponse.json(template, { status: 201 });
}
