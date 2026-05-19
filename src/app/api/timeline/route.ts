import { NextResponse } from "next/server";
import { serializeAudio, serializePing, serializeResponse, serializeSong, jsonError } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";

export async function GET() {
  const user = await requireUser();
  if (!user) return jsonError("Unauthorized", 401);
  if (!user.partnerId) return NextResponse.json({ pings: [], responses: [], songs: [], audioNotes: [] });

  const [pings, songs, audioNotes] = await Promise.all([
    prisma.ping.findMany({
      where: { OR: [{ senderId: user.id }, { receiverId: user.id }] },
      orderBy: { createdAt: "desc" },
      take: 80
    }),
    prisma.song.findMany({
      where: { OR: [{ senderId: user.id }, { receiverId: user.id }] },
      orderBy: { createdAt: "desc" },
      take: 40
    }),
    prisma.audioNote.findMany({
      where: { OR: [{ senderId: user.id }, { receiverId: user.id }] },
      orderBy: { createdAt: "desc" },
      take: 40
    })
  ]);

  const responses = pings.length
    ? await prisma.response.findMany({
        where: { pingId: { in: pings.map((ping) => ping.id) } },
        orderBy: { createdAt: "asc" }
      })
    : [];

  return NextResponse.json({
    pings: pings.map(serializePing),
    responses: responses.map(serializeResponse),
    songs: songs.map(serializeSong),
    audioNotes: audioNotes.map(serializeAudio)
  });
}
