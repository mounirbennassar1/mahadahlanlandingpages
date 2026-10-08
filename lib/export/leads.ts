import type { Prisma } from "@prisma/client";
import { STATUS_META } from "@/lib/status";

/** What every export format is built from: one flat row per lead. */
export const EXPORT_COLUMNS = [
  { key: "ref", header: "Ref", width: 12 },
  { key: "submitted", header: "Submitted (Riyadh)", width: 18 },
  { key: "name", header: "Name", width: 24 },
  { key: "phone", header: "Phone", width: 18 },
  { key: "city", header: "City", width: 14 },
  { key: "source", header: "Source", width: 26 },
  { key: "sourceSlug", header: "Source slug", width: 16 },
  { key: "status", header: "Status", width: 14 },
  { key: "assignee", header: "Assigned to", width: 18 },
  { key: "email", header: "Email", width: 24 },
  { key: "service", header: "Service", width: 22 },
  { key: "preferredAt", header: "Preferred time", width: 18 },
  { key: "payment", header: "Payment", width: 10 },
  { key: "offer", header: "Offer", width: 22 },
  { key: "message", header: "Message", width: 40 },
  { key: "utmSource", header: "UTM source", width: 14 },
  { key: "utmMedium", header: "UTM medium", width: 14 },
  { key: "utmCampaign", header: "UTM campaign", width: 20 },
  { key: "utmContent", header: "UTM content", width: 16 },
  { key: "utmTerm", header: "UTM term", width: 16 },
] as const;

export type ExportKey = (typeof EXPORT_COLUMNS)[number]["key"];
export type ExportRow = Record<ExportKey, string> & { submittedAt: Date };

export type ExportLead = Prisma.LeadGetPayload<{
  include: {
    source: { select: { slug: true; label: true } };
    assignee: { select: { name: true } };
    offer: { select: { title: true } };
  };
}>;

const RIYADH = "Asia/Riyadh";

/** "2026-10-08 14:32" on the clinic's clock, Western digits. */
export function formatRiyadh(date: Date | null | undefined) {
  if (!date) return "";
  const day = date.toLocaleDateString("en-CA", { timeZone: RIYADH });
  const time = date.toLocaleTimeString("en-GB", { timeZone: RIYADH, hour: "2-digit", minute: "2-digit", hourCycle: "h23" });
  return `${day} ${time}`;
}

export function leadRef(id: string) {
  return `LD-${id.slice(-6).toUpperCase()}`;
}

export function toExportRow(lead: ExportLead): ExportRow {
  return {
    submittedAt: lead.submittedAt,
    ref: leadRef(lead.id),
    submitted: formatRiyadh(lead.submittedAt),
    name: lead.fullName,
    phone: lead.phone,
    city: lead.city,
    source: lead.source.label,
    sourceSlug: lead.source.slug,
    status: STATUS_META[lead.status]?.label ?? lead.status,
    assignee: lead.assignee?.name ?? "",
    email: lead.email ?? "",
    service: lead.service ?? "",
    preferredAt: formatRiyadh(lead.preferredAt),
    payment: lead.paymentMethod ?? "",
    offer: lead.offer?.title ?? "",
    message: lead.message ?? "",
    utmSource: lead.utmSource ?? "",
    utmMedium: lead.utmMedium ?? "",
    utmCampaign: lead.utmCampaign ?? "",
    utmContent: lead.utmContent ?? "",
    utmTerm: lead.utmTerm ?? "",
  };
}

/** Header block shared by the PDF, TXT and Excel summary sheet. */
export type ExportMeta = {
  generatedAt: Date;
  generatedBy: string;
  filters: string[];
  total: number;
  truncated: boolean;
};
