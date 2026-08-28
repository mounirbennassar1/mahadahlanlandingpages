import { NextResponse } from "next/server";
import { mkdir, writeFile } from "node:fs/promises";
import { randomBytes } from "node:crypto";
import path from "node:path";
import { put } from "@vercel/blob";
import { auth } from "@/auth";
import { isEditor } from "@/lib/admin/auth";

export const runtime = "nodejs";

/**
 * POST multipart `file` (jpeg/png/webp/avif/gif, ≤ 8 MB) → `{ url }`.
 *
 * - With BLOB_READ_WRITE_TOKEN (production on Vercel): stored in Vercel Blob
 *   under uploads/<yyyy>/<mm>/<safe-name> (public, random suffix).
 * - Otherwise (local dev): written to public/uploads/<yyyy>/<mm>/ and served
 *   as /uploads/…; a read-only filesystem yields a 500 explaining the token.
 */

const ALLOWED: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
  "image/gif": "gif",
};
const MAX_BYTES = 8 * 1024 * 1024;

function safeName(original: string, ext: string) {
  const base = path
    .basename(original || "image")
    .replace(/\.[^.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  return `${base || "image"}.${ext}`;
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!isEditor(session.user.role)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "Expected multipart form data." }, { status: 400 });
  }

  const file = formData.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "Missing file." }, { status: 400 });
  const ext = ALLOWED[file.type];
  if (!ext) return NextResponse.json({ error: "Only JPEG, PNG, WebP, AVIF or GIF images are allowed." }, { status: 415 });
  if (file.size === 0) return NextResponse.json({ error: "The file is empty." }, { status: 400 });
  if (file.size > MAX_BYTES) return NextResponse.json({ error: "Images must be 8 MB or smaller." }, { status: 413 });

  const now = new Date();
  const yyyy = String(now.getUTCFullYear());
  const mm = String(now.getUTCMonth() + 1).padStart(2, "0");
  const name = safeName(file.name, ext);

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const blob = await put(`uploads/${yyyy}/${mm}/${name}`, file, {
        access: "public",
        addRandomSuffix: true,
        contentType: file.type,
      });
      return NextResponse.json({ url: blob.url });
    } catch (err) {
      console.error("[upload] blob put failed", err);
      return NextResponse.json({ error: "Upload to storage failed. Please try again." }, { status: 500 });
    }
  }

  try {
    const dir = path.join(process.cwd(), "public", "uploads", yyyy, mm);
    await mkdir(dir, { recursive: true });
    const fileName = `${randomBytes(4).toString("hex")}-${name}`;
    await writeFile(path.join(dir, fileName), Buffer.from(await file.arrayBuffer()));
    return NextResponse.json({ url: `/uploads/${yyyy}/${mm}/${fileName}` });
  } catch (err) {
    console.error("[upload] local write failed", err);
    return NextResponse.json({ error: "Uploads need BLOB_READ_WRITE_TOKEN in production." }, { status: 500 });
  }
}
