"use client";

import { Heart, Loader2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { signIn, signUp } from "@/services/user-service";

export function AuthGate({ children }: { children: React.ReactNode }) {
  const { user, profile, loading } = useAuth();
  const [mode, setMode] = useState<"signup" | "signin">("signup");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [hasPartnerCode, setHasPartnerCode] = useState(false);
  const [partnerCode, setPartnerCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  if (loading || (user && !profile)) {
    return (
      <main className="grid min-h-screen place-items-center px-5">
        <Loader2 className="animate-spin text-rosewarm" />
      </main>
    );
  }

  if (user && profile) return <>{children}</>;

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      if (mode === "signup") {
        await signUp({ name, email, password, partnerCode: hasPartnerCode ? partnerCode : undefined });
      } else {
        await signIn(email, password);
      }
      window.location.reload();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-lg flex-col justify-center px-5 py-10">
      <div className="mb-8">
        <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-[1.35rem] border-[1.5px] border-rosewarm/60 bg-white/72 text-rosewarm shadow-soft">
          <Heart fill="currentColor" size={22} />
        </div>
        <p className="text-xs font-black uppercase tracking-[0.18em] text-roseink/70">Private For Two</p>
        <h1 className="mt-3 font-display text-5xl font-semibold leading-none text-cocoa">Emotional Ping</h1>
        <p className="mt-4 max-w-md text-[15px] leading-7 text-mocha/78">
          A softer way to reach each other when feelings are hard to explain out loud.
        </p>
      </div>

      <form
        onSubmit={submit}
        className="rounded-[1.6rem] border-[1.5px] border-line bg-[linear-gradient(180deg,rgba(255,255,255,0.72),rgba(255,248,242,0.82))] p-5 shadow-soft backdrop-blur"
      >
        <div className="mb-5 grid grid-cols-2 rounded-[1.1rem] border-[1.5px] border-line bg-blush/55 p-1">
          <button
            type="button"
            onClick={() => setMode("signup")}
            className={`rounded-[0.9rem] py-2.5 text-sm font-bold transition ${mode === "signup" ? "bg-white text-roseink shadow-float" : "text-mocha/68"}`}
          >
            Sign up
          </button>
          <button
            type="button"
            onClick={() => setMode("signin")}
            className={`rounded-[0.9rem] py-2.5 text-sm font-bold transition ${mode === "signin" ? "bg-white text-roseink shadow-float" : "text-mocha/68"}`}
          >
            Sign in
          </button>
        </div>

        <div className="space-y-3">
          {mode === "signup" && <Input required placeholder="Name" value={name} onChange={(event) => setName(event.target.value)} />}
          <Input required type="email" placeholder="Email" value={email} onChange={(event) => setEmail(event.target.value)} />
          <Input required type="password" placeholder="Password" minLength={6} value={password} onChange={(event) => setPassword(event.target.value)} />

          {mode === "signup" && (
            <label className="flex items-center justify-between gap-3 rounded-[1.1rem] border-[1.5px] border-line bg-blush/38 px-4 py-3 text-sm font-bold text-cocoa">
              <span>Do you have a partner code?</span>
              <input
                type="checkbox"
                checked={hasPartnerCode}
                onChange={(event) => setHasPartnerCode(event.target.checked)}
                className="h-5 w-5 accent-rosewarm"
              />
            </label>
          )}

          {mode === "signup" && hasPartnerCode && (
            <Input
              required
              placeholder="Partner code"
              value={partnerCode}
              onChange={(event) => setPartnerCode(event.target.value.toUpperCase())}
            />
          )}
        </div>

        {error && <p className="mt-4 rounded-[1rem] border-[1.5px] border-rosewarm/60 bg-white/72 px-3 py-2 text-sm text-roseink">{error}</p>}

        <Button disabled={busy} className="mt-5 w-full">
          {busy && <Loader2 className="animate-spin" size={16} />}
          {mode === "signup" ? "Create private space" : "Enter private space"}
        </Button>
      </form>
    </main>
  );
}
