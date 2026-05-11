"use server";

import { redirect } from "next/navigation";

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

  const panelUrl = process.env.LEAD_PANEL_URL;
  const apiKey = process.env.LEAD_API_KEY_HAIR;

  if (!panelUrl || !apiKey) {
    console.error(
      "[submitHairLead] Missing LEAD_PANEL_URL or LEAD_API_KEY_HAIR env var",
    );
    return {
      status: "server_error",
      message:
        "حدث خطأ ما، يرجى المحاولة لاحقاً أو الاتصال بنا على 920007515",
      values: { fullName, phone, city },
    };
  }

  let response: Response;
  try {
    response = await fetch(`${panelUrl.replace(/\/+$/, "")}/api/leads`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
      },
      // Dashboard derives source from the API key — body is just lead fields.
      body: JSON.stringify({ fullName, phone, city }),
      cache: "no-store",
    });
  } catch (err) {
    console.error("[submitHairLead] network error", err);
    return {
      status: "server_error",
      message:
        "حدث خطأ في الاتصال، يرجى المحاولة لاحقاً أو الاتصال بنا على 920007515",
      values: { fullName, phone, city },
    };
  }

  if (response.status === 200 || response.status === 201) {
    redirect("/hair/thank-you");
  }

  if (response.status === 400) {
    let issues: Record<string, string> = {};
    try {
      const data = (await response.json()) as {
        error?: string;
        issues?: Record<string, unknown>;
      };
      if (data.issues && typeof data.issues === "object") {
        for (const [key, value] of Object.entries(data.issues)) {
          if (typeof value === "string") {
            issues[key] = value;
          } else if (Array.isArray(value) && typeof value[0] === "string") {
            issues[key] = value[0];
          }
        }
      }
    } catch {
      issues = {};
    }
    return {
      status: "validation_error",
      issues,
      values: { fullName, phone, city },
    };
  }

  let detail = "";
  try {
    detail = await response.text();
  } catch {}
  console.error(
    `[submitHairLead] panel responded ${response.status}: ${detail.slice(0, 500)}`,
  );
  return {
    status: "server_error",
    message:
      "حدث خطأ ما، يرجى المحاولة لاحقاً أو الاتصال بنا على 920007515",
    values: { fullName, phone, city },
  };
}
