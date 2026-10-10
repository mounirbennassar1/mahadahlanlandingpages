"use server";

import { randomInt } from "node:crypto";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { ActionError, guard, type ActionState } from "@/lib/admin/action";
import { requireActionMember } from "@/lib/team/member";
import { logAudit } from "@/lib/team/audit";
import {
  ADMIN_ROLE_ID,
  ALL_PERMISSIONS,
  baseRoleFor,
  defaultPermissions,
  isPermission,
} from "@/lib/team/permissions";

export type TeamActionState = ActionState & {
  /** A generated password, shown once to the admin who created/reset it. */
  password?: string;
  memberName?: string;
};

const PASSWORD_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";

function generatePassword(length = 12) {
  let out = "";
  for (let i = 0; i < length; i++) out += PASSWORD_ALPHABET[randomInt(PASSWORD_ALPHABET.length)];
  return out;
}

function refresh() {
  revalidatePath("/dashboard/team");
  revalidatePath("/dashboard/team/roles");
  revalidatePath("/dashboard/leads");
  revalidatePath("/dashboard");
}

/**
 * Throws unless at least one active member can still manage the team after a
 * change, so nobody can lock the clinic out of its own panel.
 */
async function assertTeamStillManaged(change: {
  userId?: string;
  deactivate?: boolean;
  remove?: boolean;
  roleId?: string;
  role?: { id: string; permissions: string[] };
}) {
  const users = await prisma.user.findMany({
    where: { active: true },
    select: { id: true, role: true, teamRoleId: true, teamRole: { select: { id: true, permissions: true } } },
  });
  const roles = new Map((await prisma.role.findMany({ select: { id: true, permissions: true } })).map((r) => [r.id, r.permissions]));
  if (change.role) roles.set(change.role.id, change.role.permissions);

  const managers = users.filter((u) => {
    if (u.id === change.userId && (change.deactivate || change.remove)) return false;
    const roleId = u.id === change.userId && change.roleId ? change.roleId : u.teamRoleId;
    const permissions = roleId ? roles.get(roleId) ?? [] : defaultPermissions(u.role);
    return permissions.includes("team.manage");
  });
  if (managers.length === 0) {
    throw new ActionError("At least one active member must keep the right to manage the team.");
  }
}

const memberSchema = z.object({
  name: z.string().trim().min(2, "Enter the member's name.").max(80),
  email: z.string().trim().toLowerCase().email("Enter a valid email."),
  phone: z.string().trim().max(30).optional().transform((v) => v || null),
  jobTitle: z.string().trim().max(60).optional().transform((v) => v || null),
  roleId: z.string().min(1, "Choose a role."),
});

function readMember(formData: FormData) {
  return memberSchema.parse({
    name: formData.get("name") ?? "",
    email: formData.get("email") ?? "",
    phone: formData.get("phone") ?? undefined,
    jobTitle: formData.get("jobTitle") ?? undefined,
    roleId: formData.get("roleId") ?? "",
  });
}

async function findRole(roleId: string) {
  const role = await prisma.role.findUnique({ where: { id: roleId } });
  if (!role) throw new ActionError("That role no longer exists.", { roleId: "Choose a role." });
  return role;
}

async function assertEmailFree(email: string, exceptId?: string) {
  const taken = await prisma.user.findFirst({
    where: { email: { equals: email, mode: "insensitive" }, ...(exceptId ? { id: { not: exceptId } } : {}) },
    select: { id: true },
  });
  if (taken) throw new ActionError("That email is already used by another member.", { email: "Already in use." });
}

