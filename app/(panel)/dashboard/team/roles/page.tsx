import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requirePageMember } from "@/lib/team/member";
import { ADMIN_ROLE_ID, isPermission } from "@/lib/team/permissions";
import { RolesBoard } from "./role-editor";

export const dynamic = "force-dynamic";

export default async function RolesPage() {
  await requirePageMember("team.manage", "/dashboard/team");

  const roles = await prisma.role.findMany({
    orderBy: [{ system: "desc" }, { createdAt: "asc" }],
    include: { _count: { select: { users: true } } },
  });

  return (
    <>
      <div style={{ marginBottom: 20 }}>
        <Link href="/dashboard/team" style={{ fontSize: 13, color: "var(--ink-3)" }}>
          ← Team
        </Link>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: 30, fontWeight: 700, letterSpacing: "-0.025em", margin: "6px 0 0" }}>
          Roles &amp; permissions
        </h1>
        <div style={{ fontSize: 14, color: "var(--ink-3)", marginTop: 6, maxWidth: 640 }}>
          A role is a named set of permissions. Give each member one on the Team page. Create roles for your own
          classifications, e.g. a receptionist who only sees the leads assigned to them.
        </div>
      </div>
      <RolesBoard
        roles={roles.map((r) => ({
          id: r.id,
          name: r.name,
          description: r.description,
          permissions: r.permissions.filter(isPermission),
          hue: r.hue,
          system: r.system,
          locked: r.id === ADMIN_ROLE_ID,
          members: r._count.users,
        }))}
      />
    </>
  );
}
