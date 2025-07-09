// app/api/templates/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const id = Number(context.params.id);
  await prisma.template.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
