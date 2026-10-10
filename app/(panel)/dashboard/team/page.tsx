import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { can, requirePageMember } from "@/lib/team/member";
import { describeAudit } from "@/lib/team/audit";
import { formatRiyadh } from "@/lib/export/leads";
import { secondaryButtonStyle } from "../_components/forms";
import { TeamBoard, type MemberRow } from "./_components/team-board";

export const dynamic = "force-dynamic";

export default async function TeamPage() {
  const member = await requirePageMember();
  const canManage = can(member, "team.manage");

  const [users, roles, events] = await Promise.all([
    prisma.user.findMany({
      orderBy: [{ active: "desc" }, { name: "asc" }],
      include: { teamRole: true, _count: { select: { assignedLeads: true } } },
    }),
    prisma.role.findMany({ orderBy: [{ system: "desc" }, { name: "asc" }] }),
    canManage
      ? prisma.auditEvent.findMany({
          orderBy: { createdAt: "desc" },
          take: 25,
          include: { actor: { select: { name: true } } },
        })
      : Promise.resolve([]),
  ]);

  const rows: MemberRow[] = users.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    phone: u.phone,
    jobTitle: u.jobTitle,
    roleId: u.teamRoleId,
    roleName: u.teamRole?.name ?? u.role,
    roleHue: u.teamRole?.hue ?? 295,
    avatarHue: u.avatarHue,
    active: u.active,
    leads: u._count.assignedLeads,
    lastLoginAt: u.lastLoginAt?.toISOString() ?? null,
  }));

  return (
    <>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 16, marginBottom: 24 }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 30, fontWeight: 700, letterSpacing: "-0.025em", margin: 0 }}>
            Team
          </h1>
          <div style={{ fontSize: 14, color: "var(--ink-3)", marginTop: 6 }}>
            {rows.filter((r) => r.active).length} active members · {roles.length} roles
          </div>
        </div>
        {canManage && (
          <Link href="/dashboard/team/roles" style={secondaryButtonStyle}>
            Roles &amp; permissions
          </Link>
        )}
      </div>

      <TeamBoard
        members={rows}
        roles={roles.map((r) => ({ id: r.id, name: r.name, description: r.description, hue: r.hue }))}
        meId={member.id}
        canManage={canManage}
      />

      {canManage && (
        <section
          style={{
            marginTop: 24,
            background: "var(--surface)",
            border: "1px solid var(--hairline)",
            borderRadius: "var(--radius)",
            padding: "18px 22px",
          }}
        >
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 700, margin: "0 0 12px" }}>Recent activity</h2>
          {events.length === 0 ? (
            <p style={{ fontSize: 13.5, color: "var(--ink-3)", margin: 0 }}>
              Team changes and lead exports will be listed here.
            </p>
          ) : (
            <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
              {events.map((e) => (
                <li
                  key={e.id}
                  style={{ display: "flex", gap: 12, padding: "8px 0", borderTop: "1px solid var(--hairline)", fontSize: 13.5 }}
                >
                  <span style={{ fontFamily: "var(--font-data)", fontSize: 12, color: "var(--ink-4)", minWidth: 120 }}>
                    {formatRiyadh(e.createdAt)}
                  </span>
                  <span style={{ color: "var(--ink-2)" }}>
                    <b style={{ color: "var(--ink)" }}>{e.actor?.name ?? "A removed member"}</b> {describeAudit(e)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </>
  );
}
