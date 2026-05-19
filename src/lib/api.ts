import { NextResponse } from "next/server";
import type { AudioNote, Ping, Response, SongDedication, UserProfile } from "@/lib/types";

export function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export function publicUser(user: UserProfile) {
  return user;
}

export function serializePing(ping: {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  category: string;
  isUrgent: boolean;
  createdAt: Date;
  seenAt: Date | null;
  respondedAt: Date | null;
}): Ping {
  return {
    ...ping,
    category: ping.category as Ping["category"],
    createdAt: ping.createdAt.toISOString(),
    seenAt: ping.seenAt?.toISOString() ?? null,
    respondedAt: ping.respondedAt?.toISOString() ?? null
  };
}

export function serializeResponse(response: {
  id: string;
  pingId: string;
  senderId: string;
  type: string;
  message: string;
  createdAt: Date;
}): Response {
  return {
    ...response,
    type: response.type === "text" ? "text" : "quick",
    createdAt: response.createdAt.toISOString()
  };
}

export function serializeSong(song: {
  id: string;
  senderId: string;
  receiverId: string;
  title: string;
  youtubeLink: string;
  message: string;
  createdAt: Date;
}): SongDedication {
  return { ...song, createdAt: song.createdAt.toISOString() };
}

export function serializeAudio(audio: {
  id: string;
  senderId: string;
  receiverId: string;
  url: string;
  durationMs: number;
  createdAt: Date;
}): AudioNote {
  return { ...audio, createdAt: audio.createdAt.toISOString() };
}
