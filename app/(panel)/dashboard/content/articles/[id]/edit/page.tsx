import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { isEditor } from "@/lib/admin/auth";
import { DeleteButton, FormMessage, PageHeader, secondaryButtonStyle } from "../../../../_components/forms";
import { ArticleForm } from "../../_components/ArticleForm";
import { deleteArticle } from "../../actions";

export const dynamic = "force-dynamic";

const LIST = "/dashboard/content/articles";

export default async function EditArticlePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ created?: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const canEdit = isEditor(session.user.role);

  const [{ id }, { created }] = await Promise.all([params, searchParams]);
  const [article, categories, doctors] = await Promise.all([
    prisma.article.findUnique({ where: { id } }),
    prisma.category.findMany({ orderBy: [{ order: "asc" }, { name: "asc" }], select: { id: true, name: true } }),
    prisma.doctor.findMany({ orderBy: [{ order: "asc" }, { name: "asc" }], select: { id: true, name: true } }),
  ]);
  if (!article) notFound();

  return (
    <>
      <PageHeader
        title="Edit article"
        subtitle={
          <span dir="auto" style={{ fontFamily: "var(--font-display), system-ui, sans-serif" }}>
            {article.title}
          </span>
        }
        right={
          <>
            <Link href={LIST} style={secondaryButtonStyle}>
              Back to articles
            </Link>
            {canEdit && <DeleteButton action={deleteArticle} id={article.id} redirectTo={LIST} />}
          </>
        }
      />
      {created && <FormMessage info="Article created. You can keep editing it here." />}
      <ArticleForm article={article} categories={categories} doctors={doctors} canEdit={canEdit} />
    </>
  );
}
