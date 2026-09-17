"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { ActionError, guard, type ActionState } from "@/lib/admin/action";
import { requireSession } from "@/lib/admin/auth";
import { addOrderEvent, refundOrderFully, syncOrderWithNoon } from "@/lib/orders";

/** Re-reads the order from noon. Any signed-in role. */
export async function syncOrder(_prev: ActionState, fd: FormData): Promise<ActionState> {
  const result = await guard(async () => {
    const session = await requireSession();
    const id = String(fd.get("id") ?? "");
    if (!id) throw new ActionError("Missing order id.");
    const r = await syncOrderWithNoon(id, { via: "manual", userId: session.user.id });
    if (r.error) throw new ActionError(r.error);
    return r;
  });
  return result.ok ? { ok: true } : result.state;
}

const RefundSchema = z.object({
  id: z.string().min(1),
  amount: z.number().int().positive().nullable(),
});

/** Refund through noon. Administrators only. */
export async function refundOrder(_prev: ActionState, fd: FormData): Promise<ActionState> {
  const result = await guard(async () => {
    const session = await requireSession();
    if (session.user.role !== "ADMIN") throw new ActionError("Only administrators can refund orders.");
    const rawAmount = String(fd.get("amount") ?? "").trim();
    const input = RefundSchema.parse({ id: fd.get("id"), amount: rawAmount === "" ? null : Number(rawAmount) });
    try {
      await refundOrderFully(input.id, session.user.id, input.amount ?? undefined);
    } catch (err) {
      throw new ActionError(err instanceof Error ? err.message : "Refund failed.");
    }
  });
  return result.ok ? { ok: true } : result.state;
}

const NoteSchema = z.object({
  id: z.string().min(1),
  body: z.string().trim().min(1, "Write something first.").max(2000),
});

export async function addOrderNote(_prev: ActionState, fd: FormData): Promise<ActionState> {
  const result = await guard(async () => {
    const session = await requireSession();
    const input = NoteSchema.parse({ id: fd.get("id"), body: fd.get("body") });
    const order = await prisma.order.findUnique({ where: { id: input.id }, select: { id: true } });
    if (!order) throw new ActionError("This order no longer exists.");
    await addOrderEvent(order.id, "NOTE", input.body, undefined, session.user.id);
    revalidatePath(`/dashboard/orders/${order.id}`);
  });
  return result.ok ? { ok: true } : result.state;
}

/** Permanent delete of an order that never reached noon or is not paid. Administrators only. */
export async function deleteOrder(_prev: ActionState, fd: FormData): Promise<ActionState> {
  const result = await guard(async () => {
    const session = await requireSession();
    if (session.user.role !== "ADMIN") throw new ActionError("Only administrators can delete orders.");
    const id = String(fd.get("id") ?? "");
    const order = await prisma.order.findUnique({ where: { id }, select: { id: true, status: true } });
    if (!order) throw new ActionError("This order no longer exists.");
    if (order.status === "PAID") throw new ActionError("Paid orders are kept for the books; refund it instead.");
    await prisma.order.delete({ where: { id } });
    revalidatePath("/dashboard/orders");
    revalidatePath("/dashboard");
  });
  return result.ok ? { ok: true } : result.state;
}
