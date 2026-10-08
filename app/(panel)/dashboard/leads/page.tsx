import { prisma } from "@/lib/prisma";
import { STATUS_ORDER, formatRelative } from "@/lib/status";
import { can, requirePageMember } from "@/lib/team/member";
import { LeadsFilters } from "./filters";
import { StatusPill } from "./status-pill";
import { AssigneePill } from "./assignee-pill";
import { LeadDetails, hasLeadDetails } from "./lead-details";
import { ExportMenu } from "./export-menu";
import {
  PAGE_SIZE,
  buildLeadWhere,
  leadInclude,
  parseLeadSearch,
  searchToParams,
  type RawSearch,
} from "./_lib/query";

export const dynamic = "force-dynamic";

function leadAvatarHue(name: string) {
  let h = 0;
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) % 360;
  const hues = [295, 220, 155, 30, 330, 250, 120];
  return hues[h % hues.length];
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase() || "·";
}

export default async function LeadsPage({ searchParams }: { searchParams: Promise<RawSearch> }) {
  const member = await requirePageMember();
  const search = parseLeadSearch(await searchParams);
  const pageNum = search.page;
  const seesAll = can(member, "leads.view_all");
  const scope = { onlyAssignedTo: seesAll ? undefined : member.id };
  const where = buildLeadWhere(search, scope);

  const [leads, totalCount, sources, statusCounts, allUsers] = await Promise.all([
    prisma.lead.findMany({
      where,
      orderBy: { submittedAt: "desc" },
      include: leadInclude,
      skip: (pageNum - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.lead.count({ where }),
    prisma.leadSource.findMany({
      orderBy: { label: "asc" },
      select: {
        slug: true,
        label: true,
        _count: { select: { leads: seesAll ? true : { where: { assigneeId: member.id } } } },
      },
    }),
    // Status chips count everything else in the filter, so switching status
    // never changes the other numbers.
    prisma.lead.groupBy({
      by: ["status"],
      _count: { _all: true },
      where: buildLeadWhere({ ...search, status: null }, scope),
    }),
    prisma.user.findMany({
      where: { active: true },
      orderBy: { name: "asc" },
      select: { id: true, name: true, avatarHue: true },
    }),
  ]);

  const statusCountMap = new Map(statusCounts.map((s) => [s.status, s._count._all] as const));
  const allStatusTotal = statusCounts.reduce((sum, s) => sum + s._count._all, 0);
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  return (
    <>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 24, gap: 16 }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 30, fontWeight: 700, letterSpacing: "-0.025em", color: "var(--ink)", margin: 0 }}>
            Leads
          </h1>
          <div style={{ fontSize: 14, color: "var(--ink-3)", marginTop: 6 }}>
            {totalCount.toLocaleString("en-US")} leads · {seesAll ? "filtered view" : "assigned to you"}
          </div>
        </div>
        {can(member, "leads.export") && (
          <ExportMenu query={searchToParams(search).toString()} count={totalCount} />
        )}
      </div>

      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--hairline)",
          borderRadius: "var(--radius)",
          overflow: "hidden",
          padding: 0,
        }}
      >
        <LeadsFilters
          sources={sources.map((s) => ({ slug: s.slug, label: s.label, count: s._count.leads }))}
          activeSource={search.source}
          activeStatus={search.status}
          query={search.q}
          from={search.from}
          to={search.to}
          assignee={search.assignee}
          assignees={seesAll ? allUsers.map((u) => ({ id: u.id, name: u.name })) : null}
          statusCounts={{
            ALL: allStatusTotal,
            ...Object.fromEntries(
              STATUS_ORDER.map((s) => [s, statusCountMap.get(s) ?? 0])
            ),
          }}
        />

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, fontSize: 14 }}>
            <thead>
              <tr>
                <Th>Lead</Th>
                <Th>Phone</Th>
                <Th>City</Th>
                <Th>Source</Th>
                <Th>Details</Th>
                <Th>Status</Th>
                <Th>Assigned to</Th>
                <Th>Submitted</Th>
              </tr>
            </thead>
            <tbody>
              {leads.length === 0 && (
                <tr>
                  <td colSpan={8} style={{ padding: 40, textAlign: "center", color: "var(--ink-3)" }}>
                    No leads match the current filter.
                  </td>
                </tr>
              )}
              {leads.map((lead) => {
                const hue = leadAvatarHue(lead.fullName);
                const rel = formatRelative(lead.submittedAt);
                return (
                  <tr key={lead.id} style={{ transition: "background 0.12s" }}>
                    <Td>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: "50%",
                            display: "grid",
                            placeItems: "center",
                            color: "#fff",
                            fontWeight: 700,
                            fontSize: 12,
                            fontFamily: "var(--font-display)",
                            flex: "none",
                            letterSpacing: "-0.01em",
                            background: `linear-gradient(135deg, oklch(0.72 0.12 ${hue}), oklch(0.5 0.15 ${hue}))`,
                          }}
                        >
                          {initials(lead.fullName)}
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", minWidth: 0, lineHeight: 1.2 }}>
                          <b style={{ color: "var(--ink)", fontWeight: 600, fontSize: 14 }}>{lead.fullName}</b>
                          <span style={{ fontSize: 12, color: "var(--ink-3)", fontFamily: "var(--font-data)", marginTop: 2 }}>
                            #LD-{lead.id.slice(-6).toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </Td>
                    <Td>
                      <span style={{ fontFamily: "var(--font-data)", fontVariantNumeric: "tabular-nums", color: "var(--ink-2)", fontSize: 13.5 }}>
                        {lead.phone}
                      </span>
                    </Td>
                    <Td>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 6,
                          padding: "5px 10px",
                          background: "var(--surface-2)",
                          border: "1px solid var(--hairline)",
                          borderRadius: 7,
                          fontSize: 12.5,
                          color: "var(--ink-2)",
                          fontWeight: 500,
                        }}
                      >
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--ink-4)" }}>
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                        {lead.city}
                      </span>
                    </Td>
                    <Td>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          padding: "4px 10px",
                          background: "var(--primary-softer)",
                          color: "var(--primary)",
                          borderRadius: 999,
                          fontFamily: "var(--font-data)",
                          fontSize: 12,
                          fontWeight: 600,
                        }}
                      >
                        {lead.source.label}
                      </span>
                      <span style={{ display: "block", fontFamily: "var(--font-data)", fontSize: 11, color: "var(--ink-4)", marginTop: 4 }}>
                        {lead.source.slug}
                      </span>
                    </Td>
                    <Td>
                      {hasLeadDetails(lead) ? <LeadDetails data={lead} /> : <span style={{ color: "var(--ink-4)" }}>—</span>}
                    </Td>
                    <Td>
                      <StatusPill leadId={lead.id} status={lead.status} disabled={!can(member, "leads.update")} />
                    </Td>
                    <Td>
                      <AssigneePill
                        leadId={lead.id}
                        assignee={lead.assignee ? { id: lead.assignee.id, name: lead.assignee.name, avatarHue: lead.assignee.avatarHue } : null}
                        users={allUsers}
                        disabled={!can(member, "leads.assign")}
                      />
                    </Td>
                    <Td>
                      <span style={{ fontFamily: "var(--font-data)", fontVariantNumeric: "tabular-nums", fontSize: 13, color: "var(--ink-2)", display: "block", lineHeight: 1.25 }}>
                        {rel.when}
                        <span style={{ color: "var(--ink-4)", fontSize: 12, display: "block" }}>{rel.time}</span>
                      </span>
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <Pagination
          total={totalCount}
          pageSize={PAGE_SIZE}
          currentPage={pageNum}
          totalPages={totalPages}
          hrefFor={(page) => `?${searchToParams(search, { page: String(page) }).toString()}`}
        />
      </div>
    </>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th
      style={{
        textAlign: "left",
        padding: "12px 16px",
        fontSize: 11.5,
        fontWeight: 600,
        color: "var(--ink-3)",
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        background: "var(--surface-2)",
        borderBottom: "1px solid var(--hairline)",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </th>
  );
}

