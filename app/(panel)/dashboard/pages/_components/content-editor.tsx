"use client";

import { useActionState, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  allFields,
  defaultsOf,
  fieldDefault,
  fieldKey,
  type FieldDef,
  type ItemsField,
  type PageDef,
} from "@/lib/pages/define";
import { sameValue } from "@/lib/pages/merge";
import { initialActionState } from "@/lib/admin/action";
import { Field, FormMessage, SubmitButton } from "@/app/(panel)/dashboard/_components/forms";
import {
  dangerButtonStyle,
  secondaryButtonStyle,
} from "@/app/(panel)/dashboard/_components/forms/styles";
import { FormSection, ReadOnlyNotice } from "@/app/(panel)/dashboard/content/_components/form-layout";
import { savePageContent, resetPageContent } from "../actions";
import { DefaultHint, ModifiedBadge, ResetButton, ScalarInput } from "./field-inputs";
import { ItemsEditor } from "./items-editor";

type Values = Record<string, unknown>;

/**
 * The page-copy editor. All values live in one client state object and are
 * submitted as a single JSON payload, so adding a field to a `content.ts`
 * needs no change here.
 */
export function ContentEditor({
  def,
  initial,
  canEdit,
  orphanCount,
  previewUrl,
}: {
  def: PageDef;
  initial: Values;
  canEdit: boolean;
  orphanCount: number;
  previewUrl: string;
}) {
  const router = useRouter();
  const fields = useMemo(() => allFields(def), [def]);
  const [values, setValues] = useState<Values>(initial);
  const [saveState, saveAction] = useActionState(savePageContent, initialActionState);
  const [resetState, resetAction] = useActionState(resetPageContent, initialActionState);
  const rtl = def.locale === "ar";

  const changed = fields.filter(([key, field]) => !sameValue(values[key], field.default)).length;
  const dirty = !sameValue(values, initial);

  // After a successful reset the server row is gone, so drop back to the code
  // defaults locally instead of waiting for a full reload.
  const resetSeen = useRef(false);
  useEffect(() => {
    if (!resetState.ok || resetSeen.current) return;
    resetSeen.current = true;
    const defaults = defaultsOf(def) as Record<string, Record<string, unknown>>;
    const flat: Values = {};
    for (const [key, , sectionKey, fieldName] of fields) flat[key] = defaults[sectionKey][fieldName];
    setValues(flat);
    router.refresh();
  }, [resetState.ok, def, fields, router]);

  const saveSeen = useRef(false);
  useEffect(() => {
    if (!saveState.ok || saveSeen.current) return;
    saveSeen.current = true;
    router.refresh();
  }, [saveState.ok, router]);

  function setField(key: string, next: unknown) {
    saveSeen.current = false;
    resetSeen.current = false;
    setValues((prev) => ({ ...prev, [key]: next }));
  }

  function resetField(key: string, field: FieldDef) {
    setField(key, fieldDefault(field));
  }

  const state = saveState.error ? saveState : resetState.error ? resetState : saveState;
  const fieldErrors = state.fieldErrors ?? {};

  return (
    <div>
      {!canEdit && <ReadOnlyNotice />}

      <FormMessage
        state={state}
        success="Saved. The public page updates within a few minutes."
      />

      {orphanCount > 0 && canEdit && (
        <FormMessage
          info={`${orphanCount} saved value${orphanCount === 1 ? "" : "s"} no longer match this page's design and are being ignored. Saving again clears them.`}
        />
      )}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          flexWrap: "wrap",
          marginBottom: 18,
          padding: "12px 16px",
          borderRadius: 12,
          background: "var(--surface)",
          border: "1px solid var(--hairline)",
        }}
      >
        <div style={{ fontSize: 13, color: "var(--ink-2)" }}>
          {changed === 0
            ? "This page shows the copy that ships with the site."
            : `${changed} field${changed === 1 ? "" : "s"} changed from the default.`}
          {dirty && (
            <span style={{ color: "var(--amber)", fontWeight: 600 }}> Unsaved changes.</span>
          )}
        </div>
        <a
          href={previewUrl}
          target="_blank"
          rel="noreferrer"
          className="fk-btn"
          style={secondaryButtonStyle}
        >
          Preview page ↗
        </a>
      </div>

      <form action={saveAction}>
        <input type="hidden" name="slug" value={def.slug} />
        <input type="hidden" name="data" value={JSON.stringify(values)} />

        {Object.entries(def.sections).map(([sectionKey, section]) => (
          <FormSection key={sectionKey} title={section.title} subtitle={section.hint}>
            {Object.entries(section.fields).map(([fieldName, field]) => {
              const key = fieldKey(sectionKey, fieldName);
              const value = values[key];
              const isModified = !sameValue(value, field.default);
              return (
                <Field
                  key={key}
                  label={
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                      {field.label}
                      {isModified && <ModifiedBadge />}
                      {isModified && canEdit && (
                        <ResetButton onClick={() => resetField(key, field)} />
                      )}
                    </span>
                  }
                  hint={field.hint}
                  error={fieldErrors[key]}
                >
                  {field.kind === "items" ? (
                    <ItemsEditor
                      field={field as ItemsField}
                      value={(Array.isArray(value) ? value : []) as Record<string, unknown>[]}
                      rtl={rtl}
                      disabled={!canEdit}
                      onChange={(next) => setField(key, next)}
                    />
                  ) : (
                    <>
                      <ScalarInput
                        field={field}
                        value={value as string | string[]}
                        rtl={rtl}
                        disabled={!canEdit}
                        onChange={(next) => setField(key, next)}
                      />
                      {isModified && <DefaultHint field={field} rtl={rtl} />}
                    </>
                  )}
                </Field>
              );
            })}
          </FormSection>
        ))}

        {canEdit && (
          <div
            style={{
              position: "sticky",
              bottom: 0,
              display: "flex",
              alignItems: "center",
              gap: 10,
              flexWrap: "wrap",
              padding: "14px 16px",
              borderRadius: 12,
              background: "var(--surface)",
              border: "1px solid var(--hairline)",
              boxShadow: "var(--shadow-lg)",
            }}
          >
            <SubmitButton pendingLabel="Saving…">Save changes</SubmitButton>
            <button
              type="button"
              className="fk-btn"
              onClick={() => {
                setValues(initial);
                router.refresh();
              }}
              disabled={!dirty}
              style={secondaryButtonStyle}
            >
              Discard changes
            </button>
            <span style={{ flex: 1 }} />
            <ResetAllButton slug={def.slug} action={resetAction} disabled={changed === 0} />
          </div>
        )}
      </form>
    </div>
  );
}

/** Two-step "reset everything", matching the inline confirm of DeleteButton. */
function ResetAllButton({
  slug,
  action,
  disabled,
}: {
  slug: string;
  action: (fd: FormData) => void;
  disabled: boolean;
}) {
  const [armed, setArmed] = useState(false);

  if (!armed) {
    return (
      <button
        type="button"
        className="fk-btn"
        onClick={() => setArmed(true)}
        disabled={disabled}
        style={dangerButtonStyle}
      >
        Reset all to defaults
      </button>
    );
  }

  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
      <span style={{ fontSize: 12.5, color: "var(--ink-3)" }}>Discard every change?</span>
      <button
        type="button"
        className="fk-btn"
        onClick={() => setArmed(false)}
        style={secondaryButtonStyle}
      >
        Cancel
      </button>
      <button
        type="button"
        className="fk-btn"
        onClick={() => {
          const fd = new FormData();
          fd.set("slug", slug);
          action(fd);
          setArmed(false);
        }}
        style={dangerButtonStyle}
      >
        Yes, reset
      </button>
    </span>
  );
}
