"use client";

import { useCallback, useEffect, useState } from "react";
import type { UserProfile } from "@/lib/types";

export function useAuth() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const response = await fetch("/api/auth/me", { cache: "no-store" });
    const data = (await response.json()) as { user: UserProfile | null };
    setProfile(data.user);
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
    const id = window.setInterval(() => void refresh(), 5000);
    return () => window.clearInterval(id);
  }, [refresh]);

  return { user: profile ? { uid: profile.id } : null, profile, loading, refresh };
}
