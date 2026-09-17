import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { CheckoutError, createCheckout } from "@/lib/orders";
import type { CheckoutResponse } from "@/lib/checkout-types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Opens a noon hosted checkout for a package or an offer.
 *
 * Same-origin only (the landings and /offers call it with fetch). The price is
 * always taken from the database, never from the request, and the customer
 * details become a lead so the sales team can follow up even when the payment
 * is abandoned.
 */
const BodySchema = z.object({
  item: z.object({ kind: z.enum(["package", "offer"]), id: z.string().trim().min(1).max(64) }),
  fullName: z.string().trim().min(2).max(120),
  phone: z.string().trim().regex(/^\+9665\d{8}$/, "Saudi mobile in E.164 form"),
  city: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(160).optional().or(z.literal("")),
  pageSlug: z.string().trim().max(64).optional(),
  utmSource: z.string().trim().max(64).optional(),
  utmMedium: z.string().trim().max(64).optional(),
  utmCampaign: z.string().trim().max(120).optional(),
  utmContent: z.string().trim().max(120).optional(),
  utmTerm: z.string().trim().max(120).optional(),
});

function json(body: CheckoutResponse, status = 200) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

export async function POST(req: NextRequest) {
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return json({ ok: false, error: "بيانات الطلب غير صحيحة.", code: "VALIDATION" }, 400);
  }

  const parsed = BodySchema.safeParse(raw);
  if (!parsed.success) {
    return json({ ok: false, error: "راجعي الاسم ورقم الجوال ثم حاولي مرة أخرى.", code: "VALIDATION" }, 400);
  }

  try {
    const { url, reference } = await createCheckout({ ...parsed.data, email: parsed.data.email || undefined }, { origin: req.nextUrl.origin });
    return json({ ok: true, url, reference }, 201);
  } catch (err) {
    if (err instanceof CheckoutError) {
      const status = err.code === "ITEM_UNAVAILABLE" ? 409 : 503;
      return json({ ok: false, error: err.message, code: err.code }, status);
    }
    console.error("[api/checkout]", err);
    return json({ ok: false, error: "حدث خطأ غير متوقع. حاولي مرة أخرى بعد قليل.", code: "SERVER" }, 500);
  }
}
