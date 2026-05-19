import { NextResponse } from "next/server";
import { z } from "zod";
import { jsonError, serializeResponse } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";

const schema = z.object({
  pingId: z.string().min(1),
  type: z.enum(["quick", "text"]),
  message: z.string().min(1)
});

export async function POST(request: Request) {
  const user = await requireUser();
  if (!user) return jsonError("Unauthorized", 401);

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return jsonError("Response message is required.");

  const ping = await prisma.ping.findUnique({ where: { id: parsed.data.pingId } });
  if (!ping || (ping.senderId !== user.id && ping.receiverId !== user.id)) return jsonError("Not found", 404);

  const response = await prisma.$transaction(async (tx) => {
    const created = await tx.response.create({
      data: {
        pingId: parsed.data.pingId,
        senderId: user.id,
        type: parsed.data.type,
        message: parsed.data.message
      }
    });
    await tx.ping.update({ where: { id: parsed.data.pingId }, data: { respondedAt: new Date() } });
    return created;
  });

  return NextResponse.json({ response: serializeResponse(response) });
}
