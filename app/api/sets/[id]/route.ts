import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const setId = Number(params.id);
  const data = await req.json();

  // Only update allowed fields
  const allowedFields = ["weight", "reps", "rpe", "setNumber"];
  const updateData: any = {};
  for (const key of allowedFields) {
    if (data[key] !== undefined) updateData[key] = data[key];
  }

  try {
    const updatedSet = await prisma.set.update({
      where: { id: setId },
      data: updateData,
    });
    return NextResponse.json(updatedSet, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
