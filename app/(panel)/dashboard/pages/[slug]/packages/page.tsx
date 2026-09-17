import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { isEditor } from "@/lib/admin/auth";
import { getPageDef } from "@/lib/pages/registry";
import { Card } from "@/app/(panel)/dashboard/_components/card";
import { DeleteButton } from "@/app/(panel)/dashboard/_components/forms";
import { primaryButtonStyle, secondaryButtonStyle } from "@/app/(panel)/dashboard/_components/forms/styles";
import { Code, DateCell, EditLink, EmptyRow, Num, Pill, Table, Td, Th, TitleCell, fmtDate } from "@/app/(panel)/dashboard/content/_components/table";
import { deletePackage } from "@/app/(panel)/dashboard/packages/actions";

export const dynamic = "force-dynamic";

function packageState(p: { active: boolean; startsAt: Date | null; endsAt: Date | null }, now: Date) {
  if (!p.active) return { tone: "slate" as const, label: "Hidden" };
  if (p.startsAt && p.startsAt > now) return { tone: "blue" as const, label: "Scheduled" };
  if (p.endsAt && p.endsAt < now) return { tone: "amber" as const, label: "Expired" };
  return { tone: "green" as const, label: "Live" };
}

/** Packages a landing sells through its pay button (its own, then the global ones). */
export default async function PagePackagesTab({ params }: { params: Promise<{ slug: string }> }) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const canEdit = isEditor(session.user.role);

  const { slug } = await params;
  const def = getPageDef(slug);
  if (!def) notFound();
  if (def.kind !== "landing") {
    return (
      <Card title="No packages here">
        <div style={{ fontSize: 13.5, color: "var(--ink-3)", lineHeight: 1.7 }}>
          Only landing pages sell packages. The offers page sells the offers managed under Website › Offers.
        </div>
      </Card>
    );
  }

  const packages = await prisma.package.findMany({
    where: { OR: [{ pageSlug: def.slug }, { pageSlug: null }] },
    orderBy: [{ pageSlug: "desc" }, { order: "asc" }, { createdAt: "asc" }],
    include: { _count: { select: { orders: true } } },
  });
  const now = new Date();
  const own = packages.filter((p) => p.pageSlug === def.slug);
  const global = packages.filter((p) => p.pageSlug === null);

  const renderRows = (rows: typeof packages) =>
    rows.map((p) => {
      const st = packageState(p, now);
      return (
        <tr key={p.id} className="fk-row">
          <Td>
            <TitleCell
              href={`/dashboard/packages/${p.id}/edit`}
              title={p.title}
              meta={
                <span style={{ display: "inline-flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                  <Code>{p.slug}</Code>
                  {p.badge && <Pill tone="primary" dot={false}>{p.badge}</Pill>}
                </span>
              }
            />
          </Td>
          <Td>
            <span style={{ fontFamily: "var(--font-data)", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>
              <b style={{ color: "var(--ink)", fontWeight: 600 }}>{p.price.toLocaleString("en-US")}</b>
              <span style={{ color: "var(--ink-4)", fontSize: 12 }}> SAR</span>
              {p.oldPrice !== null && <span style={{ color: "var(--ink-4)", textDecoration: "line-through", marginLeft: 8, fontSize: 12.5 }}>{p.oldPrice.toLocaleString("en-US")}</span>}
            </span>
          </Td>
          <Td>
            <span style={{ fontFamily: "var(--font-data)", fontSize: 12.5, whiteSpace: "nowrap", color: p.startsAt || p.endsAt ? "var(--ink-2)" : "var(--ink-4)" }}>
              {p.startsAt || p.endsAt ? `${p.startsAt ? fmtDate(p.startsAt) : "…"} → ${p.endsAt ? fmtDate(p.endsAt) : "…"}` : "Always"}
            </span>
          </Td>
          <Td>
            <Num>{p._count.orders}</Num>
          </Td>
          <Td>
            <Pill tone={st.tone}>{st.label}</Pill>
          </Td>
          <Td>
            <DateCell date={p.updatedAt} />
          </Td>
          <Td align="right">
            <div style={{ display: "inline-flex", gap: 6, alignItems: "center" }}>
              <EditLink href={`/dashboard/packages/${p.id}/edit`} />
              {canEdit && <DeleteButton action={deletePackage} id={p.id} warning={p._count.orders > 0 ? `${p._count.orders} order(s) reference this package.` : undefined} />}
            </div>
          </Td>
        </tr>
      );
    });

  const head = (
    <thead>
      <tr>
        <Th>Package</Th>
        <Th>Price</Th>
        <Th>Window</Th>
        <Th>Orders</Th>
        <Th>Status</Th>
        <Th>Updated</Th>
        <Th align="right"></Th>
      </tr>
    </thead>
  );

  return (
    <div style={{ display: "grid", gap: 20 }}>
      <Card
        title={`Packages sold on ${def.title}`}
        subtitle="What the “احجزي وادفعي الآن” button on this page lists, in this order."
        padding={false}
        right={
          canEdit ? (
            <Link href={`/dashboard/packages/new?page=${def.slug}`} className="fk-btn" style={{ ...primaryButtonStyle, margin: 18 }}>
              New package for this page
            </Link>
          ) : undefined
        }
      >
        <Table>
          {head}
          <tbody>
            {own.length === 0 && (
              <EmptyRow colSpan={7}>
                No packages yet for this page. Until you add one, the pay button shows only the global packages below
                {global.length === 0 ? " (none yet), so visitors are pointed to WhatsApp." : "."}
              </EmptyRow>
            )}
            {renderRows(own)}
          </tbody>
        </Table>
      </Card>

      <Card
        title="Packages shown on every page"
        subtitle="Global packages (for example a consultation fee) appear after the page's own packages."
        padding={false}
        right={
          <Link href="/dashboard/packages?page=global" className="fk-btn" style={{ ...secondaryButtonStyle, margin: 18 }}>
            Manage
          </Link>
        }
      >
        <Table>
          {head}
          <tbody>
            {global.length === 0 && <EmptyRow colSpan={7}>No global packages.</EmptyRow>}
            {renderRows(global)}
          </tbody>
        </Table>
      </Card>
    </div>
  );
}
