"use client";

import { useEffect, useMemo, useState } from "react";
import type { AudioNote, Ping, Response, SongDedication } from "@/lib/types";

export type TimelineItem =
  | { kind: "ping"; data: Ping; at: Date }
  | { kind: "response"; data: Response; at: Date }
  | { kind: "song"; data: SongDedication; at: Date }
  | { kind: "audio"; data: AudioNote; at: Date };

type TimelinePayload = {
  pings: Ping[];
  responses: Response[];
  songs: SongDedication[];
  audioNotes: AudioNote[];
};

export function useTimeline(userId?: string, partnerId?: string | null) {
  const [payload, setPayload] = useState<TimelinePayload>({
    pings: [],
    responses: [],
    songs: [],
    audioNotes: []
  });

  useEffect(() => {
    if (!userId || !partnerId) {
      setPayload({ pings: [], responses: [], songs: [], audioNotes: [] });
      return;
    }

    let active = true;
    async function load() {
      const response = await fetch("/api/timeline", { cache: "no-store" });
      if (!response.ok) return;
      const data = (await response.json()) as TimelinePayload;
      if (active) setPayload(data);
    }

    void load();
    const id = window.setInterval(() => void load(), 2000);
    return () => {
      active = false;
      window.clearInterval(id);
    };
  }, [userId, partnerId]);

  const items = useMemo<TimelineItem[]>(() => {
    const pingItems = payload.pings.map((data) => ({ kind: "ping" as const, data, at: new Date(data.createdAt) }));
    const responseItems = payload.responses.map((data) => ({
      kind: "response" as const,
      data,
      at: new Date(data.createdAt)
    }));
    const songItems = payload.songs.map((data) => ({ kind: "song" as const, data, at: new Date(data.createdAt) }));
    const audioItems = payload.audioNotes.map((data) => ({ kind: "audio" as const, data, at: new Date(data.createdAt) }));

    return [...pingItems, ...responseItems, ...songItems, ...audioItems]
      .sort((a, b) => b.at.getTime() - a.at.getTime())
      .slice(0, 80);
  }, [payload]);

  return { items, pings: payload.pings, responses: payload.responses };
}
