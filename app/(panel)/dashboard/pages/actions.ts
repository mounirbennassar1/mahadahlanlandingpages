"use server";

import { auth } from "@/auth";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { ActionError, guard, type ActionState } from "@/lib/admin/action";
import { requireEditor } from "@/lib/admin/auth";
import { text } from "@/lib/admin/form";
import { getPageDef } from "@/lib/pages/registry";
import { buildContentSchema } from "@/lib/pages/schema";
import { diffContent } from "@/lib/pages/merge";
import { revalidatePage } from "@/lib/pages/revalidate";

function pageFromForm(fd: FormData) {
  const def = getPageDef(text(fd, "slug"));
  if (!def) throw new ActionError("That page no longer exists.");
  return def;
}

/**
 * Saves the whole editor payload for one page. Only fields that differ from the
 * code defaults are stored, so later copy changes in code still reach pages the
 * admin never touched.
 */
export async function savePageContent(_prev: ActionState, fd: FormData): Promise<ActionState> {
  const result = await guard(async () => {
    const session = await requireEditor();
    const def = pageFromForm(fd);

    let payload: unknown;
    try {
      payload = JSON.parse(text(fd, "data") || "{}");
    } catch {
      throw new ActionError("The editor sent an unreadable payload. Reload the page and try again.");
    }

    const values = buildContentSchema(def).parse(payload);
    const data = diffContent(def, values) as Prisma.InputJsonObject;

    await prisma.pageContent.upsert({
      where: { slug: def.slug },
      create: { slug: def.slug, data, updatedById: session.user.id },
      update: { data, updatedById: session.user.id },
    });

    revalidatePage(def);
    return def;
  });

  return result.ok ? { ok: true } : result.state;
}

/** Drops every override for a page, returning it to the copy in code. */
export async function resetPageContent(_prev: ActionState, fd: FormData): Promise<ActionState> {
  const result = await guard(async () => {
    await requireEditor();
    const def = pageFromForm(fd);
    await prisma.pageContent.deleteMany({ where: { slug: def.slug } });
    revalidatePage(def);
    return def;
  });

  return result.ok ? { ok: true } : result.state;
}

/** Read-side helper for the editor's "unsaved work" guard. */
export async function currentUserCanEdit() {
  const session = await auth();
  return Boolean(session?.user && (session.user.role === "ADMIN" || session.user.role === "MANAGER"));
}
