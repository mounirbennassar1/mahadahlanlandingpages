"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { FormMessage, Select, dangerButtonStyle, primaryButtonStyle, secondaryButtonStyle } from "../../_components/forms";
import { removeMember, resetMemberPassword, setMemberActive, type TeamActionState } from "../actions";
import { Dialog, PasswordReveal } from "./dialog";
import { MemberDialog, type MemberDraft, type RoleOption } from "./member-dialog";

export type MemberRow = MemberDraft & {
  avatarHue: number;
  active: boolean;
  roleName: string;
  roleHue: number;
  leads: number;
  lastLoginAt: string | null;
};

type Modal =
  | { kind: "add" }
  | { kind: "edit"; member: MemberRow }
  | { kind: "remove"; member: MemberRow }
  | { kind: "password"; name: string; email: string; password: string }
  | null;

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase() || "·";
}

function lastSeen(iso: string | null) {
  if (!iso) return "Never signed in";
  const date = new Date(iso);
  return `Last sign-in ${date.toLocaleDateString("en-CA", { timeZone: "Asia/Riyadh" })}`;
}

export function TeamBoard({
  members,
  roles,
  meId,
  canManage,
}: {
  members: MemberRow[];
  roles: (RoleOption & { hue: number })[];
  meId: string;
  canManage: boolean;
}) {
  const [modal, setModal] = useState<Modal>(null);
  const [status, setStatus] = useState<"active" | "inactive" | "all">("active");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [query, setQuery] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  const q = query.trim().toLowerCase();
  const visible = members.filter(
    (m) =>
      (status === "all" || (status === "active") === m.active) &&
      (roleFilter === "all" || m.roleId === roleFilter) &&
      (!q || m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q)),
  );
  const activeCount = members.filter((m) => m.active).length;

  function run(fn: () => Promise<TeamActionState>, after?: (s: TeamActionState) => void) {
    setError(null);
    startTransition(async () => {
      const result = await fn();
      if (!result.ok) setError(result.error ?? "Something went wrong.");
      else after?.(result);
      router.refresh();
    });
  }

  return (
    <>
      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--hairline)",
          borderRadius: "var(--radius)",
          overflow: "hidden",
        }}
      >
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10, padding: "16px 20px", borderBottom: "1px solid var(--hairline)" }}>
          <Tabs
            value={status}
            onChange={setStatus}
            options={[
              { value: "active", label: `Active (${activeCount})` },
              { value: "inactive", label: `Deactivated (${members.length - activeCount})` },
              { value: "all", label: `All (${members.length})` },
            ]}
          />
          <Select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            options={[{ value: "all", label: "Every role" }, ...roles.map((r) => ({ value: r.id, label: r.name }))]}
            style={{ width: 170, padding: "8px 10px", fontSize: 13 }}
            aria-label="Filter by role"
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name or email…"
            className="fk-input"
            style={{ flex: "1 1 200px", maxWidth: 280, padding: "8px 12px", borderRadius: 10, border: "1px solid var(--hairline)", background: "var(--surface-2)", fontSize: 13 }}
          />
          {canManage && (
            <button type="button" onClick={() => setModal({ kind: "add" })} style={{ ...primaryButtonStyle, marginLeft: "auto" }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Add member
            </button>
          )}
        </div>

        {error && (
          <div style={{ padding: "12px 20px 0" }}>
            <FormMessage error={error} />
          </div>
        )}

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, fontSize: 14 }}>
            <thead>
              <tr>
                <Th>Member</Th>
                <Th>Role</Th>
                <Th>Leads</Th>
                <Th>Status</Th>
                {canManage && <Th align="right">Actions</Th>}
              </tr>
            </thead>
            <tbody>
              {visible.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ padding: 36, textAlign: "center", color: "var(--ink-3)" }}>
                    No members match.
                  </td>
                </tr>
              )}
              {visible.map((m) => (
                <tr key={m.id} style={{ opacity: m.active ? 1 : 0.6 }}>
                  <Td>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div
                        style={{
                          width: 38,
                          height: 38,
                          flex: "none",
                          borderRadius: "50%",
                          color: "#fff",
                          fontWeight: 700,
                          fontSize: 13,
                          display: "grid",
                          placeItems: "center",
                          fontFamily: "var(--font-display)",
                          background: `linear-gradient(135deg, oklch(0.72 0.12 ${m.avatarHue}), oklch(0.5 0.15 ${m.avatarHue}))`,
                        }}
                      >
                        {initials(m.name)}
                      </div>
                      <div style={{ minWidth: 0, lineHeight: 1.3 }}>
                        <div style={{ fontWeight: 600, color: "var(--ink)" }}>
                          {m.name}
                          {m.id === meId && <span style={{ fontSize: 11.5, color: "var(--ink-4)", fontWeight: 500 }}> · you</span>}
                        </div>
                        <div style={{ fontSize: 12.5, color: "var(--ink-3)" }}>
                          {m.email}
                          {m.jobTitle ? ` · ${m.jobTitle}` : ""}
                        </div>
                        <div style={{ fontSize: 11.5, color: "var(--ink-4)" }}>{lastSeen(m.lastLoginAt)}</div>
                      </div>
                    </div>
                  </Td>
                  <Td>
                    <span
                      style={{
                        fontSize: 12,
                        padding: "4px 10px",
                        borderRadius: 999,
                        fontWeight: 600,
                        background: `oklch(0.95 0.03 ${m.roleHue})`,
                        color: `oklch(0.45 0.14 ${m.roleHue})`,
                      }}
                    >
                      {m.roleName}
                    </span>
                  </Td>
                  <Td>
                    <a href={`/dashboard/leads?assignee=${m.id}`} style={{ fontFamily: "var(--font-data)", color: "var(--ink-2)" }}>
                      {m.leads.toLocaleString("en-US")}
                    </a>
                  </Td>
                  <Td>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12.5, color: m.active ? "var(--green)" : "var(--ink-3)" }}>
                      <span style={{ width: 7, height: 7, borderRadius: "50%", background: m.active ? "var(--green)" : "var(--slate)" }} />
                      <Swap on={m.active} yes="Active" no="Deactivated" />
                    </span>
                  </Td>
                  {canManage && (
                    <Td align="right">
                      <div style={{ display: "inline-flex", gap: 6, flexWrap: "wrap", justifyContent: "flex-end" }}>
                        <button type="button" disabled={pending} onClick={() => setModal({ kind: "edit", member: m })} style={rowButton}>
                          Edit
                        </button>
                        <button
                          type="button"
                          disabled={pending}
                          onClick={() =>
                            run(
                              () => resetMemberPassword(m.id),
                              (s) => s.password && setModal({ kind: "password", name: m.name, email: m.email, password: s.password }),
                            )
                          }
                          style={rowButton}
                        >
                          Reset password
                        </button>
                        {m.id !== meId && (
                          <button type="button" disabled={pending} onClick={() => run(() => setMemberActive(m.id, !m.active))} style={rowButton}>
                            <Swap on={m.active} yes="Deactivate" no="Reactivate" />
                          </button>
                        )}
                        {m.id !== meId && (
                          <button
                            type="button"
                            disabled={pending}
                            onClick={() => setModal({ kind: "remove", member: m })}
                            style={{ ...rowButton, color: "var(--red)" }}
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </Td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modal?.kind === "add" && <MemberDialog member={null} roles={roles} onClose={() => setModal(null)} />}
      {modal?.kind === "edit" && <MemberDialog member={modal.member} roles={roles} onClose={() => setModal(null)} />}
      {modal?.kind === "password" && (
        <Dialog title="New password" onClose={() => setModal(null)}>
          <PasswordReveal name={modal.name} email={modal.email} password={modal.password} />
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 20 }}>
            <button type="button" onClick={() => setModal(null)} style={secondaryButtonStyle}>
              Done
            </button>
          </div>
        </Dialog>
      )}
      {modal?.kind === "remove" && (
        <RemoveDialog
          member={modal.member}
          others={members.filter((o) => o.active && o.id !== modal.member.id)}
          onClose={() => setModal(null)}
        />
      )}
    </>
  );
}

