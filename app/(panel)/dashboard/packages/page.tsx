import Link from "next/link";
import { redirect } from "next/navigation";
import type { Prisma } from "@prisma/client";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { isEditor } from "@/lib/admin/auth";
import { DeleteButton, PageHeader } from "../_components/forms";
import {
  Chip,
  Code,
  DateCell,
  EditLink,
  EmptyRow,
  ListToolbar,
  NewButton,
  Num,
  Pill,
  Table,
  TableShell,
  Td,
  Th,
  TitleCell,
  fmtDate,
} from "../content/_components/table";
import { deletePackage } from "./actions";
import { packagePageOptions, pageTitle } from "./_lib/pages";

export const dynamic = "force-dynamic";

const LIST = "/dashboard/packages";

function packageState(p: { active: boolean; startsAt: Date | null; endsAt: Date | null }, now: Date) {
  if (!p.active) return { tone: "slate" as const, label: "Hidden" };
  if (p.startsAt && p.startsAt > now) return { tone: "blue" as const, label: "Scheduled" };
  if (p.endsAt && p.endsAt < now) return { tone: "amber" as const, label: "Expired" };
  return { tone: "green" as const, label: "Live" };
}

export default async function PackagesPage({ searchParams }: { searchParams: Promise<{ q?: string; page?: string }> }) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const canEdit = isEditor(session.user.role);

  const sp = await searchParams;
  const q = sp.q?.trim() ?? "";
  const pageFilter = sp.page?.trim() ?? "";

  const where: Prisma.PackageWhereInput = {
    ...(q
      ? {
          OR: [
            { title: { contains: q, mode: "insensitive" } },
            { slug: { contains: q, mode: "insensitive" } },
            { badge: { contains: q, mode: "insensitive" } },
          ],
        }
      : {}),
    ...(pageFilter === "global" ? { pageSlug: null } : pageFilter ? { pageSlug: pageFilter } : {}),
  };

  const [packages, counts] = await Promise.all([
    prisma.package.findMany({
      where,
      orderBy: [{ pageSlug: "asc" }, { order: "asc" }, { createdAt: "asc" }],
      include: { _count: { select: { orders: true } } },
    }),
    prisma.package.groupBy({ by: ["pageSlug"], _count: { _all: true } }),
  ]);
  const now = new Date();
  const countByPage = new Map(counts.map((c) => [c.pageSlug ?? "global", c._count._all]));
  const pages = packagePageOptions().filter((p) => countByPage.has(p.slug));
  const chipHref = (value: string) => `?${new URLSearchParams({ ...(q ? { q } : {}), ...(value ? { page: value } : {}) }).toString()}`;

  return (
    <>
      <PageHeader
        title="Packages"
        subtitle={`${packages.length} packages · what the pay buttons on the landing pages sell`}
        right={canEdit ? <NewButton href={`${LIST}/new${pageFilter && pageFilter !== "global" ? `?page=${pageFilter}` : ""}`}>New package</NewButton> : undefined}
      />
      <TableShell>
        <ListToolbar
          q={q}
          placeholder="Search title, badge…"
          hidden={{ page: pageFilter || undefined }}
          chips={
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              <Chip href={chipHref("")} active={!pageFilter}>
                All
              </Chip>
              {countByPage.has("global") && (
                <Chip href={chipHref("global")} active={pageFilter === "global"}>
                  Every page · {countByPage.get("global")}
                </Chip>
              )}
              {pages.map((p) => (
                <Chip key={p.slug} href={chipHref(p.slug)} active={pageFilter === p.slug}>
                  <span dir="rtl" lang="ar" style={{ fontFamily: "var(--font-display), system-ui, sans-serif" }}>
                    {p.title}
                  </span>
                  <span style={{ color: "var(--ink-4)" }}>{countByPage.get(p.slug)}</span>
                </Chip>
              ))}
            </div>
          }
        />
        <Table>
          <thead>
            <tr>
              <Th>Package</Th>
              <Th>Page</Th>
              <Th>Price</Th>
              <Th>Window</Th>
              <Th>Orders</Th>
              <Th>Order</Th>
              <Th>Status</Th>
              <Th>Updated</Th>
              <Th align="right"></Th>
            </tr>
          </thead>
          <tbody>
            {packages.length === 0 && (
              <EmptyRow colSpan={9}>
                {q || pageFilter ? "No packages match." : "No packages yet. Create one and it appears in the pay button of its page."}
              </EmptyRow>
            )}
            {packages.map((p) => {
              const st = packageState(p, now);
              return (
                <tr key={p.id} className="fk-row">
                  <Td>
                    <TitleCell
                      href={`${LIST}/${p.id}/edit`}
                      title={p.title}
                      meta={
                        <span style={{ display: "inline-flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                          <Code>{p.slug}</Code>
                          {p.badge && <Pill tone="primary" dot={false}>{p.badge}</Pill>}
                          {p.features.length > 0 && <span style={{ color: "var(--ink-4)" }}>{p.features.length} points</span>}
                        </span>
                      }
                    />
                  </Td>
                  <Td>
                    {p.pageSlug ? (
                      <Link href={`/dashboard/pages/${p.pageSlug}/packages`} className="fk-link" dir="rtl" lang="ar" style={{ fontFamily: "var(--font-display), system-ui, sans-serif", color: "var(--ink-2)" }}>
                        {pageTitle(p.pageSlug)}
                      </Link>
                    ) : (
                      <Pill tone="blue" dot={false}>Every page</Pill>
                    )}
                  </Td>
                  <Td>
                    <span style={{ fontFamily: "var(--font-data)", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>
                      <b style={{ color: "var(--ink)", fontWeight: 600 }}>{p.price.toLocaleString("en-US")}</b>
                      <span style={{ color: "var(--ink-4)", fontSize: 12 }}> SAR</span>
                      {p.oldPrice !== null && (
                        <span style={{ color: "var(--ink-4)", textDecoration: "line-through", marginLeft: 8, fontSize: 12.5 }}>
                          {p.oldPrice.toLocaleString("en-US")}
                        </span>
                      )}
                    </span>
                  </Td>
                  <Td>
                    <span style={{ fontFamily: "var(--font-data)", fontSize: 12.5, whiteSpace: "nowrap", color: p.startsAt || p.endsAt ? "var(--ink-2)" : "var(--ink-4)" }}>
                      {p.startsAt || p.endsAt ? `${p.startsAt ? fmtDate(p.startsAt) : "…"} → ${p.endsAt ? fmtDate(p.endsAt) : "…"}` : "Always"}
                    </span>
                  </Td>
                  <Td>
                    {p._count.orders > 0 ? (
                      <Link href={`/dashboard/orders?q=${encodeURIComponent(p.title)}`} className="fk-link">
                        <Num>{p._count.orders}</Num>
                      </Link>
                    ) : (
                      <Num>0</Num>
                    )}
                  </Td>
                  <Td>
                    <Num>{p.order}</Num>
                  </Td>
                  <Td>
                    <Pill tone={st.tone}>{st.label}</Pill>
                  </Td>
                  <Td>
                    <DateCell date={p.updatedAt} />
                  </Td>
                  <Td align="right">
                    <div style={{ display: "inline-flex", gap: 6, alignItems: "center" }}>
                      <EditLink href={`${LIST}/${p.id}/edit`} />
                      {canEdit && (
                        <DeleteButton
                          action={deletePackage}
                          id={p.id}
                          warning={p._count.orders > 0 ? `${p._count.orders} order(s) reference this package.` : undefined}
                        />
                      )}
                    </div>
                  </Td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </TableShell>
    </>
  );
}
