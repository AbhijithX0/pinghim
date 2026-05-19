import { compare } from "bcryptjs";
import { NextResponse } from "next/server";
import { z } from "zod";
import { jsonError } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/session";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

export async function POST(request: Request) {
  try {
    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) return jsonError("Please check your sign in details.");

    const user = await prisma.user.findUnique({
      where: { email: parsed.data.email.toLowerCase().trim() }
    });
    if (!user) return jsonError("Email or password is incorrect.", 401);

    const ok = await compare(parsed.data.password, user.passwordHash);
    if (!ok) return jsonError("Email or password is incorrect.", 401);

    await createSession(user.id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Signin failed", error);
    return jsonError("Sign in failed. Please check the database setup and try again.", 500);
  }
}
