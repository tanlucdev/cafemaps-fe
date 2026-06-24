"use client";

import { useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  page: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ page, total, limit, onPageChange }: PaginationProps) {
  const t = useTranslations("pagination");
  const totalPages = Math.ceil(total / limit);

  if (totalPages <= 1) return null;

  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  // Build page numbers to show: always first, last, current ±1, with ellipsis
  function getPages(): (number | "…")[] {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages: (number | "…")[] = [1];
    if (page > 3) pages.push("…");
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
      pages.push(i);
    }
    if (page < totalPages - 2) pages.push("…");
    pages.push(totalPages);
    return pages;
  }

  return (
    <nav className="flex flex-col items-center gap-3 pt-7 pb-4" aria-label="Pagination">
      <p className="text-xs font-bold text-[var(--foreground-muted)]">
        {t("showing", { from, to, total })}
      </p>

      <div className="flex max-w-full items-center gap-1 overflow-x-auto rounded-full border border-[var(--border)] bg-[#fffaf2]/78 p-1.5 shadow-[var(--shadow-sm)] backdrop-blur-md">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          aria-label={t("prev")}
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-full border text-sm font-bold shadow-[var(--shadow-sm)] backdrop-blur-md transition-all focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] sm:w-auto sm:px-4",
            page === 1
              ? "cursor-not-allowed border-[var(--border)] bg-white/36 text-[var(--foreground-muted)]/40"
              : "border-[var(--border)] bg-white/70 text-[var(--foreground-muted)] hover:-translate-y-px hover:border-[var(--accent)] hover:bg-[var(--accent-light)] hover:text-[var(--accent)]",
          )}
        >
          <ChevronLeft size={16} />
          <span className="hidden sm:inline">{t("prev")}</span>
        </button>

        {getPages().map((p, i) =>
          p === "…" ? (
            <span
              key={`ellipsis-${i}`}
              className="w-7 shrink-0 text-center text-sm font-bold text-[var(--foreground-muted)]/60"
            >
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              aria-current={p === page ? "page" : undefined}
              className={cn(
                "size-10 shrink-0 rounded-full border text-sm font-black shadow-[var(--shadow-sm)] backdrop-blur-md transition-all focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]",
                p === page
                  ? "border-[var(--accent)] bg-[var(--accent)] text-white shadow-[0_12px_28px_rgba(200,132,42,0.20)]"
                  : "border-[var(--border)] bg-white/70 text-[var(--foreground-muted)] hover:-translate-y-px hover:border-[var(--accent)] hover:bg-[var(--accent-light)] hover:text-[var(--accent)]",
              )}
            >
              {p}
            </button>
          ),
        )}

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          aria-label={t("next")}
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-full border text-sm font-bold shadow-[var(--shadow-sm)] backdrop-blur-md transition-all focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] sm:w-auto sm:px-4",
            page === totalPages
              ? "cursor-not-allowed border-[var(--border)] bg-white/36 text-[var(--foreground-muted)]/40"
              : "border-[var(--border)] bg-white/70 text-[var(--foreground-muted)] hover:-translate-y-px hover:border-[var(--accent)] hover:bg-[var(--accent-light)] hover:text-[var(--accent)]",
          )}
        >
          <span className="hidden sm:inline">{t("next")}</span>
          <ChevronRight size={16} />
        </button>
      </div>
    </nav>
  );
}
