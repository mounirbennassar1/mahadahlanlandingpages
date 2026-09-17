import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { isEditor } from "@/lib/admin/auth";
import { DeleteButton, FormMessage, PageHeader, secondaryButtonStyle } from "../../../_components/forms";
import { PackageForm } from "../../_components/PackageForm";
import { deletePackage } from "../../actions";
import { packagePageOptions, pageTitle } from "../../_lib/pages";

export const dynamic = "force-dynamic";

const LIST = "/dashboard/packages";

export default async function EditPackagePage({
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
  const pkg = await prisma.package.findUnique({ where: { id }, include: { _count: { select: { orders: true } } } });
  if (!pkg) notFound();

  return (
    <>
      <PageHeader
        title="Edit package"
        subtitle={
          <span dir="auto" style={{ fontFamily: "var(--font-display), system-ui, sans-serif" }}>
            {pkg.title} · {pageTitle(pkg.pageSlug)} · {pkg._count.orders} order{pkg._count.orders === 1 ? "" : "s"}
          </span>
        }
        right={
          <>
            <Link href={LIST} style={secondaryButtonStyle}>
              Back to packages
            </Link>
            {canEdit && (
              <DeleteButton
                action={deletePackage}
                id={pkg.id}
                redirectTo={LIST}
                warning={pkg._count.orders > 0 ? `${pkg._count.orders} order(s) reference this package.` : undefined}
              />
            )}
          </>
        }
      />
      {created && <FormMessage info="Package created. It is now listed in the pay button of its page." />}
      <PackageForm pkg={pkg} pages={packagePageOptions(pkg.pageSlug)} canEdit={canEdit} />
    </>
  );
}
