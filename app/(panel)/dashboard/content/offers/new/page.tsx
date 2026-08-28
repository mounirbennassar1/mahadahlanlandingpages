import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { isEditor } from "@/lib/admin/auth";
import { PageHeader, secondaryButtonStyle } from "../../../_components/forms";
import { OfferForm } from "../_components/OfferForm";

export const dynamic = "force-dynamic";

export default async function NewOfferPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (!isEditor(session.user.role)) redirect("/dashboard/content/offers");

  const categories = await prisma.offer.findMany({
    where: { category: { not: null } },
    select: { category: true },
    distinct: ["category"],
    orderBy: { category: "asc" },
  });

  return (
    <>
      <PageHeader
        title="New offer"
        right={
          <Link href="/dashboard/content/offers" style={secondaryButtonStyle}>
            Back to offers
          </Link>
        }
      />
      <OfferForm categories={categories.flatMap((c) => (c.category ? [c.category] : []))} canEdit />
    </>
  );
}
