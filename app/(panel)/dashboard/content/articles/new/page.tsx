import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { isEditor } from "@/lib/admin/auth";
import { PageHeader, secondaryButtonStyle } from "../../../_components/forms";
import { ArticleForm } from "../_components/ArticleForm";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function NewArticlePage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (!isEditor(session.user.role)) redirect("/dashboard/content/articles");

  const [categories, doctors] = await Promise.all([
    prisma.category.findMany({ orderBy: [{ order: "asc" }, { name: "asc" }], select: { id: true, name: true } }),
    prisma.doctor.findMany({ orderBy: [{ order: "asc" }, { name: "asc" }], select: { id: true, name: true } }),
  ]);

  return (
    <>
      <PageHeader
        title="New article"
        subtitle="Drafts are only visible here until you publish them."
        right={
          <Link href="/dashboard/content/articles" style={secondaryButtonStyle}>
            Back to articles
          </Link>
        }
      />
      <ArticleForm categories={categories} doctors={doctors} canEdit />
    </>
  );
}
