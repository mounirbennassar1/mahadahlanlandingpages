"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Device } from "@prisma/client";
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
import { FormActions, FormGrid, FormSection, ReadOnlyNotice, TwoCol } from "../../_components/form-layout";
import { SITE_URL } from "../../_components/table";
import { createDevice, updateDevice } from "../actions";

export function DeviceForm({ device, canEdit }: { device?: Device; canEdit: boolean }) {
  const isEdit = Boolean(device);
  const [state, formAction] = useActionState(isEdit ? updateDevice : createDevice, initialActionState);
  const router = useRouter();
  useEffect(() => {
    if (state.ok) router.refresh();
  }, [state, router]);

  const fe = state.fieldErrors ?? {};
  const ro = !canEdit;
  const publicUrl = device?.active ? `${SITE_URL}/our-devices/${device.slug}` : null;

  return (
    <form action={formAction}>
      {device && <input type="hidden" name="id" value={device.id} />}
      {ro && <ReadOnlyNotice />}
      <FormMessage state={state} success="Device saved." />
      <div key={device?.updatedAt?.toISOString() ?? "new"}>
        <FormGrid
          main={
            <>
              <FormSection>
                <TwoCol>
                  <Field label="Name (Arabic)" required error={fe.name}>
                    <TextInput name="name" rtl required defaultValue={device?.name} disabled={ro} error={fe.name} />
                  </Field>
                  <Field label="Name (English)" hint="Brand name as printed on the device." error={fe.nameEn}>
                    <TextInput name="nameEn" defaultValue={device?.nameEn ?? ""} disabled={ro} error={fe.nameEn} placeholder="e.g. Morpheus8" />
                  </Field>
                </TwoCol>
                <Field label="Slug" hint="Generated from the English name when left empty." error={fe.slug}>
                  <SlugInput name="slug" from="nameEn" defaultValue={device?.slug} disabled={ro} error={fe.slug} prefix="/our-devices/" />
                </Field>
                <Field label="Tagline" error={fe.tagline}>
                  <TextInput name="tagline" rtl defaultValue={device?.tagline ?? ""} disabled={ro} error={fe.tagline} />
                </Field>
                <Field label="Description" error={fe.description}>
                  <Textarea name="description" rtl rows={6} defaultValue={device?.description ?? ""} disabled={ro} error={fe.description} />
                </Field>
                <Field label="Used for" hint="One treatment per line." error={fe.usedFor} style={{ marginBottom: 0 }}>
                  <ListInput name="usedFor" defaultValue={device?.usedFor ?? []} disabled={ro} error={fe.usedFor} placeholder="شد الوجه" />
                </Field>
              </FormSection>
            </>
          }
          side={
            <>
              <FormSection title="Image">
                <Field label="Image" error={fe.image}>
                  <ImageField name="image" defaultValue={device?.image} disabled={ro} error={fe.image} />
                </Field>
                <Field label="Alt text" error={fe.imageAlt} style={{ marginBottom: 0 }}>
                  <TextInput name="imageAlt" rtl defaultValue={device?.imageAlt ?? ""} disabled={ro} error={fe.imageAlt} />
                </Field>
              </FormSection>
              <FormSection title="Visibility">
                <Checkbox name="active" label="Active" description="Shown on the devices page." defaultChecked={device?.active ?? true} disabled={ro} />
                <Field label="Order" hint="Lower numbers show first." error={fe.order} style={{ marginBottom: 0 }}>
                  <NumberInput name="order" step={1} defaultValue={device?.order ?? 0} disabled={ro} error={fe.order} />
                </Field>
              </FormSection>
              {canEdit && (
                <FormSection>
                  <FormActions>
                    <SubmitButton pendingLabel={isEdit ? "Saving…" : "Creating…"}>{isEdit ? "Save changes" : "Create device"}</SubmitButton>
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
