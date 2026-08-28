import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { isEditor } from "@/lib/admin/auth";
import { PageHeader, secondaryButtonStyle } from "../../../_components/forms";
import { ServiceForm } from "../_components/ServiceForm";
import { landingOptions, serviceGroups } from "../options";

export const dynamic = "force-dynamic";

export default async function NewServicePage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (!isEditor(session.user.role)) redirect("/dashboard/content/services");

  const groups = await serviceGroups();

  return (
    <>
      <PageHeader
        title="New service"
        right={
          <Link href="/dashboard/content/services" style={secondaryButtonStyle}>
            Back to services
          </Link>
        }
      />
      <ServiceForm groups={groups} landings={landingOptions()} canEdit />
    </>
  );
}
