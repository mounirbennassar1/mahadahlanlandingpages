import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { isEditor } from "@/lib/admin/auth";
import { getPageDef } from "@/lib/pages/registry";
import { getPageOverrides } from "@/lib/pages/get";
import { allFields } from "@/lib/pages/define";
import { mergeField, orphanKeys } from "@/lib/pages/merge";
import { SITE_URL } from "@/app/(panel)/dashboard/content/_components/table";
import { ContentEditor } from "../../_components/content-editor";

export const dynamic = "force-dynamic";

export default async function PageContentTab({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const { slug } = await params;
  const def = getPageDef(slug);
  if (!def) notFound();

  const overrides = await getPageOverrides(def.slug);

  // The editor works on the flat "section.field" map it submits back.
  const initial: Record<string, unknown> = {};
  for (const [key, field] of allFields(def)) initial[key] = mergeField(field, overrides[key]);

  return (
    <ContentEditor
      def={def}
      initial={initial}
      canEdit={isEditor(session.user.role)}
      orphanCount={orphanKeys(def, overrides).length}
      previewUrl={`${SITE_URL}${def.path}`}
    />
  );
}
