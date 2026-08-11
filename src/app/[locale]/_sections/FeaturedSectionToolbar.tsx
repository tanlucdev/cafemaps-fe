"use client"

import { AnimatePresence, motion } from "framer-motion"
import { LayoutGrid, LayoutList } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
import type { SearchSort } from "@/lib/search-state"
import type { ViewMode } from "./featured-section-helpers"

interface FeaturedSectionToolbarProps {
  reduceMotion: boolean | null
  sortLabel: string
  sortMode: SearchSort
  total: number
  ts: (key: string, values?: Record<string, number>) => string
  viewMode: ViewMode
  onSortChange: (sort: SearchSort) => void
  onViewModeChange: (mode: ViewMode) => void
}

export default function FeaturedSectionToolbar({
  reduceMotion,
  sortLabel,
  sortMode,
  total,
  ts,
  viewMode,
  onSortChange,
  onViewModeChange,
}: FeaturedSectionToolbarProps) {
  return (
    <div className="mb-5 flex flex-nowrap items-center justify-between gap-2 rounded-[20px] border border-[var(--border)] bg-[#fffaf2]/76 px-3 py-2.5 shadow-[var(--shadow-sm)] backdrop-blur-md sm:gap-4 sm:rounded-[22px] sm:px-4 sm:py-3">
      <p className="shrink-0 text-xs leading-tight font-medium text-[var(--foreground-muted)] sm:text-sm">
        {total > 0 && <strong className="text-[var(--foreground)]">{ts("results", { count: total })}</strong>}
      </p>
      <div className="ml-auto flex min-w-0 shrink items-center gap-1.5 sm:shrink-0 sm:gap-3">
        <Select value={sortMode} onValueChange={(v) => v && onSortChange(v as SearchSort)}>
          <SelectTrigger
            className="h-9 w-[132px] rounded-full border border-[#e8cfa9] bg-white/86 px-2.5 text-[13px] font-bold text-[var(--foreground-muted)] shadow-[0_10px_22px_rgba(44,26,14,0.07)] backdrop-blur-md focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/18 focus:ring-offset-0 focus:outline-none sm:h-10 sm:w-[168px] sm:px-3 dark:bg-[var(--card)]"
            aria-label={ts("sortLabel")}
          >
            <span className="min-w-0 truncate">{sortLabel}</span>
          </SelectTrigger>
          <SelectContent
            sideOffset={6}
            align="end"
            alignItemWithTrigger={false}
            className="min-w-[224px] rounded-[18px] border border-[#e8cfa9] bg-[#fffaf2]/96 p-1 text-[#2f2116] shadow-[0_18px_48px_rgba(44,26,14,0.14)] ring-0 backdrop-blur-xl"
          >
            {(["popular", "rating", "newest"] as const).map((value) => (
              <SelectItem
                key={value}
                value={value}
                className="min-h-10 rounded-[13px] px-3.5 py-2 text-sm font-semibold focus:bg-[var(--accent)] focus:text-white data-[highlighted]:bg-[var(--accent)] data-[highlighted]:text-white"
              >
                {ts(value === "popular" ? "sortPopular" : value === "rating" ? "sortRating" : "sortNewest")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <motion.div
          layout
          className="relative isolate flex items-center gap-1 rounded-full border border-[#e8cfa9] bg-white/82 p-1 shadow-[0_10px_22px_rgba(44,26,14,0.07)] backdrop-blur-md dark:bg-[var(--card)]"
        >
          {(["grid", "list"] as const).map((mode) => {
            const active = viewMode === mode
            const Icon = mode === "grid" ? LayoutGrid : LayoutList
            return (
              <motion.button
                key={mode}
                type="button"
                onClick={() => onViewModeChange(mode)}
                whileHover={reduceMotion ? undefined : { y: -1, scale: 1.04 }}
                whileTap={reduceMotion ? undefined : { scale: 0.92 }}
                className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-[var(--accent)] sm:h-9 sm:w-9 ${active ? `${reduceMotion ? "bg-[var(--accent)] shadow-[0_8px_18px_rgba(200,132,42,0.22)]" : ""} text-white` : "text-[#8b735d] hover:bg-[#f6ead8] hover:text-[var(--foreground)]"}`}
                aria-label={`${mode === "grid" ? "Grid" : "List"} view`}
                aria-pressed={active}
                title={`${mode === "grid" ? "Grid" : "List"} view`}
              >
                {active && !reduceMotion && (
                  <>
                    <motion.span
                      layoutId="featured-view-toggle-thumb"
                      className="absolute inset-0 z-0 rounded-full bg-[var(--accent)] shadow-[0_8px_20px_rgba(200,132,42,0.28),inset_0_1px_0_rgba(255,255,255,0.22)] ring-1 ring-white/35"
                      transition={{ type: "spring", stiffness: 420, damping: 34, mass: 0.72 }}
                    />
                    <AnimatePresence>
                      <motion.span
                        key={mode}
                        className="pointer-events-none absolute inset-[-5px] z-0 rounded-full border border-[var(--accent)]"
                        initial={{ opacity: 0.42, scale: 0.82 }}
                        animate={{ opacity: 0, scale: 1.34 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
                      />
                    </AnimatePresence>
                  </>
                )}
                <motion.span
                  className="relative z-10 grid place-items-center"
                  animate={
                    active && !reduceMotion
                      ? { scale: [0.9, 1.06, 1], rotate: [0, mode === "grid" ? 8 : -8, 0] }
                      : { scale: 1, rotate: 0 }
                  }
                  transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Icon size={16} />
                </motion.span>
              </motion.button>
            )
          })}
        </motion.div>
      </div>
    </div>
  )
}
