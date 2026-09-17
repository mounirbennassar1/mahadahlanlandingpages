"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { ActionError, guard, type ActionState } from "@/lib/admin/action";
import { requireEditor } from "@/lib/admin/auth";
import { text } from "@/lib/admin/form";
import { parsePackageForm } from "@/lib/admin/schemas";
import { resolveSlug } from "@/lib/admin/slug";
import { revalidatePackages } from "@/lib/admin/revalidate";
import { getPageDef } from "@/lib/pages/registry";

const LIST = "/dashboard/packages";

function validPage(slug: string | null) {
  if (slug === null) return null;
  const def = getPageDef(slug);
  if (!def) throw new ActionError("Pick a page from the list.", { pageSlug: "Unknown page." });
  return def.slug;
}

function bust(pageSlug: string | null, id?: string) {
  revalidatePackages(pageSlug);
  revalidatePath(LIST);
  revalidatePath("/dashboard");
  if (pageSlug) revalidatePath(`/dashboard/pages/${pageSlug}/packages`);
  if (id) revalidatePath(`${LIST}/${id}/edit`);
}

export async function createPackage(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const r = await guard(async () => {
    await requireEditor();
    const input = parsePackageForm(formData);
    const pageSlug = validPage(input.pageSlug);
    const slug = await resolveSlug("packages", input.slug, input.title);
    const pkg = await prisma.package.create({ data: { ...input, pageSlug, slug }, select: { id: true } });
    bust(pageSlug);
    return pkg;
  });
  if (!r.ok) return r.state;
  redirect(`${LIST}/${r.data.id}/edit?created=1`);
}

export async function updatePackage(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const r = await guard(async () => {
    await requireEditor();
    const id = text(formData, "id");
    const existing = await prisma.package.findUnique({ where: { id }, select: { id: true, pageSlug: true } });
    if (!existing) throw new ActionError("This package no longer exists.");
    const input = parsePackageForm(formData);
    const pageSlug = validPage(input.pageSlug);
    const slug = await resolveSlug("packages", input.slug, input.title, id);
    await prisma.package.update({ where: { id }, data: { ...input, pageSlug, slug } });
    bust(pageSlug, id);
    if (existing.pageSlug !== pageSlug) bust(existing.pageSlug);
  });
  return r.ok ? { ok: true } : r.state;
}

/** Orders that bought this package keep their snapshot; packageId becomes null. */
export async function deletePackage(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const r = await guard(async () => {
    await requireEditor();
    const id = text(formData, "id");
    const existing = await prisma.package.findUnique({ where: { id }, select: { id: true, pageSlug: true } });
    if (!existing) throw new ActionError("This package no longer exists.");
    await prisma.package.delete({ where: { id } });
    bust(existing.pageSlug);
    revalidatePath("/dashboard/orders");
  });
  return r.ok ? { ok: true } : r.state;
}

/** Quick on/off from the list. */
export async function togglePackage(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const r = await guard(async () => {
    await requireEditor();
    const id = text(formData, "id");
    const existing = await prisma.package.findUnique({ where: { id }, select: { id: true, active: true, pageSlug: true } });
    if (!existing) throw new ActionError("This package no longer exists.");
    await prisma.package.update({ where: { id }, data: { active: !existing.active } });
    bust(existing.pageSlug, id);
  });
  return r.ok ? { ok: true } : r.state;
}
