import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export type AuditAction =
  | "member.created"
  | "member.updated"
  | "member.role_changed"
  | "member.deactivated"
  | "member.reactivated"
  | "member.password_reset"
  | "member.removed"
  | "role.created"
  | "role.updated"
  | "role.deleted"
  | "leads.exported";

/**
 * Records who did what. Never throws: losing a log line must not fail the
 * change the user just made.
 */
export async function logAudit(
  actorId: string | null,
  action: AuditAction,
  target: { id?: string; name?: string } = {},
  meta?: Prisma.InputJsonObject,
) {
  try {
    await prisma.auditEvent.create({
      data: { actorId, action, targetId: target.id, targetName: target.name, meta },
    });
  } catch (err) {
    console.error("[audit]", action, err);
  }
}

/** One readable line per event for the team activity feed. */
export function describeAudit(event: {
  action: string;
  targetName: string | null;
  meta: Prisma.JsonValue;
}): string {
  const meta = (event.meta && typeof event.meta === "object" && !Array.isArray(event.meta)
    ? event.meta
    : {}) as Record<string, unknown>;
  const who = event.targetName ?? "a member";
  switch (event.action) {
    case "member.created":
      return `added ${who}${meta.role ? ` as ${meta.role}` : ""}`;
    case "member.updated":
      return `edited ${who}'s details`;
    case "member.role_changed":
      return `changed ${who}'s role${meta.from ? ` from ${meta.from}` : ""}${meta.to ? ` to ${meta.to}` : ""}`;
    case "member.deactivated":
      return `deactivated ${who}`;
    case "member.reactivated":
      return `reactivated ${who}`;
    case "member.password_reset":
      return `reset ${who}'s password`;
    case "member.removed":
      return `removed ${who}${typeof meta.movedLeads === "number" && meta.movedLeads > 0 ? ` (${meta.movedLeads} leads moved to ${meta.movedTo ?? "unassigned"})` : ""}`;
    case "role.created":
      return `created the role ${who}`;
    case "role.updated":
      return `edited the role ${who}`;
    case "role.deleted":
      return `deleted the role ${who}`;
    case "leads.exported":
      return `exported ${typeof meta.count === "number" ? meta.count.toLocaleString("en-US") : ""} leads as ${String(meta.format ?? "").toUpperCase()}`;
    default:
      return event.action;
  }
}
