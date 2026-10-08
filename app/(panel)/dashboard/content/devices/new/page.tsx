import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { can, getMember } from "@/lib/team/member";
import { PageHeader, secondaryButtonStyle } from "../../../_components/forms";
import { DeviceForm } from "../_components/DeviceForm";

export const dynamic = "force-dynamic";

export default async function NewDevicePage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (!can(await getMember(), "content.edit")) redirect("/dashboard/content/devices");

  return (
    <>
      <PageHeader
        title="New device"
        right={
          <Link href="/dashboard/content/devices" style={secondaryButtonStyle}>
            Back to devices
          </Link>
        }
      />
      <DeviceForm canEdit />
    </>
  );
}
