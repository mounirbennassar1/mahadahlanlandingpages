"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Package } from "@prisma/client";
import { initialActionState } from "@/lib/admin/action";
import {
  Checkbox,
  DateTimeInput,
  Field,
  FormMessage,
  ImageField,
  ListInput,
  NumberInput,
  Select,
  SlugInput,
  SubmitButton,
  TextInput,
  Textarea,
} from "../../_components/forms";
import { FormActions, FormGrid, FormSection, ReadOnlyNotice, TwoCol } from "../../content/_components/form-layout";
import { createPackage, updatePackage } from "../actions";
import { EVERY_PAGE, type PageOption } from "../_lib/pages";

export function PackageForm({
  pkg,
  pages,
  canEdit,
  initialPageSlug,
}: {
  pkg?: Package;
  pages: PageOption[];
  canEdit: boolean;
  /** Preselects the page when the form is opened from a page's Packages tab. */
  initialPageSlug?: string | null;
}) {
  const isEdit = Boolean(pkg);
  const [state, formAction] = useActionState(isEdit ? updatePackage : createPackage, initialActionState);
  const router = useRouter();
  useEffect(() => {
    if (state.ok) router.refresh();
  }, [state, router]);

  const fe = state.fieldErrors ?? {};
  const ro = !canEdit;

  return (
    <form action={formAction}>
      {pkg && <input type="hidden" name="id" value={pkg.id} />}
      {ro && <ReadOnlyNotice />}
      <FormMessage state={state} success="Package saved." />
      <div key={pkg?.updatedAt?.toISOString() ?? "new"}>
        <FormGrid
          main={
            <>
              <FormSection>
                <Field label="Title" required error={fe.title}>
                  <TextInput name="title" rtl required defaultValue={pkg?.title} disabled={ro} error={fe.title} placeholder="مثال: باقة 3 جلسات ليزر" />
                </Field>
                <Field label="Slug" error={fe.slug}>
                  <SlugInput name="slug" from="title" defaultValue={pkg?.slug} disabled={ro} error={fe.slug} />
                </Field>
                <Field label="Description" hint="One or two lines under the title on the package card." error={fe.description}>
                  <Textarea name="description" rtl rows={3} defaultValue={pkg?.description ?? ""} disabled={ro} error={fe.description} />
                </Field>
                <TwoCol>
                  <Field label="Price (SAR)" required hint="Whole riyals; this is what noon charges." error={fe.price}>
                    <NumberInput name="price" min={1} step={1} required defaultValue={pkg?.price ?? ""} disabled={ro} error={fe.price} />
                  </Field>
                  <Field label="Old price (SAR)" hint="Shown struck through; must be higher than the price." error={fe.oldPrice}>
                    <NumberInput name="oldPrice" min={0} step={1} defaultValue={pkg?.oldPrice ?? ""} disabled={ro} error={fe.oldPrice} />
                  </Field>
                </TwoCol>
                <Field label="Badge" hint='Short label on the card, e.g. "الأكثر طلباً".' error={fe.badge}>
                  <TextInput name="badge" rtl defaultValue={pkg?.badge ?? ""} disabled={ro} error={fe.badge} />
                </Field>
                <Field label="What is included" hint="One point per line, up to 12. Shown as ticks on the card." error={fe.features} style={{ marginBottom: 0 }}>
                  <ListInput name="features" defaultValue={pkg?.features ?? []} rows={4} disabled={ro} error={fe.features} placeholder={"3 جلسات\nاستشارة مجانية\nمتابعة بعد الجلسة"} />
                </Field>
              </FormSection>
            </>
          }
          side={
            <>
              <FormSection title="Where it is sold">
                <Field label="Page" hint="The landing whose pay button lists this package. Pick “Every page” for a general package such as a consultation fee." error={fe.pageSlug} style={{ marginBottom: 0 }}>
                  <Select
                    name="pageSlug"
                    defaultValue={pkg ? (pkg.pageSlug ?? EVERY_PAGE) : (initialPageSlug ?? EVERY_PAGE)}
                    disabled={ro}
                    error={fe.pageSlug}
                    options={[{ value: EVERY_PAGE, label: "Every page (global)" }, ...pages.map((p) => ({ value: p.slug, label: `${p.title} · ${p.path}` }))]}
                  />
                </Field>
              </FormSection>
              <FormSection title="Image">
                <Field label="Image" hint="Optional; reserved for a future card layout." error={fe.image}>
                  <ImageField name="image" defaultValue={pkg?.image} disabled={ro} error={fe.image} />
                </Field>
                <Field label="Alt text" error={fe.imageAlt} style={{ marginBottom: 0 }}>
                  <TextInput name="imageAlt" rtl defaultValue={pkg?.imageAlt ?? ""} disabled={ro} error={fe.imageAlt} />
                </Field>
              </FormSection>
              <FormSection title="Visibility & schedule">
                <Checkbox name="active" label="Active" description="Inactive packages are hidden even inside their window." defaultChecked={pkg?.active ?? true} disabled={ro} />
                <Field label="Starts" hint="Optional. Hidden before this moment." error={fe.startsAt}>
                  <DateTimeInput name="startsAt" defaultValue={pkg?.startsAt} disabled={ro} error={fe.startsAt} />
                </Field>
                <Field label="Ends" hint="Optional. Hidden after this moment." error={fe.endsAt}>
                  <DateTimeInput name="endsAt" defaultValue={pkg?.endsAt} disabled={ro} error={fe.endsAt} />
                </Field>
                <Field label="Order" hint="Lower numbers show first." error={fe.order} style={{ marginBottom: 0 }}>
                  <NumberInput name="order" step={1} defaultValue={pkg?.order ?? 0} disabled={ro} error={fe.order} />
                </Field>
              </FormSection>
              {canEdit && (
                <FormSection>
                  <FormActions>
                    <SubmitButton pendingLabel={isEdit ? "Saving…" : "Creating…"}>{isEdit ? "Save changes" : "Create package"}</SubmitButton>
                  </FormActions>
                </FormSection>
              )}
            </>
          }
        />
      </div>
    </form>
  );
}
