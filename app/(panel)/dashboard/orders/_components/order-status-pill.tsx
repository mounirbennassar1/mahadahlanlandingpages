import type { OrderStatus } from "@prisma/client";
import { ORDER_STATUS_META } from "@/lib/order-status";
import { Pill } from "@/app/(panel)/dashboard/content/_components/table";

export function OrderStatusPill({ status }: { status: OrderStatus }) {
  const meta = ORDER_STATUS_META[status];
  return <Pill tone={meta.tone}>{meta.label}</Pill>;
}
