export async function uploadAudioNote(input: {
  senderId: string;
  receiverId: string;
  blob: Blob;
  durationMs: number;
}) {
  const formData = new FormData();
  formData.append("audio", input.blob, "audio.webm");
  formData.append("durationMs", String(input.durationMs));

  const response = await fetch("/api/audio", {
    method: "POST",
    body: formData
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error ?? "Could not upload audio.");
  return data;
}
