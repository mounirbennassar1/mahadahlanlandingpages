import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ORDER_STATUS_META } from "@/lib/order-status";
import { getPageDef } from "@/lib/pages/registry";
import { buildOrderWhere, parseOrderSearch } from "@/app/(panel)/dashboard/orders/_lib/query";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_ROWS = 10_000;

const COLUMNS = ["reference", "created_at", "status", "amount_sar", "refunded_sar", "currency", "item_type", "item", "full_name", "phone", "city", "email", "page", "page_slug", "noon_order_id", "noon_status", "payment_brand", "paid_at", "failure_reason", "lead_id", "utm_source", "utm_medium", "utm_campaign"] as const;

function cell(value: unknown): string {
  if (value === null || value === undefined) return "";
  const text = String(value);
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function iso(date: Date | null) {
  return date ? date.toISOString() : "";
}

/** Filtered CSV of the current orders view (session-gated; proxy.ts also 401s /api/admin/*). */
export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(request.url);
  const search = parseOrderSearch(Object.fromEntries(url.searchParams.entries()));
  const orders = await prisma.order.findMany({ where: buildOrderWhere(search), orderBy: { createdAt: "desc" }, take: MAX_ROWS });

  const lines = [COLUMNS.join(",")];
  for (const o of orders) {
    const page = o.pageSlug ? getPageDef(o.pageSlug) : undefined;
    lines.push(
      [o.reference, iso(o.createdAt), ORDER_STATUS_META[o.status].label, o.amount, o.refundedAmount, o.currency, o.itemType, o.itemTitle, o.fullName, o.phone, o.city, o.email ?? "", page?.title ?? "", o.pageSlug ?? "", o.noonOrderId ?? "", o.noonStatus ?? "", o.paymentBrand ?? "", iso(o.paidAt), o.failureReason ?? "", o.leadId ?? "", o.utmSource ?? "", o.utmMedium ?? "", o.utmCampaign ?? ""]
        .map(cell)
        .join(","),
    );
  }

  const today = new Date().toISOString().slice(0, 10);
  return new NextResponse(`﻿${lines.join("\r\n")}\r\n`, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="orders-${search.status ?? "all"}-${today}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
