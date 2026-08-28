import { redirect } from "next/navigation";
import type { Prisma } from "@prisma/client";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { isEditor } from "@/lib/admin/auth";
import { DeleteButton, PageHeader } from "../../_components/forms";
import { ActivePill, Code, DateCell, EditLink, EmptyRow, ListToolbar, NewButton, Num, Table, TableShell, Td, Th, TitleCell } from "../_components/table";
import { deleteService } from "./actions";

export const dynamic = "force-dynamic";

const LIST = "/dashboard/content/services";

export default async function ServicesPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const canEdit = isEditor(session.user.role);

  const q = (await searchParams).q?.trim() ?? "";
  const where: Prisma.ServiceWhereInput = q
    ? {
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { slug: { contains: q, mode: "insensitive" } },
          { group: { contains: q, mode: "insensitive" } },
          { landingSlug: { contains: q, mode: "insensitive" } },
        ],
      }
    : {};

  const services = await prisma.service.findMany({ where, orderBy: [{ group: "asc" }, { order: "asc" }, { name: "asc" }] });

  return (
    <>
      <PageHeader
        title="Services"
        subtitle={`${services.length} services · listed in the /book-now form`}
        right={canEdit ? <NewButton href={`${LIST}/new`}>New service</NewButton> : undefined}
      />
      <TableShell>
        <ListToolbar q={q} placeholder="Search name, group, slug…" />
        <Table>
          <thead>
            <tr>
              <Th>Service</Th>
              <Th>Group</Th>
              <Th>Slug</Th>
              <Th>Landing</Th>
              <Th>Order</Th>
              <Th>Status</Th>
              <Th>Updated</Th>
              <Th align="right"></Th>
            </tr>
          </thead>
          <tbody>
            {services.length === 0 && <EmptyRow colSpan={8}>No services match.</EmptyRow>}
            {services.map((s) => (
              <tr key={s.id} className="fk-row">
                <Td>
                  <TitleCell href={`${LIST}/${s.id}/edit`} title={s.name} meta={s.description ? <span dir="rtl" style={{ display: "block", textAlign: "left" }}>{s.description}</span> : undefined} />
                </Td>
                <Td>
                  <span dir="rtl" lang="ar" style={{ fontFamily: "var(--font-display), system-ui, sans-serif" }}>
                    {s.group ?? <span style={{ color: "var(--ink-4)" }}>—</span>}
                  </span>
                </Td>
                <Td>
                  <Code>{s.slug}</Code>
                </Td>
                <Td>{s.landingSlug ? <Code>/{s.landingSlug}</Code> : <span style={{ color: "var(--ink-4)" }}>—</span>}</Td>
                <Td>
                  <Num>{s.order}</Num>
                </Td>
                <Td>
                  <ActivePill active={s.active} />
                </Td>
                <Td>
                  <DateCell date={s.updatedAt} />
                </Td>
                <Td align="right">
                  <div style={{ display: "inline-flex", gap: 6, alignItems: "center" }}>
                    <EditLink href={`${LIST}/${s.id}/edit`} />
                    {canEdit && <DeleteButton action={deleteService} id={s.id} />}
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
