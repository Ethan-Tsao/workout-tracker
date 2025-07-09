import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  _req: NextRequest,
  { params }: any
) {
  const id = Number(params.id);
  await prisma.template.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
