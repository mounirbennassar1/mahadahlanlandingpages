"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";
import { initialActionState, type ActionState } from "@/lib/admin/action";
import { dangerButtonStyle, inputStyle, primaryButtonStyle, secondaryButtonStyle } from "@/app/(panel)/dashboard/_components/forms/styles";
import { FormMessage } from "@/app/(panel)/dashboard/_components/forms/form-message";
import { addOrderNote, refundOrder, syncOrder } from "../actions";

function Pending({ label, pendingLabel, style }: { label: string; pendingLabel: string; style: React.CSSProperties }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="fk-btn" disabled={pending} style={style}>
      {pending ? pendingLabel : label}
    </button>
  );
}

export function SyncButton({ orderId, disabled }: { orderId: string; disabled?: boolean }) {
  const [state, action] = useActionState(syncOrder, initialActionState);
  const router = useRouter();
  useEffect(() => {
    if (state.ok) router.refresh();
  }, [state, router]);
  return (
    <form action={action} style={{ display: "grid", gap: 8 }}>
      <input type="hidden" name="id" value={orderId} />
      <Pending label="Check with noon" pendingLabel="Checking…" style={{ ...primaryButtonStyle, justifyContent: "center", opacity: disabled ? 0.5 : 1 }} />
      {state.error && <span style={{ fontSize: 12.5, color: "var(--red)" }}>{state.error}</span>}
      {state.ok && <span style={{ fontSize: 12.5, color: "var(--green)" }}>Status refreshed from noon.</span>}
    </form>
  );
}

export function RefundForm({ orderId, remaining }: { orderId: string; remaining: number }) {
  const [state, action] = useActionState(refundOrder, initialActionState);
  // The form is "armed" for one action state; a returned result (a new state
  // object) closes it again without any effect-driven setState.
  const [armedFor, setArmedFor] = useState<ActionState | null>(null);
  const arming = armedFor === state;
  const router = useRouter();
  useEffect(() => {
    if (state.ok) router.refresh();
  }, [state, router]);

  if (!arming) {
    return (
      <div style={{ display: "grid", gap: 8 }}>
        <button type="button" className="fk-btn" onClick={() => setArmedFor(state)} style={{ ...secondaryButtonStyle, color: "var(--red)", justifyContent: "center" }}>
          Refund…
        </button>
        {state.ok && <span style={{ fontSize: 12.5, color: "var(--green)" }}>Refund sent to noon.</span>}
      </div>
    );
  }
  return (
    <form action={action} style={{ display: "grid", gap: 8 }}>
      <input type="hidden" name="id" value={orderId} />
      <label style={{ fontSize: 12.5, color: "var(--ink-3)", fontWeight: 600 }}>
        Amount (SAR), leave empty for the full {remaining.toLocaleString("en-US")}
        <input name="amount" type="number" min={1} max={remaining} step={1} placeholder={String(remaining)} className="fk-input" style={{ ...inputStyle, marginTop: 6, fontFamily: "var(--font-data)" }} />
      </label>
      <div style={{ display: "flex", gap: 8 }}>
        <Pending label="Confirm refund" pendingLabel="Refunding…" style={{ ...dangerButtonStyle, padding: "8px 14px" }} />
        <button type="button" className="fk-btn" onClick={() => setArmedFor(null)} style={secondaryButtonStyle}>
          Cancel
        </button>
      </div>
      {state.error && <span style={{ fontSize: 12.5, color: "var(--red)" }}>{state.error}</span>}
    </form>
  );
}

export function OrderNoteForm({ orderId }: { orderId: string }) {
  const [state, action] = useActionState(addOrderNote, initialActionState);
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  useEffect(() => {
    if (state.ok) {
      formRef.current?.reset();
      router.refresh();
    }
  }, [state, router]);
  return (
    <form ref={formRef} action={action} style={{ display: "grid", gap: 10 }}>
      <input type="hidden" name="id" value={orderId} />
      <FormMessage state={state} success="Note added." />
      <textarea name="body" rows={3} dir="auto" placeholder="Called the customer, booked for Sunday…" className="fk-input" style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }} />
      <div>
        <Pending label="Add note" pendingLabel="Saving…" style={secondaryButtonStyle} />
      </div>
    </form>
  );
}
