import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request) {
  const urlParts = new URL(req.url).pathname.split("/");
  const exerciseIdStr = urlParts[urlParts.length - 1];
  const exerciseId = Number(exerciseIdStr);

  const data = await req.json();
  if (!data.name) return NextResponse.json({ error: "Missing name" }, { status: 400 });

  try {
    const updated = await prisma.exercise.update({
      where: { id: exerciseId },
      data: { name: data.name },
    });
    return NextResponse.json(updated, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}


export async function DELETE(req: Request) {
  const urlParts = new URL(req.url).pathname.split("/");
  const exerciseIdStr = urlParts[urlParts.length - 1];
  const exerciseId = Number(exerciseIdStr);

  try {
    await prisma.exercise.delete({ where: { id: exerciseId } });
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
