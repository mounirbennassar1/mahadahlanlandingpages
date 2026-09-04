"use client";

import { useActionState, useEffect, useRef } from "react";
import { initialActionState } from "@/lib/admin/action";
import { FormMessage, SubmitButton, Textarea } from "@/app/(panel)/dashboard/_components/forms";
import { addLeadNote } from "../actions";

/** Note composer on the lead detail page. Any signed-in role may write one. */
export function NoteForm({ leadId }: { leadId: string }) {
  const [state, action] = useActionState(addLeadNote, initialActionState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok) formRef.current?.reset();
  }, [state.ok]);

  return (
    <form ref={formRef} action={action}>
      <input type="hidden" name="leadId" value={leadId} />
      {state.error && <FormMessage state={state} />}
      <Textarea
        name="body"
        rows={3}
        rtl
        required
        placeholder="Add a note about this lead…"
        aria-label="Note"
      />
      <div style={{ marginTop: 10 }}>
        <SubmitButton pendingLabel="Adding…">Add note</SubmitButton>
      </div>
    </form>
  );
}
