import type { EmotionalCategory } from "@/lib/types";

async function api<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers
    }
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error ?? "Request failed.");
  return data as T;
}

export function sendPing(input: {
  senderId: string;
  receiverId: string;
  text: string;
  category: EmotionalCategory;
  isUrgent?: boolean;
}) {
  return api("/api/pings", {
    method: "POST",
    body: JSON.stringify({
      text: input.text,
      category: input.category,
      isUrgent: input.isUrgent ?? false
    })
  });
}

export function markSeen(pingId: string) {
  return api(`/api/pings/${pingId}/seen`, { method: "POST" });
}

export function respondToPing(input: {
  pingId: string;
  senderId: string;
  type: "quick" | "text";
  message: string;
}) {
  return api("/api/responses", {
    method: "POST",
    body: JSON.stringify({
      pingId: input.pingId,
      type: input.type,
      message: input.message
    })
  });
}
