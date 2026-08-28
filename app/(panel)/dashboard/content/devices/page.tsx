import { redirect } from "next/navigation";
import type { Prisma } from "@prisma/client";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { isEditor } from "@/lib/admin/auth";
import { DeleteButton, PageHeader } from "../../_components/forms";
import {
  ActivePill,
  Code,
  DateCell,
  EditLink,
  EmptyRow,
  ExternalLink,
  ListToolbar,
  NewButton,
  Num,
  SITE_URL,
  Table,
  TableShell,
  Td,
  Th,
  Thumb,
  TitleCell,
} from "../_components/table";
import { deleteDevice } from "./actions";

export const dynamic = "force-dynamic";

const LIST = "/dashboard/content/devices";

export default async function DevicesPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const canEdit = isEditor(session.user.role);

  const q = (await searchParams).q?.trim() ?? "";
  const where: Prisma.DeviceWhereInput = q
    ? {
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { nameEn: { contains: q, mode: "insensitive" } },
          { slug: { contains: q, mode: "insensitive" } },
        ],
      }
    : {};

  const devices = await prisma.device.findMany({ where, orderBy: [{ order: "asc" }, { createdAt: "asc" }] });

  return (
    <>
      <PageHeader
        title="Devices"
        subtitle={`${devices.length} devices · shown on /our-devices`}
        right={canEdit ? <NewButton href={`${LIST}/new`}>New device</NewButton> : undefined}
      />
      <TableShell>
        <ListToolbar q={q} placeholder="Search name, slug…" />
        <Table>
          <thead>
            <tr>
              <Th>Device</Th>
              <Th>Slug</Th>
              <Th>Used for</Th>
              <Th>Order</Th>
              <Th>Status</Th>
              <Th>Updated</Th>
              <Th align="right"></Th>
            </tr>
          </thead>
          <tbody>
            {devices.length === 0 && <EmptyRow colSpan={7}>No devices match.</EmptyRow>}
            {devices.map((d) => (
              <tr key={d.id} className="fk-row">
                <Td>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <Thumb src={d.image} alt={d.imageAlt} />
                    <TitleCell href={`${LIST}/${d.id}/edit`} title={d.name} meta={d.nameEn ?? d.tagline ?? undefined} />
                  </div>
                </Td>
                <Td>
                  <Code>{d.slug}</Code>
                </Td>
                <Td>
                  <Num>{d.usedFor.length}</Num> <span style={{ color: "var(--ink-4)", fontSize: 12.5 }}>uses</span>
                </Td>
                <Td>
                  <Num>{d.order}</Num>
                </Td>
                <Td>
                  <ActivePill active={d.active} />
                </Td>
                <Td>
                  <DateCell date={d.updatedAt} />
                </Td>
                <Td align="right">
                  <div style={{ display: "inline-flex", gap: 6, alignItems: "center" }}>
                    {d.active && <ExternalLink href={`${SITE_URL}/our-devices/${d.slug}`} />}
                    <EditLink href={`${LIST}/${d.id}/edit`} />
                    {canEdit && <DeleteButton action={deleteDevice} id={d.id} />}
                  </div>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </TableShell>
    </>
  );
}
