"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Offer } from "@prisma/client";
import { initialActionState } from "@/lib/admin/action";
import {
  Checkbox,
  DateTimeInput,
  Field,
  FormMessage,
  ImageField,
  NumberInput,
  SlugInput,
  SubmitButton,
  TextInput,
  Textarea,
} from "../../../_components/forms";
import { FormActions, FormGrid, FormSection, ReadOnlyNotice, TwoCol } from "../../_components/form-layout";
import { createOffer, updateOffer } from "../actions";

export function OfferForm({ offer, categories, canEdit }: { offer?: Offer; categories: string[]; canEdit: boolean }) {
  const isEdit = Boolean(offer);
  const [state, formAction] = useActionState(isEdit ? updateOffer : createOffer, initialActionState);
  const router = useRouter();
  useEffect(() => {
    if (state.ok) router.refresh();
  }, [state, router]);

  const fe = state.fieldErrors ?? {};
  const ro = !canEdit;

  return (
    <form action={formAction}>
      {offer && <input type="hidden" name="id" value={offer.id} />}
      {ro && <ReadOnlyNotice />}
      <FormMessage state={state} success="Offer saved." />
      <div key={offer?.updatedAt?.toISOString() ?? "new"}>
        <FormGrid
          main={
            <>
              <FormSection>
                <Field label="Title" required error={fe.title}>
                  <TextInput name="title" rtl required defaultValue={offer?.title} disabled={ro} error={fe.title} placeholder="عنوان العرض" />
                </Field>
                <Field label="Slug" error={fe.slug}>
                  <SlugInput name="slug" from="title" defaultValue={offer?.slug} disabled={ro} error={fe.slug} />
                </Field>
                <Field label="Description" error={fe.description}>
                  <Textarea name="description" rtl rows={4} defaultValue={offer?.description ?? ""} disabled={ro} error={fe.description} />
                </Field>
                <TwoCol>
                  <Field label="Price (SAR)" required hint="Whole riyals." error={fe.price}>
                    <NumberInput name="price" min={0} step={1} required defaultValue={offer?.price ?? ""} disabled={ro} error={fe.price} />
                  </Field>
                  <Field label="Old price (SAR)" hint="Shown struck through; must be higher than the price." error={fe.oldPrice}>
                    <NumberInput name="oldPrice" min={0} step={1} defaultValue={offer?.oldPrice ?? ""} disabled={ro} error={fe.oldPrice} />
                  </Field>
                </TwoCol>
                <TwoCol>
                  <Field label="Badge" hint='Short label on the card, e.g. "الأكثر طلباً".' error={fe.badge} style={{ marginBottom: 0 }}>
                    <TextInput name="badge" rtl defaultValue={offer?.badge ?? ""} disabled={ro} error={fe.badge} />
                  </Field>
                  <Field label="Category" hint="Free text; pick an existing one to keep the filters tidy." error={fe.category} style={{ marginBottom: 0 }}>
                    <TextInput name="category" rtl list="offer-categories" defaultValue={offer?.category ?? ""} disabled={ro} error={fe.category} />
                    <datalist id="offer-categories">
                      {categories.map((c) => (
                        <option key={c} value={c} />
                      ))}
                    </datalist>
                  </Field>
                </TwoCol>
              </FormSection>
            </>
          }
          side={
            <>
              <FormSection title="Image">
                <Field label="Image" error={fe.image}>
                  <ImageField name="image" defaultValue={offer?.image} disabled={ro} error={fe.image} />
                </Field>
                <Field label="Alt text" error={fe.imageAlt} style={{ marginBottom: 0 }}>
                  <TextInput name="imageAlt" rtl defaultValue={offer?.imageAlt ?? ""} disabled={ro} error={fe.imageAlt} />
                </Field>
              </FormSection>
              <FormSection title="Visibility & schedule">
                <Checkbox name="active" label="Active" description="Inactive offers are hidden even inside their window." defaultChecked={offer?.active ?? true} disabled={ro} />
                <Field label="Starts" hint="Optional. Hidden before this moment." error={fe.startsAt}>
                  <DateTimeInput name="startsAt" defaultValue={offer?.startsAt} disabled={ro} error={fe.startsAt} />
                </Field>
                <Field label="Ends" hint="Optional. Hidden after this moment." error={fe.endsAt}>
                  <DateTimeInput name="endsAt" defaultValue={offer?.endsAt} disabled={ro} error={fe.endsAt} />
                </Field>
                <Field label="Order" hint="Lower numbers show first." error={fe.order} style={{ marginBottom: 0 }}>
                  <NumberInput name="order" step={1} defaultValue={offer?.order ?? 0} disabled={ro} error={fe.order} />
                </Field>
              </FormSection>
              {canEdit && (
                <FormSection>
                  <FormActions>
                    <SubmitButton pendingLabel={isEdit ? "Saving…" : "Creating…"}>{isEdit ? "Save changes" : "Create offer"}</SubmitButton>
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
