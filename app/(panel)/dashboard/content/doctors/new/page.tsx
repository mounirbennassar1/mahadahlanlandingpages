import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { isEditor } from "@/lib/admin/auth";
import { PageHeader, secondaryButtonStyle } from "../../../_components/forms";
import { DoctorForm } from "../_components/DoctorForm";

export const dynamic = "force-dynamic";

export default async function NewDoctorPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (!isEditor(session.user.role)) redirect("/dashboard/content/doctors");

  return (
    <>
      <PageHeader
        title="New doctor"
        right={
          <Link href="/dashboard/content/doctors" style={secondaryButtonStyle}>
            Back to doctors
          </Link>
        }
      />
      <DoctorForm canEdit />
    </>
  );
}
