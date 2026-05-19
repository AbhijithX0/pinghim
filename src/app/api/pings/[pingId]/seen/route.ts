import { NextResponse } from "next/server";
import { jsonError } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";

export async function POST(_request: Request, { params }: { params: Promise<{ pingId: string }> }) {
  const user = await requireUser();
  if (!user) return jsonError("Unauthorized", 401);
  const { pingId } = await params;

  const ping = await prisma.ping.findUnique({ where: { id: pingId } });
  if (!ping || (ping.senderId !== user.id && ping.receiverId !== user.id)) return jsonError("Not found", 404);

  await prisma.ping.update({ where: { id: pingId }, data: { seenAt: new Date() } });
  return NextResponse.json({ ok: true });
}
