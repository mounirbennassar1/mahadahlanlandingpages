import type { OrderStatus } from "@prisma/client";

/** Labels and dashboard tones for the order pipeline (client-safe). */
export const ORDER_STATUS_META: Record<OrderStatus, { label: string; tone: "green" | "amber" | "red" | "slate" | "blue" | "primary"; ar: string }> = {
  PENDING: { label: "Pending", tone: "amber", ar: "بانتظار الدفع" },
  PAID: { label: "Paid", tone: "green", ar: "مدفوع" },
  FAILED: { label: "Failed", tone: "red", ar: "فشل الدفع" },
  CANCELLED: { label: "Cancelled", tone: "slate", ar: "ملغي" },
  EXPIRED: { label: "Expired", tone: "slate", ar: "منتهي" },
  REFUNDED: { label: "Refunded", tone: "blue", ar: "مسترد" },
};

export const ORDER_STATUS_ORDER: OrderStatus[] = ["PAID", "PENDING", "FAILED", "CANCELLED", "EXPIRED", "REFUNDED"];

export function formatSarPlain(amount: number) {
  return `${amount.toLocaleString("en-US")} SAR`;
}
