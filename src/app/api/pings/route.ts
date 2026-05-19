import { NextResponse } from "next/server";
import { z } from "zod";
import { jsonError, serializePing } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { sendTelegramPing } from "@/lib/telegram";

const schema = z.object({
  text: z.string().min(1),
  category: z.string().min(1),
  isUrgent: z.boolean().optional()
});

export async function POST(request: Request) {
  const user = await requireUser();
  if (!user) return jsonError("Unauthorized", 401);
  if (!user.partnerId) return jsonError("Connect a partner first.");

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return jsonError("Ping text is required.");

  const ping = await prisma.ping.create({
    data: {
      senderId: user.id,
      receiverId: user.partnerId,
      text: parsed.data.text,
      category: parsed.data.category,
      isUrgent: parsed.data.isUrgent ?? false
    }
  });

  await sendTelegramPing({
    receiverId: user.partnerId,
    senderName: user.name,
    text: ping.text,
    isUrgent: ping.isUrgent
  });

  return NextResponse.json({ ping: serializePing(ping) });
}
