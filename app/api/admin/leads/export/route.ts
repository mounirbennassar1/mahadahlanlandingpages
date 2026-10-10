import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { STATUS_META } from "@/lib/status";
import { can, getMember } from "@/lib/team/member";
import { logAudit } from "@/lib/team/audit";
import { toExportRow, type ExportMeta } from "@/lib/export/leads";
import { toCsv, toTxt } from "@/lib/export/text";
import { toXlsx } from "@/lib/export/xlsx";
import { toPdf } from "@/lib/export/pdf";
import { buildLeadWhere, parseLeadSearch, type LeadSearch } from "@/app/(panel)/dashboard/leads/_lib/query";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_ROWS = 10_000;

const FORMATS = {
  csv: { type: "text/csv; charset=utf-8", ext: "csv" },
  xlsx: { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", ext: "xlsx" },
  pdf: { type: "application/pdf", ext: "pdf" },
  txt: { type: "text/plain; charset=utf-8", ext: "txt" },
} as const;

type Format = keyof typeof FORMATS;

async function describeFilters(search: LeadSearch, scopedTo: string | null) {
  const lines: string[] = [];
  if (scopedTo) lines.push(`Only leads assigned to ${scopedTo}`);
  if (search.source) {
    const source = await prisma.leadSource.findUnique({ where: { slug: search.source }, select: { label: true } });
    lines.push(`Source: ${source?.label ?? search.source}`);
  }
  if (search.status) lines.push(`Status: ${STATUS_META[search.status].label}`);
  if (search.from || search.to) lines.push(`Period: ${search.from ?? "start"} to ${search.to ?? "today"}`);
  if (search.assignee === "none") lines.push("Assigned to: nobody");
  else if (search.assignee) {
    const user = await prisma.user.findUnique({ where: { id: search.assignee }, select: { name: true } });
    lines.push(`Assigned to: ${user?.name ?? "unknown member"}`);
  }
  if (search.q) lines.push(`Search: ${search.q}`);
  return lines.length ? lines : ["All leads"];
}

/**
 * The current leads view as Excel, CSV, PDF or TXT. Takes the same query
 * string as /dashboard/leads plus `format`. `proxy.ts` already 401s signed-out
 * calls to /api/admin/*; the member check here also covers deactivated users
 * and roles without `leads.export`.
 */
export async function GET(request: Request) {
  const member = await getMember();
  if (!member) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!can(member, "leads.export")) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const url = new URL(request.url);
  const format = (url.searchParams.get("format") ?? "csv") as Format;
  if (!(format in FORMATS)) return NextResponse.json({ error: "Unknown format" }, { status: 400 });

  const search = parseLeadSearch(Object.fromEntries(url.searchParams.entries()));
  const seesAll = can(member, "leads.view_all");
  const where = buildLeadWhere(search, { onlyAssignedTo: seesAll ? undefined : member.id });

  const [leads, total] = await Promise.all([
    prisma.lead.findMany({
      where,
      orderBy: { submittedAt: "desc" },
      take: MAX_ROWS,
      include: {
        source: { select: { slug: true, label: true } },
        assignee: { select: { name: true } },
        offer: { select: { title: true } },
      },
    }),
    prisma.lead.count({ where }),
  ]);

  const rows = leads.map(toExportRow);
  const meta: ExportMeta = {
    generatedAt: new Date(),
    generatedBy: member.name,
    filters: await describeFilters(search, seesAll ? null : member.name),
    total,
    truncated: total > rows.length,
  };

  let body: string | Buffer;
  switch (format) {
    case "csv":
      body = toCsv(rows);
      break;
    case "txt":
      body = toTxt(rows, meta);
      break;
    case "xlsx":
      body = await toXlsx(rows, meta);
      break;
    case "pdf":
      body = await toPdf(rows, meta);
      break;
  }

  await logAudit(member.id, "leads.exported", {}, {
    format,
    count: rows.length,
    filters: meta.filters,
  });

  const scope = search.source ?? "all";
  const today = meta.generatedAt.toLocaleDateString("en-CA", { timeZone: "Asia/Riyadh" });
  return new NextResponse(typeof body === "string" ? body : new Uint8Array(body), {
    headers: {
      "Content-Type": FORMATS[format].type,
      "Content-Disposition": `attachment; filename="leads-${scope}-${today}.${FORMATS[format].ext}"`,
      "Cache-Control": "no-store",
    },
  });
}
