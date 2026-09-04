"use client";

import type { ItemsField } from "@/lib/pages/define";
import { Field } from "@/app/(panel)/dashboard/_components/forms";
import { smallButtonStyle } from "@/app/(panel)/dashboard/_components/forms/styles";
import { ScalarInput } from "./field-inputs";

type Row = Record<string, unknown>;

/**
 * Repeated content rows (cards, FAQ, testimonials). A `fixed` list keeps its
 * row count because page code zips it with icons or images by index; only the
 * text of each row can change there.
 */
export function ItemsEditor({
  field,
  value,
  rtl,
  disabled,
  onChange,
}: {
  field: ItemsField;
  value: Row[];
  rtl: boolean;
  disabled?: boolean;
  onChange: (next: Row[]) => void;
}) {
  const rows = Array.isArray(value) ? value : [];
  const keys = Object.entries(field.itemFields);
  const canAdd = !field.fixed && rows.length < (field.maxItems ?? 50);

  function patch(index: number, key: string, next: unknown) {
    onChange(rows.map((row, i) => (i === index ? { ...row, [key]: next } : row)));
  }

  function move(index: number, delta: number) {
    const target = index + delta;
    if (target < 0 || target >= rows.length) return;
    const next = [...rows];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  }

  function add() {
    const blank: Row = {};
    for (const [key, def] of keys) blank[key] = def.kind === "list" ? [] : "";
    onChange([...rows, blank]);
  }

  function caption(row: Row, index: number) {
    const first = keys.find(([, def]) => def.kind !== "list");
    const raw = first ? row[first[0]] : undefined;
    const label = typeof raw === "string" && raw.trim() ? raw.trim() : `Item ${index + 1}`;
    return label.length > 60 ? `${label.slice(0, 60)}…` : label;
  }

  return (
    <div style={{ display: "grid", gap: 12 }}>
      {rows.map((row, index) => (
        <div
          key={index}
          style={{
            border: "1px solid var(--hairline)",
            borderRadius: 12,
            background: "var(--surface-2)",
            padding: 14,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 10,
              marginBottom: 10,
            }}
          >
            <div
              style={{
                fontSize: 12.5,
                fontWeight: 700,
                color: "var(--ink-2)",
                minWidth: 0,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                unicodeBidi: "plaintext",
              }}
            >
              {index + 1}. {caption(row, index)}
            </div>
            {!disabled && (
              <div style={{ display: "flex", gap: 6, flex: "none" }}>
                <button
                  type="button"
                  className="fk-btn"
                  title="Move up"
                  onClick={() => move(index, -1)}
                  disabled={index === 0}
                  style={{ ...smallButtonStyle, padding: "4px 9px" }}
                >
                  ↑
                </button>
                <button
                  type="button"
                  className="fk-btn"
                  title="Move down"
                  onClick={() => move(index, 1)}
                  disabled={index === rows.length - 1}
                  style={{ ...smallButtonStyle, padding: "4px 9px" }}
                >
                  ↓
                </button>
                {!field.fixed && (
                  <button
                    type="button"
                    className="fk-btn"
                    onClick={() => onChange(rows.filter((_, i) => i !== index))}
                    style={{
                      ...smallButtonStyle,
                      padding: "4px 10px",
                      color: "var(--red)",
                      background: "var(--red-soft)",
                      borderColor: "oklch(0.88 0.05 25)",
                    }}
                  >
                    Remove
                  </button>
                )}
              </div>
            )}
          </div>

          {keys.map(([key, def]) => (
            <Field key={key} label={def.label} style={{ marginBottom: 12 }}>
              <ScalarInput
                field={def}
                value={(row[key] ?? (def.kind === "list" ? [] : "")) as string | string[]}
                rtl={rtl}
                disabled={disabled}
                onChange={(next) => patch(index, key, next)}
              />
            </Field>
          ))}
        </div>
      ))}

      {canAdd && !disabled && (
        <div>
          <button type="button" className="fk-btn" onClick={add} style={smallButtonStyle}>
            + Add item
          </button>
        </div>
      )}
      {field.fixed && (
        <div style={{ fontSize: 11.5, color: "var(--ink-4)" }}>
          This list has a fixed number of items because each one is paired with an icon or image in
          the page design. You can change the text of each.
        </div>
      )}
    </div>
  );
}
