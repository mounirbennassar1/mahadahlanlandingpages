"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

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
    const source = await prisma.leadSource.findUnique({ where: { slug: "hair" } });
    if (!source || !source.active) {
      console.error("[submitHairLead] Source 'hair' missing or inactive — run db:seed.");
      return {
        status: "server_error",
        message:
          "حدث خطأ ما، يرجى المحاولة لاحقاً أو الاتصال بنا على 920007515",
        values: { fullName, phone, city },
      };
    }

    await prisma.lead.create({
      data: { fullName, phone, city, sourceId: source.id },
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
