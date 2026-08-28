import Link from "next/link";
import { redirect } from "next/navigation";
import type { Prisma } from "@prisma/client";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { isEditor } from "@/lib/admin/auth";
import { DeleteButton, PageHeader } from "../../_components/forms";
import {
  Chip,
  DateCell,
  EditLink,
  EmptyRow,
  ExternalLink,
  ListToolbar,
  NewButton,
  SITE_URL,
  StatusPill,
  Table,
  TableShell,
  Td,
  Th,
  TitleCell,
} from "../_components/table";
import { deleteArticle } from "./actions";

export const dynamic = "force-dynamic";

const LIST = "/dashboard/content/articles";

export default async function ArticlesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const canEdit = isEditor(session.user.role);

  const params = await searchParams;
  const q = params.q?.trim() ?? "";
  const status = params.status === "DRAFT" || params.status === "PUBLISHED" ? params.status : null;

  const where: Prisma.ArticleWhereInput = {};
  if (status) where.status = status;
  if (q) {
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { slug: { contains: q, mode: "insensitive" } },
      { excerpt: { contains: q, mode: "insensitive" } },
    ];
  }

  const [articles, counts] = await Promise.all([
    prisma.article.findMany({
      where,
      orderBy: [{ updatedAt: "desc" }],
      include: { category: { select: { name: true } }, author: { select: { name: true } } },
      take: 300,
    }),
    prisma.article.groupBy({ by: ["status"], _count: { _all: true } }),
  ]);
  const countOf = (s: "DRAFT" | "PUBLISHED") => counts.find((c) => c.status === s)?._count._all ?? 0;
  const total = countOf("DRAFT") + countOf("PUBLISHED");
  const chipHref = (s: string | null) => {
    const sp = new URLSearchParams();
    if (q) sp.set("q", q);
    if (s) sp.set("status", s);
    const qs = sp.toString();
    return qs ? `${LIST}?${qs}` : LIST;
  };

  return (
    <>
      <PageHeader
        title="Articles"
        subtitle={`${total.toLocaleString("en-US")} articles · shown on /news-articles`}
        right={canEdit ? <NewButton href={`${LIST}/new`}>New article</NewButton> : undefined}
      />

      <TableShell>
        <ListToolbar
          q={q}
          placeholder="Search title, slug…"
          hidden={{ status: status ?? undefined }}
          chips={
            <>
              <Chip href={chipHref(null)} active={!status}>All · {total}</Chip>
              <Chip href={chipHref("PUBLISHED")} active={status === "PUBLISHED"}>Published · {countOf("PUBLISHED")}</Chip>
              <Chip href={chipHref("DRAFT")} active={status === "DRAFT"}>Draft · {countOf("DRAFT")}</Chip>
            </>
          }
        />
        <Table>
          <thead>
            <tr>
              <Th>Article</Th>
              <Th>Category</Th>
              <Th>Author</Th>
              <Th>Status</Th>
              <Th>Published</Th>
              <Th>Updated</Th>
              <Th align="right"></Th>
            </tr>
          </thead>
          <tbody>
            {articles.length === 0 && <EmptyRow colSpan={7}>No articles match.</EmptyRow>}
            {articles.map((a) => (
              <tr key={a.id} className="fk-row">
                <Td>
                  <TitleCell
                    href={`${LIST}/${a.id}/edit`}
                    title={
                      <>
                        {a.featured && (
                          <span title="Featured" style={{ color: "var(--amber)", marginInlineEnd: 6 }}>★</span>
                        )}
                        {a.title}
                      </>
                    }
                    meta={<code style={{ fontFamily: "var(--font-data)" }}>/{a.slug}</code>}
                  />
                </Td>
                <Td>
                  <span dir="rtl" lang="ar" style={{ fontFamily: "var(--font-display), system-ui, sans-serif" }}>
                    {a.category?.name ?? <span style={{ color: "var(--ink-4)" }}>—</span>}
                  </span>
                </Td>
                <Td>
                  <span dir="rtl" lang="ar" style={{ fontFamily: "var(--font-display), system-ui, sans-serif" }}>
                    {a.author?.name ?? <span style={{ color: "var(--ink-4)" }}>—</span>}
                  </span>
                </Td>
                <Td>
                  <StatusPill status={a.status} />
                </Td>
                <Td>
                  <DateCell date={a.publishedAt} />
                </Td>
                <Td>
                  <DateCell date={a.updatedAt} />
                </Td>
                <Td align="right">
                  <div style={{ display: "inline-flex", gap: 6, alignItems: "center" }}>
                    {a.status === "PUBLISHED" && <ExternalLink href={`${SITE_URL}/news-articles/${a.slug}`} />}
                    <EditLink href={`${LIST}/${a.id}/edit`} />
                    {canEdit && <DeleteButton action={deleteArticle} id={a.id} />}
                  </div>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </TableShell>

      {!canEdit && (
        <div style={{ fontSize: 12.5, color: "var(--ink-4)", marginTop: 12 }}>
          Read-only: your role can view content but not change it. <Link href="/dashboard">Back to dashboard</Link>
        </div>
      )}
    </>
  );
}
