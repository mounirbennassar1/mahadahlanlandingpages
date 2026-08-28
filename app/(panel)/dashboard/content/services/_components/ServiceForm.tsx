"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Service } from "@prisma/client";
import { initialActionState } from "@/lib/admin/action";
import { Checkbox, Field, FormMessage, NumberInput, Select, SlugInput, SubmitButton, TextInput, Textarea } from "../../../_components/forms";
import { FormActions, FormSection, ReadOnlyNotice, TwoCol } from "../../_components/form-layout";
import { createService, updateService } from "../actions";

export type LandingOption = { slug: string; title: string };

export function ServiceForm({
  service,
  groups,
  landings,
  canEdit,
}: {
  service?: Service;
  groups: string[];
  landings: LandingOption[];
  canEdit: boolean;
}) {
  const isEdit = Boolean(service);
  const [state, formAction] = useActionState(isEdit ? updateService : createService, initialActionState);
  const router = useRouter();
  useEffect(() => {
    if (state.ok) router.refresh();
  }, [state, router]);

  const fe = state.fieldErrors ?? {};
  const ro = !canEdit;

  return (
    <form action={formAction} style={{ maxWidth: 760 }}>
      {service && <input type="hidden" name="id" value={service.id} />}
      {ro && <ReadOnlyNotice />}
      <FormMessage state={state} success="Service saved." />
      <div key={service?.updatedAt?.toISOString() ?? "new"}>
        <FormSection>
          <Field label="Name" required error={fe.name}>
            <TextInput name="name" rtl required defaultValue={service?.name} disabled={ro} error={fe.name} placeholder="اسم الخدمة" />
          </Field>
          <TwoCol>
            <Field label="Slug" error={fe.slug}>
              <SlugInput name="slug" from="name" defaultValue={service?.slug} disabled={ro} error={fe.slug} />
            </Field>
            <Field label="Group" hint='Heading in the booking select, e.g. "خدمات البشرة".' error={fe.group}>
              <TextInput name="group" rtl list="service-groups" defaultValue={service?.group ?? ""} disabled={ro} error={fe.group} />
              <datalist id="service-groups">
                {groups.map((g) => (
                  <option key={g} value={g} />
                ))}
              </datalist>
            </Field>
          </TwoCol>
          <Field label="Description" error={fe.description}>
            <Textarea name="description" rtl rows={3} defaultValue={service?.description ?? ""} disabled={ro} error={fe.description} />
          </Field>
          <TwoCol>
            <Field label="Landing page" hint="Links this service to one of the treatment landings." error={fe.landingSlug}>
              <Select
                name="landingSlug"
                defaultValue={service?.landingSlug ?? ""}
                disabled={ro}
                error={fe.landingSlug}
                placeholder="None"
                options={landings.map((l) => ({ value: l.slug, label: `${l.slug} · ${l.title}` }))}
              />
            </Field>
            <Field label="Order" hint="Lower numbers show first." error={fe.order}>
              <NumberInput name="order" step={1} defaultValue={service?.order ?? 0} disabled={ro} error={fe.order} />
            </Field>
          </TwoCol>
          <Checkbox name="active" label="Active" description="Listed in the booking form." defaultChecked={service?.active ?? true} disabled={ro} />
          {canEdit && (
            <FormActions>
              <SubmitButton pendingLabel={isEdit ? "Saving…" : "Creating…"}>{isEdit ? "Save changes" : "Create service"}</SubmitButton>
            </FormActions>
          )}
        </FormSection>
      </div>
    </form>
  );
}
