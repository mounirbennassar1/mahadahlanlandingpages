import type { ActionState } from "@/lib/admin/action";

/** Success / error banner for `useActionState` results (or explicit text). */
export function FormMessage({
  state,
  success = "Saved.",
  error,
  info,
}: {
  state?: ActionState;
  success?: React.ReactNode;
  error?: React.ReactNode;
  info?: React.ReactNode;
}) {
  const isError = Boolean(error ?? state?.error);
  const isSuccess = !isError && Boolean(state?.ok);
  const isInfo = !isError && !isSuccess && Boolean(info);
  if (!isError && !isSuccess && !isInfo) return null;

  const tone = isError
    ? { bg: "var(--red-soft)", fg: "var(--red)", border: "oklch(0.9 0.05 25)" }
    : isSuccess
      ? { bg: "var(--green-soft)", fg: "var(--green)", border: "oklch(0.9 0.05 155)" }
      : { bg: "var(--primary-softer)", fg: "var(--primary)", border: "var(--primary-soft)" };

  return (
    <div
      role={isError ? "alert" : "status"}
      style={{
        background: tone.bg,
        color: tone.fg,
        border: `1px solid ${tone.border}`,
        padding: "10px 14px",
        borderRadius: 10,
        fontSize: 13.5,
        fontWeight: 500,
        marginBottom: 18,
      }}
    >
      {isError ? (error ?? state?.error) : isSuccess ? success : info}
    </div>
  );
}
