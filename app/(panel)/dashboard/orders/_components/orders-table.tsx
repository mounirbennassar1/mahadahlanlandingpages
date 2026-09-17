import Link from "next/link";
import { formatRelative } from "@/lib/status";
import { getPageDef } from "@/lib/pages/registry";
import { Code, EmptyRow, Num, Pill, Table, Td, Th } from "@/app/(panel)/dashboard/content/_components/table";
import { OrderStatusPill } from "./order-status-pill";
import type { OrderRow } from "../_lib/query";

/** Orders table shared by /dashboard/orders and a page's Orders tab. */
export function OrdersTable({ orders, showPage = true }: { orders: OrderRow[]; showPage?: boolean }) {
  const columns = showPage ? 8 : 7;
  return (
    <Table>
      <thead>
        <tr>
          <Th>Order</Th>
          <Th>Customer</Th>
          <Th>Item</Th>
          {showPage && <Th>Page</Th>}
          <Th align="right">Amount</Th>
          <Th>Status</Th>
          <Th>noon</Th>
          <Th>Created</Th>
        </tr>
      </thead>
      <tbody>
        {orders.length === 0 && <EmptyRow colSpan={columns}>No orders match the current filter.</EmptyRow>}
        {orders.map((o) => {
          const rel = formatRelative(o.createdAt);
          const page = o.pageSlug ? getPageDef(o.pageSlug) : undefined;
          return (
            <tr key={o.id} className="fk-row">
              <Td>
                <Link href={`/dashboard/orders/${o.id}`} className="fk-link" style={{ fontFamily: "var(--font-data)", fontWeight: 600, color: "var(--ink)", letterSpacing: "0.04em" }}>
                  {o.reference}
                </Link>
                <div style={{ fontSize: 11.5, color: "var(--ink-4)", marginTop: 3 }}>
                  {o.itemType === "PACKAGE" ? "Package" : "Offer"}
                </div>
              </Td>
              <Td>
                <div style={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 0 }}>
                  <span dir="auto" style={{ fontWeight: 600, color: "var(--ink)", fontFamily: "var(--font-display), system-ui, sans-serif", unicodeBidi: "plaintext" }}>
                    {o.fullName}
                  </span>
                  <span style={{ fontFamily: "var(--font-data)", fontSize: 12.5, color: "var(--ink-3)" }}>{o.phone}</span>
                </div>
              </Td>
              <Td>
                <span dir="rtl" lang="ar" style={{ fontFamily: "var(--font-display), system-ui, sans-serif", color: "var(--ink-2)", display: "block", maxWidth: 260, unicodeBidi: "plaintext" }}>
                  {o.itemTitle}
                </span>
              </Td>
              {showPage && (
                <Td>
                  {page ? (
                    <Link href={`/dashboard/pages/${page.slug}/orders`} className="fk-link" dir="rtl" lang="ar" style={{ fontFamily: "var(--font-display), system-ui, sans-serif", color: "var(--ink-2)" }}>
                      {page.title}
                    </Link>
                  ) : (
                    <span style={{ color: "var(--ink-4)" }}>—</span>
                  )}
                </Td>
              )}
              <Td align="right">
                <Num>
                  <b style={{ color: "var(--ink)", fontWeight: 600 }}>{o.amount.toLocaleString("en-US")}</b>
                  <span style={{ color: "var(--ink-4)", fontSize: 12 }}> SAR</span>
                </Num>
                {o.refundedAmount > 0 && (
                  <div style={{ fontSize: 11.5, color: "var(--blue)", marginTop: 2 }}>−{o.refundedAmount.toLocaleString("en-US")} refunded</div>
                )}
              </Td>
              <Td>
                <OrderStatusPill status={o.status} />
              </Td>
              <Td>
                {o.noonOrderId ? (
                  <span style={{ display: "inline-flex", flexDirection: "column", gap: 3 }}>
                    <Code>{o.noonOrderId}</Code>
                    {o.paymentBrand && <Pill tone="slate" dot={false}>{o.paymentBrand.replace(/_/g, " ")}</Pill>}
                  </span>
                ) : (
                  <span style={{ color: "var(--ink-4)", fontSize: 12.5 }}>not sent</span>
                )}
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
    </Table>
  );
}
