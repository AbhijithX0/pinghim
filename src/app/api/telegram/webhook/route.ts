import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendTelegramMessage } from "@/lib/telegram";
import { connectTelegramChat } from "@/lib/telegram-connect";

type TelegramUpdate = {
  message?: {
    chat?: { id?: number | string };
    text?: string;
  };
};

export async function POST(request: Request) {
  const expectedSecret = process.env.TELEGRAM_WEBHOOK_SECRET;
  const receivedSecret = request.headers.get("x-telegram-bot-api-secret-token");
  if (expectedSecret && receivedSecret !== expectedSecret) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const update = (await request.json()) as TelegramUpdate;
  const chatId = update.message?.chat?.id;
  const text = update.message?.text ?? "";
  const startMatch = text.match(/^\/start\s+([A-Za-z0-9_-]+)$/);

  if (!chatId || !startMatch) return NextResponse.json({ ok: true });

  const userId = startMatch[1];
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    await sendTelegramMessage(String(chatId), "This Emotional Ping account was not found.");
    return NextResponse.json({ ok: true });
  }

  await connectTelegramChat(userId, String(chatId));
  await sendTelegramMessage(String(chatId), "Telegram connected to Emotional Ping.");
  return NextResponse.json({ ok: true });
}
