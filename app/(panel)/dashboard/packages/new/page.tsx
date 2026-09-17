import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { isEditor } from "@/lib/admin/auth";
import { getPageDef } from "@/lib/pages/registry";
import { PageHeader, secondaryButtonStyle } from "../../_components/forms";
import { PackageForm } from "../_components/PackageForm";
import { packagePageOptions } from "../_lib/pages";

export const dynamic = "force-dynamic";

export default async function NewPackagePage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (!isEditor(session.user.role)) redirect("/dashboard/packages");

  const { page } = await searchParams;
  const preset = page && getPageDef(page) ? page : null;

  return (
    <>
      <PageHeader
        title="New package"
        subtitle={preset ? `For ${getPageDef(preset)?.title}` : undefined}
        right={
          <Link href={preset ? `/dashboard/pages/${preset}/packages` : "/dashboard/packages"} style={secondaryButtonStyle}>
            Back to packages
          </Link>
        }
      />
      <PackageForm pages={packagePageOptions()} canEdit initialPageSlug={preset} />
    </>
  );
}
