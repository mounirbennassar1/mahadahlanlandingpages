import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  getLeadsByCity,
  getLeadsByUtmSource,
  getLeadsOverTime,
  getOverviewMetrics,
} from "@/lib/metrics";
import { getPageDef } from "@/lib/pages/registry";
import { getContentStatus } from "@/lib/pages/get";
import { Card } from "@/app/(panel)/dashboard/_components/card";
import { KpiRow } from "@/app/(panel)/dashboard/_components/kpi-row";
import { LeadsOverTimeChart } from "@/app/(panel)/dashboard/_components/leads-over-time";
import { StatusDonut } from "@/app/(panel)/dashboard/_components/status-donut";
import { CitiesBar } from "@/app/(panel)/dashboard/_components/cities-bar";
import { BarList } from "@/app/(panel)/dashboard/_components/bar-list";
import { RangeChips, parseRange } from "@/app/(panel)/dashboard/_components/range-chips";
import { LeadsTable } from "@/app/(panel)/dashboard/leads/_components/leads-table";
import { leadInclude } from "@/app/(panel)/dashboard/leads/_lib/query";
import { secondaryButtonStyle } from "@/app/(panel)/dashboard/_components/forms/styles";
import { NoSourceCard } from "../_components/no-source-card";

export const dynamic = "force-dynamic";

export default async function PageOverview({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ range?: string }>;
}) {
  const { slug } = await params;
  const def = getPageDef(slug);
  if (!def) notFound();

  const range = parseRange((await searchParams).range);
  const status = (await getContentStatus()).get(def.slug);

  const contentCard = (
    <Card
      title="Page text"
      subtitle={
        status && status.changedFields > 0
          ? `${status.changedFields} field${status.changedFields === 1 ? "" : "s"} changed${status.editedBy ? ` by ${status.editedBy}` : ""}`
          : "Showing the wording that ships with the site"
      }
      right={
        <Link
          href={`/dashboard/pages/${def.slug}/content`}
          className="fk-btn"
          style={secondaryButtonStyle}
        >
          Edit text
        </Link>
      }
    >
      <div style={{ fontSize: 13.5, color: "var(--ink-3)", lineHeight: 1.7 }}>
        {Object.keys(def.sections).length} sections can be edited on this page, including headings,
        paragraphs, lists and the search description.
      </div>
    </Card>
  );

  if (!def.leadSource) {
    return (
      <div style={{ display: "grid", gap: 20 }}>
        {contentCard}
        <NoSourceCard />
      </div>
    );
  }

  const source = await prisma.leadSource.findUnique({
    where: { slug: def.leadSource },
    select: { id: true, slug: true, label: true },
  });

  if (!source) {
    return (
      <div style={{ display: "grid", gap: 20 }}>
        {contentCard}
        <NoSourceCard pending sourceSlug={def.leadSource} />
      </div>
    );
  }

  const scope = { sourceId: source.id };
  const [overview, overTime, cities, utm, recent] = await Promise.all([
    getOverviewMetrics(scope),
    getLeadsOverTime(range, scope),
    getLeadsByCity(6, scope),
    getLeadsByUtmSource(scope),
    prisma.lead.findMany({
      where: { sourceId: source.id },
      orderBy: { submittedAt: "desc" },
      include: leadInclude,
      take: 8,
    }),
  ]);

  const users = await prisma.user.findMany({ select: { id: true, name: true, avatarHue: true } });
  const basePath = `/dashboard/pages/${def.slug}`;

  return (
    <div style={{ display: "grid", gap: 20 }}>
      <KpiRow overview={overview} />

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.6fr) minmax(0, 1fr)", gap: 20 }}>
        <Card
          title="Leads over time"
          subtitle={`Last ${range} days`}
          right={<RangeChips basePath={basePath} active={range} />}
        >
          <LeadsOverTimeChart data={overTime} />
        </Card>
        <StatusDonut byStatus={overview.byStatus} total={overview.total} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 20 }}>
        <BarList
          title="Ad platforms"
          subtitle="Where these leads came from"
          data={utm}
          empty="No campaign data on these leads."
        />
        <CitiesBar data={cities} />
      </div>

      <Card
        title="Latest leads"
        padding={false}
        right={
          <Link href={`${basePath}/leads`} className="fk-btn" style={secondaryButtonStyle}>
            View all
          </Link>
        }
      >
        <LeadsTable leads={recent} users={users} showSource={false} compact />
      </Card>

      {contentCard}
    </div>
  );
}
