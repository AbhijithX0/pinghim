"use client";

import { Clock, MessageCircleHeart, Music2, Volume2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import type { Ping, Response, UserProfile } from "@/lib/types";
import { respondedIn, softTime, cn } from "@/lib/utils";
import type { TimelineItem } from "@/hooks/use-timeline";
import { markSeen, respondToPing } from "@/services/ping-service";

type Props = {
  currentUserId: string;
  partner: UserProfile | null;
  items: TimelineItem[];
  pings: Ping[];
  responses: Response[];
};

const quickReplies = ["I'm here", "Give me a minute", "Call me"];

export function Timeline({ currentUserId, partner, items, pings, responses }: Props) {
  const receivedUnseen = useMemo(
    () => pings.filter((ping) => ping.receiverId === currentUserId && !ping.seenAt),
    [currentUserId, pings]
  );

  useEffect(() => {
    receivedUnseen.forEach((ping) => {
      void markSeen(ping.id);
    });
  }, [receivedUnseen]);

  return (
    <aside className="min-w-0 rounded-[1.5rem] border-[1.5px] border-line bg-[linear-gradient(180deg,rgba(255,255,255,0.62),rgba(255,245,238,0.9))] p-4 shadow-soft lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)]">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="font-display text-3xl font-semibold text-cocoa">Shared Timeline</h2>
          <p className="mt-1 text-sm text-mocha/66">{partner ? `With ${partner.name}` : "Waiting for connection"}</p>
        </div>
        <Clock className="text-sage" size={20} />
      </div>

      <div className="soft-scroll space-y-3 overflow-y-auto pr-1 lg:max-h-[calc(100vh-12.5rem)]">
        {items.length === 0 && (
          <div className="rounded-[1.25rem] border-[1.5px] border-line bg-white/72 p-5 text-sm font-semibold leading-7 text-mocha/68">
            Your timeline will fill with pings, responses, songs, and audio.
          </div>
        )}

        {items.map((item) => {
          if (item.kind === "ping") {
            const pingResponses = responses.filter((response) => response.pingId === item.data.id);
            return <PingCard key={`ping-${item.data.id}`} currentUserId={currentUserId} ping={item.data} responses={pingResponses} />;
          }

          if (item.kind === "song") {
            const mine = item.data.senderId === currentUserId;
            return (
              <article key={`song-${item.data.id}`} className="rounded-[1.25rem] border-[1.5px] border-rosewarm/60 bg-rosewarm/10 p-4 shadow-float">
                <div className="mb-2 flex items-center gap-2 text-sm font-black text-roseink">
                  <Music2 size={16} />
                  {mine ? "You dedicated a song today" : "Your partner dedicated a song today"}
                </div>
                <a href={item.data.youtubeLink} target="_blank" rel="noreferrer" className="font-black text-cocoa underline decoration-rosewarm/45 underline-offset-4">
                  {item.data.title}
                </a>
                {item.data.message && <p className="mt-2 text-sm leading-6 text-cocoa/72">{item.data.message}</p>}
                <p className="mt-3 text-xs font-semibold text-cocoa/45">{softTime(item.at)}</p>
              </article>
            );
          }

          if (item.kind === "audio") {
            return (
              <article key={`audio-${item.data.id}`} className="rounded-[1.25rem] border-[1.5px] border-sage/70 bg-sage/10 p-4 shadow-float">
                <div className="mb-3 flex items-center gap-2 text-sm font-black text-cocoa">
                  <Volume2 size={16} />
                  {item.data.senderId === currentUserId ? "You sent an audio note" : "Audio note"}
                </div>
                <audio controls src={item.data.url} className="w-full" />
                <p className="mt-3 text-xs font-semibold text-cocoa/45">{softTime(item.at)}</p>
              </article>
            );
          }

          return (
            <article key={`response-${item.data.id}`} className="rounded-[1.2rem] border-[1.5px] border-indigoink/25 bg-indigoink/8 p-3 text-sm text-cocoa/65 shadow-float">
              <span className="font-black text-indigoink">{item.data.senderId === currentUserId ? "You" : "Partner"} replied:</span>{" "}
              {item.data.message}
            </article>
          );
        })}
      </div>
    </aside>
  );
}

function PingCard({ currentUserId, ping, responses }: { currentUserId: string; ping: Ping; responses: Response[] }) {
  const [custom, setCustom] = useState("");
  const [busy, setBusy] = useState("");
  const mine = ping.senderId === currentUserId;
  const createdAt = new Date(ping.createdAt);
  const response = responses[0];
  const respondedAt = ping.respondedAt ? new Date(ping.respondedAt) : null;

  async function reply(message: string, type: "quick" | "text") {
    if (!message.trim()) return;
    setBusy(message);
    try {
      await respondToPing({ pingId: ping.id, senderId: currentUserId, type, message: message.trim() });
      setCustom("");
    } finally {
      setBusy("");
    }
  }

  return (
    <article
      className={cn(
        "rounded-[1.25rem] border-[1.5px] p-4 shadow-float",
        ping.isUrgent ? "border-roseink bg-rosewarm/15" : mine ? "border-rosewarm/35 bg-white/62" : "border-indigoink/28 bg-white/68"
      )}
    >
      <div className="mb-2 flex items-start justify-between gap-3">
        <span
          className={cn(
            "rounded-[0.9rem] border-[1.5px] px-2.5 py-1 text-[11px] font-black uppercase",
            ping.isUrgent ? "border-roseink text-roseink" : "border-line text-cocoa/50"
          )}
        >
          {ping.isUrgent ? "Urgent" : ping.category}
        </span>
        <span className="text-xs font-semibold text-cocoa/42">{softTime(createdAt)}</span>
      </div>
      <p className="text-base font-black leading-6 text-cocoa">{ping.text}</p>
      <p className="mt-2 text-xs font-semibold text-cocoa/48">{mine ? "Sent by you" : "Sent to you"}</p>

      {respondedAt && <p className="mt-3 rounded-[1rem] border-[1.5px] border-sage bg-sage/12 px-3 py-2 text-xs font-black text-cocoa">{respondedIn(createdAt, respondedAt)}</p>}

      {response && (
        <div className="mt-3 rounded-[1rem] border-[1.5px] border-indigoink/30 bg-indigoink/8 px-3 py-2 text-sm text-cocoa">
          <span className="font-black text-indigoink">{response.senderId === currentUserId ? "You" : "Partner"}:</span> {response.message}
        </div>
      )}

      {!mine && !respondedAt && (
        <div className="mt-4 space-y-2">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            {quickReplies.map((replyText) => (
              <Button key={replyText} variant="secondary" disabled={Boolean(busy)} onClick={() => reply(replyText, "quick")} className="min-h-10 px-2 text-xs">
                {replyText}
              </Button>
            ))}
          </div>
          <div className="flex gap-2">
            <Textarea placeholder="Write back softly" value={custom} onChange={(event) => setCustom(event.target.value)} className="min-h-12 flex-1 py-3" />
            <Button aria-label="Send response" className="h-12 min-h-12 w-12 px-0" disabled={Boolean(busy)} onClick={() => reply(custom, "text")}>
              <MessageCircleHeart size={18} />
            </Button>
          </div>
        </div>
      )}
    </article>
  );
}
