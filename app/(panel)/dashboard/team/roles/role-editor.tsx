"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Checkbox,
  Field,
  FormMessage,
  TextInput,
  primaryButtonStyle,
  secondaryButtonStyle,
} from "../../_components/forms";
import { PERMISSIONS, permissionGroups, type Permission } from "@/lib/team/permissions";
import { deleteRole, saveRole, type TeamActionState } from "../actions";
import { Dialog, DialogSubmit, submitKeepingInput } from "../_components/dialog";

export type RoleCard = {
  id: string;
  name: string;
  description: string | null;
  permissions: Permission[];
  hue: number;
  system: boolean;
  locked: boolean;
  members: number;
};

const HUES = [295, 220, 155, 30, 330, 250, 120, 60];
const initial: TeamActionState = { ok: false };

export function RolesBoard({ roles }: { roles: RoleCard[] }) {
  const [editing, setEditing] = useState<RoleCard | "new" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
        <button type="button" onClick={() => setEditing("new")} style={primaryButtonStyle}>
          New role
        </button>
      </div>
      {error && <FormMessage error={error} />}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
        {roles.map((role) => (
          <div
            key={role.id}
            style={{
              background: "var(--surface)",
              border: "1px solid var(--hairline)",
              borderTop: `4px solid oklch(0.6 0.14 ${role.hue})`,
              borderRadius: 16,
              padding: 18,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: 17, fontWeight: 700, margin: 0 }}>{role.name}</h3>
              {role.system && <span style={{ fontSize: 11, color: "var(--ink-4)", fontWeight: 600 }}>BUILT-IN</span>}
              <a
                href={`/dashboard/team`}
                style={{ marginLeft: "auto", fontSize: 12.5, color: "var(--ink-3)", fontFamily: "var(--font-data)" }}
              >
                {role.members} {role.members === 1 ? "member" : "members"}
              </a>
            </div>
            {role.description && <p style={{ fontSize: 13, color: "var(--ink-3)", margin: "6px 0 0" }}>{role.description}</p>}
            <ul style={{ listStyle: "none", padding: 0, margin: "14px 0", display: "grid", gap: 6, flex: 1 }}>
              {(Object.keys(PERMISSIONS) as Permission[]).map((p) => {
                const has = role.permissions.includes(p);
                return (
                  <li key={p} style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 13, color: has ? "var(--ink-2)" : "var(--ink-4)" }}>
                    <span style={{ width: 16, textAlign: "center", color: has ? "var(--green)" : "var(--ink-4)", fontWeight: 700 }}>
                      {has ? "✓" : "·"}
                    </span>
                    <span style={{ textDecoration: has ? "none" : "line-through" }}>{PERMISSIONS[p].label}</span>
                  </li>
                );
              })}
            </ul>
            <div style={{ display: "flex", gap: 8 }}>
              {role.locked ? (
                <span style={{ fontSize: 12, color: "var(--ink-4)" }}>Always has every permission.</span>
              ) : (
                <button type="button" onClick={() => setEditing(role)} style={secondaryButtonStyle}>
                  Edit
                </button>
              )}
              {!role.system && (
                <button
                  type="button"
                  disabled={pending}
                  onClick={() =>
                    startTransition(async () => {
                      setError(null);
                      const result = await deleteRole(role.id);
                      if (!result.ok) setError(result.error ?? "Something went wrong.");
                      router.refresh();
                    })
                  }
                  style={{ ...secondaryButtonStyle, color: "var(--red)" }}
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {editing && <RoleDialog role={editing === "new" ? null : editing} onClose={() => setEditing(null)} />}
    </>
  );
}

function RoleDialog({ role, onClose }: { role: RoleCard | null; onClose: () => void }) {
  const [state, action, pending] = useActionState(saveRole, initial);
  const [hue, setHue] = useState(role?.hue ?? HUES[0]);
  const errors = state.fieldErrors ?? {};

  useEffect(() => {
    if (state.ok) onClose();
  }, [state, onClose]);

  return (
    <Dialog
      title={role ? `Edit ${role.name}` : "New role"}
      description="Members get exactly the permissions ticked here. Changes apply on their next page load."
      onClose={onClose}
      width={560}
    >
      <form onSubmit={submitKeepingInput(action)}>
        {role && <input type="hidden" name="id" value={role.id} />}
        <input type="hidden" name="hue" value={hue} />
        <FormMessage state={state.ok ? undefined : state} />
        <Field label="Name" required error={errors.name} hint={role?.system ? "Built-in roles keep their name." : undefined}>
          <TextInput
            name="name"
            defaultValue={role?.name}
            readOnly={role?.system}
            required
            placeholder="e.g. Receptionist"
            error={errors.name}
          />
        </Field>
        <Field label="Description" error={errors.description}>
          <TextInput name="description" defaultValue={role?.description ?? ""} placeholder="What this role is for" />
        </Field>
        <Field label="Colour">
          <div style={{ display: "flex", gap: 8 }}>
            {HUES.map((h) => (
              <button
                key={h}
                type="button"
                aria-label={`Colour ${h}`}
                onClick={() => setHue(h)}
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: "50%",
                  background: `oklch(0.6 0.14 ${h})`,
                  outline: hue === h ? "2px solid var(--ink)" : "none",
                  outlineOffset: 2,
                }}
              />
            ))}
          </div>
        </Field>
        {permissionGroups().map(({ group, keys }) => (
          <div key={group}>
            <div style={{ fontSize: 11.5, fontWeight: 700, color: "var(--ink-4)", textTransform: "uppercase", letterSpacing: "0.08em", margin: "6px 0 8px" }}>
              {group}
            </div>
            {keys.map((p) => (
              <Checkbox
                key={p}
                name="permissions"
                value={p}
                label={PERMISSIONS[p].label}
                description={PERMISSIONS[p].hint}
                defaultChecked={role?.permissions.includes(p)}
              />
            ))}
          </div>
        ))}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 6 }}>
          <button type="button" onClick={onClose} style={secondaryButtonStyle}>
            Cancel
          </button>
          <DialogSubmit pending={pending} label={role ? "Save role" : "Create role"} pendingLabel="Saving…" />
        </div>
      </form>
    </Dialog>
  );
}
