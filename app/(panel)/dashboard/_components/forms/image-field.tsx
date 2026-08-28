"use client";

import { useRef, useState } from "react";
import { inputStyle, smallButtonStyle } from "./styles";
import { ACCEPT_IMAGES, uploadImage } from "./upload";

function normalize(url: string) {
  const v = url.trim();
  if (v.startsWith("public/")) return `/${v.slice("public/".length)}`;
  return v;
}

/**
 * URL text input + "Upload" button (POST /api/admin/upload) + live preview.
 * Accepts absolute URLs and site-relative `/public` paths like `/team/x.avif`.
 */
export function ImageField({
  name,
  defaultValue,
  error,
  disabled,
  id,
  placeholder = "https://… or /path/in/public",
}: {
  name: string;
  defaultValue?: string | null;
  error?: string;
  disabled?: boolean;
  id?: string;
  placeholder?: string;
}) {
  const [url, setUrl] = useState(defaultValue ?? "");
  const [busy, setBusy] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function onFile(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    setUploadError(null);
    try {
      setUrl(await uploadImage(file));
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  const preview = normalize(url);

  return (
    <div>
      <div style={{ display: "flex", gap: 8 }}>
        <input
          id={id}
          name={name}
          type="text"
          className="fk-input"
          aria-invalid={error ? true : undefined}
          value={url}
          disabled={disabled}
          placeholder={placeholder}
          spellCheck={false}
          onChange={(e) => setUrl(e.target.value)}
          onBlur={() => setUrl((v) => normalize(v))}
          style={{ ...inputStyle, fontFamily: "var(--font-data)", fontSize: 13 }}
        />
        <input
          ref={fileRef}
          type="file"
          accept={ACCEPT_IMAGES}
          hidden
          onChange={(e) => onFile(e.target.files?.[0])}
        />
        <button
          type="button"
          className="fk-btn"
          disabled={disabled || busy}
          onClick={() => fileRef.current?.click()}
          style={{ ...smallButtonStyle, padding: "0 14px", flex: "none" }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          {busy ? "Uploading…" : "Upload"}
        </button>
        {url && !disabled && (
          <button
            type="button"
            className="fk-btn"
            onClick={() => setUrl("")}
            title="Clear"
            style={{ ...smallButtonStyle, padding: "0 10px", flex: "none", color: "var(--ink-4)" }}
          >
            ×
          </button>
        )}
      </div>
      {uploadError && <div style={{ fontSize: 12.5, color: "var(--red)", marginTop: 6 }}>{uploadError}</div>}
      {preview && (
        <div
          style={{
            marginTop: 10,
            borderRadius: 10,
            border: "1px solid var(--hairline)",
            background: "var(--surface-2)",
            padding: 6,
            display: "inline-block",
            maxWidth: "100%",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview}
            alt=""
            style={{ display: "block", maxWidth: 320, maxHeight: 200, borderRadius: 6, objectFit: "contain" }}
          />
        </div>
      )}
    </div>
  );
}
