import { prisma } from "@/lib/prisma";

export async function sendTelegramPing(input: {
  receiverId: string;
  senderName: string;
  text: string;
  isUrgent: boolean;
}) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) return;

  const connection = await prisma.telegramConnection.findUnique({
    where: { userId: input.receiverId }
  });
  if (!connection) return;

  const message = input.isUrgent
    ? `URGENT\n"${input.text}"\nRespond now.`
    : `${input.senderName}\n"${input.text}"`;

  await sendTelegramMessage(connection.chatId, message);
}

export async function sendTelegramMessage(chatId: string, text: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) return;

  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      disable_web_page_preview: true
    })
  });
}
