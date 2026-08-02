"use client"

import { AnimatePresence, LayoutGroup, motion } from "framer-motion"
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
  const direction = viewMode === "grid" ? -1 : 1
  const panelVariants = {
    enter: (dir: number) => ({
      opacity: 0.28,
      x: dir * 34,
      y: 14,
      scale: 0.982,
      filter: "blur(2px)",
    }),
    center: { opacity: 1, x: 0, y: 0, scale: 1, filter: "blur(0px)" },
    exit: (dir: number) => ({
      opacity: 0.2,
      x: dir * -26,
      y: -10,
      scale: 0.986,
      filter: "blur(2px)",
    }),
  }

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
    <LayoutGroup id="featured-cafe-results">
      <AnimatePresence custom={direction} mode="popLayout" initial={false}>
        <motion.div
          key={`${viewMode}-${page}-${animationType}`}
          custom={direction}
          variants={panelVariants}
          initial={reduceMotion ? false : "enter"}
          animate="center"
          exit={reduceMotion ? { opacity: 0 } : "exit"}
          className="will-change-transform"
          transition={
            reduceMotion
              ? { duration: 0 }
              : { duration: 0.34, ease: [0.16, 1, 0.3, 1] }
          }
        >
          {viewMode === "grid" ? (
            <CafeGrid
              cafes={paginated}
              locale={locale}
              animationType={animationType}
              desktopColumns="three"
              eagerFirstImage
            />
          ) : (
            <CafeList cafes={paginated} locale={locale} animationType={animationType} eagerFirstImage />
          )}

          <Pagination page={page} total={total} limit={9} onPageChange={onPageChange} />
        </motion.div>
      </AnimatePresence>
    </LayoutGroup>
  )
}
