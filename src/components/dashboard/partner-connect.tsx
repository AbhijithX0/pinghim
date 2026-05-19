"use client";

import { Copy, Link2, Loader2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { UserProfile } from "@/lib/types";
import { connectWithPartnerCode } from "@/services/user-service";

export function PartnerConnect({ profile }: { profile: UserProfile }) {
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  async function connect(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      await connectWithPartnerCode(profile.id, code);
      setMessage("Connected");
    } catch (caught) {
      setMessage(caught instanceof Error ? caught.message : "Could not connect.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="mt-5 rounded-lg border-[1.5px] border-line bg-white/45 p-4 shadow-soft">
      <div className="grid gap-4 md:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-roseink/70">Invite code</p>
          <div className="mt-2 flex items-center gap-2">
            <code className="rounded-lg border-[1.5px] border-rosewarm bg-cream px-4 py-3 text-2xl font-black tracking-[0.16em] text-roseink">
              {profile.inviteCode}
            </code>
            <Button
              type="button"
              variant="secondary"
              className="h-12 min-h-12 w-12 px-0"
              aria-label="Copy invite code"
              onClick={() => profile.inviteCode && navigator.clipboard.writeText(profile.inviteCode)}
            >
              <Copy size={18} />
            </Button>
          </div>
        </div>

        <form onSubmit={connect} className="flex flex-col gap-2 sm:flex-row sm:items-end">
          <label className="flex-1">
            <span className="mb-2 block text-xs font-black uppercase tracking-[0.12em] text-cocoa/55">Partner code</span>
            <Input required value={code} onChange={(event) => setCode(event.target.value.toUpperCase())} />
          </label>
          <Button disabled={busy} className="sm:w-36">
            {busy ? <Loader2 size={16} className="animate-spin" /> : <Link2 size={16} />}
            Connect
          </Button>
        </form>
      </div>
      {message && <p className="mt-3 text-sm font-semibold text-cocoa/68">{message}</p>}
    </section>
  );
}
