"use client";

import { Music2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { dedicateSong } from "@/services/song-service";

type Props = {
  userId: string;
  partnerId?: string | null;
};

export function SongDedication({ userId, partnerId }: Props) {
  const [title, setTitle] = useState("");
  const [youtubeLink, setYoutubeLink] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!partnerId) return;
    setBusy(true);
    try {
      await dedicateSong({ senderId: userId, receiverId: partnerId, title, youtubeLink, message });
      setTitle("");
      setYoutubeLink("");
      setMessage("");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="rounded-lg border-[1.5px] border-line bg-white/45 p-4 shadow-soft">
      <div className="mb-3 flex items-center gap-2">
        <Music2 size={18} className="text-rosewarm" />
        <h2 className="font-black text-cocoa">Song Dedication</h2>
      </div>
      <div className="space-y-2">
        <Input required disabled={!partnerId} placeholder="Title" value={title} onChange={(event) => setTitle(event.target.value)} />
        <Input
          required
          disabled={!partnerId}
          type="url"
          placeholder="YouTube link"
          value={youtubeLink}
          onChange={(event) => setYoutubeLink(event.target.value)}
        />
        <Textarea disabled={!partnerId} placeholder="Message" value={message} onChange={(event) => setMessage(event.target.value)} />
      </div>
      <Button disabled={!partnerId || busy} className="mt-3 w-full">
        Dedicate
      </Button>
    </form>
  );
}
