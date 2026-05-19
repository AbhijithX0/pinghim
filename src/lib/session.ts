import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "node:crypto";
import { prisma } from "@/lib/prisma";

const cookieName = "emotional_ping_session";

function secret() {
  return process.env.SESSION_SECRET ?? "development-only-change-me";
}

function sign(value: string) {
  return createHmac("sha256", secret()).update(value).digest("base64url");
}

function encode(userId: string) {
  const payload = Buffer.from(JSON.stringify({ userId, iat: Date.now() }), "utf8").toString("base64url");
  return `${payload}.${sign(payload)}`;
}

function decode(token?: string) {
  if (!token) return null;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;

  const expected = sign(payload);
  const left = Buffer.from(signature);
  const right = Buffer.from(expected);
  if (left.length !== right.length || !timingSafeEqual(left, right)) return null;

  try {
    const parsed = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as { userId?: string };
    return parsed.userId ?? null;
  } catch {
    return null;
  }
}

export async function createSession(userId: string) {
  const jar = await cookies();
  jar.set(cookieName, encode(userId), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 60
  });
}

export async function clearSession() {
  const jar = await cookies();
  jar.delete(cookieName);
}

export async function currentUserId() {
  const jar = await cookies();
  return decode(jar.get(cookieName)?.value);
}

export async function requireUser() {
  const userId = await currentUserId();
  if (!userId) return null;

  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      partnerId: true,
      inviteCode: true,
      telegramConnected: true
    }
  });
}
