import { redirect } from "next/navigation";
import type { Prisma } from "@prisma/client";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { isEditor } from "@/lib/admin/auth";
import { DeleteButton, PageHeader } from "../../_components/forms";
import { Code, DateCell, EditLink, EmptyRow, ListToolbar, NewButton, Num, Table, TableShell, Td, Th, TitleCell } from "../_components/table";
import { deleteCategory } from "./actions";

export const dynamic = "force-dynamic";

const LIST = "/dashboard/content/categories";

export default async function CategoriesPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const canEdit = isEditor(session.user.role);

  const q = (await searchParams).q?.trim() ?? "";
  const where: Prisma.CategoryWhereInput = q
    ? { OR: [{ name: { contains: q, mode: "insensitive" } }, { slug: { contains: q, mode: "insensitive" } }] }
    : {};

  const categories = await prisma.category.findMany({
    where,
    orderBy: [{ order: "asc" }, { name: "asc" }],
    include: { _count: { select: { articles: true } } },
  });

  return (
    <>
      <PageHeader
        title="Categories"
        subtitle={`${categories.length} categories · used to filter /news-articles`}
        right={canEdit ? <NewButton href={`${LIST}/new`}>New category</NewButton> : undefined}
      />
      <TableShell>
        <ListToolbar q={q} placeholder="Search name, slug…" />
        <Table>
          <thead>
            <tr>
              <Th>Category</Th>
              <Th>Slug</Th>
              <Th>Articles</Th>
              <Th>Order</Th>
              <Th>Updated</Th>
              <Th align="right"></Th>
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 && <EmptyRow colSpan={6}>No categories match.</EmptyRow>}
            {categories.map((c) => (
              <tr key={c.id} className="fk-row">
                <Td>
                  <TitleCell href={`${LIST}/${c.id}/edit`} title={c.name} meta={c.description ? <span dir="rtl" style={{ display: "block", textAlign: "left" }}>{c.description}</span> : undefined} />
                </Td>
                <Td>
                  <Code>{c.slug}</Code>
                </Td>
                <Td>
                  <Num>{c._count.articles}</Num>
                </Td>
                <Td>
                  <Num>{c.order}</Num>
                </Td>
                <Td>
                  <DateCell date={c.updatedAt} />
                </Td>
                <Td align="right">
                  <div style={{ display: "inline-flex", gap: 6, alignItems: "center" }}>
                    <EditLink href={`${LIST}/${c.id}/edit`} />
                    {canEdit && (
                      <DeleteButton
                        action={deleteCategory}
                        id={c.id}
                        warning={c._count.articles > 0 ? `${c._count.articles} article${c._count.articles === 1 ? "" : "s"} will lose this category.` : undefined}
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
