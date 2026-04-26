"use client"

import { useTranslations } from "next-intl"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface PaginationProps {
  page: number
  total: number
  limit: number
  onPageChange: (page: number) => void
}

export default function Pagination({ page, total, limit, onPageChange }: PaginationProps) {
  const t = useTranslations("pagination")
  const totalPages = Math.ceil(total / limit)

  if (totalPages <= 1) return null

  const from = (page - 1) * limit + 1
  const to = Math.min(page * limit, total)

  // Build page numbers to show: always first, last, current ±1, with ellipsis
  function getPages(): (number | "…")[] {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1)
    const pages: (number | "…")[] = [1]
    if (page > 3) pages.push("…")
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
      pages.push(i)
    }
    if (page < totalPages - 2) pages.push("…")
    pages.push(totalPages)
    return pages
  }

  return (
    <div className="flex flex-col items-center gap-3 pt-8 pb-4">
      {/* Showing X–Y of Z */}
      <p className="text-xs text-(--foreground-muted)">
        {t("showing", { from, to, total })}
      </p>

      {/* Page controls */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className={cn(
            "flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
            page === 1
              ? "border-border text-(--foreground-muted) opacity-40 cursor-not-allowed"
              : "border-border text-(--foreground-muted) hover:border-accent hover:text-accent"
          )}
        >
          <ChevronLeft size={14} />
          {t("prev")}
        </button>

        {getPages().map((p, i) =>
          p === "…" ? (
            <span key={`ellipsis-${i}`} className="w-8 text-center text-xs text-(--foreground-muted)">
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={cn(
                "w-8 h-8 rounded-lg text-xs font-medium transition-all border",
                p === page
                  ? "bg-accent text-white border-accent"
                  : "border-border text-(--foreground-muted) hover:border-accent hover:text-accent"
              )}
            >
              {p}
            </button>
          )
        )}

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          className={cn(
            "flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
            page === totalPages
              ? "border-border text-(--foreground-muted) opacity-40 cursor-not-allowed"
              : "border-border text-(--foreground-muted) hover:border-accent hover:text-accent"
          )}
        >
          {t("next")}
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  )
}
