import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { jsonError, serializeAudio } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";

export async function POST(request: Request) {
  const user = await requireUser();
  if (!user) return jsonError("Unauthorized", 401);
  if (!user.partnerId) return jsonError("Connect a partner first.");

  const formData = await request.formData();
  const file = formData.get("audio");
  const durationMs = Number(formData.get("durationMs") ?? 0);
  if (!(file instanceof File)) return jsonError("Audio file is required.");

  const bytes = Buffer.from(await file.arrayBuffer());
  const uploadDir = path.join(process.cwd(), "public", "uploads", "audio", user.id);
  await mkdir(uploadDir, { recursive: true });

  const fileName = `${Date.now()}.webm`;
  await writeFile(path.join(uploadDir, fileName), bytes);
  const url = `/uploads/audio/${user.id}/${fileName}`;

  const audio = await prisma.audioNote.create({
    data: {
      senderId: user.id,
      receiverId: user.partnerId,
      url,
      durationMs: Number.isFinite(durationMs) ? Math.round(durationMs) : 0
    }
  });

  return NextResponse.json({ audio: serializeAudio(audio) });
}
