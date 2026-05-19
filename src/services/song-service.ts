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

export function dedicateSong(input: {
  senderId: string;
  receiverId: string;
  title: string;
  youtubeLink: string;
  message: string;
}) {
  return api("/api/songs", {
    method: "POST",
    body: JSON.stringify({
      title: input.title,
      youtubeLink: input.youtubeLink,
      message: input.message
    })
  });
}
