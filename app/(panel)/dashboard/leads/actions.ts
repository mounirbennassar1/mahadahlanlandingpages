"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import type { LeadStatus } from "@prisma/client";
import { STATUS_ORDER } from "@/lib/status";
import { can, getMember, type Member } from "@/lib/team/member";
import type { Permission } from "@/lib/team/permissions";

type Result = { ok: true } | { ok: false; error: string };

/** The member, if they may act on this lead with `permission`. */
async function authorize(leadId: string, permission: Permission): Promise<Member | string> {
  const member = await getMember();
  if (!member) return "Your session has expired. Please sign in again.";
  if (!can(member, permission)) return "Your role doesn't allow this.";
  if (!can(member, "leads.view_all")) {
    const lead = await prisma.lead.findUnique({ where: { id: leadId }, select: { assigneeId: true } });
    if (lead?.assigneeId !== member.id) return "This lead isn't assigned to you.";
  }
  return member;
}

export async function updateLeadStatus(leadId: string, status: LeadStatus): Promise<Result> {
  if (!STATUS_ORDER.includes(status)) return { ok: false, error: "Invalid status" };
  const member = await authorize(leadId, "leads.update");
  if (typeof member === "string") return { ok: false, error: member };

  await prisma.lead.update({ where: { id: leadId }, data: { status } });
  revalidatePath("/dashboard/leads");
  revalidatePath("/dashboard");
  return { ok: true };
}

export async function assignLead(leadId: string, userId: string | null): Promise<Result> {
  const member = await authorize(leadId, "leads.assign");
  if (typeof member === "string") return { ok: false, error: member };
  if (userId) {
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { active: true } });
    if (!user) return { ok: false, error: "User not found" };
    if (!user.active) return { ok: false, error: "That member is deactivated" };
  }
  await prisma.lead.update({ where: { id: leadId }, data: { assigneeId: userId } });
  revalidatePath("/dashboard/leads");
  revalidatePath("/dashboard");
  return { ok: true };
}
