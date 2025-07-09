import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = { params: { id: string } };

export async function DELETE(
  req: NextRequest,
  { params }: Params
) {
  const id = Number(params.id);
  await prisma.template.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
