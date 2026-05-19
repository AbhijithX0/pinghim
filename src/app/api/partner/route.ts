import { NextResponse } from "next/server";
import { z } from "zod";
import { jsonError } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";

const schema = z.object({ code: z.string().min(1) });

export async function GET() {
  const user = await requireUser();
  if (!user) return jsonError("Unauthorized", 401);
  if (!user.partnerId) return NextResponse.json({ partner: null });

  const partner = await prisma.user.findUnique({
    where: { id: user.partnerId },
    select: { id: true, name: true, email: true, partnerId: true, inviteCode: true, telegramConnected: true }
  });

  return NextResponse.json({ partner });
}

export async function POST(request: Request) {
  const user = await requireUser();
  if (!user) return jsonError("Unauthorized", 401);
  if (user.partnerId) return jsonError("You already have a connected partner.");

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return jsonError("Partner code is required.");

  const code = parsed.data.code.trim().toUpperCase();
  await prisma.$transaction(async (tx) => {
    const partner = await tx.user.findUnique({ where: { inviteCode: code } });
    if (!partner) throw new Error("That partner code was not found.");
    if (partner.id === user.id) throw new Error("You cannot use your own invite code.");
    if (partner.partnerId) throw new Error("That person is already connected.");

    await tx.user.update({ where: { id: user.id }, data: { partnerId: partner.id } });
    await tx.user.update({ where: { id: partner.id }, data: { partnerId: user.id } });
  });

  return NextResponse.json({ ok: true });
}
