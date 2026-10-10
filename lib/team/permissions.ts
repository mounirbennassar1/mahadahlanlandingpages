import type { UserRole } from "@prisma/client";

/**
 * Every permission a role can grant. Keys are stored as-is in `Role.permissions`,
 * so never rename one without a data migration.
 */
export const PERMISSIONS = {
  "leads.view_all": {
    group: "Leads",
    label: "See every lead",
    hint: "Without it, a member only sees the leads assigned to them.",
  },
  "leads.update": {
    group: "Leads",
    label: "Change lead status",
    hint: "Move a lead between Inquiry, Confirmed, Booked and the rest.",
  },
  "leads.assign": {
    group: "Leads",
    label: "Assign leads",
    hint: "Hand a lead to any team member.",
  },
  "leads.export": {
    group: "Leads",
    label: "Export leads",
    hint: "Download the current view as Excel, CSV, PDF or TXT.",
  },
  "content.edit": {
    group: "Website",
    label: "Edit website content",
    hint: "Articles, categories, doctors, devices, offers and services.",
  },
  "marketing.manage": {
    group: "Marketing",
    label: "Manage sources and tracking",
    hint: "Rotate landing API keys and edit conversion tracking.",
  },
  "team.manage": {
    group: "Team",
    label: "Manage the team",
    hint: "Add, edit, deactivate and remove members; create and edit roles.",
  },
} as const;

export type Permission = keyof typeof PERMISSIONS;

export const ALL_PERMISSIONS = Object.keys(PERMISSIONS) as Permission[];

export function isPermission(value: string): value is Permission {
  return value in PERMISSIONS;
}

/** Permissions grouped for the role editor, in declaration order. */
export function permissionGroups() {
  const groups = new Map<string, Permission[]>();
  for (const key of ALL_PERMISSIONS) {
    const group = PERMISSIONS[key].group;
    groups.set(group, [...(groups.get(group) ?? []), key]);
  }
  return [...groups.entries()].map(([group, keys]) => ({ group, keys }));
}

/**
 * The three seeded roles. Ids are fixed so the SQL migration, the seed and the
 * code agree; `prisma/sql/2026-10-08-team-roles.sql` inserts the same rows.
 */
export const SYSTEM_ROLES = [
  {
    id: "role_admin",
    name: "Administrator",
    description: "Full access, including the team and roles.",
    hue: 295,
    base: "ADMIN",
    permissions: ALL_PERMISSIONS,
  },
  {
    id: "role_manager",
    name: "Manager",
    description: "Runs leads and the website; cannot change the team or tracking.",
    hue: 220,
    base: "MANAGER",
    permissions: ALL_PERMISSIONS.filter((p) => p !== "team.manage" && p !== "marketing.manage"),
  },
  {
    id: "role_sales",
    name: "Sales",
    description: "Works the lead list: status and assignment.",
    hue: 155,
    base: "AGENT",
    permissions: ["leads.view_all", "leads.update", "leads.assign"] as Permission[],
  },
] as const satisfies ReadonlyArray<{
  id: string;
  name: string;
  description: string;
  hue: number;
  base: UserRole;
  permissions: readonly Permission[];
}>;

export const ADMIN_ROLE_ID = "role_admin";

/** Used when a user has no `teamRole` yet (e.g. created by the website panel). */
export function defaultPermissions(role: UserRole): Permission[] {
  const match = SYSTEM_ROLES.find((r) => r.base === role);
  return match ? [...match.permissions] : [];
}

/**
 * The website panel shares this database and only understands the coarse
 * enum, so every role change also writes the closest enum value.
 */
export function baseRoleFor(permissions: readonly string[]): UserRole {
  if (permissions.includes("team.manage")) return "ADMIN";
  if (permissions.includes("content.edit")) return "MANAGER";
  return "AGENT";
}
