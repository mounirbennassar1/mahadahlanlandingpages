import Link from "next/link";
import { searchToParams, type LeadSearch } from "../_lib/query";

/**
 * Page links that keep every active filter. The previous version linked to
 * `?page=N` only, which silently dropped the source, status and search.
 */
export function Pagination({
  total,
  pageSize,
  search,
  basePath,
}: {
  total: number;
  pageSize: number;
  search: LeadSearch;
  basePath: string;
}) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const current = Math.min(search.page, totalPages);
  const start = total === 0 ? 0 : (current - 1) * pageSize + 1;
  const end = Math.min(total, current * pageSize);

  // A window of at most 7 pages around the current one.
  const windowSize = 7;
  let first = Math.max(1, current - Math.floor(windowSize / 2));
  const last = Math.min(totalPages, first + windowSize - 1);
  first = Math.max(1, last - windowSize + 1);
  const pages = Array.from({ length: last - first + 1 }, (_, i) => first + i);

  function href(page: number) {
    const params = searchToParams(search);
    if (page > 1) params.set("page", String(page));
    const qs = params.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "14px 22px",
        borderTop: "1px solid var(--hairline)",
        fontSize: 13,
        color: "var(--ink-3)",
        gap: 12,
        flexWrap: "wrap",
      }}
    >
      <div>
        Showing{" "}
        <b style={{ color: "var(--ink)" }}>
          {start}–{end}
        </b>{" "}
        of <b style={{ color: "var(--ink)" }}>{total.toLocaleString("en-US")}</b> leads
      </div>
      {totalPages > 1 && (
        <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
          <Arrow href={href(current - 1)} disabled={current === 1} label="Previous">
            ‹
          </Arrow>
          {pages.map((p) => (
            <PageLink key={p} href={href(p)} page={p} active={p === current} />
          ))}
          <Arrow href={href(current + 1)} disabled={current === totalPages} label="Next">
            ›
          </Arrow>
        </div>
      )}
    </div>
  );
}

function PageLink({ href, page, active }: { href: string; page: number; active: boolean }) {
  return (
    <Link
      href={href}
      style={{
        width: 32,
        height: 32,
        borderRadius: 8,
        display: "grid",
        placeItems: "center",
        color: active ? "#fff" : "var(--ink-2)",
        fontSize: 13,
        fontWeight: 500,
        fontFamily: "var(--font-data)",
        background: active ? "var(--ink)" : "transparent",
      }}
    >
      {page}
    </Link>
  );
}

function Arrow({
  href,
  disabled,
  label,
  children,
}: {
  href: string;
  disabled: boolean;
  label: string;
  children: React.ReactNode;
}) {
  if (disabled) {
    return (
      <span
        aria-hidden
        style={{
          width: 32,
          height: 32,
          display: "grid",
          placeItems: "center",
          color: "var(--ink-4)",
          fontSize: 16,
        }}
      >
        {children}
      </span>
    );
  }
  return (
    <Link
      href={href}
      aria-label={label}
      style={{
        width: 32,
        height: 32,
        borderRadius: 8,
        display: "grid",
        placeItems: "center",
        color: "var(--ink-2)",
        fontSize: 16,
      }}
    >
      {children}
    </Link>
  );
}
