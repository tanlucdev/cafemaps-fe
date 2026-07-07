"use client"

import { AnimatePresence, motion } from "framer-motion"
import { Coffee } from "lucide-react"
import CafeGrid from "@/components/cafe/CafeGrid"
import CafeList from "@/components/cafe/CafeList"
import Pagination from "@/components/ui/Pagination"
import type { Cafe } from "@/types/cafe"
import type { ViewMode } from "./featured-section-helpers"

interface FeaturedSectionResultsProps {
  animationType: "slide" | "fade"
  dataError: boolean
  dataLoading: boolean
  locale: string
  page: number
  paginated: Cafe[]
  reduceMotion: boolean | null
  total: number
  ts: (key: string) => string
  viewMode: ViewMode
  onPageChange: (page: number) => void
  onRetry: () => void
}

export default function FeaturedSectionResults({
  animationType,
  dataError,
  dataLoading,
  locale,
  page,
  paginated,
  reduceMotion,
  total,
  ts,
  viewMode,
  onPageChange,
  onRetry,
}: FeaturedSectionResultsProps) {
  if (dataError) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-[28px] border border-[var(--border)] bg-[#fffaf2]/78 py-20 text-center shadow-[var(--shadow-sm)] backdrop-blur-md">
        <Coffee size={40} className="text-[var(--accent)]/60" />
        <p className="text-base font-medium text-[var(--foreground-muted)]">
          {locale === "vi" ? "Không tải được danh sách quán." : "Could not load cafes."}
        </p>
        <button
          type="button"
          onClick={onRetry}
          className="cursor-pointer rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-[var(--accent-hover)]"
        >
          {locale === "vi" ? "Thử lại" : "Retry"}
        </button>
      </div>
    )
  }

  if (dataLoading) return <CafeGrid cafes={[]} locale={locale} loading desktopColumns="three" />

  if (total === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-[28px] border border-[var(--border)] bg-[#fffaf2]/78 py-20 text-center shadow-[var(--shadow-sm)] backdrop-blur-md">
        <Coffee size={40} className="text-[var(--accent)]/60" />
        <p className="text-base font-medium text-[var(--foreground-muted)]">
          {ts("noResultsMessage")}
        </p>
      </div>
    )
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={`${viewMode}-${page}-${animationType}`}
        initial={reduceMotion ? false : { opacity: 0, y: 10, scale: 0.992 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.992 }}
        transition={{ duration: reduceMotion ? 0 : 0.22, ease: [0.16, 1, 0.3, 1] }}
      >
        {viewMode === "grid" ? (
          <CafeGrid
            cafes={paginated}
            locale={locale}
            animationType={animationType}
            desktopColumns="three"
          />
        ) : (
          <CafeList cafes={paginated} locale={locale} animationType={animationType} />
        )}

        <Pagination page={page} total={total} limit={9} onPageChange={onPageChange} />
      </motion.div>
    </AnimatePresence>
  )
}
