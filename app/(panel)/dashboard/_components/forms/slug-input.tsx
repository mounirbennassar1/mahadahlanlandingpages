"use client";

import { useEffect, useRef, useState } from "react";
import { slugify } from "@/lib/admin/slugify";
import { inputStyle } from "./styles";

/**
 * Slug field that mirrors another input (`from`, default "title") through
 * `slugify()` until the user types their own value. Existing slugs (edit
 * pages) are left alone unless cleared.
 */
export function SlugInput({
  name = "slug",
  from = "title",
  defaultValue,
  error,
  disabled,
  id,
  prefix,
}: {
  name?: string;
  from?: string;
  defaultValue?: string | null;
  error?: string;
  disabled?: boolean;
  id?: string;
  /** Visual hint of the public path, e.g. "/news-articles/". */
  prefix?: string;
}) {
  const [value, setValue] = useState(defaultValue ?? "");
  const [touched, setTouched] = useState(Boolean(defaultValue));
  const ref = useRef<HTMLInputElement>(null);

  // Mirror the source field until the user types their own slug.
  useEffect(() => {
    if (touched) return;
    const source = ref.current?.form?.elements.namedItem(from);
    if (!(source instanceof HTMLInputElement)) return;
    const onInput = () => setValue(slugify(source.value));
    source.addEventListener("input", onInput);
    return () => source.removeEventListener("input", onInput);
  }, [from, touched]);

  return (
    <div>
      <div
        className="fk-input"
        aria-invalid={error ? true : undefined}
        style={{ ...inputStyle, display: "flex", alignItems: "center", gap: 4, padding: "0 0 0 14px" }}
      >
        {prefix && (
          <span style={{ color: "var(--ink-4)", fontFamily: "var(--font-data)", fontSize: 12.5, whiteSpace: "nowrap" }}>
            {prefix}
          </span>
        )}
        <input
          ref={ref}
          id={id}
          name={name}
          value={value}
          disabled={disabled}
          dir="auto"
          spellCheck={false}
          onChange={(e) => {
            setValue(e.target.value);
            setTouched(e.target.value !== "");
          }}
          placeholder="auto"
          style={{
            flex: 1,
            minWidth: 0,
            border: "none",
            outline: "none",
            background: "transparent",
            padding: "10px 14px 10px 0",
            fontSize: 13.5,
            fontFamily: "var(--font-data)",
            color: "var(--ink)",
          }}
        />
        {touched && !disabled && (
          <button
            type="button"
            onClick={() => {
              setTouched(false);
              const source = ref.current?.form?.elements.namedItem(from);
              setValue(source instanceof HTMLInputElement ? slugify(source.value) : "");
            }}
            title="Regenerate from title"
            style={{ color: "var(--ink-4)", fontSize: 11.5, fontWeight: 600, padding: "0 12px", whiteSpace: "nowrap" }}
          >
            auto
          </button>
        )}
      </div>
    </div>
  );
}
