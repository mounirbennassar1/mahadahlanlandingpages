"use client";

import { useFormStatus } from "react-dom";
import { primaryButtonStyle, secondaryButtonStyle } from "./styles";

export function SubmitButton({
  children = "Save",
  pendingLabel = "Saving…",
  variant = "primary",
  disabled,
  style,
}: {
  children?: React.ReactNode;
  pendingLabel?: React.ReactNode;
  variant?: "primary" | "secondary";
  disabled?: boolean;
  style?: React.CSSProperties;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className="fk-btn"
      disabled={pending || disabled}
      style={{ ...(variant === "primary" ? primaryButtonStyle : secondaryButtonStyle), ...style }}
    >
      {pending ? pendingLabel : children}
    </button>
  );
}
