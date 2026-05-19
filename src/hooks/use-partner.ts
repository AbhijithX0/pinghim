"use client";

import { useEffect, useState } from "react";
import type { UserProfile } from "@/lib/types";

export function usePartner(partnerId?: string | null) {
  const [partner, setPartner] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (!partnerId) {
      setPartner(null);
      return;
    }

    let active = true;
    async function load() {
      const response = await fetch("/api/partner", { cache: "no-store" });
      const data = (await response.json()) as { partner: UserProfile | null };
      if (active) setPartner(data.partner);
    }

    void load();
    const id = window.setInterval(() => void load(), 5000);
    return () => {
      active = false;
      window.clearInterval(id);
    };
  }, [partnerId]);

  return partner;
}
