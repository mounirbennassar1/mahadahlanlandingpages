import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import type { OrderEventType, Prisma } from "@prisma/client";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { formatRelative } from "@/lib/status";
import { getNoonConfig } from "@/lib/noon";
import { ORDER_STATUS_META } from "@/lib/order-status";
import { getPageDef } from "@/lib/pages/registry";
import { Card } from "@/app/(panel)/dashboard/_components/card";
import { PageHeader } from "@/app/(panel)/dashboard/_components/forms";
import { secondaryButtonStyle } from "@/app/(panel)/dashboard/_components/forms/styles";
import { DeleteButton } from "@/app/(panel)/dashboard/_components/forms/delete-button";
import { Code, Pill } from "@/app/(panel)/dashboard/content/_components/table";
import { OrderStatusPill } from "../_components/order-status-pill";
import { deleteOrder } from "../actions";
import { OrderNoteForm, RefundForm, SyncButton } from "./order-actions";

export const dynamic = "force-dynamic";

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      lead: { select: { id: true, status: true, assignee: { select: { name: true } } } },
      package: { select: { id: true, title: true } },
      offer: { select: { id: true, title: true } },
      events: { orderBy: { createdAt: "desc" }, include: { user: { select: { name: true } } } },
    },
  });
  if (!order) notFound();

  const page = order.pageSlug ? getPageDef(order.pageSlug) : undefined;
  const rel = formatRelative(order.createdAt);
  const noon = getNoonConfig();
  const remaining = order.amount - order.refundedAmount;
  const isAdmin = session.user.role === "ADMIN";

  return (
    <div>
      <PageHeader
        title={<span style={{ fontFamily: "var(--font-data)", letterSpacing: "0.04em" }}>{order.reference}</span>}
        subtitle={
          <span style={{ display: "inline-flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <OrderStatusPill status={order.status} />
            <span>
              {rel.when} · {rel.time}
            </span>
            {page ? (
              <Link href={`/dashboard/pages/${page.slug}/orders`} className="fk-link">
                {page.title}
              </Link>
            ) : (
              <span style={{ color: "var(--ink-4)" }}>no page</span>
            )}
          </span>
        }
        right={
          <>
            <Link href="/dashboard/orders" className="fk-btn" style={secondaryButtonStyle}>
              Back to orders
            </Link>
            {isAdmin && order.status !== "PAID" && (
              <DeleteButton action={deleteOrder} id={order.id} redirectTo="/dashboard/orders" warning="Delete this order and its history permanently?" />
            )}
          </>
        }
      />

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 380px", gap: 20, alignItems: "start" }}>
        <div style={{ display: "grid", gap: 20, minWidth: 0 }}>
          <Card title="Purchase">
            <dl style={dlStyle}>
              <Row label="Item">
                <Ar>{order.itemTitle}</Ar>
                <span style={{ marginLeft: 8 }}>
                  {order.itemType === "PACKAGE" ? (
                    order.package ? (
                      <Link href={`/dashboard/packages/${order.package.id}/edit`} className="fk-link" style={{ fontSize: 12.5 }}>
                        package ↗
                      </Link>
                    ) : (
                      <span style={{ fontSize: 12.5, color: "var(--ink-4)" }}>(package deleted)</span>
                    )
                  ) : order.offer ? (
                    <Link href={`/dashboard/content/offers/${order.offer.id}/edit`} className="fk-link" style={{ fontSize: 12.5 }}>
                      offer ↗
                    </Link>
                  ) : (
                    <span style={{ fontSize: 12.5, color: "var(--ink-4)" }}>(offer deleted)</span>
                  )}
                </span>
              </Row>
              <Row label="Amount">
                <b style={{ fontFamily: "var(--font-data)", fontSize: 16, color: "var(--ink)" }}>
                  {order.amount.toLocaleString("en-US")} {order.currency}
                </b>
                {order.refundedAmount > 0 && <span style={{ marginLeft: 10, color: "var(--blue)", fontSize: 12.5 }}>−{order.refundedAmount.toLocaleString("en-US")} refunded</span>}
              </Row>
              {order.paidAt && (
                <Row label="Paid at">
                  <span style={{ fontFamily: "var(--font-data)" }}>{fmt(order.paidAt)}</span>
                </Row>
              )}
              {order.failureReason && (
                <Row label="Reason">
                  <span style={{ color: "var(--red)" }}>{order.failureReason}</span>
                </Row>
              )}
            </dl>
          </Card>

          <Card title="Customer">
            <dl style={dlStyle}>
              <Row label="Name">
                <Ar>{order.fullName}</Ar>
              </Row>
              <Row label="Phone">
                <a href={`tel:${order.phone}`} style={dataLink}>
                  {order.phone}
                </a>
                <a href={`https://wa.me/${order.phone.replace(/[^\d]/g, "")}`} target="_blank" rel="noreferrer" style={{ ...dataLink, marginLeft: 12 }}>
                  WhatsApp ↗
                </a>
              </Row>
              <Row label="City">
                <Ar>{order.city}</Ar>
              </Row>
              {order.email && (
                <Row label="Email">
                  <a href={`mailto:${order.email}`} style={dataLink}>
                    {order.email}
                  </a>
                </Row>
              )}
              <Row label="Lead">
                {order.lead ? (
                  <Link href={`/dashboard/leads/${order.lead.id}`} className="fk-link" style={dataLink}>
                    #LD-{order.lead.id.slice(-6).toUpperCase()} · {order.lead.status.toLowerCase()}
                    {order.lead.assignee ? ` · ${order.lead.assignee.name}` : ""}
                  </Link>
                ) : (
                  <span style={{ color: "var(--ink-4)" }}>none</span>
                )}
              </Row>
            </dl>
          </Card>

          <Card title="noon payments">
            <dl style={dlStyle}>
              <Row label="Order id">{order.noonOrderId ? <Code>{order.noonOrderId}</Code> : <span style={{ color: "var(--ink-4)" }}>never sent (checkout failed before noon)</span>}</Row>
              <Row label="noon status">{order.noonStatus ? <Pill tone="slate" dot={false}>{order.noonStatus}</Pill> : <span style={{ color: "var(--ink-4)" }}>—</span>}</Row>
              {order.paymentBrand && <Row label="Paid with">{order.paymentBrand.replace(/_/g, " ")}</Row>}
              <Row label="Environment">
                <Pill tone={noon.env === "live" ? "green" : "amber"} dot={false}>
                  {noon.env}
                </Pill>
              </Row>
              {order.checkoutUrl && order.status === "PENDING" && (
                <Row label="Checkout link">
                  <a href={order.checkoutUrl} target="_blank" rel="noreferrer" style={dataLink}>
                    Open noon page ↗
                  </a>
                </Row>
              )}
            </dl>
          </Card>

          {(order.utmSource || order.utmMedium || order.utmCampaign) && (
            <Card title="Campaign">
              <dl style={dlStyle}>
                {order.utmSource && <Row label="Source">{order.utmSource}</Row>}
                {order.utmMedium && <Row label="Medium">{order.utmMedium}</Row>}
                {order.utmCampaign && <Row label="Campaign">{order.utmCampaign}</Row>}
                {order.utmContent && <Row label="Content">{order.utmContent}</Row>}
                {order.utmTerm && <Row label="Term">{order.utmTerm}</Row>}
              </dl>
            </Card>
          )}
        </div>

        <div style={{ display: "grid", gap: 20 }}>
          <Card title="Actions" subtitle={noon.configured ? `Talks to noon (${noon.env})` : "noon is not configured on this server"}>
            <div style={{ display: "grid", gap: 12 }}>
              <SyncButton orderId={order.id} disabled={!order.noonOrderId} />
              {isAdmin && order.status === "PAID" && remaining > 0 && <RefundForm orderId={order.id} remaining={remaining} />}
              <div style={{ fontSize: 12, color: "var(--ink-4)", lineHeight: 1.6 }}>
                Status meaning: {ORDER_STATUS_META[order.status].label} — {statusHelp(order.status)}
              </div>
            </div>
          </Card>

          <Card title="Add a note">
            <OrderNoteForm orderId={order.id} />
          </Card>

          <Card title="History" subtitle={`${order.events.length} event${order.events.length === 1 ? "" : "s"}`}>
            <Timeline rows={order.events} />
          </Card>
        </div>
      </div>
    </div>
  );
}

function statusHelp(status: string) {
  switch (status) {
    case "PENDING":
      return "the customer was sent to noon and has not completed the payment yet.";
    case "PAID":
      return "noon captured the money; the lead is confirmed.";
    case "FAILED":
      return "the bank declined or noon could not start the checkout.";
    case "CANCELLED":
      return "the customer left noon's page or the payment was reversed.";
    case "EXPIRED":
      return "noon closed the checkout after its time limit.";
    case "REFUNDED":
      return "the full amount was returned to the customer.";
    default:
      return "";
  }
}

const DOT: Record<OrderEventType, string> = {
  CREATED: "var(--blue)",
  CHECKOUT: "var(--primary)",
  RETURN: "var(--amber)",
  WEBHOOK: "var(--amber)",
  SYNC: "var(--slate)",
  STATUS: "var(--red)",
  REFUND: "var(--blue)",
  NOTE: "var(--primary)",
};

const EVENT_LABEL: Record<OrderEventType, string> = {
  CREATED: "Order created",
  CHECKOUT: "Sent to noon",
  RETURN: "Customer returned from noon",
  WEBHOOK: "noon webhook",
  SYNC: "Checked with noon",
  STATUS: "Status changed",
  REFUND: "Refund",
  NOTE: "Note",
};

type EventRow = { id: string; type: OrderEventType; body: string | null; meta: Prisma.JsonValue; createdAt: Date; user: { name: string } | null };

function Timeline({ rows }: { rows: EventRow[] }) {
  if (rows.length === 0) return <div style={{ fontSize: 13, color: "var(--ink-3)" }}>Nothing recorded yet.</div>;
  return (
    <ol style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 2 }}>
      {rows.map((row, i) => (
        <li key={row.id} style={{ display: "grid", gridTemplateColumns: "18px 1fr", gap: 12 }}>
          <div style={{ display: "grid", justifyItems: "center", gap: 2 }}>
            <span style={{ width: 9, height: 9, borderRadius: "50%", background: DOT[row.type], marginTop: 6 }} />
            {i < rows.length - 1 && <span style={{ width: 1, flex: 1, background: "var(--hairline)", minHeight: 18 }} />}
          </div>
          <div style={{ paddingBottom: 16, minWidth: 0 }}>
            <div style={{ fontSize: 13.5, color: "var(--ink)", fontWeight: 600 }}>{EVENT_LABEL[row.type]}</div>
            {row.body && (
              <div dir="auto" style={{ marginTop: 6, padding: "10px 12px", background: "var(--surface-2)", border: "1px solid var(--hairline)", borderRadius: 10, fontSize: 13, color: "var(--ink-2)", lineHeight: 1.7, whiteSpace: "pre-wrap", unicodeBidi: "plaintext" }}>
                {row.body}
              </div>
            )}
            <div style={{ fontSize: 12, color: "var(--ink-4)", marginTop: 4, fontFamily: "var(--font-data)" }}>
              {row.user ? `${row.user.name} · ` : ""}
              {fmt(row.createdAt)}
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}

function fmt(d: Date) {
  return d.toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

const dlStyle: React.CSSProperties = { margin: 0, display: "grid", gridTemplateColumns: "auto minmax(0, 1fr)", columnGap: 16, rowGap: 10, fontSize: 13.5 };
const dataLink: React.CSSProperties = { fontFamily: "var(--font-data)", color: "var(--primary)" };

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <>
      <dt style={{ color: "var(--ink-4)", fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em", alignSelf: "start", paddingTop: 3, whiteSpace: "nowrap" }}>{label}</dt>
      <dd style={{ margin: 0, color: "var(--ink-2)", overflowWrap: "anywhere" }}>{children}</dd>
    </>
  );
}

function Ar({ children }: { children: React.ReactNode }) {
  return (
    <span dir="auto" style={{ fontFamily: "var(--font-display), system-ui, sans-serif", unicodeBidi: "plaintext" }}>
      {children}
    </span>
  );
}
