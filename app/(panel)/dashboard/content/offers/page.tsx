import { redirect } from "next/navigation";
import type { Prisma } from "@prisma/client";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { isEditor } from "@/lib/admin/auth";
import { DeleteButton, PageHeader } from "../../_components/forms";
import {
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
  Thumb,
  TitleCell,
  fmtDate,
} from "../_components/table";
import { deleteOffer } from "./actions";

export const dynamic = "force-dynamic";

const LIST = "/dashboard/content/offers";

function offerState(o: { active: boolean; startsAt: Date | null; endsAt: Date | null }, now: Date) {
  if (!o.active) return { tone: "slate" as const, label: "Hidden" };
  if (o.startsAt && o.startsAt > now) return { tone: "blue" as const, label: "Scheduled" };
  if (o.endsAt && o.endsAt < now) return { tone: "amber" as const, label: "Expired" };
  return { tone: "green" as const, label: "Live" };
}

export default async function OffersPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const canEdit = isEditor(session.user.role);

  const q = (await searchParams).q?.trim() ?? "";
  const where: Prisma.OfferWhereInput = q
    ? {
        OR: [
          { title: { contains: q, mode: "insensitive" } },
          { slug: { contains: q, mode: "insensitive" } },
          { category: { contains: q, mode: "insensitive" } },
          { badge: { contains: q, mode: "insensitive" } },
        ],
      }
    : {};

  const offers = await prisma.offer.findMany({
    where,
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    include: { _count: { select: { leads: true } } },
  });
  const now = new Date();

  return (
    <>
      <PageHeader
        title="Offers"
        subtitle={`${offers.length} offers · shown on /offers and the booking form`}
        right={canEdit ? <NewButton href={`${LIST}/new`}>New offer</NewButton> : undefined}
      />
      <TableShell>
        <ListToolbar q={q} placeholder="Search title, category, badge…" />
        <Table>
          <thead>
            <tr>
              <Th>Offer</Th>
              <Th>Price</Th>
              <Th>Window</Th>
              <Th>Leads</Th>
              <Th>Order</Th>
              <Th>Status</Th>
              <Th>Updated</Th>
              <Th align="right"></Th>
            </tr>
          </thead>
          <tbody>
            {offers.length === 0 && <EmptyRow colSpan={8}>No offers match.</EmptyRow>}
            {offers.map((o) => {
              const st = offerState(o, now);
              return (
                <tr key={o.id} className="fk-row">
                  <Td>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <Thumb src={o.image} alt={o.imageAlt} />
                      <TitleCell
                        href={`${LIST}/${o.id}/edit`}
                        title={o.title}
                        meta={
                          <span style={{ display: "inline-flex", gap: 8, alignItems: "center" }}>
                            <Code>{o.slug}</Code>
                            {o.category && (
                              <span dir="rtl" lang="ar" style={{ fontFamily: "var(--font-display), system-ui, sans-serif" }}>
                                {o.category}
                              </span>
                            )}
                            {o.badge && <Pill tone="primary" dot={false}>{o.badge}</Pill>}
                          </span>
                        }
                      />
                    </div>
                  </Td>
                  <Td>
                    <span style={{ fontFamily: "var(--font-data)", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>
                      <b style={{ color: "var(--ink)", fontWeight: 600 }}>{o.price.toLocaleString("en-US")}</b>
                      <span style={{ color: "var(--ink-4)", fontSize: 12 }}> SAR</span>
                      {o.oldPrice !== null && (
                        <span style={{ color: "var(--ink-4)", textDecoration: "line-through", marginLeft: 8, fontSize: 12.5 }}>
                          {o.oldPrice.toLocaleString("en-US")}
                        </span>
                      )}
                    </span>
                  </Td>
                  <Td>
                    <span style={{ fontFamily: "var(--font-data)", fontSize: 12.5, whiteSpace: "nowrap", color: o.startsAt || o.endsAt ? "var(--ink-2)" : "var(--ink-4)" }}>
                      {o.startsAt || o.endsAt ? `${o.startsAt ? fmtDate(o.startsAt) : "…"} → ${o.endsAt ? fmtDate(o.endsAt) : "…"}` : "Always"}
                    </span>
                  </Td>
                  <Td>
                    <Num>{o._count.leads}</Num>
                  </Td>
                  <Td>
                    <Num>{o.order}</Num>
                  </Td>
                  <Td>
                    <Pill tone={st.tone}>{st.label}</Pill>
                  </Td>
                  <Td>
                    <DateCell date={o.updatedAt} />
                  </Td>
                  <Td align="right">
                    <div style={{ display: "inline-flex", gap: 6, alignItems: "center" }}>
                      <EditLink href={`${LIST}/${o.id}/edit`} />
                      {canEdit && (
                        <DeleteButton
                          action={deleteOffer}
                          id={o.id}
                          warning={o._count.leads > 0 ? `${o._count.leads} lead(s) reference this offer.` : undefined}
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