function RemoveDialog({ member, others, onClose }: { member: MemberRow; others: MemberRow[]; onClose: () => void }) {
  const [moveTo, setMoveTo] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <Dialog
      title={`Remove ${member.name}?`}
      description="This deletes their account for good. To keep their history and just block sign-in, deactivate them instead."
      onClose={onClose}
    >
      <FormMessage error={error ?? undefined} />
      {member.leads > 0 ? (
        <div style={{ marginBottom: 18 }}>
          <label style={{ fontSize: 12.5, color: "var(--ink-3)", fontWeight: 600, display: "block", marginBottom: 6 }}>
            Who takes over their {member.leads.toLocaleString("en-US")} leads?
          </label>
          <Select
            value={moveTo}
            onChange={(e) => setMoveTo(e.target.value)}
            options={[{ value: "", label: "Nobody (leave unassigned)" }, ...others.map((o) => ({ value: o.id, label: o.name }))]}
          />
        </div>
      ) : (
        <p style={{ fontSize: 13.5, color: "var(--ink-2)", margin: "0 0 18px" }}>They have no assigned leads.</p>
      )}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
        <button type="button" onClick={onClose} style={secondaryButtonStyle}>
          Cancel
        </button>
        <button
          type="button"
          disabled={pending}
          onClick={() =>
            startTransition(async () => {
              const result = await removeMember(member.id, moveTo || null);
              if (!result.ok) {
                setError(result.error ?? "Something went wrong.");
                return;
              }
              router.refresh();
              onClose();
            })
          }
          style={{ ...dangerButtonStyle, padding: "10px 16px", fontSize: 13.5, fontWeight: 600 }}
        >
          <Swap on={pending} yes="Removing…" no="Remove member" />
        </button>
      </div>
    </Dialog>
  );
}