export async function createMember(_prev: TeamActionState, formData: FormData): Promise<TeamActionState> {
  const result = await guard(async () => {
    const actor = await requireActionMember("team.manage");
    const data = readMember(formData);
    const role = await findRole(data.roleId);
    await assertEmailFree(data.email);

    const typed = String(formData.get("password") ?? "").trim();
    if (typed && typed.length < 8) {
      throw new ActionError("Use at least 8 characters.", { password: "At least 8 characters." });
    }
    const password = typed || generatePassword();

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        jobTitle: data.jobTitle,
        teamRoleId: role.id,
        role: baseRoleFor(role.permissions),
        passwordHash: await bcrypt.hash(password, 10),
        avatarHue: [295, 220, 155, 30, 330, 250, 120][randomInt(7)],
      },
    });
    await logAudit(actor.id, "member.created", { id: user.id, name: user.name }, { role: role.name });
    return { password, memberName: user.name };
  });
  if (!result.ok) return result.state;
  refresh();
  return { ok: true, ...result.data };
}

export async function updateMember(_prev: TeamActionState, formData: FormData): Promise<TeamActionState> {
  const result = await guard(async () => {
    const actor = await requireActionMember("team.manage");
    const id = String(formData.get("id") ?? "");
    const data = readMember(formData);
    const current = await prisma.user.findUnique({ where: { id }, include: { teamRole: true } });
    if (!current) throw new ActionError("This member no longer exists.");
    const role = await findRole(data.roleId);
    await assertEmailFree(data.email, id);

    const roleChanged = current.teamRoleId !== role.id;
    if (roleChanged) await assertTeamStillManaged({ userId: id, roleId: role.id });

    await prisma.user.update({
      where: { id },
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        jobTitle: data.jobTitle,
        teamRoleId: role.id,
        role: baseRoleFor(role.permissions),
      },
    });

    const detailsChanged =
      current.name !== data.name ||
      current.email !== data.email ||
      current.phone !== data.phone ||
      current.jobTitle !== data.jobTitle;
    if (detailsChanged) await logAudit(actor.id, "member.updated", { id, name: data.name });
    if (roleChanged) {
      await logAudit(actor.id, "member.role_changed", { id, name: data.name }, {
        from: current.teamRole?.name ?? current.role,
        to: role.name,
      });
    }
  });
  if (!result.ok) return result.state;
  refresh();
  return { ok: true };
}

export async function setMemberActive(id: string, active: boolean): Promise<TeamActionState> {
  const result = await guard(async () => {
    const actor = await requireActionMember("team.manage");
    if (id === actor.id && !active) throw new ActionError("You can't deactivate your own account.");
    const user = await prisma.user.findUnique({ where: { id }, select: { name: true } });
    if (!user) throw new ActionError("This member no longer exists.");
    if (!active) await assertTeamStillManaged({ userId: id, deactivate: true });
    await prisma.user.update({ where: { id }, data: { active } });
    await logAudit(actor.id, active ? "member.reactivated" : "member.deactivated", { id, name: user.name });
  });
  if (!result.ok) return result.state;
  refresh();
  return { ok: true };
}

export async function resetMemberPassword(id: string): Promise<TeamActionState> {
  const result = await guard(async () => {
    const actor = await requireActionMember("team.manage");
    const user = await prisma.user.findUnique({ where: { id }, select: { name: true } });
    if (!user) throw new ActionError("This member no longer exists.");
    const password = generatePassword();
    await prisma.user.update({ where: { id }, data: { passwordHash: await bcrypt.hash(password, 10) } });
    await logAudit(actor.id, "member.password_reset", { id, name: user.name });
    return { password, memberName: user.name };
  });
  if (!result.ok) return result.state;
  return { ok: true, ...result.data };
}

/**
 * Deletes a member for good. Their leads go to `moveTo` (another active
 * member) or become unassigned; their history in other tables keeps the row
 * with the author cleared (the foreign keys are ON DELETE SET NULL).
 */
