"use client"

import { AnimatePresence, motion } from "framer-motion"
import { Coffee, LoaderCircle } from "lucide-react"
import CafeList from "@/components/cafe/CafeList"
import CafeGrid from "@/components/cafe/CafeGrid"
import Pagination from "@/components/ui/Pagination"
import { CafeCardSkeleton, Skeleton } from "@/components/ui/Skeleton"
import type { Cafe } from "@/types/cafe"
import type { ViewMode } from "./featured-section-helpers"

interface FeaturedSectionResultsProps {
  animationType: "slide" | "fade"
  dataError: boolean
  dataLoading: boolean
  locale: string
  page: number
  pageSize: number
  paginated: Cafe[]
  reduceMotion: boolean | null
  canAnimate: boolean
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
  pageSize,
  paginated,
  reduceMotion,
  canAnimate,
  total,
  ts,
  viewMode,
  onPageChange,
  onRetry,
}: FeaturedSectionResultsProps) {
  const direction = viewMode === "grid" ? -1 : 1
  const panelVariants = {
    enter: (dir: number) => ({
      opacity: animationType === "fade" ? 0.86 : 0.55,
      x: animationType === "fade" ? 0 : dir * 12,
      y: animationType === "fade" ? 6 : 8,
      scale: animationType === "fade" ? 1 : 0.992,
    }),
    center: { opacity: 1, x: 0, y: 0, scale: 1 },
    exit: (dir: number) => ({
      opacity: 0.72,
      x: animationType === "fade" ? 0 : dir * -10,
      y: animationType === "fade" ? -4 : -6,
      scale: animationType === "fade" ? 1 : 0.994,
    }),
  }

  if (dataError) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-[28px] border border-[var(--border)] bg-[var(--surface)]/88 py-20 text-center shadow-[var(--shadow-sm)] backdrop-blur-md">
        <Coffee size={40} className="text-[var(--accent)]/60" />
        <p className="text-base font-medium text-[var(--foreground-muted)]">
          {locale === "vi" ? "Không tải được danh sách quán." : "Could not load cafes."}
        </p>
        <button
          type="button"
          onClick={onRetry}
          className="cursor-pointer rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-bold text-[var(--accent-foreground)] transition-colors hover:bg-[var(--accent-hover)]"
        >
          {locale === "vi" ? "Thử lại" : "Retry"}
        </button>
      </div>
    )
  }

  if (dataLoading) return <CafeFilteringLoader viewMode={viewMode} />

  if (total === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-[28px] border border-[var(--border)] bg-[var(--surface)]/88 py-20 text-center shadow-[var(--shadow-sm)] backdrop-blur-md">
        <Coffee size={40} className="text-[var(--accent)]/60" />
        <p className="text-base font-medium text-[var(--foreground-muted)]">
          {ts("noResultsMessage")}
        </p>
      </div>
    )
  }

  return (
    <AnimatePresence custom={direction} mode="popLayout" initial={false}>
      <motion.div
        key={`${viewMode}-${page}-${animationType}`}
        custom={direction}
        variants={panelVariants}
        initial={!canAnimate || reduceMotion ? false : "enter"}
        animate="center"
        exit={reduceMotion ? { opacity: 0 } : "exit"}
        className="will-change-transform"
        transition={
          reduceMotion ? { duration: 0 } : { duration: 0.22, ease: [0.16, 1, 0.3, 1] }
        }
      >
        {viewMode === "grid" ? (
          <CafeGrid
            cafes={paginated}
            locale={locale}
            animationType={animationType}
            desktopColumns="three"
            eagerFirstImage
            mobileCompact
          />
        ) : (
          <CafeList cafes={paginated} locale={locale} animationType={animationType} eagerFirstImage />
        )}

        <Pagination page={page} total={total} limit={pageSize} onPageChange={onPageChange} />
      </motion.div>
    </AnimatePresence>
  )
}

function CafeFilteringLoader({ viewMode }: { viewMode: ViewMode }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex w-full flex-col gap-5"
    >
      <div className="flex items-center gap-3">
        <div className="relative flex size-14 items-center justify-center">
          <LoaderCircle className="absolute size-14 animate-spin text-[var(--accent)]" aria-hidden="true" />
          <Coffee className="size-6 text-[var(--accent)]" aria-hidden="true" />
        </div>
        <div className="space-y-2">
          <div className="h-3 w-36 animate-pulse rounded-full bg-[var(--accent)]/50" />
          <div className="h-2 w-24 animate-pulse rounded-full bg-[#7a9e7e]/45" />
        </div>
      </div>
      {viewMode === "grid" ? (
        <div className="grid grid-cols-2 gap-2 md:grid-cols-2 md:gap-6 lg:gap-8 xl:grid-cols-3">
          {Array.from({ length: 9 }).map((_, index) => (
            <CafeCardSkeleton key={index} mobileCompact />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="flex min-h-[140px] overflow-hidden rounded-2xl bg-[var(--surface)] shadow-[var(--shadow-sm)]"
            >
              <Skeleton className="w-32 shrink-0 rounded-none sm:w-44" />
              <div className="flex min-w-0 flex-1 flex-col gap-3 p-4">
                <Skeleton className="h-5 w-2/3" />
                <Skeleton className="h-4 w-1/2" />
                <div className="flex gap-2">
                  <Skeleton className="h-5 w-16 rounded-full" />
                  <Skeleton className="h-5 w-20 rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
