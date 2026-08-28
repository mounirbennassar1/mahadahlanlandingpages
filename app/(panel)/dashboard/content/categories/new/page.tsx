import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { isEditor } from "@/lib/admin/auth";
import { PageHeader, secondaryButtonStyle } from "../../../_components/forms";
import { CategoryForm } from "../_components/CategoryForm";

export const dynamic = "force-dynamic";

export default async function NewCategoryPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (!isEditor(session.user.role)) redirect("/dashboard/content/categories");

  return (
    <>
      <PageHeader
        title="New category"
        right={
          <Link href="/dashboard/content/categories" style={secondaryButtonStyle}>
            Back to categories
          </Link>
        }
      />
      <CategoryForm canEdit />
    </>
  );
}
