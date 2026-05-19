"use client";

import { Mic, Pause, Play, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { uploadAudioNote } from "@/services/audio-service";

type Props = {
  userId: string;
  partnerId?: string | null;
};

export function AudioRecorder({ userId, partnerId }: Props) {
  const recorderRef = useRef<MediaRecorder | null>(null);
  const startedAtRef = useRef(0);
  const chunksRef = useRef<Blob[]>([]);
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState("");
  const [blob, setBlob] = useState<Blob | null>(null);
  const [durationMs, setDurationMs] = useState(0);
  const [busy, setBusy] = useState(false);

  async function start() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    chunksRef.current = [];
    startedAtRef.current = Date.now();
    recorder.ondataavailable = (event) => {
      if (event.data.size) chunksRef.current.push(event.data);
    };
    recorder.onstop = () => {
      const nextBlob = new Blob(chunksRef.current, { type: "audio/webm" });
      setBlob(nextBlob);
      setAudioUrl(URL.createObjectURL(nextBlob));
      setDurationMs(Date.now() - startedAtRef.current);
      stream.getTracks().forEach((track) => track.stop());
    };
    recorder.start();
    recorderRef.current = recorder;
    setRecording(true);
  }

  function stop() {
    recorderRef.current?.stop();
    recorderRef.current = null;
    setRecording(false);
  }

  async function upload() {
    if (!blob || !partnerId) return;
    setBusy(true);
    try {
      await uploadAudioNote({ senderId: userId, receiverId: partnerId, blob, durationMs });
      setBlob(null);
      setAudioUrl("");
      setDurationMs(0);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="rounded-lg border-[1.5px] border-line bg-white/45 p-4 shadow-soft">
      <div className="mb-3 flex items-center gap-2">
        <Mic size={18} className="text-sage" />
        <h2 className="font-black text-cocoa">Audio Note</h2>
      </div>

      <div className="flex gap-2">
        <Button type="button" disabled={!partnerId || busy} variant={recording ? "danger" : "secondary"} onClick={recording ? stop : start} className="flex-1">
          {recording ? <Pause size={17} /> : <Play size={17} />}
          {recording ? "Stop" : "Record"}
        </Button>
        <Button type="button" disabled={!blob || !partnerId || busy} onClick={upload} className="flex-1">
          <Upload size={17} />
          Upload
        </Button>
      </div>

      {audioUrl && <audio controls src={audioUrl} className="mt-4 w-full" />}
    </section>
  );
}
