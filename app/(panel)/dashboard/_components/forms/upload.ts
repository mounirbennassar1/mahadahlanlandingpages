/** Browser helper: POSTs a file to /api/admin/upload and returns its URL. */
export const ACCEPT_IMAGES = "image/jpeg,image/png,image/webp,image/avif,image/gif";

export async function uploadImage(file: File): Promise<string> {
  const body = new FormData();
  body.append("file", file);
  const res = await fetch("/api/admin/upload", { method: "POST", body });
  let json: { url?: string; error?: string } = {};
  try {
    json = (await res.json()) as { url?: string; error?: string };
  } catch {
    /* non-JSON error body */
  }
  if (!res.ok || !json.url) {
    throw new Error(json.error ?? `Upload failed (${res.status})`);
  }
  return json.url;
}
