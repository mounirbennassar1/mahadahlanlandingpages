import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { addOrderEvent, syncOrderWithNoon } from "@/lib/orders";
import { parseNoonJson, verifyWebhookSignature, type NoonWebhookPayload } from "@/lib/noon";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * noon order-status notifications. Configure this URL in the noon dashboard:
 *   https://www.mahadahlan.com/api/noon/webhook
 *
 * The payload is only used to find the order; the status itself is always
 * re-read from noon's API, so a forged call can at most trigger a harmless
 * refresh. When NOON_WEBHOOK_SECRET is set the signature is checked as well
 * and mismatches are recorded on the order.
 */
export async function POST(req: NextRequest) {
  const text = await req.text();
  if (!text.trim()) return NextResponse.json({ ok: true, note: "empty" });

  let payload: NoonWebhookPayload;
  try {
    payload = parseNoonJson<NoonWebhookPayload>(text);
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const noonOrderId = payload.orderId !== undefined ? String(payload.orderId) : null;
  const reference = payload.merchantOrderReference?.toUpperCase() ?? null;

  const order =
    (noonOrderId ? await prisma.order.findUnique({ where: { noonOrderId } }) : null) ??
    (reference ? await prisma.order.findUnique({ where: { reference } }) : null);

  if (!order) {
    console.warn("[noon webhook] unknown order", { noonOrderId, reference });
    return NextResponse.json({ ok: true, note: "unknown order" });
  }

  const verdict = verifyWebhookSignature(payload);
  if (verdict === "invalid") {
    await addOrderEvent(order.id, "WEBHOOK", "Webhook received with an invalid signature; status re-read from noon anyway.", {
      eventType: payload.eventType ?? null,
      orderStatus: payload.orderStatus ?? null,
      signature: "invalid",
    });
  }

  try {
    await syncOrderWithNoon(order.id, {
      via: "webhook",
      hint: {
        eventId: payload.eventId ?? null,
        eventType: payload.eventType ?? null,
        orderStatus: payload.orderStatus ?? null,
        timeStamp: payload.timeStamp ?? null,
        signature: verdict,
      },
    });
  } catch (err) {
    console.error("[noon webhook] sync failed", err);
    return NextResponse.json({ ok: false, error: "Sync failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

/** noon may probe the endpoint when it is saved in the dashboard. */
export async function GET() {
  return NextResponse.json({ ok: true, service: "noon-webhook" });
}
