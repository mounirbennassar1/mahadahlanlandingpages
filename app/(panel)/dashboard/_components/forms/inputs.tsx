import { arabicInputStyle, inputStyle } from "./styles";

type Common = {
  error?: string;
  /** Arabic content field: sets dir="rtl" lang="ar" and the Arabic font. */
  rtl?: boolean;
};

function baseProps(error?: string, rtl?: boolean) {
  return {
    className: "fk-input",
    "aria-invalid": error ? true : undefined,
    ...(rtl ? { dir: "rtl" as const, lang: "ar" } : {}),
  };
}

export function TextInput({
  error,
  rtl,
  style,
  ...props
}: Common & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      type="text"
      {...baseProps(error, rtl)}
      {...props}
      style={{ ...(rtl ? arabicInputStyle : inputStyle), ...style }}
    />
  );
}

export function Textarea({
  error,
  rtl,
  style,
  rows = 4,
  ...props
}: Common & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      rows={rows}
      {...baseProps(error, rtl)}
      {...props}
      style={{ ...(rtl ? arabicInputStyle : inputStyle), resize: "vertical", lineHeight: 1.6, ...style }}
    />
  );
}

export type SelectOption = { value: string; label: string; disabled?: boolean };

export function Select({
  error,
  rtl,
  style,
  options,
  placeholder,
  ...props
}: Common & { options: SelectOption[]; placeholder?: string } & React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...baseProps(error, rtl)}
      {...props}
      style={{ ...(rtl ? arabicInputStyle : inputStyle), appearance: "auto", cursor: "pointer", ...style }}
    >
      {placeholder !== undefined && <option value="">{placeholder}</option>}
      {options.map((o) => (
        <option key={o.value} value={o.value} disabled={o.disabled}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

export function NumberInput({
  error,
  style,
  ...props
}: { error?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      type="number"
      inputMode="numeric"
      {...baseProps(error)}
      {...props}
      style={{ ...inputStyle, fontFamily: "var(--font-data)", fontVariantNumeric: "tabular-nums", ...style }}
    />
  );
}

/** Plain checkbox styled as a toggle row; uncontrolled so form reset works. */
export function Checkbox({
  name,
  label,
  description,
  defaultChecked,
  disabled,
}: {
  name: string;
  label: React.ReactNode;
  description?: React.ReactNode;
  defaultChecked?: boolean;
  disabled?: boolean;
}) {
  return (
    <label
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 10,
        padding: "10px 12px",
        borderRadius: 10,
        border: "1px solid var(--hairline)",
        background: "var(--surface-2)",
        cursor: disabled ? "default" : "pointer",
        marginBottom: 12,
      }}
    >
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        disabled={disabled}
        style={{ width: 16, height: 16, marginTop: 2, accentColor: "var(--primary)", flex: "none" }}
      />
      <span style={{ minWidth: 0 }}>
        <span style={{ display: "block", fontSize: 13.5, fontWeight: 600, color: "var(--ink)" }}>{label}</span>
        {description && (
          <span style={{ display: "block", fontSize: 12, color: "var(--ink-3)", marginTop: 2 }}>{description}</span>
        )}
      </span>
    </label>
  );
}
