// app/api/templates/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);
  await prisma.template.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
