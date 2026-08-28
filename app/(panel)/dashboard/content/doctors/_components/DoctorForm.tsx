"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Doctor } from "@prisma/client";
import { initialActionState } from "@/lib/admin/action";
import {
  Checkbox,
  Field,
  FormMessage,
  ImageField,
  ListInput,
  NumberInput,
  SlugInput,
  SubmitButton,
  TextInput,
  Textarea,
  secondaryButtonStyle,
} from "../../../_components/forms";
import { FormActions, FormGrid, FormSection, ReadOnlyNotice } from "../../_components/form-layout";
import { SITE_URL } from "../../_components/table";
import { createDoctor, updateDoctor } from "../actions";

export function DoctorForm({ doctor, canEdit }: { doctor?: Doctor; canEdit: boolean }) {
  const isEdit = Boolean(doctor);
  const [state, formAction] = useActionState(isEdit ? updateDoctor : createDoctor, initialActionState);
  const router = useRouter();
  useEffect(() => {
    if (state.ok) router.refresh();
  }, [state, router]);

  const fe = state.fieldErrors ?? {};
  const ro = !canEdit;
  const publicUrl = doctor?.active ? `${SITE_URL}/doctors/${doctor.slug}` : null;

  return (
    <form action={formAction}>
      {doctor && <input type="hidden" name="id" value={doctor.id} />}
      {ro && <ReadOnlyNotice />}
      <FormMessage state={state} success="Doctor saved." />
      <div key={doctor?.updatedAt?.toISOString() ?? "new"}>
        <FormGrid
          main={
            <>
              <FormSection>
                <Field label="Name" required error={fe.name}>
                  <TextInput name="name" rtl required defaultValue={doctor?.name} disabled={ro} error={fe.name} placeholder="د. …" />
                </Field>
                <Field label="Slug" error={fe.slug}>
                  <SlugInput name="slug" from="name" defaultValue={doctor?.slug} disabled={ro} error={fe.slug} prefix="/doctors/" />
                </Field>
                <Field label="Title" required hint="Role line, e.g. استشارية الجلدية والتجميل والليزر" error={fe.title}>
                  <TextInput name="title" rtl required defaultValue={doctor?.title} disabled={ro} error={fe.title} />
                </Field>
                <Field label="Bio" error={fe.bio} style={{ marginBottom: 0 }}>
                  <Textarea name="bio" rtl rows={6} defaultValue={doctor?.bio ?? ""} disabled={ro} error={fe.bio} />
                </Field>
              </FormSection>
              <FormSection title="Credentials & specialties" subtitle="One item per line.">
                <Field label="Credentials" error={fe.credentials}>
                  <ListInput name="credentials" defaultValue={doctor?.credentials ?? []} disabled={ro} error={fe.credentials} placeholder="البورد السعودي في …" />
                </Field>
                <Field label="Specialties" error={fe.specialties} style={{ marginBottom: 0 }}>
                  <ListInput name="specialties" rows={3} defaultValue={doctor?.specialties ?? []} disabled={ro} error={fe.specialties} placeholder="الليزر" />
                </Field>
              </FormSection>
            </>
          }
          side={
            <>
              <FormSection title="Photo">
                <Field label="Image" error={fe.image}>
                  <ImageField name="image" defaultValue={doctor?.image} disabled={ro} error={fe.image} />
                </Field>
                <Field label="Alt text" error={fe.imageAlt} style={{ marginBottom: 0 }}>
                  <TextInput name="imageAlt" rtl defaultValue={doctor?.imageAlt ?? ""} disabled={ro} error={fe.imageAlt} />
                </Field>
              </FormSection>
              <FormSection title="Visibility">
                <Checkbox name="active" label="Active" description="Shown on the doctors and about pages." defaultChecked={doctor?.active ?? true} disabled={ro} />
                <Field label="Order" hint="Lower numbers show first." error={fe.order} style={{ marginBottom: 0 }}>
                  <NumberInput name="order" step={1} defaultValue={doctor?.order ?? 0} disabled={ro} error={fe.order} />
                </Field>
              </FormSection>
              {canEdit && (
                <FormSection>
                  <FormActions>
                    <SubmitButton pendingLabel={isEdit ? "Saving…" : "Creating…"}>{isEdit ? "Save changes" : "Create doctor"}</SubmitButton>
                    {publicUrl && (
                      <a href={publicUrl} target="_blank" rel="noopener noreferrer" style={secondaryButtonStyle}>
                        View on site
                      </a>
                    )}
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
