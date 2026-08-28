"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { ActionError, guard, type ActionState } from "@/lib/admin/action";
import { requireEditor } from "@/lib/admin/auth";
import { text } from "@/lib/admin/form";
import { parseCategoryForm } from "@/lib/admin/schemas";
import { resolveSlug } from "@/lib/admin/slug";
import { revalidateContent } from "@/lib/admin/revalidate";

const LIST = "/dashboard/content/categories";

export async function createCategory(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const r = await guard(async () => {
    await requireEditor();
    const input = parseCategoryForm(formData);
    const slug = await resolveSlug("categories", input.slug, input.name);
    const category = await prisma.category.create({ data: { ...input, slug }, select: { id: true } });
    revalidateContent("categories");
    revalidatePath(LIST);
    revalidatePath("/dashboard/content/articles");
    return category;
  });
  if (!r.ok) return r.state;
  redirect(`${LIST}/${r.data.id}/edit?created=1`);
}

export async function updateCategory(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const r = await guard(async () => {
    await requireEditor();
    const id = text(formData, "id");
    const existing = await prisma.category.findUnique({ where: { id }, select: { id: true } });
    if (!existing) throw new ActionError("This category no longer exists.");
    const input = parseCategoryForm(formData);
    const slug = await resolveSlug("categories", input.slug, input.name, id);
    await prisma.category.update({ where: { id }, data: { ...input, slug } });
    revalidateContent("categories");
    revalidatePath(LIST);
    revalidatePath(`${LIST}/${id}/edit`);
    revalidatePath("/dashboard/content/articles");
  });
  return r.ok ? { ok: true } : r.state;
}

/** Articles keep existing; their categoryId is set to null by the schema (onDelete: SetNull). */
export async function deleteCategory(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const r = await guard(async () => {
    await requireEditor();
    const id = text(formData, "id");
    const existing = await prisma.category.findUnique({ where: { id }, select: { id: true } });
    if (!existing) throw new ActionError("This category no longer exists.");
    await prisma.category.delete({ where: { id } });
    revalidateContent("categories");
    revalidatePath(LIST);
    revalidatePath("/dashboard/content/articles");
  });
  return r.ok ? { ok: true } : r.state;
}
