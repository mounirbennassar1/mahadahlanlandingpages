"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import type { LeadStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { STATUS_ORDER } from "@/lib/status";
import { auth } from "@/auth";
import { ActionError, guard, type ActionState } from "@/lib/admin/action";
import { requireSession } from "@/lib/admin/auth";

/**
 * Session lookup for the optimistic pills, which `await` the action and roll
 * their UI back on `{ ok: false }`. Returning instead of throwing means an
 * expired session rolls the pill back rather than leaving it out of sync.
 */
async function sessionOrError() {
  const session = await auth();
  if (!session?.user) {
    return { ok: false as const, error: "Your session has expired. Please sign in again." };
  }
  return { ok: true as const, session };
}

function revalidateLead(leadId?: string) {
  revalidatePath("/dashboard/leads");
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/pages");
  if (leadId) revalidatePath(`/dashboard/leads/${leadId}`);
}

/** Status change, recorded on the lead's timeline. */
export async function updateLeadStatus(leadId: string, status: LeadStatus) {
  const auth = await sessionOrError();
  if (!auth.ok) return auth;
  const { session } = auth;
  if (!STATUS_ORDER.includes(status)) return { ok: false as const, error: "Invalid status" };

  const current = await prisma.lead.findUnique({
    where: { id: leadId },
    select: { status: true },
  });
  if (!current) return { ok: false as const, error: "Lead not found" };
  if (current.status === status) return { ok: true as const };

  await prisma.$transaction([
    prisma.lead.update({ where: { id: leadId }, data: { status } }),
    prisma.leadActivity.create({
      data: {
        leadId,
        userId: session.user.id,
        type: "STATUS",
        meta: { from: current.status, to: status },
      },
    }),
  ]);

  revalidateLead(leadId);
  return { ok: true as const };
}

/** Assignment change, recorded on the lead's timeline. */
export async function assignLead(leadId: string, userId: string | null) {
  const authed = await sessionOrError();
  if (!authed.ok) return authed;
  const { session } = authed;

  const [lead, target] = await Promise.all([
    prisma.lead.findUnique({
      where: { id: leadId },
      select: { assigneeId: true, assignee: { select: { name: true } } },
    }),
    userId
      ? prisma.user.findUnique({ where: { id: userId }, select: { id: true, name: true } })
      : Promise.resolve(null),
  ]);

  if (!lead) return { ok: false as const, error: "Lead not found" };
  if (userId && !target) return { ok: false as const, error: "User not found" };
  if (lead.assigneeId === userId) return { ok: true as const };

  await prisma.$transaction([
    prisma.lead.update({ where: { id: leadId }, data: { assigneeId: userId } }),
    prisma.leadActivity.create({
      data: {
        leadId,
        userId: session.user.id,
        type: "ASSIGN",
        meta: {
          from: lead.assignee?.name ?? null,
          to: target?.name ?? null,
        },
      },
    }),
  ]);

  revalidateLead(leadId);
  return { ok: true as const };
}

const NoteSchema = z.object({
  leadId: z.string().min(1),
  body: z.string().trim().min(1, "Write something first.").max(2000),
});

/** Free-text note from a team member. Available to every signed-in role. */
export async function addLeadNote(_prev: ActionState, fd: FormData): Promise<ActionState> {
  const result = await guard(async () => {
    const session = await requireSession();
    const input = NoteSchema.parse({
      leadId: fd.get("leadId"),
      body: fd.get("body"),
    });

    const lead = await prisma.lead.findUnique({
      where: { id: input.leadId },
      select: { id: true },
    });
    if (!lead) throw new ActionError("This lead no longer exists.");

    await prisma.$transaction([
      prisma.leadActivity.create({
        data: {
          leadId: input.leadId,
          userId: session.user.id,
          type: "NOTE",
          body: input.body,
        },
      }),
      prisma.lead.update({
        where: { id: input.leadId },
        data: { notesCount: { increment: 1 } },
      }),
    ]);

    revalidateLead(input.leadId);
    return input.leadId;
  });

  return result.ok ? { ok: true } : result.state;
}

/** Permanent delete. Administrators only; activities cascade. */
export async function deleteLead(_prev: ActionState, fd: FormData): Promise<ActionState> {
  const result = await guard(async () => {
    const session = await requireSession();
    if (session.user.role !== "ADMIN") {
      throw new ActionError("Only administrators can delete leads.");
    }
    const id = String(fd.get("id") ?? "");
    if (!id) throw new ActionError("Missing lead id.");
    await prisma.lead.delete({ where: { id } });
    revalidateLead();
    return id;
  });

  return result.ok ? { ok: true } : result.state;
}
