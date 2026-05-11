"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ensureSource } from "@/lib/sources";

export type LeadFormState = {
  status: "idle" | "validation_error" | "server_error";
  message?: string;
  issues?: {
    fullName?: string;
    phone?: string;
    city?: string;
  };
  values?: {
    fullName: string;
    phone: string;
    city: string;
  };
};

export async function submitHairLead(
  _prev: LeadFormState,
  formData: FormData,
): Promise<LeadFormState> {
  const fullName = String(formData.get("fullName") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const city = String(formData.get("city") ?? "").trim();

  // UTM attribution (optional — passed as hidden inputs from the form).
  const utmField = (k: string) => {
    const v = String(formData.get(k) ?? "").trim();
    return v.length > 0 ? v.slice(0, 120) : null;
  };
  const utmSource = utmField("utmSource");
  const utmMedium = utmField("utmMedium");
  const utmCampaign = utmField("utmCampaign");
  const utmContent = utmField("utmContent");
  const utmTerm = utmField("utmTerm");

  const clientIssues: LeadFormState["issues"] = {};
  if (!fullName) clientIssues.fullName = "الاسم الكامل مطلوب";
  if (!phone) clientIssues.phone = "رقم الجوال مطلوب";
  if (!city) clientIssues.city = "المدينة مطلوبة";

  if (Object.keys(clientIssues).length > 0) {
    return {
      status: "validation_error",
      issues: clientIssues,
      values: { fullName, phone, city },
    };
  }

  try {
    // ensureSource bootstraps the LeadSource + 5 UTM links if this is the
    // first hair submission ever — so the hair landing works in any env
    // where it has been deployed, with or without a prior seed run.
    const source = await ensureSource("hair");
    if (!source || !source.active) {
      console.error("[submitHairLead] Source 'hair' missing or inactive.");
      return {
        status: "server_error",
        message:
          "حدث خطأ ما، يرجى المحاولة لاحقاً أو الاتصال بنا على 920007515",
        values: { fullName, phone, city },
      };
    }

    await prisma.lead.create({
      data: {
        fullName,
        phone,
        city,
        sourceId: source.id,
        utmSource,
        utmMedium,
        utmCampaign,
        utmContent,
        utmTerm,
      },
    });
  } catch (err) {
    console.error("[submitHairLead] DB error", err);
    return {
      status: "server_error",
      message:
        "حدث خطأ في الاتصال، يرجى المحاولة لاحقاً أو الاتصال بنا على 920007515",
      values: { fullName, phone, city },
    };
  }

  redirect("/hair/thank-you");
}
