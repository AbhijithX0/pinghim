import { NextResponse } from "next/server";
import { z } from "zod";
import { jsonError, serializeSong } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";

const schema = z.object({
  title: z.string().min(1),
  youtubeLink: z.string().url(),
  message: z.string().optional()
});

export async function POST(request: Request) {
  const user = await requireUser();
  if (!user) return jsonError("Unauthorized", 401);
  if (!user.partnerId) return jsonError("Connect a partner first.");

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return jsonError("Please add a valid title and YouTube link.");

  const song = await prisma.song.create({
    data: {
      senderId: user.id,
      receiverId: user.partnerId,
      title: parsed.data.title,
      youtubeLink: parsed.data.youtubeLink,
      message: parsed.data.message ?? ""
    }
  });

  return NextResponse.json({ song: serializeSong(song) });
}
