"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { readingMinutesFromHtml } from "@/lib/content";
import { ActionError, guard, type ActionState } from "@/lib/admin/action";
import { requireEditor } from "@/lib/admin/auth";
import { text } from "@/lib/admin/form";
import { parseArticleForm } from "@/lib/admin/schemas";
import { resolveSlug } from "@/lib/admin/slug";
import { revalidateContent } from "@/lib/admin/revalidate";

const LIST = "/dashboard/content/articles";

export async function createArticle(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const r = await guard(async () => {
    await requireEditor();
    const input = parseArticleForm(formData);
    const slug = await resolveSlug("articles", input.slug, input.title);
    const publishedAt = input.status === "PUBLISHED" ? (input.publishedAt ?? new Date()) : input.publishedAt;
    const article = await prisma.article.create({
      data: { ...input, slug, publishedAt, readingMinutes: readingMinutesFromHtml(input.content) },
      select: { id: true, slug: true },
    });
    revalidateContent("articles", article.slug);
    revalidatePath(LIST);
    return article;
  });
  if (!r.ok) return r.state;
  redirect(`${LIST}/${r.data.id}/edit?created=1`);
}

export async function updateArticle(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const r = await guard(async () => {
    await requireEditor();
    const id = text(formData, "id");
    const existing = await prisma.article.findUnique({ where: { id }, select: { slug: true, publishedAt: true } });
    if (!existing) throw new ActionError("This article no longer exists.");
    const input = parseArticleForm(formData);
    const slug = await resolveSlug("articles", input.slug, input.title, id);
    const publishedAt =
      input.status === "PUBLISHED" ? (input.publishedAt ?? existing.publishedAt ?? new Date()) : input.publishedAt;
    await prisma.article.update({
      where: { id },
      data: { ...input, slug, publishedAt, readingMinutes: readingMinutesFromHtml(input.content) },
    });
    if (existing.slug !== slug) revalidateContent("articles", existing.slug);
    revalidateContent("articles", slug);
    revalidatePath(LIST);
    revalidatePath(`${LIST}/${id}/edit`);
  });
  return r.ok ? { ok: true } : r.state;
}

export async function deleteArticle(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const r = await guard(async () => {
    await requireEditor();
    const id = text(formData, "id");
    const existing = await prisma.article.findUnique({ where: { id }, select: { slug: true } });
    if (!existing) throw new ActionError("This article no longer exists.");
    await prisma.article.delete({ where: { id } });
    revalidateContent("articles", existing.slug);
    revalidatePath(LIST);
  });
  return r.ok ? { ok: true } : r.state;
}
