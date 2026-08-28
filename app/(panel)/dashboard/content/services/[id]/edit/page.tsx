import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { isEditor } from "@/lib/admin/auth";
import { DeleteButton, FormMessage, PageHeader, secondaryButtonStyle } from "../../../../_components/forms";
import { ServiceForm } from "../../_components/ServiceForm";
import { deleteService } from "../../actions";
import { landingOptions, serviceGroups } from "../../options";

export const dynamic = "force-dynamic";

const LIST = "/dashboard/content/services";

export default async function EditServicePage({
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
  const [service, groups] = await Promise.all([prisma.service.findUnique({ where: { id } }), serviceGroups()]);
  if (!service) notFound();

  return (
    <>
      <PageHeader
        title="Edit service"
        subtitle={
          <span dir="auto" style={{ fontFamily: "var(--font-display), system-ui, sans-serif" }}>
            {service.name}
          </span>
        }
        right={
          <>
            <Link href={LIST} style={secondaryButtonStyle}>
              Back to services
            </Link>
            {canEdit && <DeleteButton action={deleteService} id={service.id} redirectTo={LIST} />}
          </>
        }
      />
      {created && <FormMessage info="Service created." />}
      <ServiceForm service={service} groups={groups} landings={landingOptions(service.landingSlug)} canEdit={canEdit} />
    </>
  );
}