function Tabs<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
}) {
  return (
    <div style={{ display: "inline-flex", padding: 3, borderRadius: 10, background: "var(--surface-2)", border: "1px solid var(--hairline)" }}>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          style={{
            padding: "6px 12px",
            borderRadius: 8,
            fontSize: 12.5,
            fontWeight: 600,
            background: value === o.value ? "var(--surface)" : "transparent",
            color: value === o.value ? "var(--ink)" : "var(--ink-3)",
            boxShadow: value === o.value ? "var(--shadow)" : "none",
          }}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/**
 * Both labels stay mounted and CSS picks one: translation extensions rewrap
 * text nodes, and React crashes when it swaps a text node they replaced.
 */
function Swap({ on, yes, no }: { on: boolean; yes: string; no: string }) {
  return (
    <>
      <span style={{ display: on ? "inline" : "none" }}>{yes}</span>
      <span style={{ display: on ? "none" : "inline" }}>{no}</span>
    </>
  );
}

const rowButton: React.CSSProperties = {
  padding: "5px 10px",
  borderRadius: 8,
  border: "1px solid var(--hairline)",
  background: "var(--surface)",
  fontSize: 12,
  fontWeight: 500,
  color: "var(--ink-2)",
  whiteSpace: "nowrap",
};

function Th({ children, align = "left" }: { children: React.ReactNode; align?: "left" | "right" }) {
  return (
    <th
      style={{
        textAlign: align,
        padding: "11px 16px",
        fontSize: 11.5,
        fontWeight: 600,
        color: "var(--ink-3)",
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        background: "var(--surface-2)",
        borderBottom: "1px solid var(--hairline)",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </th>
  );
}

function Td({ children, align = "left" }: { children: React.ReactNode; align?: "left" | "right" }) {
  return (
    <td style={{ padding: "13px 16px", borderBottom: "1px solid var(--hairline)", verticalAlign: "middle", textAlign: align }}>
      {children}
    </td>
  );
}
