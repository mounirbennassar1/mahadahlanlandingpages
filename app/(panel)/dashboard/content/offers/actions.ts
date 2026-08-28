"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { ActionError, guard, type ActionState } from "@/lib/admin/action";
import { requireEditor } from "@/lib/admin/auth";
import { text } from "@/lib/admin/form";
import { parseOfferForm } from "@/lib/admin/schemas";
import { resolveSlug } from "@/lib/admin/slug";
import { revalidateContent } from "@/lib/admin/revalidate";

const LIST = "/dashboard/content/offers";

export async function createOffer(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const r = await guard(async () => {
    await requireEditor();
    const input = parseOfferForm(formData);
    const slug = await resolveSlug("offers", input.slug, input.title);
    const offer = await prisma.offer.create({ data: { ...input, slug }, select: { id: true } });
    revalidateContent("offers");
    revalidatePath(LIST);
    return offer;
  });
  if (!r.ok) return r.state;
  redirect(`${LIST}/${r.data.id}/edit?created=1`);
}

export async function updateOffer(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const r = await guard(async () => {
    await requireEditor();
    const id = text(formData, "id");
    const existing = await prisma.offer.findUnique({ where: { id }, select: { id: true } });
    if (!existing) throw new ActionError("This offer no longer exists.");
    const input = parseOfferForm(formData);
    const slug = await resolveSlug("offers", input.slug, input.title, id);
    await prisma.offer.update({ where: { id }, data: { ...input, slug } });
    revalidateContent("offers");
    revalidatePath(LIST);
    revalidatePath(`${LIST}/${id}/edit`);
  });
  return r.ok ? { ok: true } : r.state;
}

/** Leads that picked this offer keep existing; offerId becomes null (onDelete: SetNull). */
export async function deleteOffer(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const r = await guard(async () => {
    await requireEditor();
    const id = text(formData, "id");
    const existing = await prisma.offer.findUnique({ where: { id }, select: { id: true } });
    if (!existing) throw new ActionError("This offer no longer exists.");
    await prisma.offer.delete({ where: { id } });
    revalidateContent("offers");
    revalidatePath(LIST);
    revalidatePath("/dashboard/leads");
  });
  return r.ok ? { ok: true } : r.state;
}
