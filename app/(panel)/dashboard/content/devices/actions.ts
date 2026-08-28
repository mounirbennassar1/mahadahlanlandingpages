"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { ActionError, guard, type ActionState } from "@/lib/admin/action";
import { requireEditor } from "@/lib/admin/auth";
import { text } from "@/lib/admin/form";
import { parseDeviceForm } from "@/lib/admin/schemas";
import { resolveSlug } from "@/lib/admin/slug";
import { revalidateContent } from "@/lib/admin/revalidate";

const LIST = "/dashboard/content/devices";

export async function createDevice(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const r = await guard(async () => {
    await requireEditor();
    const input = parseDeviceForm(formData);
    const slug = await resolveSlug("devices", input.slug, input.nameEn || input.name);
    const device = await prisma.device.create({ data: { ...input, slug }, select: { id: true, slug: true } });
    revalidateContent("devices", device.slug);
    revalidatePath(LIST);
    return device;
  });
  if (!r.ok) return r.state;
  redirect(`${LIST}/${r.data.id}/edit?created=1`);
}

export async function updateDevice(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const r = await guard(async () => {
    await requireEditor();
    const id = text(formData, "id");
    const existing = await prisma.device.findUnique({ where: { id }, select: { slug: true } });
    if (!existing) throw new ActionError("This device no longer exists.");
    const input = parseDeviceForm(formData);
    const slug = await resolveSlug("devices", input.slug, input.nameEn || input.name, id);
    await prisma.device.update({ where: { id }, data: { ...input, slug } });
    if (existing.slug !== slug) revalidateContent("devices", existing.slug);
    revalidateContent("devices", slug);
    revalidatePath(LIST);
    revalidatePath(`${LIST}/${id}/edit`);
  });
  return r.ok ? { ok: true } : r.state;
}

export async function deleteDevice(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const r = await guard(async () => {
    await requireEditor();
    const id = text(formData, "id");
    const existing = await prisma.device.findUnique({ where: { id }, select: { slug: true } });
    if (!existing) throw new ActionError("This device no longer exists.");
    await prisma.device.delete({ where: { id } });
    revalidateContent("devices", existing.slug);
    revalidatePath(LIST);
  });
  return r.ok ? { ok: true } : r.state;
}
