"use client";

import { useRef, useState } from "react";
import { EditorContent, useEditor, useEditorState } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { inputStyle, smallButtonStyle, primaryButtonStyle } from "./styles";
import { ACCEPT_IMAGES, uploadImage } from "./upload";

/**
 * Tiptap editor (StarterKit + Link + Image) writing HTML into a hidden
 * `<input name={name}>`. RTL/Arabic by default; `immediatelyRender: false`
 * so the server render and the first client render match.
 */
export function RichTextEditor({
  name,
  defaultValue = "",
  error,
  disabled,
}: {
  name: string;
  defaultValue?: string;
  error?: string;
  disabled?: boolean;
}) {
  const [html, setHtml] = useState(defaultValue);
  const [panel, setPanel] = useState<"link" | "image" | null>(null);
  const [linkUrl, setLinkUrl] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [imgAlt, setImgAlt] = useState("");
  const [busy, setBusy] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    immediatelyRender: false,
    editable: !disabled,
    extensions: [
      StarterKit.configure({
        link: false,
        heading: { levels: [2, 3] },
        code: false,
        codeBlock: false,
        strike: false,
        underline: false,
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: "https",
        HTMLAttributes: { rel: "noopener noreferrer" },
      }),
      Image.configure({ inline: false, allowBase64: false }),
    ],
    content: defaultValue,
    editorProps: { attributes: { dir: "rtl", lang: "ar", spellcheck: "true" } },
    onUpdate: ({ editor }) => setHtml(editor.getHTML()),
  });

  const state = useEditorState({
    editor,
    selector: ({ editor }) =>
      editor
        ? {
            paragraph: editor.isActive("paragraph"),
            h2: editor.isActive("heading", { level: 2 }),
            h3: editor.isActive("heading", { level: 3 }),
            bold: editor.isActive("bold"),
            italic: editor.isActive("italic"),
            bulletList: editor.isActive("bulletList"),
            orderedList: editor.isActive("orderedList"),
            blockquote: editor.isActive("blockquote"),
            link: editor.isActive("link"),
            canUndo: editor.can().undo(),
            canRedo: editor.can().redo(),
          }
        : null,
  });

  const ready = Boolean(editor) && !disabled;

  function openLink() {
    if (!editor) return;
    setLinkUrl((editor.getAttributes("link").href as string | undefined) ?? "");
    setPanel(panel === "link" ? null : "link");
  }

  function applyLink() {
    if (!editor) return;
    const href = linkUrl.trim();
    if (href) editor.chain().focus().extendMarkRange("link").setLink({ href }).run();
    else editor.chain().focus().extendMarkRange("link").unsetLink().run();
    setPanel(null);
  }

  function insertImage() {
    if (!editor) return;
    const src = imgUrl.trim();
    if (!src) return;
    editor.chain().focus().setImage({ src, alt: imgAlt.trim() || undefined }).run();
    setImgUrl("");
    setImgAlt("");
    setPanel(null);
  }

  async function onFile(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    setUploadError(null);
    try {
      setImgUrl(await uploadImage(file));
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <div
      className="fk-input"
      aria-invalid={error ? true : undefined}
      style={{ ...inputStyle, padding: 0, background: "var(--surface)", overflow: "hidden" }}
    >
      <input type="hidden" name={name} value={html} />

      {/* Toolbar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
          padding: "6px 8px",
          borderBottom: "1px solid var(--hairline)",
          background: "var(--surface-2)",
          position: "sticky",
          top: 0,
          zIndex: 2,
        }}
      >
        <Tool title="Paragraph" active={state?.paragraph} disabled={!ready} onClick={() => editor?.chain().focus().setParagraph().run()}>
          ¶
        </Tool>
        <Tool title="Heading 2" active={state?.h2} disabled={!ready} onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}>
          H2
        </Tool>
        <Tool title="Heading 3" active={state?.h3} disabled={!ready} onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}>
          H3
        </Tool>
        <Sep />
        <Tool title="Bold" active={state?.bold} disabled={!ready} onClick={() => editor?.chain().focus().toggleBold().run()}>
          <b>B</b>
        </Tool>
        <Tool title="Italic" active={state?.italic} disabled={!ready} onClick={() => editor?.chain().focus().toggleItalic().run()}>
          <i style={{ fontFamily: "Georgia, serif" }}>I</i>
        </Tool>
        <Sep />
        <Tool title="Bullet list" active={state?.bulletList} disabled={!ready} onClick={() => editor?.chain().focus().toggleBulletList().run()}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <line x1="9" y1="6" x2="20" y2="6" /><line x1="9" y1="12" x2="20" y2="12" /><line x1="9" y1="18" x2="20" y2="18" />
            <circle cx="4.5" cy="6" r="1" fill="currentColor" /><circle cx="4.5" cy="12" r="1" fill="currentColor" /><circle cx="4.5" cy="18" r="1" fill="currentColor" />
          </svg>
        </Tool>
        <Tool title="Numbered list" active={state?.orderedList} disabled={!ready} onClick={() => editor?.chain().focus().toggleOrderedList().run()}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <line x1="10" y1="6" x2="21" y2="6" /><line x1="10" y1="12" x2="21" y2="12" /><line x1="10" y1="18" x2="21" y2="18" />
            <path d="M4 6h1v4" /><path d="M4 10h2" /><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" />
          </svg>
        </Tool>
        <Tool title="Quote" active={state?.blockquote} disabled={!ready} onClick={() => editor?.chain().focus().toggleBlockquote().run()}>
          <span style={{ fontFamily: "Georgia, serif", fontSize: 18, lineHeight: 1 }}>&rdquo;</span>
        </Tool>
        <Sep />
        <Tool title="Link" active={state?.link || panel === "link"} disabled={!ready} onClick={openLink}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.72-1.71" />
          </svg>
        </Tool>
        <Tool title="Image" active={panel === "image"} disabled={!ready} onClick={() => setPanel(panel === "image" ? null : "image")}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
          </svg>
        </Tool>
        <Tool title="Horizontal rule" disabled={!ready} onClick={() => editor?.chain().focus().setHorizontalRule().run()}>
          —
        </Tool>
        <Sep />
        <Tool title="Undo" disabled={!ready || !state?.canUndo} onClick={() => editor?.chain().focus().undo().run()}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 14 4 9 9 4" /><path d="M20 20v-7a4 4 0 0 0-4-4H4" />
          </svg>
        </Tool>
        <Tool title="Redo" disabled={!ready || !state?.canRedo} onClick={() => editor?.chain().focus().redo().run()}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 14 20 9 15 4" /><path d="M4 20v-7a4 4 0 0 1 4-4h12" />
          </svg>
        </Tool>
      </div>

      {panel === "link" && (
        <Panel>
          <input
            type="url"
            className="fk-input"
            value={linkUrl}
            placeholder="https://…"
            autoFocus
            onChange={(e) => setLinkUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                applyLink();
              }
              if (e.key === "Escape") setPanel(null);
            }}
            style={{ ...inputStyle, fontFamily: "var(--font-data)", fontSize: 13, flex: 1 }}
          />
          <button type="button" className="fk-btn" onClick={applyLink} style={{ ...primaryButtonStyle, padding: "8px 14px" }}>
            {linkUrl.trim() ? "Apply" : "Remove link"}
          </button>
          <button type="button" className="fk-btn" onClick={() => setPanel(null)} style={smallButtonStyle}>
            Cancel
          </button>
        </Panel>
      )}

      {panel === "image" && (
        <Panel>
          <input
            type="text"
            className="fk-input"
            value={imgUrl}
            placeholder="Image URL or upload…"
            autoFocus
            spellCheck={false}
            onChange={(e) => setImgUrl(e.target.value)}
            style={{ ...inputStyle, fontFamily: "var(--font-data)", fontSize: 13, flex: 2, minWidth: 200 }}
          />
          <input
            type="text"
            className="fk-input"
            value={imgAlt}
            placeholder="Alt text (Arabic)"
            dir="rtl"
            lang="ar"
            onChange={(e) => setImgAlt(e.target.value)}
            style={{ ...inputStyle, flex: 1, minWidth: 160 }}
          />
          <input ref={fileRef} type="file" accept={ACCEPT_IMAGES} hidden onChange={(e) => onFile(e.target.files?.[0])} />
          <button type="button" className="fk-btn" disabled={busy} onClick={() => fileRef.current?.click()} style={smallButtonStyle}>
            {busy ? "Uploading…" : "Upload"}
          </button>
          <button
            type="button"
            className="fk-btn"
            disabled={!imgUrl.trim()}
            onClick={insertImage}
            style={{ ...primaryButtonStyle, padding: "8px 14px" }}
          >
            Insert
          </button>
          <button type="button" className="fk-btn" onClick={() => setPanel(null)} style={smallButtonStyle}>
            Cancel
          </button>
          {uploadError && <span style={{ fontSize: 12.5, color: "var(--red)", width: "100%" }}>{uploadError}</span>}
        </Panel>
      )}

      <div className="fk-editor" style={{ opacity: editor ? 1 : 0.5, minHeight: 360 }}>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

function Tool({
  title,
  active,
  disabled,
  onClick,
  children,
}: {
  title: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      aria-pressed={active ? true : undefined}
      disabled={disabled}
      className={`fk-tool${active ? " is-active" : ""}`}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      style={{
        minWidth: 32,
        height: 30,
        padding: "0 6px",
        borderRadius: 7,
        display: "inline-grid",
        placeItems: "center",
        color: disabled ? "var(--ink-4)" : "var(--ink-2)",
        fontSize: 12.5,
        fontWeight: 700,
        fontFamily: "var(--font-data)",
        lineHeight: 1,
      }}
    >
      {children}
    </button>
  );
}

function Sep() {
  return <span style={{ width: 1, height: 18, background: "var(--hairline)", margin: "0 4px" }} />;
}

function Panel({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        flexWrap: "wrap",
        padding: "8px 10px",
        borderBottom: "1px solid var(--hairline)",
        background: "var(--primary-softer)",
      }}
    >
      {children}
    </div>
  );
}
