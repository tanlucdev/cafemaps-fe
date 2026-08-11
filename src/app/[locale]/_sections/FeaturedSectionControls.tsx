"use client";

import type { RefObject } from "react";
import { motion, type MotionProps } from "framer-motion";
import { Coffee, Search } from "lucide-react";
import GuidedFilterBar from "@/components/cafe/GuidedFilterBar";
import type { CafeFilter as Filter } from "@/types/cafe";

interface FeaturedSectionControlsProps {
  activeDistricts?: string[];
  filter: Filter;
  headerMotion: MotionProps;
  searchInput: string;
  searchInputRef: RefObject<HTMLInputElement | null>;
  setSearchInput: (value: string) => void;
  ts: (key: string) => string;
  onFilterChange: (filter: Filter) => void;
  onSearchSubmit: () => void;
}

export default function FeaturedSectionControls({
  activeDistricts,
  filter,
  headerMotion,
  searchInput,
  searchInputRef,
  setSearchInput,
  ts,
  onFilterChange,
  onSearchSubmit,
}: FeaturedSectionControlsProps) {
  return (
    <section className="relative z-30 border-b border-[var(--border)] bg-[#fffaf2]/82 pt-[76px] pb-4 shadow-[0_12px_34px_rgba(44,26,14,0.06)] backdrop-blur-xl sm:pt-16 sm:pb-5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div {...headerMotion} className="max-w-3xl pb-5">
          <p className="mb-2 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--accent-light)] px-3 py-1.5 text-xs font-bold text-[var(--accent)] shadow-[var(--shadow-sm)] backdrop-blur-md">
            <Coffee size={13} aria-hidden /> {ts("eyebrow")}
          </p>
          <h1 className="max-w-[13ch] font-lora text-[30px] leading-tight font-bold text-[var(--foreground)] sm:max-w-none sm:text-[44px]">
            {ts("heading")}
          </h1>
          <p className="mt-2 max-w-[32ch] text-sm leading-6 font-medium text-[var(--foreground-muted)] sm:max-w-2xl sm:text-base">
            {ts("subtitle")}
          </p>
        </motion.div>

        <motion.div {...headerMotion}>
          <div className="flex max-w-2xl items-center overflow-hidden rounded-full border border-[var(--border)] bg-white/78 shadow-[var(--shadow-sm)] backdrop-blur-md transition-colors outline-none focus-within:border-[var(--accent)] focus-within:ring-2 focus-within:ring-[var(--accent)]/16 dark:bg-[var(--card)]">
            <div className="flex shrink-0 items-center pl-4 text-[var(--foreground-muted)]">
              <Search size={16} />
            </div>
            <input
              ref={searchInputRef}
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onSearchSubmit()}
              placeholder={ts("placeholder")}
              className="min-w-0 flex-1 appearance-none border-0 bg-transparent py-3 pr-2 pl-3 text-[13.5px] text-[var(--foreground)] shadow-none ring-0 outline-0 placeholder:text-[var(--foreground-muted)] focus:border-0 focus:shadow-none focus:ring-0 focus:outline-none"
            />
            <button
              onClick={onSearchSubmit}
              className="m-1.5 shrink-0 cursor-pointer rounded-full bg-[var(--accent)] px-5 py-2 text-[13px] font-black text-white shadow-[0_10px_24px_rgba(200,132,42,0.18)] transition-transform hover:-translate-y-px hover:scale-[1.02] hover:bg-[var(--accent-hover)] focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] active:scale-95"
            >
              {ts("button")}
            </button>
          </div>
        </motion.div>

        <div className="sticky top-16 z-50 -mx-2 mt-6 rounded-[24px] border border-[var(--border)] bg-[#fffaf2]/90 px-2 shadow-[0_16px_42px_rgba(44,26,14,0.10)] backdrop-blur-xl sm:top-18 sm:mx-0 sm:mt-7 sm:px-4">
          <GuidedFilterBar filter={filter} onChange={onFilterChange} districts={activeDistricts} />
        </div>
      </div>
    </section>
  );
}
