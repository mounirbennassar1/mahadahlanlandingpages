import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { STATUS_META } from "@/lib/status";
import {
  buildLeadWhere,
  parseLeadSearch,
} from "@/app/(panel)/dashboard/leads/_lib/query";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_ROWS = 10_000;

const COLUMNS = [
  "id",
  "submitted_at",
  "page",
  "page_slug",
  "full_name",
  "phone",
  "city",
  "status",
  "assignee",
  "email",
  "service",
  "message",
  "preferred_at",
  "payment_method",
  "offer",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "extra",
  "notes",
] as const;

/** RFC 4180: quote when the value holds a comma, quote or newline. */
function cell(value: unknown): string {
  if (value === null || value === undefined) return "";
  const text = String(value);
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function iso(date: Date | null) {
  return date ? date.toISOString() : "";
}

/**
 * Filtered CSV of the current leads view. `proxy.ts` already blocks
 * unauthenticated /api/admin/* with a 401; the session check here is a second
 * line of defence.
 */
export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const search = parseLeadSearch(Object.fromEntries(url.searchParams.entries()));
  const where = buildLeadWhere(search);

  const leads = await prisma.lead.findMany({
    where,
    orderBy: { submittedAt: "desc" },
    take: MAX_ROWS,
    include: {
      source: { select: { slug: true, label: true } },
      assignee: { select: { name: true } },
      offer: { select: { title: true } },
    },
  });

  const lines = [COLUMNS.join(",")];
  for (const lead of leads) {
    lines.push(
      [
        lead.id,
        iso(lead.submittedAt),
        lead.source.label,
        lead.source.slug,
        lead.fullName,
        lead.phone,
        lead.city,
        STATUS_META[lead.status]?.label ?? lead.status,
        lead.assignee?.name ?? "",
        lead.email ?? "",
        lead.service ?? "",
        lead.message ?? "",
        iso(lead.preferredAt),
        lead.paymentMethod ?? "",
        lead.offer?.title ?? "",
        lead.utmSource ?? "",
        lead.utmMedium ?? "",
        lead.utmCampaign ?? "",
        lead.utmContent ?? "",
        lead.utmTerm ?? "",
        lead.data ? JSON.stringify(lead.data) : "",
        lead.notesCount,
      ]
        .map(cell)
        .join(","),
    );
  }

  const scope = search.source ?? "all";
  const today = new Date().toISOString().slice(0, 10);

  // The BOM makes Excel read the file as UTF-8, so Arabic names survive.
  return new NextResponse(`﻿${lines.join("\r\n")}\r\n`, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="leads-${scope}-${today}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
