"use client";

import type { CSSProperties } from "react";
import type { FieldDef, ItemFieldDef } from "@/lib/pages/define";
import { TextInput, Textarea } from "@/app/(panel)/dashboard/_components/forms";
import { arabicInputStyle, inputStyle, smallButtonStyle } from "@/app/(panel)/dashboard/_components/forms/styles";

/** One editable value, rendered by field kind. Controlled by the parent editor. */
export function ScalarInput({
  field,
  value,
  rtl,
  disabled,
  onChange,
}: {
  field: ItemFieldDef;
  value: string | string[];
  rtl: boolean;
  disabled?: boolean;
  onChange: (next: string | string[]) => void;
}) {
  if (field.kind === "list") {
    return (
      <LinesInput
        value={Array.isArray(value) ? value : []}
        rtl={rtl}
        disabled={disabled}
        onChange={onChange}
      />
    );
  }
  if (field.kind === "textarea") {
    return (
      <Textarea
        value={typeof value === "string" ? value : ""}
        rows={field.rows ?? 3}
        rtl={rtl}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  }
  return (
    <TextInput
      value={typeof value === "string" ? value : ""}
      rtl={rtl}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

/** `string[]` as one line per entry, with a live chip preview. */
function LinesInput({
  value,
  rtl,
  disabled,
  onChange,
}: {
  value: string[];
  rtl: boolean;
  disabled?: boolean;
  onChange: (next: string[]) => void;
}) {
  const style: CSSProperties = {
    ...(rtl ? arabicInputStyle : inputStyle),
    resize: "vertical",
    lineHeight: 1.7,
  };
  return (
    <div>
      <textarea
        className="fk-input"
        rows={Math.min(Math.max(value.length + 1, 3), 12)}
        disabled={disabled}
        value={value.join("\n")}
        placeholder="One item per line"
        onChange={(e) => onChange(e.target.value.split(/\r?\n/))}
        {...(rtl ? { dir: "rtl" as const, lang: "ar" } : {})}
        style={style}
      />
      <div style={{ fontSize: 11.5, color: "var(--ink-4)", marginTop: 5 }}>
        One item per line. {value.filter((v) => v.trim()).length} shown on the page.
      </div>
    </div>
  );
}

export function ResetButton({ onClick, disabled }: { onClick: () => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      className="fk-btn"
      onClick={onClick}
      disabled={disabled}
      style={{ ...smallButtonStyle, fontSize: 11.5, padding: "4px 10px" }}
    >
      Reset
    </button>
  );
}

export function ModifiedBadge() {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "2px 8px",
        borderRadius: 999,
        background: "var(--amber-soft)",
        color: "var(--amber)",
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: "0.01em",
      }}
    >
      Modified
    </span>
  );
}

/** The shipped copy, shown under a changed field so the editor can compare. */
export function DefaultHint({ field, rtl }: { field: FieldDef; rtl: boolean }) {
  let preview = "";
  if (field.kind === "text" || field.kind === "textarea") preview = field.default;
  else if (field.kind === "list") preview = field.default.join(" · ");
  else preview = `${field.default.length} items`;

  if (!preview) return null;
  const clipped = preview.length > 160 ? `${preview.slice(0, 160)}…` : preview;

  return (
    <div
      style={{
        fontSize: 11.5,
        color: "var(--ink-4)",
        marginTop: 6,
        unicodeBidi: "plaintext",
        textAlign: rtl ? "right" : "left",
      }}
    >
      Default: {clipped}
    </div>
  );
}
