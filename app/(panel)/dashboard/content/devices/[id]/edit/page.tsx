import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { isEditor } from "@/lib/admin/auth";
import { DeleteButton, FormMessage, PageHeader, secondaryButtonStyle } from "../../../../_components/forms";
import { DeviceForm } from "../../_components/DeviceForm";
import { deleteDevice } from "../../actions";

export const dynamic = "force-dynamic";

const LIST = "/dashboard/content/devices";

export default async function EditDevicePage({
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
  const device = await prisma.device.findUnique({ where: { id } });
  if (!device) notFound();

  return (
    <>
      <PageHeader
        title="Edit device"
        subtitle={
          <span dir="auto" style={{ fontFamily: "var(--font-display), system-ui, sans-serif" }}>
            {device.name}
            {device.nameEn ? ` · ${device.nameEn}` : ""}
          </span>
        }
        right={
          <>
            <Link href={LIST} style={secondaryButtonStyle}>
              Back to devices
            </Link>
            {canEdit && <DeleteButton action={deleteDevice} id={device.id} redirectTo={LIST} />}
          </>
        }
      />
      {created && <FormMessage info="Device created." />}
      <DeviceForm device={device} canEdit={canEdit} />
    </>
  );
}
