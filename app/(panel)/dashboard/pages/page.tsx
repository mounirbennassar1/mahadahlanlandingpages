import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getLeadsBySource, getSourceKpis } from "@/lib/metrics";
import { PAGES, type PageKindFilter } from "./_lib/index-data";
import { getContentStatus } from "@/lib/pages/get";
import { PageHeader } from "@/app/(panel)/dashboard/_components/forms";
import { BarList } from "@/app/(panel)/dashboard/_components/bar-list";
import {
  Chip,
  Code,
  DateCell,
  EmptyRow,
  ExternalLink,
  ListToolbar,
  Num,
  Pill,
  SITE_URL,
  Table,
  TableShell,
  Td,
  Th,
  TitleCell,
} from "@/app/(panel)/dashboard/content/_components/table";

export const dynamic = "force-dynamic";

const KIND_TONE = { home: "primary", site: "blue", landing: "green" } as const;
const KINDS: { value: PageKindFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "home", label: "Home" },
  { value: "site", label: "Website" },
  { value: "landing", label: "Landings" },
];

export default async function PagesIndex({
  searchParams,
}: {
  searchParams: Promise<{ kind?: string; q?: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const { kind = "all", q = "" } = await searchParams;
  const [status, sources, kpis, bySource] = await Promise.all([
    getContentStatus(),
    prisma.leadSource.findMany({ select: { id: true, slug: true, label: true } }),
    getSourceKpis(),
    getLeadsBySource(),
  ]);

  const sourceBySlug = new Map(sources.map((s) => [s.slug, s]));
  const needle = q.trim().toLowerCase();
  const rows = PAGES.filter((def) => {
    if (kind !== "all" && def.kind !== kind) return false;
    if (!needle) return true;
    return (
      def.title.toLowerCase().includes(needle) ||
      def.slug.toLowerCase().includes(needle) ||
      def.path.toLowerCase().includes(needle)
    );
  });

  const pageBySourceSlug = new Map(
    PAGES.filter((p) => p.leadSource).map((p) => [p.leadSource as string, p]),
  );

  return (
    <div>
      <PageHeader
        title="Pages"
        subtitle="Edit the wording of every public page, and see the leads each one brings in."
      />

      <div style={{ marginBottom: 20 }}>
        <BarList
          title="Leads by page"
          subtitle="All time, highest first"
          labelWidth={150}
          empty="No leads have been submitted yet."
          data={bySource.slice(0, 8).map((row) => {
            const page = pageBySourceSlug.get(row.slug);
            return {
              label: page?.title ?? row.label,
              count: row.count,
              href: page ? `/dashboard/pages/${page.slug}/leads` : `/dashboard/leads?source=${row.slug}`,
            };
          })}
        />
      </div>

      <TableShell>
        <ListToolbar
          q={q}
          placeholder="Search pages…"
          hidden={{ kind: kind === "all" ? undefined : kind }}
          chips={KINDS.map((k) => (
            <Chip
              key={k.value}
              href={`?kind=${k.value}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
              active={kind === k.value}
            >
              {k.label}
            </Chip>
          ))}
        />
        <Table>
          <thead>
            <tr>
              <Th>Page</Th>
              <Th>Type</Th>
              <Th>Content</Th>
              <Th align="right">Leads</Th>
              <Th align="right">7 days</Th>
              <Th align="right">Booked</Th>
              <Th align="right">Conv.</Th>
              <Th width={190} />
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && <EmptyRow colSpan={8}>No pages match that search.</EmptyRow>}
            {rows.map((def) => {
              const state = status.get(def.slug);
              const source = def.leadSource ? sourceBySlug.get(def.leadSource) : undefined;
              const kpi = source ? kpis.get(source.id) : undefined;
              const total = kpi?.total ?? 0;
              const booked = kpi?.booked ?? 0;
              const conv = total === 0 ? 0 : Math.round((booked / total) * 100);

              return (
                <tr key={def.slug}>
                  <Td>
                    <TitleCell
                      title={def.title}
                      meta={<Code>{def.path}</Code>}
                      href={`/dashboard/pages/${def.slug}`}
                    />
                  </Td>
                  <Td>
                    <Pill tone={KIND_TONE[def.kind]}>{def.kind}</Pill>
                  </Td>
                  <Td>
                    {state && state.changedFields > 0 ? (
                      <span style={{ fontSize: 12.5, color: "var(--ink-2)" }}>
                        <Pill tone="amber">Customized</Pill>{" "}
                        <span style={{ color: "var(--ink-3)" }}>
                          {state.changedFields} field{state.changedFields === 1 ? "" : "s"}
                          {state.editedBy ? ` · ${state.editedBy}` : ""}
                        </span>
                        <div style={{ marginTop: 3 }}>
                          <DateCell date={state.updatedAt} />
                        </div>
                      </span>
                    ) : (
                      <span style={{ fontSize: 12.5, color: "var(--ink-4)" }}>Default</span>
                    )}
                  </Td>
                  <Td align="right">{def.leadSource ? <Num>{total}</Num> : <Dash />}</Td>
                  <Td align="right">{def.leadSource ? <Num>{kpi?.week ?? 0}</Num> : <Dash />}</Td>
                  <Td align="right">{def.leadSource ? <Num>{booked}</Num> : <Dash />}</Td>
                  <Td align="right">
                    {def.leadSource && total > 0 ? <Num>{`${conv}%`}</Num> : <Dash />}
                  </Td>
                  <Td align="right">
                    <span style={{ display: "inline-flex", gap: 10, justifyContent: "flex-end" }}>
                      <Link href={`/dashboard/pages/${def.slug}/content`} className="fk-link">
                        Edit text
                      </Link>
                      <ExternalLink href={`${SITE_URL}${def.path}`} />
                    </span>
                  </Td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </TableShell>
    </div>
  );
}

function Dash() {
  return <span style={{ color: "var(--ink-4)" }}>—</span>;
}
