"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { ActionError, guard, type ActionState } from "@/lib/admin/action";
import { requireEditor } from "@/lib/admin/auth";
import { text } from "@/lib/admin/form";
import { parseServiceForm } from "@/lib/admin/schemas";
import { resolveSlug } from "@/lib/admin/slug";
import { revalidateContent } from "@/lib/admin/revalidate";

const LIST = "/dashboard/content/services";

export async function createService(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const r = await guard(async () => {
    await requireEditor();
    const input = parseServiceForm(formData);
    const slug = await resolveSlug("services", input.slug, input.name);
    const service = await prisma.service.create({ data: { ...input, slug }, select: { id: true } });
    revalidateContent("services");
    revalidatePath(LIST);
    return service;
  });
  if (!r.ok) return r.state;
  redirect(`${LIST}/${r.data.id}/edit?created=1`);
}

export async function updateService(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const r = await guard(async () => {
    await requireEditor();
    const id = text(formData, "id");
    const existing = await prisma.service.findUnique({ where: { id }, select: { id: true } });
    if (!existing) throw new ActionError("This service no longer exists.");
    const input = parseServiceForm(formData);
    const slug = await resolveSlug("services", input.slug, input.name, id);
    await prisma.service.update({ where: { id }, data: { ...input, slug } });
    revalidateContent("services");
    revalidatePath(LIST);
    revalidatePath(`${LIST}/${id}/edit`);
  });
  return r.ok ? { ok: true } : r.state;
}

export async function deleteService(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const r = await guard(async () => {
    await requireEditor();
    const id = text(formData, "id");
    const existing = await prisma.service.findUnique({ where: { id }, select: { id: true } });
    if (!existing) throw new ActionError("This service no longer exists.");
    await prisma.service.delete({ where: { id } });
    revalidateContent("services");
    revalidatePath(LIST);
  });
  return r.ok ? { ok: true } : r.state;
}
