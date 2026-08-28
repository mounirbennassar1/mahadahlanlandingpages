import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { isEditor } from "@/lib/admin/auth";
import { DeleteButton, FormMessage, PageHeader, secondaryButtonStyle } from "../../../../_components/forms";
import { OfferForm } from "../../_components/OfferForm";
import { deleteOffer } from "../../actions";

export const dynamic = "force-dynamic";

const LIST = "/dashboard/content/offers";

export default async function EditOfferPage({
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
  const [offer, categories] = await Promise.all([
    prisma.offer.findUnique({ where: { id }, include: { _count: { select: { leads: true } } } }),
    prisma.offer.findMany({ where: { category: { not: null } }, select: { category: true }, distinct: ["category"], orderBy: { category: "asc" } }),
  ]);
  if (!offer) notFound();

  return (
    <>
      <PageHeader
        title="Edit offer"
        subtitle={
          <span dir="auto" style={{ fontFamily: "var(--font-display), system-ui, sans-serif" }}>
            {offer.title} · {offer._count.leads} lead{offer._count.leads === 1 ? "" : "s"}
          </span>
        }
        right={
          <>
            <Link href={LIST} style={secondaryButtonStyle}>
              Back to offers
            </Link>
            {canEdit && (
              <DeleteButton
                action={deleteOffer}
                id={offer.id}
                redirectTo={LIST}
                warning={offer._count.leads > 0 ? `${offer._count.leads} lead(s) reference this offer.` : undefined}
              />
            )}
          </>
        }
      />
      {created && <FormMessage info="Offer created." />}
      <OfferForm offer={offer} categories={categories.flatMap((c) => (c.category ? [c.category] : []))} canEdit={canEdit} />
    </>
  );
}
