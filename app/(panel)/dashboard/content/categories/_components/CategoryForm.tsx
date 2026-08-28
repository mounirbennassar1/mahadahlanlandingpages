"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Category } from "@prisma/client";
import { initialActionState } from "@/lib/admin/action";
import { Field, FormMessage, NumberInput, SlugInput, SubmitButton, TextInput, Textarea } from "../../../_components/forms";
import { FormActions, FormSection, ReadOnlyNotice, TwoCol } from "../../_components/form-layout";
import { createCategory, updateCategory } from "../actions";

export function CategoryForm({ category, canEdit }: { category?: Category; canEdit: boolean }) {
  const isEdit = Boolean(category);
  const [state, formAction] = useActionState(isEdit ? updateCategory : createCategory, initialActionState);
  const router = useRouter();
  useEffect(() => {
    if (state.ok) router.refresh();
  }, [state, router]);

  const fe = state.fieldErrors ?? {};
  const ro = !canEdit;

  return (
    <form action={formAction} style={{ maxWidth: 720 }}>
      {category && <input type="hidden" name="id" value={category.id} />}
      {ro && <ReadOnlyNotice />}
      <FormMessage state={state} success="Category saved." />
      <div key={category?.updatedAt?.toISOString() ?? "new"}>
        <FormSection>
          <Field label="Name" required error={fe.name}>
            <TextInput name="name" rtl required defaultValue={category?.name} disabled={ro} error={fe.name} placeholder="اسم التصنيف" />
          </Field>
          <TwoCol>
            <Field label="Slug" hint="Used in the articles filter URL." error={fe.slug}>
              <SlugInput name="slug" from="name" defaultValue={category?.slug} disabled={ro} error={fe.slug} />
            </Field>
            <Field label="Order" hint="Lower numbers show first." error={fe.order}>
              <NumberInput name="order" step={1} defaultValue={category?.order ?? 0} disabled={ro} error={fe.order} />
            </Field>
          </TwoCol>
          <Field label="Description" error={fe.description} style={{ marginBottom: canEdit ? 22 : 0 }}>
            <Textarea name="description" rtl rows={3} defaultValue={category?.description ?? ""} disabled={ro} error={fe.description} />
          </Field>
          {canEdit && (
            <FormActions>
              <SubmitButton pendingLabel={isEdit ? "Saving…" : "Creating…"}>{isEdit ? "Save changes" : "Create category"}</SubmitButton>
            </FormActions>
          )}
        </FormSection>
      </div>
    </form>
  );
}
