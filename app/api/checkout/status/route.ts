import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { syncOrderWithNoon } from "@/lib/orders";
import type { CheckoutStatus } from "@/lib/checkout-types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const REF_RE = /^MD-[A-Z0-9]{4}-[A-Z0-9]{4}$/;

/**
 * Polled by the return page while noon is still settling the payment. The
 * reference is unguessable (32^8 combinations) and the response carries no
 * personal data beyond what the customer typed themselves.
 */
export async function GET(req: NextRequest) {
  const ref = (req.nextUrl.searchParams.get("ref") ?? "").toUpperCase();
  if (!REF_RE.test(ref)) return NextResponse.json({ error: "Bad reference" }, { status: 400 });

  const order = await prisma.order.findUnique({ where: { reference: ref } });
  if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const current = order.status === "PENDING" && order.noonOrderId ? (await syncOrderWithNoon(order.id, { via: "return" })).order : order;

  const body: CheckoutStatus = {
    reference: current.reference,
    status: current.status,
    amount: current.amount,
    itemTitle: current.itemTitle,
  };
  return NextResponse.json(body, { headers: { "Cache-Control": "no-store" } });
}
