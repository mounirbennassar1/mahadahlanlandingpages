"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

function normalize(input: FormDataEntryValue | null): string | null {
  if (typeof input !== "string") return null;
  const v = input.trim();
  return v ? v : null;
}

/**
 * Save the Google Ads conversion ID + label for one (source, type) row.
 *
 * Empty inputs clear the IDs and effectively pause the conversion — the row
 * stays in the table (the `active` flag handles enable/disable separately).
 */
export async function saveConversionAction(formData: FormData) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Forbidden");
  }

  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("Missing conversion id");

  const conversionId = normalize(formData.get("conversionId"));
  const conversionLabel = normalize(formData.get("conversionLabel"));
  const active = formData.get("active") === "on";

  await prisma.conversionAction.update({
    where: { id },
    data: {
      conversionId,
      conversionLabel,
      active,
    },
  });

  revalidatePath("/dashboard/conversions");
}
