"use client";

import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { initialActionState, type ActionState } from "@/lib/admin/action";
import { dangerButtonStyle, smallButtonStyle } from "./styles";

type DeleteAction = (prev: ActionState, formData: FormData) => Promise<ActionState>;

function ConfirmButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="fk-btn" disabled={pending} style={{ ...dangerButtonStyle, padding: "6px 12px" }}>
      {pending ? "Deleting…" : label}
    </button>
  );
}

/**
 * Two-step inline delete (no window.confirm). Posts `id` to `action`; on
 * success the list re-renders via revalidatePath, or navigates to `redirectTo`.
 */
export function DeleteButton({
  action,
  id,
  label = "Delete",
  confirmLabel = "Yes, delete",
  warning,
  redirectTo,
}: {
  action: DeleteAction;
  id: string;
  label?: string;
  confirmLabel?: string;
  /** Shown while confirming, e.g. "3 articles will lose their category." */
  warning?: React.ReactNode;
  redirectTo?: string;
}) {
  const [state, formAction] = useActionState(action, initialActionState);
  const [arming, setArming] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (state.ok && redirectTo) router.push(redirectTo);
  }, [state, redirectTo, router]);

  if (!arming) {
    return (
      <button
        type="button"
        className="fk-btn"
        onClick={() => setArming(true)}
        style={{ ...smallButtonStyle, color: "var(--red)" }}
      >
        {label}
      </button>
    );
  }

  return (
    <form action={formAction} style={{ display: "inline-flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
      <input type="hidden" name="id" value={id} />
      {warning && <span style={{ fontSize: 12, color: "var(--amber)", fontWeight: 600 }}>{warning}</span>}
      <ConfirmButton label={confirmLabel} />
      <button type="button" className="fk-btn" onClick={() => setArming(false)} style={{ ...smallButtonStyle }}>
        Cancel
      </button>
      {state.error && <span style={{ fontSize: 12, color: "var(--red)" }}>{state.error}</span>}
    </form>
  );
}
