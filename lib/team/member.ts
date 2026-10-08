import { cache } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ActionError } from "@/lib/admin/action";
import { defaultPermissions, isPermission, type Permission } from "./permissions";

export type Member = {
  id: string;
  name: string;
  email: string;
  avatarHue: number;
  roleName: string;
  permissions: Permission[];
};

/**
 * The signed-in member, read from the database on every request.
 *
 * Sessions are JWTs, so the token alone would keep a deactivated member signed
 * in and keep stale permissions after a role change. Everything that gates
 * access goes through here instead of `session.user.role`.
 */
export const getMember = cache(async (): Promise<Member | null> => {
  const session = await auth();
  const id = session?.user?.id;
  if (!id) return null;

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      avatarHue: true,
      active: true,
      role: true,
      teamRole: { select: { name: true, permissions: true } },
    },
  });
  if (!user || !user.active) return null;

  const permissions = user.teamRole
    ? user.teamRole.permissions.filter(isPermission)
    : defaultPermissions(user.role);

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    avatarHue: user.avatarHue,
    roleName: user.teamRole?.name ?? user.role,
    permissions,
  };
});

export function can(member: Member | null, permission: Permission) {
  return Boolean(member?.permissions.includes(permission));
}

/** For pages: signed-out or deactivated members are sent to sign out. */
export async function requirePageMember(permission?: Permission, fallback = "/dashboard") {
  const member = await getMember();
  if (!member) redirect("/logout");
  if (permission && !can(member, permission)) redirect(fallback);
  return member;
}

/** For server actions: throws an `ActionError` the form can show. */
export async function requireActionMember(permission?: Permission) {
  const member = await getMember();
  if (!member) throw new ActionError("Your session has expired. Please sign in again.");
  if (permission && !can(member, permission)) {
    throw new ActionError("Your role doesn't allow this. Ask an administrator.");
  }
  return member;
}