export async function removeMember(id: string, moveTo: string | null): Promise<TeamActionState> {
  const result = await guard(async () => {
    const actor = await requireActionMember("team.manage");
    if (id === actor.id) throw new ActionError("You can't remove your own account.");
    if (moveTo === id) throw new ActionError("Choose someone else to take over the leads.");
    const user = await prisma.user.findUnique({ where: { id }, select: { name: true } });
    if (!user) throw new ActionError("This member no longer exists.");
    await assertTeamStillManaged({ userId: id, remove: true });

    let target: { id: string; name: string } | null = null;
    if (moveTo) {
      target = await prisma.user.findFirst({ where: { id: moveTo, active: true }, select: { id: true, name: true } });
      if (!target) throw new ActionError("The member taking over the leads isn't active.");
    }

    const moved = await prisma.$transaction(async (tx) => {
      const { count } = await tx.lead.updateMany({ where: { assigneeId: id }, data: { assigneeId: target?.id ?? null } });
      await tx.user.delete({ where: { id } });
      return count;
    });
    await logAudit(actor.id, "member.removed", { id, name: user.name }, {
      movedLeads: moved,
      movedTo: target?.name ?? null,
    });
  });
  if (!result.ok) return result.state;
  refresh();
  return { ok: true };
}

// ───────────────────────── Roles ─────────────────────────

const roleSchema = z.object({
  name: z.string().trim().min(2, "Give the role a name.").max(40),
  description: z.string().trim().max(160).optional().transform((v) => v || null),
  hue: z.coerce.number().int().min(0).max(359).catch(295),
  permissions: z.array(z.string()).transform((list) => ALL_PERMISSIONS.filter((p) => list.includes(p))),
});

function readRole(formData: FormData) {
  return roleSchema.parse({
    name: formData.get("name") ?? "",
    description: formData.get("description") ?? undefined,
    hue: formData.get("hue") ?? 295,
    permissions: formData.getAll("permissions").map(String).filter(isPermission),
  });
}

export async function saveRole(_prev: TeamActionState, formData: FormData): Promise<TeamActionState> {
  const result = await guard(async () => {
    const actor = await requireActionMember("team.manage");
    const id = String(formData.get("id") ?? "");
    const data = readRole(formData);

    const nameTaken = await prisma.role.findFirst({
      where: { name: { equals: data.name, mode: "insensitive" }, ...(id ? { id: { not: id } } : {}) },
      select: { id: true },
    });
    if (nameTaken) throw new ActionError("Another role already has that name.", { name: "Already in use." });

    if (!id) {
      const role = await prisma.role.create({ data });
      await logAudit(actor.id, "role.created", { id: role.id, name: role.name });
      return;
    }

    const current = await prisma.role.findUnique({ where: { id } });
    if (!current) throw new ActionError("This role no longer exists.");
    if (current.id === ADMIN_ROLE_ID) {
      throw new ActionError("The Administrator role always has every permission.");
    }
    if (current.system && current.name !== data.name) {
      throw new ActionError("Built-in roles keep their name.", { name: "Built-in roles can't be renamed." });
    }
    await assertTeamStillManaged({ role: { id, permissions: data.permissions } });

    await prisma.$transaction([
      prisma.role.update({ where: { id }, data }),
      // Keep the coarse enum the website panel reads in step with the role.
      prisma.user.updateMany({ where: { teamRoleId: id }, data: { role: baseRoleFor(data.permissions) } }),
    ]);
    await logAudit(actor.id, "role.updated", { id, name: data.name }, { permissions: data.permissions });
  });
  if (!result.ok) return result.state;
  refresh();
  return { ok: true };
}

export async function deleteRole(id: string): Promise<TeamActionState> {
  const result = await guard(async () => {
    const actor = await requireActionMember("team.manage");
    const role = await prisma.role.findUnique({ where: { id }, include: { _count: { select: { users: true } } } });
    if (!role) throw new ActionError("This role no longer exists.");
    if (role.system) throw new ActionError("Built-in roles can't be deleted.");
    if (role._count.users > 0) {
      throw new ActionError(`Move the ${role._count.users} member(s) with this role to another role first.`);
    }
    await prisma.role.delete({ where: { id } });
    await logAudit(actor.id, "role.deleted", { id, name: role.name });
  });
  if (!result.ok) return result.state;
  refresh();
  return { ok: true };
}
