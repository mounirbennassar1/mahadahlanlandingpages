import Link from "next/link";
import { orderSearchToParams, type OrderSearch } from "../_lib/query";

/** Page links that keep every active filter (uses `p` so it never clashes with the page filter). */
export function OrdersPagination({ total, pageSize, search, basePath }: { total: number; pageSize: number; search: OrderSearch; basePath: string }) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const current = Math.min(search.pageNo, totalPages);
  const start = total === 0 ? 0 : (current - 1) * pageSize + 1;
  const end = Math.min(total, current * pageSize);

  function href(page: number) {
    const params = orderSearchToParams(search);
    if (page > 1) params.set("p", String(page));
    const qs = params.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  }

  const windowSize = 7;
  let first = Math.max(1, current - Math.floor(windowSize / 2));
  const last = Math.min(totalPages, first + windowSize - 1);
  first = Math.max(1, last - windowSize + 1);
  const pages = Array.from({ length: last - first + 1 }, (_, i) => first + i);

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 22px", borderTop: "1px solid var(--hairline)", fontSize: 13, color: "var(--ink-3)", gap: 12, flexWrap: "wrap" }}>
      <div>
        Showing <b style={{ color: "var(--ink)" }}>{start}–{end}</b> of <b style={{ color: "var(--ink)" }}>{total.toLocaleString("en-US")}</b> orders
      </div>
      {totalPages > 1 && (
        <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
          {pages.map((p) => (
            <Link
              key={p}
              href={href(p)}
              style={{ width: 32, height: 32, borderRadius: 8, display: "grid", placeItems: "center", color: p === current ? "#fff" : "var(--ink-2)", fontSize: 13, fontWeight: 500, fontFamily: "var(--font-data)", background: p === current ? "var(--ink)" : "transparent" }}
            >
              {p}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
