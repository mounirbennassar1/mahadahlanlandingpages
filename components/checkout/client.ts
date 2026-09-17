import type { CheckoutRequest, CheckoutResponse } from "@/lib/checkout-types";

/** POST /api/checkout with Arabic messages for every failure path. */
export async function startCheckout(payload: CheckoutRequest): Promise<CheckoutResponse> {
  try {
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = (await res.json().catch(() => null)) as CheckoutResponse | null;
    if (data && typeof data === "object" && "ok" in data) return data;
    return {
      ok: false,
      code: "SERVER",
      error: "تعذّر فتح صفحة الدفع الآن. حاولي مرة أخرى بعد قليل أو تواصلي معنا عبر واتساب.",
    };
  } catch {
    return {
      ok: false,
      code: "SERVER",
      error: "تعذّر الاتصال. تحققي من اتصالك بالإنترنت ثم حاولي مرة أخرى.",
    };
  }
}
