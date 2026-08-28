"use client";

import { useEffect, useRef, useState } from "react";
import { inputStyle } from "./styles";
import { isoToLocalInput, localInputToIso } from "./datetime";

/**
 * Shows a datetime-local picker in the browser's timezone and submits the
 * ISO (UTC) value in a hidden input under `name`, so the server never has to
 * guess the timezone the clinic typed in. The visible picker is uncontrolled
 * and filled in after mount because local time can only be derived in the
 * browser (the server's timezone differs).
 */
export function DateTimeInput({
  name,
  defaultValue,
  error,
  disabled,
  id,
}: {
  name: string;
  /** ISO string or Date from the database. */
  defaultValue?: string | Date | null;
  error?: string;
  disabled?: boolean;
  id?: string;
}) {
  const initialIso = defaultValue ? (defaultValue instanceof Date ? defaultValue.toISOString() : defaultValue) : "";
  const [iso, setIso] = useState(initialIso);
  const localRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (localRef.current) localRef.current.value = isoToLocalInput(initialIso);
  }, [initialIso]);

  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <input type="hidden" name={name} value={iso} />
      <input
        ref={localRef}
        id={id}
        type="datetime-local"
        className="fk-input"
        aria-invalid={error ? true : undefined}
        disabled={disabled}
        onChange={(e) => setIso(localInputToIso(e.target.value))}
        style={{ ...inputStyle, fontFamily: "var(--font-data)" }}
      />
      {iso && !disabled && (
        <button
          type="button"
          onClick={() => {
            if (localRef.current) localRef.current.value = "";
            setIso("");
          }}
          title="Clear"
          style={{ color: "var(--ink-4)", padding: 6, borderRadius: 8, flex: "none" }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}
    </div>
  );
}
