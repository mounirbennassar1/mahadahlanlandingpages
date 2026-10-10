"use client";

import { startTransition, useEffect, useState } from "react";
import { primaryButtonStyle } from "../../_components/forms";

/** Centered modal; Escape and the backdrop close it. */
export function Dialog({
  title,
  description,
  onClose,
  width = 480,
  children,
}: {
  title: React.ReactNode;
  description?: React.ReactNode;
  onClose: () => void;
  width?: number;
  children: React.ReactNode;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        background: "oklch(0.2 0.03 295 / 0.35)",
        display: "grid",
        placeItems: "center",
        padding: 16,
        overflowY: "auto",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: width,
          background: "var(--surface)",
          border: "1px solid var(--hairline)",
          borderRadius: 16,
          boxShadow: "var(--shadow-lg)",
          padding: 24,
          textAlign: "left",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 18 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: 19, fontWeight: 700, margin: 0, color: "var(--ink)" }}>{title}</h2>
            {description && <p style={{ fontSize: 13, color: "var(--ink-3)", margin: "6px 0 0" }}>{description}</p>}
          </div>
          <button type="button" onClick={onClose} aria-label="Close" style={{ color: "var(--ink-4)", padding: 4, borderRadius: 8 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

/** A generated password, shown exactly once with a copy button. */
export function PasswordReveal({ name, email, password }: { name: string; email?: string; password: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div>
      <p style={{ fontSize: 13.5, color: "var(--ink-2)", margin: "0 0 12px" }}>
        Share this password with <b>{name}</b>{email ? ` (${email})` : ""}. It won&apos;t be shown again; they can sign in
        with it right away.
      </p>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "12px 14px",
          borderRadius: 10,
          border: "1px dashed var(--primary)",
          background: "var(--primary-softer)",
        }}
      >
        <code style={{ flex: 1, fontFamily: "var(--font-data)", fontSize: 17, letterSpacing: "0.06em", color: "var(--ink)" }}>
          {password}
        </code>
        <button
          type="button"
          onClick={() => {
            navigator.clipboard?.writeText(password).then(() => setCopied(true), () => setCopied(false));
          }}
          style={{
            padding: "6px 12px",
            borderRadius: 8,
            background: "var(--surface)",
            border: "1px solid var(--hairline)",
            fontSize: 12.5,
            fontWeight: 600,
            color: "var(--ink-2)",
          }}
        >
          <span style={{ display: copied ? "none" : "inline" }}>Copy</span>
          <span style={{ display: copied ? "inline" : "none" }}>Copied</span>
        </button>
      </div>
    </div>
  );
}

/**
 * Submit handler for `useActionState` forms that must keep what was typed when
 * the action returns an error. `<form action>` resets the form after every
 * submission (React 19), which also desyncs controlled selects.
 */
export function submitKeepingInput(action: (formData: FormData) => void) {
  return (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    startTransition(() => action(data));
  };
}

/** Both labels stay mounted (translation extensions break React text swaps). */
export function DialogSubmit({ pending, label, pendingLabel }: { pending: boolean; label: string; pendingLabel: string }) {
  return (
    <button type="submit" disabled={pending} className="fk-btn" style={{ ...primaryButtonStyle, opacity: pending ? 0.7 : 1 }}>
      <span style={{ display: pending ? "none" : "inline" }}>{label}</span>
      <span style={{ display: pending ? "inline" : "none" }}>{pendingLabel}</span>
    </button>
  );
}
