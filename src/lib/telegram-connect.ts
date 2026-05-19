import { prisma } from "@/lib/prisma";
import { sendTelegramMessage } from "@/lib/telegram";

type TelegramUpdate = {
  update_id: number;
  message?: {
    chat?: { id?: number | string };
    text?: string;
  };
};

export async function syncTelegramConnectionForUser(userId: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    return { connected: false, reason: "Bot token is not configured." };
  }

  const response = await fetch(`https://api.telegram.org/bot${token}/getUpdates`);
  const payload = (await response.json()) as { ok?: boolean; result?: TelegramUpdate[] };
  const updates = payload.result ?? [];

  const match = [...updates]
    .reverse()
    .find((update) => update.message?.text?.trim() === `/start ${userId}`);

  if (!match?.message?.chat?.id) {
    return { connected: false, reason: "Open the bot and tap Connect Telegram first." };
  }

  const chatId = String(match.message.chat.id);
  await connectTelegramChat(userId, chatId);
  await sendTelegramMessage(chatId, "Telegram connected to Emotional Ping.");
  return { connected: true };
}

export async function connectTelegramChat(userId: string, chatId: string) {
  await prisma.$transaction([
    prisma.telegramConnection.upsert({
      where: { userId },
      create: { userId, chatId },
      update: { chatId }
    }),
    prisma.user.update({
      where: { id: userId },
      data: { telegramConnected: true }
    })
  ]);
}
