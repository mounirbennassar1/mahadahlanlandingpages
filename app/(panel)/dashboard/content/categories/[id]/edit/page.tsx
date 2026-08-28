import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { isEditor } from "@/lib/admin/auth";
import { DeleteButton, FormMessage, PageHeader, secondaryButtonStyle } from "../../../../_components/forms";
import { CategoryForm } from "../../_components/CategoryForm";
import { deleteCategory } from "../../actions";

export const dynamic = "force-dynamic";

const LIST = "/dashboard/content/categories";

export default async function EditCategoryPage({
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
  const category = await prisma.category.findUnique({ where: { id }, include: { _count: { select: { articles: true } } } });
  if (!category) notFound();

  return (
    <>
      <PageHeader
        title="Edit category"
        subtitle={
          <span dir="auto" style={{ fontFamily: "var(--font-display), system-ui, sans-serif" }}>
            {category.name} · {category._count.articles} article{category._count.articles === 1 ? "" : "s"}
          </span>
        }
        right={
          <>
            <Link href={LIST} style={secondaryButtonStyle}>
              Back to categories
            </Link>
            {canEdit && (
              <DeleteButton
                action={deleteCategory}
                id={category.id}
                redirectTo={LIST}
                warning={category._count.articles > 0 ? `${category._count.articles} article(s) will lose this category.` : undefined}
              />
            )}
          </>
        }
      />
      {created && <FormMessage info="Category created." />}
      <CategoryForm category={category} canEdit={canEdit} />
    </>
  );
}