function Td({ children }: { children: React.ReactNode }) {
  return (
    <td
      style={{
        padding: "14px 16px",
        borderBottom: "1px solid var(--hairline)",
        verticalAlign: "middle",
        color: "var(--ink-2)",
      }}
    >
      {children}
    </td>
  );
}

function Pagination({
  total,
  pageSize,
  currentPage,
  totalPages,
  hrefFor,
}: {
  total: number;
  pageSize: number;
  currentPage: number;
  totalPages: number;
  hrefFor: (page: number) => string;
}) {
  const start = total === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const end = Math.min(total, currentPage * pageSize);
  // A window of up to 7 pages around the current one.
  const first = Math.max(1, Math.min(currentPage - 3, totalPages - 6));
  const pages = Array.from({ length: Math.min(totalPages, 7) }, (_, i) => first + i);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "14px 22px",
        borderTop: "1px solid var(--hairline)",
        fontSize: 13,
        color: "var(--ink-3)",
      }}
    >
      <div>
        Showing <b style={{ color: "var(--ink)" }}>{start}–{end}</b> of{" "}
        <b style={{ color: "var(--ink)" }}>{total.toLocaleString("en-US")}</b> leads
      </div>
      <div style={{ display: "flex", gap: 4 }}>
        {pages.map((p) => (
          <PageLink key={p} page={p} href={hrefFor(p)} active={p === currentPage} />
        ))}
      </div>
    </div>
  );
}

function PageLink({ page, href, active }: { page: number; href: string; active: boolean }) {
  return (
    <a
      href={href}
      style={{
        width: 32,
        height: 32,
        borderRadius: 8,
        display: "grid",
        placeItems: "center",
        color: active ? "#fff" : "var(--ink-2)",
        fontSize: 13,
        fontWeight: 500,
        fontFamily: "var(--font-data)",
        background: active ? "var(--ink)" : "transparent",
      }}
    >
      {page}
    </a>
  );
}
