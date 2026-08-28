"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { ActionError, guard, type ActionState } from "@/lib/admin/action";
import { requireEditor } from "@/lib/admin/auth";
import { text } from "@/lib/admin/form";
import { parseDoctorForm } from "@/lib/admin/schemas";
import { resolveSlug } from "@/lib/admin/slug";
import { revalidateContent } from "@/lib/admin/revalidate";

const LIST = "/dashboard/content/doctors";

export async function createDoctor(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const r = await guard(async () => {
    await requireEditor();
    const input = parseDoctorForm(formData);
    const slug = await resolveSlug("doctors", input.slug, input.name);
    const doctor = await prisma.doctor.create({ data: { ...input, slug }, select: { id: true, slug: true } });
    revalidateContent("doctors", doctor.slug);
    revalidatePath(LIST);
    return doctor;
  });
  if (!r.ok) return r.state;
  redirect(`${LIST}/${r.data.id}/edit?created=1`);
}

export async function updateDoctor(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const r = await guard(async () => {
    await requireEditor();
    const id = text(formData, "id");
    const existing = await prisma.doctor.findUnique({ where: { id }, select: { slug: true } });
    if (!existing) throw new ActionError("This doctor no longer exists.");
    const input = parseDoctorForm(formData);
    const slug = await resolveSlug("doctors", input.slug, input.name, id);
    await prisma.doctor.update({ where: { id }, data: { ...input, slug } });
    if (existing.slug !== slug) revalidateContent("doctors", existing.slug);
    revalidateContent("doctors", slug);
    revalidatePath(LIST);
    revalidatePath(`${LIST}/${id}/edit`);
    revalidatePath("/dashboard/content/articles");
  });
  return r.ok ? { ok: true } : r.state;
}

/** Articles by this doctor keep existing; authorId becomes null (onDelete: SetNull). */
export async function deleteDoctor(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const r = await guard(async () => {
    await requireEditor();
    const id = text(formData, "id");
    const existing = await prisma.doctor.findUnique({ where: { id }, select: { slug: true } });
    if (!existing) throw new ActionError("This doctor no longer exists.");
    await prisma.doctor.delete({ where: { id } });
    revalidateContent("doctors", existing.slug);
    revalidateContent("articles");
    revalidatePath(LIST);
    revalidatePath("/dashboard/content/articles");
  });
  return r.ok ? { ok: true } : r.state;
}
