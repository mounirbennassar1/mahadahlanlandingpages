import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { isEditor } from "@/lib/admin/auth";
import { DeleteButton, FormMessage, PageHeader, secondaryButtonStyle } from "../../../../_components/forms";
import { DoctorForm } from "../../_components/DoctorForm";
import { deleteDoctor } from "../../actions";

export const dynamic = "force-dynamic";

const LIST = "/dashboard/content/doctors";

export default async function EditDoctorPage({
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
  const doctor = await prisma.doctor.findUnique({ where: { id }, include: { _count: { select: { articles: true } } } });
  if (!doctor) notFound();

  return (
    <>
      <PageHeader
        title="Edit doctor"
        subtitle={
          <span dir="auto" style={{ fontFamily: "var(--font-display), system-ui, sans-serif" }}>
            {doctor.name}
          </span>
        }
        right={
          <>
            <Link href={LIST} style={secondaryButtonStyle}>
              Back to doctors
            </Link>
            {canEdit && (
              <DeleteButton
                action={deleteDoctor}
                id={doctor.id}
                redirectTo={LIST}
                warning={doctor._count.articles > 0 ? `${doctor._count.articles} article(s) will lose their author.` : undefined}
              />
            )}
          </>
        }
      />
      {created && <FormMessage info="Doctor created." />}
      <DoctorForm doctor={doctor} canEdit={canEdit} />
    </>
  );
}
