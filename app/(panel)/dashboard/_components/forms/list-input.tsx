"use client";

import { useState } from "react";
import { arabicInputStyle, inputStyle } from "./styles";

function parseLines(text: string) {
  return text
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean);
}

/**
 * Edits a `string[]`: one item per line. Submits the list as JSON in a hidden
 * input named `name` (parsed by lib/admin/form.ts `list()`).
 */
export function ListInput({
  name,
  defaultValue = [],
  placeholder,
  rows = 5,
  rtl = true,
  error,
  disabled,
  id,
}: {
  name: string;
  defaultValue?: string[];
  placeholder?: string;
  rows?: number;
  rtl?: boolean;
  error?: string;
  disabled?: boolean;
  id?: string;
}) {
  const [text, setText] = useState(defaultValue.join("\n"));
  const items = parseLines(text);

  return (
    <div>
      <input type="hidden" name={name} value={JSON.stringify(items)} />
      <textarea
        id={id}
        className="fk-input"
        aria-invalid={error ? true : undefined}
        rows={rows}
        disabled={disabled}
        value={text}
        placeholder={placeholder ?? "One item per line"}
        onChange={(e) => setText(e.target.value)}
        {...(rtl ? { dir: "rtl" as const, lang: "ar" } : {})}
        style={{ ...(rtl ? arabicInputStyle : inputStyle), resize: "vertical", lineHeight: 1.7 }}
      />
      {items.length > 0 && (
        <div
          dir={rtl ? "rtl" : "ltr"}
          style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}
        >
          {items.map((item, i) => (
            <span
              key={`${item}-${i}`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "3px 9px",
                borderRadius: 999,
                background: "var(--primary-softer)",
                color: "var(--primary)",
                fontSize: 12,
                fontWeight: 600,
                fontFamily: rtl ? "var(--font-display), system-ui, sans-serif" : undefined,
              }}
            >
              {item}
              {!disabled && (
                <button
                  type="button"
                  title="Remove"
                  onClick={() => setText(items.filter((_, j) => j !== i).join("\n"))}
                  style={{ color: "var(--primary-3)", lineHeight: 1, padding: 0 }}
                >
                  ×
                </button>
              )}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
