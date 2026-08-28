"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Article } from "@prisma/client";
import { initialActionState } from "@/lib/admin/action";
import {
  Checkbox,
  DateTimeInput,
  Field,
  FormMessage,
  ImageField,
  RichTextEditor,
  Select,
  SlugInput,
  SubmitButton,
  TextInput,
  Textarea,
  secondaryButtonStyle,
} from "../../../_components/forms";
import { FormActions, FormGrid, FormSection, ReadOnlyNotice } from "../../_components/form-layout";
import { SITE_URL } from "../../_components/table";
import { createArticle, updateArticle } from "../actions";

type Option = { id: string; name: string };

export function ArticleForm({
  article,
  categories,
  doctors,
  canEdit,
}: {
  article?: Article;
  categories: Option[];
  doctors: Option[];
  canEdit: boolean;
}) {
  const isEdit = Boolean(article);
  const [state, formAction] = useActionState(isEdit ? updateArticle : createArticle, initialActionState);
  const router = useRouter();
  useEffect(() => {
    if (state.ok) router.refresh();
  }, [state, router]);

  const fe = state.fieldErrors ?? {};
  const ro = !canEdit;
  const publicUrl = article && article.status === "PUBLISHED" ? `${SITE_URL}/news-articles/${article.slug}` : null;

  return (
    <form action={formAction}>
      {article && <input type="hidden" name="id" value={article.id} />}
      {ro && <ReadOnlyNotice />}
      <FormMessage state={state} success="Article saved." />

      {/* Keyed on updatedAt so a fresh server render remounts the fields with the saved values. */}
      <div key={article?.updatedAt?.toISOString() ?? "new"}>
        <FormGrid
          main={
            <>
              <FormSection>
                <Field label="Title" required error={fe.title}>
                  <TextInput name="title" rtl required defaultValue={article?.title} disabled={ro} error={fe.title} placeholder="عنوان المقال" />
                </Field>
                <Field label="Slug" hint="Auto-generated from the title. Letters, digits and dashes." error={fe.slug}>
                  <SlugInput name="slug" from="title" defaultValue={article?.slug} disabled={ro} error={fe.slug} prefix="/news-articles/" />
                </Field>
                <Field label="Excerpt" hint="Short summary shown on cards and in search results." error={fe.excerpt}>
                  <Textarea name="excerpt" rtl rows={3} defaultValue={article?.excerpt ?? ""} disabled={ro} error={fe.excerpt} />
                </Field>
                <Field label="Content" required error={fe.content} style={{ marginBottom: 0 }}>
                  <RichTextEditor name="content" defaultValue={article?.content ?? ""} disabled={ro} error={fe.content} />
                </Field>
              </FormSection>

              <FormSection title="SEO" subtitle="Optional overrides for the page title and meta description.">
                <Field label="SEO title" error={fe.seoTitle}>
                  <TextInput name="seoTitle" rtl defaultValue={article?.seoTitle ?? ""} disabled={ro} error={fe.seoTitle} />
                </Field>
                <Field label="SEO description" error={fe.seoDescription} style={{ marginBottom: 0 }}>
                  <Textarea name="seoDescription" rtl rows={3} defaultValue={article?.seoDescription ?? ""} disabled={ro} error={fe.seoDescription} />
                </Field>
              </FormSection>
            </>
          }
          side={
            <>
              <FormSection title="Publishing">
                <Field label="Status" error={fe.status}>
                  <Select
                    name="status"
                    defaultValue={article?.status ?? "DRAFT"}
                    disabled={ro}
                    error={fe.status}
                    options={[
                      { value: "DRAFT", label: "Draft" },
                      { value: "PUBLISHED", label: "Published" },
                    ]}
                  />
                </Field>
                <Checkbox
                  name="featured"
                  label="Featured"
                  description="Pinned to the top of the articles page."
                  defaultChecked={article?.featured ?? false}
                  disabled={ro}
                />
                <Field label="Publish date" hint="Leave empty to use the moment it is first published." error={fe.publishedAt} style={{ marginBottom: 0 }}>
                  <DateTimeInput name="publishedAt" defaultValue={article?.publishedAt} disabled={ro} error={fe.publishedAt} />
                </Field>
              </FormSection>

              <FormSection title="Organisation">
                <Field label="Category" error={fe.categoryId}>
                  <Select
                    name="categoryId"
                    rtl
                    defaultValue={article?.categoryId ?? ""}
                    disabled={ro}
                    placeholder="No category"
                    options={categories.map((c) => ({ value: c.id, label: c.name }))}
                  />
                </Field>
                <Field label="Author" error={fe.authorId} style={{ marginBottom: 0 }}>
                  <Select
                    name="authorId"
                    rtl
                    defaultValue={article?.authorId ?? ""}
                    disabled={ro}
                    placeholder="No author"
                    options={doctors.map((d) => ({ value: d.id, label: d.name }))}
                  />
                </Field>
              </FormSection>

              <FormSection title="Cover image">
                <Field label="Image" error={fe.coverImage}>
                  <ImageField name="coverImage" defaultValue={article?.coverImage} disabled={ro} error={fe.coverImage} />
                </Field>
                <Field label="Alt text" error={fe.coverAlt} style={{ marginBottom: 0 }}>
                  <TextInput name="coverAlt" rtl defaultValue={article?.coverAlt ?? ""} disabled={ro} error={fe.coverAlt} />
                </Field>
              </FormSection>

              {canEdit && (
                <FormSection>
                  <FormActions>
                    <SubmitButton pendingLabel={isEdit ? "Saving…" : "Creating…"}>{isEdit ? "Save changes" : "Create article"}</SubmitButton>
                    {publicUrl && (
                      <a href={publicUrl} target="_blank" rel="noopener noreferrer" style={secondaryButtonStyle}>
                        View on site
                      </a>
                    )}
                  </FormActions>
                  {article?.readingMinutes ? (
                    <div style={{ fontSize: 12, color: "var(--ink-4)", marginTop: 12 }}>
                      Reading time: {article.readingMinutes} min · recalculated on save.
                    </div>
                  ) : null}
                </FormSection>
              )}
            </>
          }
        />
      </div>
    </form>
  );
}
