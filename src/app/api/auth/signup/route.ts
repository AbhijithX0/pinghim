import { hash } from "bcryptjs";
import { NextResponse } from "next/server";
import { z } from "zod";
import { jsonError } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/session";
import { makeInviteCode } from "@/lib/utils";

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  partnerCode: z.string().optional()
});

export async function POST(request: Request) {
  try {
    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) return jsonError("Please check your signup details.");

    const { name, email, password, partnerCode } = parsed.data;
    const normalizedEmail = email.toLowerCase().trim();
    const normalizedCode = partnerCode?.trim().toUpperCase();

    const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (existing) return jsonError("An account with that email already exists.");

    const passwordHash = await hash(password, 12);
    const inviteCode = normalizedCode ? null : await uniqueInviteCode();

    const user = await prisma.$transaction(async (tx) => {
      let partnerId: string | null = null;

      if (normalizedCode) {
        const partner = await tx.user.findUnique({ where: { inviteCode: normalizedCode } });
        if (!partner) throw new Error("That partner code was not found.");
        if (partner.partnerId) throw new Error("That partner code is already connected.");
        partnerId = partner.id;

        const created = await tx.user.create({
          data: { name, email: normalizedEmail, passwordHash, partnerId },
          select: { id: true }
        });
        await tx.user.update({ where: { id: partner.id }, data: { partnerId: created.id } });
        return created;
      }

      return tx.user.create({
        data: { name, email: normalizedEmail, passwordHash, inviteCode },
        select: { id: true }
      });
    });

    await createSession(user.id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Signup failed", error);
    if (error instanceof Error && error.message.includes("partner code")) {
      return jsonError(error.message);
    }
    return jsonError("Signup failed. Please check the database setup and try again.", 500);
  }
}

async function uniqueInviteCode() {
  for (let index = 0; index < 12; index += 1) {
    const code = makeInviteCode();
    const existing = await prisma.user.findUnique({ where: { inviteCode: code } });
    if (!existing) return code;
  }
  throw new Error("Could not create a unique invite code.");
}
