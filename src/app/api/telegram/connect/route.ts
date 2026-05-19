import { NextResponse } from "next/server";
import { requireUser } from "@/lib/session";
import { syncTelegramConnectionForUser } from "@/lib/telegram-connect";

export async function POST() {
  const user = await requireUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await syncTelegramConnectionForUser(user.id);
  if (!result.connected) {
    return NextResponse.json({ error: result.reason }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
