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
import { deleteDoctor } from "./actions";

export const dynamic = "force-dynamic";

const LIST = "/dashboard/content/doctors";

export default async function DoctorsPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const canEdit = isEditor(session.user.role);

  const q = (await searchParams).q?.trim() ?? "";
  const where: Prisma.DoctorWhereInput = q
    ? {
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { slug: { contains: q, mode: "insensitive" } },
          { title: { contains: q, mode: "insensitive" } },
        ],
      }
    : {};

  const doctors = await prisma.doctor.findMany({
    where,
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    include: { _count: { select: { articles: true } } },
  });

  return (
    <>
      <PageHeader
        title="Doctors"
        subtitle={`${doctors.length} doctors · shown on /doctors and /about-us`}
        right={canEdit ? <NewButton href={`${LIST}/new`}>New doctor</NewButton> : undefined}
      />
      <TableShell>
        <ListToolbar q={q} placeholder="Search name, title, slug…" />
        <Table>
          <thead>
            <tr>
              <Th>Doctor</Th>
              <Th>Slug</Th>
              <Th>Specialties</Th>
              <Th>Articles</Th>
              <Th>Order</Th>
              <Th>Status</Th>
              <Th>Updated</Th>
              <Th align="right"></Th>
            </tr>
          </thead>
          <tbody>
            {doctors.length === 0 && <EmptyRow colSpan={8}>No doctors match.</EmptyRow>}
            {doctors.map((d) => (
              <tr key={d.id} className="fk-row">
                <Td>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <Thumb src={d.image} alt={d.imageAlt} />
                    <TitleCell href={`${LIST}/${d.id}/edit`} title={d.name} meta={<span dir="rtl" style={{ display: "block", textAlign: "left" }}>{d.title}</span>} />
                  </div>
                </Td>
                <Td>
                  <Code>{d.slug}</Code>
                </Td>
                <Td>
                  <span dir="rtl" lang="ar" style={{ fontSize: 12.5, fontFamily: "var(--font-display), system-ui, sans-serif" }}>
                    {d.specialties.slice(0, 3).join("، ")}
                    {d.specialties.length > 3 ? ` +${d.specialties.length - 3}` : ""}
                  </span>
                </Td>
                <Td>
                  <Num>{d._count.articles}</Num>
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
                    {d.active && <ExternalLink href={`${SITE_URL}/doctors/${d.slug}`} />}
                    <EditLink href={`${LIST}/${d.id}/edit`} />
                    {canEdit && (
                      <DeleteButton
                        action={deleteDoctor}
                        id={d.id}
                        warning={d._count.articles > 0 ? `${d._count.articles} article(s) will lose their author.` : undefined}
                      />
                    )}
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
