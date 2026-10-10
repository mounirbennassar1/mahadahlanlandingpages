"use client";

import { useActionState, useEffect, useState } from "react";
import { Field, FormMessage, Select, TextInput, secondaryButtonStyle } from "../../_components/forms";
import { createMember, updateMember, type TeamActionState } from "../actions";
import { Dialog, DialogSubmit, PasswordReveal, submitKeepingInput } from "./dialog";

export type RoleOption = { id: string; name: string; description: string | null };

export type MemberDraft = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  jobTitle: string | null;
  roleId: string | null;
};

const initial: TeamActionState = { ok: false };

export function MemberDialog({
  member,
  roles,
  onClose,
}: {
  /** Null to add a new member. */
  member: MemberDraft | null;
  roles: RoleOption[];
  onClose: () => void;
}) {
  const isNew = !member;
  const [state, action, pending] = useActionState(isNew ? createMember : updateMember, initial);
  const [roleId, setRoleId] = useState(member?.roleId ?? roles.find((r) => r.name === "Sales")?.id ?? "");
  const [email, setEmail] = useState(member?.email ?? "");
  const role = roles.find((r) => r.id === roleId);
  const errors = state.fieldErrors ?? {};

  // An edit has nothing to show once saved: the page already re-rendered.
  useEffect(() => {
    if (!isNew && state.ok) onClose();
  }, [isNew, state, onClose]);

  if (isNew && state.ok && state.password) {
    return (
      <Dialog title="Member added" onClose={onClose}>
        <PasswordReveal name={state.memberName ?? "the new member"} email={email} password={state.password} />
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 20 }}>
          <button type="button" onClick={onClose} style={secondaryButtonStyle}>
            Done
          </button>
        </div>
      </Dialog>
    );
  }
  return (
    <Dialog
      title={isNew ? "Add a team member" : `Edit ${member.name}`}
      description={isNew ? "They sign in at portal.mahadahlan.com with their email and the password below." : undefined}
      onClose={onClose}
    >
      <form onSubmit={submitKeepingInput(action)}>
        {member && <input type="hidden" name="id" value={member.id} />}
        <FormMessage state={state.ok ? undefined : state} />
        <Field label="Full name" required error={errors.name}>
          <TextInput name="name" defaultValue={member?.name} required autoFocus error={errors.name} />
        </Field>
        <Field label="Email" required error={errors.email}>
          <TextInput
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            error={errors.email}
          />
        </Field>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Field label="Phone" error={errors.phone}>
            <TextInput name="phone" defaultValue={member?.phone ?? ""} inputMode="tel" error={errors.phone} />
          </Field>
          <Field label="Job title" error={errors.jobTitle}>
            <TextInput name="jobTitle" defaultValue={member?.jobTitle ?? ""} placeholder="e.g. Receptionist" error={errors.jobTitle} />
          </Field>
        </div>
        <Field label="Role" required error={errors.roleId} hint={role?.description ?? undefined}>
          <Select
            name="roleId"
            value={roleId}
            onChange={(e) => setRoleId(e.target.value)}
            options={roles.map((r) => ({ value: r.id, label: r.name }))}
            placeholder="Choose a role"
            required
            error={errors.roleId}
          />
        </Field>
        {isNew && (
          <Field label="Password" error={errors.password} hint="Leave empty to generate a strong one. At least 8 characters.">
            <TextInput name="password" type="text" autoComplete="new-password" error={errors.password} />
          </Field>
        )}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 6 }}>
          <button type="button" onClick={onClose} style={secondaryButtonStyle}>
            Cancel
          </button>
          <DialogSubmit
            pending={pending}
            label={isNew ? "Add member" : "Save changes"}
            pendingLabel={isNew ? "Adding…" : "Saving…"}
          />
        </div>
      </form>
    </Dialog>
  );
}
