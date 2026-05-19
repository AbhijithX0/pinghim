"use client";

import { LogOut, Send, Smartphone, UsersRound } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { AudioRecorder } from "@/components/dashboard/audio-recorder";
import { CategoryTabs } from "@/components/dashboard/category-tabs";
import { PartnerConnect } from "@/components/dashboard/partner-connect";
import { SongDedication } from "@/components/dashboard/song-dedication";
import { Timeline } from "@/components/dashboard/timeline";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { categories, urgentPing } from "@/data/categories";
import { useAuth } from "@/hooks/use-auth";
import { usePartner } from "@/hooks/use-partner";
import { useTimeline } from "@/hooks/use-timeline";
import { cn } from "@/lib/utils";
import { logout } from "@/services/user-service";
import { sendPing } from "@/services/ping-service";
import type { EmotionalCategory } from "@/lib/types";

export function Dashboard() {
  const { user, profile } = useAuth();
  const partner = usePartner(profile?.partnerId);
  const { items, pings, responses } = useTimeline(user?.uid, profile?.partnerId);
  const [activeCategory, setActiveCategory] = useState<EmotionalCategory>(categories[0].name);
  const [pendingUrgent, setPendingUrgent] = useState<{ text: string; category: EmotionalCategory } | null>(null);
  const [status, setStatus] = useState("");
  const [busyText, setBusyText] = useState("");

  const active = useMemo(() => categories.find((category) => category.name === activeCategory) ?? categories[0], [activeCategory]);
  const canPing = Boolean(user && profile?.partnerId);
  const telegramUrl = user
    ? `https://t.me/${process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME}?start=${user.uid}`
    : "#";

  useEffect(() => {
    if (!user || !profile || profile.telegramConnected) return;

    const sync = async () => {
      try {
        await fetch("/api/telegram/connect", { method: "POST" });
      } catch {
        // Ignore silent retries for local Telegram linking.
      }
    };

    void sync();
    const id = window.setInterval(() => void sync(), 5000);
    return () => window.clearInterval(id);
  }, [user, profile]);

  async function tapPing(text: string, category: EmotionalCategory) {
    if (!user || !profile?.partnerId) return;
    if (text === urgentPing) {
      setPendingUrgent({ text, category });
      return;
    }

    setBusyText(text);
    setStatus("");
    try {
      await sendPing({ senderId: user.uid, receiverId: profile.partnerId, text, category });
      setStatus("Sent");
    } catch (caught) {
      setStatus(caught instanceof Error ? caught.message : "Could not send ping.");
    } finally {
      setBusyText("");
    }
  }

  async function confirmUrgent() {
    if (!user || !profile?.partnerId || !pendingUrgent) return;
    setBusyText(pendingUrgent.text);
    try {
      await sendPing({
        senderId: user.uid,
        receiverId: profile.partnerId,
        text: pendingUrgent.text,
        category: pendingUrgent.category,
        isUrgent: true
      });
      setPendingUrgent(null);
      setStatus("Urgent ping sent");
    } catch (caught) {
      setStatus(caught instanceof Error ? caught.message : "Could not send urgent ping.");
    } finally {
      setBusyText("");
    }
  }

  if (!user || !profile) return null;

  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-3 pb-24 pt-4 sm:px-5 lg:px-8">
      <header className="sticky top-0 z-20 -mx-3 border-b-[1.5px] border-line bg-[#fbf0e4]/82 px-3 py-3 backdrop-blur sm:-mx-5 sm:px-5 lg:-mx-8 lg:px-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-roseink/70">Emotional Ping</p>
            <h1 className="mt-1 font-display text-2xl font-semibold text-cocoa">Keep the feeling simple.</h1>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-cocoa/72">
              <span className="inline-flex items-center gap-1.5 rounded-[1rem] border-[1.5px] border-line bg-white/68 px-2.5 py-1 font-semibold shadow-float">
                <UsersRound size={14} />
                {partner ? partner.name : "Waiting for partner"}
              </span>
              <span
                className={cn(
                  "rounded-[1rem] border-[1.5px] px-2.5 py-1 font-semibold shadow-float",
                  profile.partnerId ? "border-sage bg-sage/15 text-cocoa" : "border-rosewarm bg-white/68 text-roseink"
                )}
              >
                {profile.partnerId ? "Connected" : "Invite open"}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={telegramUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-10 items-center justify-center rounded-[1rem] border-[1.5px] border-indigoink/25 bg-white/68 px-3 text-indigoink shadow-float transition hover:bg-white"
              title="Connect Telegram"
            >
              <Smartphone size={18} />
            </a>
            <Button
              variant="ghost"
              className="h-10 min-h-10 w-10 px-0"
              onClick={async () => {
                await logout();
                window.location.reload();
              }}
              aria-label="Log out"
            >
              <LogOut size={18} />
            </Button>
          </div>
        </div>
      </header>

      {!profile.partnerId && <PartnerConnect profile={profile} />}

      <section className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1.06fr)_minmax(340px,0.74fr)]">
        <div className="min-w-0">
          <CategoryTabs active={activeCategory} onChange={setActiveCategory} />

          <div className="mt-4 rounded-[1.5rem] border-[1.5px] border-line bg-[linear-gradient(180deg,rgba(255,255,255,0.65),rgba(255,246,240,0.86))] p-4 shadow-soft">
            <div className="mb-4 flex items-end justify-between gap-3">
              <div>
                <h2 className="font-display text-3xl font-semibold text-cocoa">{active.name}</h2>
                <p className="mt-2 max-w-2xl text-sm leading-7 text-mocha/76">{active.hint}</p>
                <p className="mt-2 text-xs font-bold uppercase tracking-[0.16em] text-mocha/46">{active.buttons.length} emotional taps</p>
              </div>
              {status && <span className="shrink-0 rounded-[1rem] border-[1.5px] border-line bg-white/74 px-3 py-1 text-xs font-bold text-cocoa/65">{status}</span>}
            </div>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {active.buttons.map((button) => (
                <button
                  key={button.text}
                  disabled={!canPing || Boolean(busyText)}
                  onClick={() => tapPing(button.text, active.name)}
                  className={cn(
                    "group relative min-h-20 overflow-hidden rounded-[1.35rem] border-[1.5px] px-4 py-3 text-left shadow-float transition hover:-translate-y-0.5 hover:bg-white active:translate-y-0 disabled:opacity-55",
                    "before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-white/70 before:content-['']",
                    "bg-gradient-to-br from-[#fff8f2] via-white/82 to-[#fff2e8]",
                    button.tone === "rose" && "border-rosewarm/55",
                    button.tone === "indigo" && "border-indigoink/40",
                    button.tone === "sage" && "border-sage/60",
                    !button.tone && "border-line",
                    button.text === urgentPing && "border-roseink bg-rosewarm/15 text-roseink"
                  )}
                >
                  <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.16em] text-mocha/38">
                    {button.text === urgentPing ? "urgent" : active.name.toLowerCase()}
                  </span>
                  <span className="flex items-start justify-between gap-3">
                    <span className="pr-2 text-[15px] font-bold leading-6 text-cocoa">{button.text}</span>
                    <Send size={15} className="shrink-0 opacity-35 transition group-hover:opacity-80" />
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <SongDedication userId={user.uid} partnerId={profile.partnerId} />
            <AudioRecorder userId={user.uid} partnerId={profile.partnerId} />
          </div>
        </div>

        <Timeline currentUserId={user.uid} partner={partner} items={items} pings={pings} responses={responses} />
      </section>

      {pendingUrgent && (
        <Modal title="Send urgent ping?" onClose={() => setPendingUrgent(null)}>
          <p className="rounded-lg border-[1.5px] border-rosewarm bg-white/62 p-4 text-sm font-semibold leading-6 text-roseink">
            {pendingUrgent.text}
          </p>
          <div className="mt-4 flex gap-2">
            <Button variant="secondary" className="flex-1" onClick={() => setPendingUrgent(null)}>
              Cancel
            </Button>
            <Button variant="danger" className="flex-1" onClick={confirmUrgent} disabled={busyText === pendingUrgent.text}>
              Send now
            </Button>
          </div>
        </Modal>
      )}
    </main>
  );
}
