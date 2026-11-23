"use client";

import ChristmasArt from "@/components/seasonal/ChristmasArt";
import SeasonalGreeting from "@/components/seasonal/SeasonalGreeting";
import seasonal from "@/components/seasonal/SeasonalPages.module.css";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Bookmark, Car, Coffee, FolderOpen, FolderPlus, Search, SlidersHorizontal, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { CafeCardSkeleton } from "@/components/ui/Skeleton";
import { useSavedPageState } from './useSavedPageState';
import { FolderCard } from './FolderCard';
import { FilterChip, DistrictDropdown, SearchBar } from './FilterControls';
import { EmptyState } from './EmptyState';
import { SavedCafeCard } from './SavedCafeCard';
import { SavedModals } from './SavedModals';

export function SavedCollectionView({state}: {state: ReturnType<typeof useSavedPageState>}) {
const { t, entries, entriesLoading, activeCollection, setActiveCollection, quickFilter, setQuickFilter, district, setDistrict, search, setSearch, filtersOpen, setFiltersOpen, setShowCreateFolder, setRenameTarget, setDeleteTarget, setMoveTarget, collections, visibleCafes, activeFilterCount, handleSavedChange, locale } = state;
return (
    <section className={`${seasonal.page} relative min-h-[100svh] overflow-hidden bg-[var(--background)] px-4 pb-[calc(var(--mobile-bottom-nav-height)+28px)] pt-[72px] text-[var(--foreground)] sm:px-6 sm:pt-[104px] lg:px-8 lg:pb-20 lg:pt-28`}>
      <div className="pointer-events-none absolute inset-0 opacity-[0.14] [background-image:radial-gradient(#8b5b2b_0.8px,transparent_0.8px)] [background-size:18px_18px]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-linear-to-b from-[#fff0d2]/55 to-transparent dark:from-white/6" />

      <div className="relative mx-auto max-w-[1280px]">

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="mb-5 grid gap-4 lg:mb-7 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-stretch">
        <div className={`${seasonal.hero} rounded-[28px] border border-[#ffe3b7]/60 bg-[#fffaf2]/72 p-4 shadow-[0_18px_58px_rgba(44,26,14,0.1)] backdrop-blur dark:border-white/10 dark:bg-white/5 sm:p-6 lg:p-7`}>
          <div className={seasonal.intro}><SeasonalGreeting /><ChristmasArt kind="house" className={seasonal.art} /></div>
          <ChristmasArt kind="lights" className={seasonal.lights} />
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#ffe3b7]/70 bg-white/55 px-3 py-1.5 text-[12px] font-bold text-[var(--accent)] shadow-[0_10px_28px_rgba(44,26,14,0.06)] dark:border-white/10 dark:bg-white/7">
              <Bookmark className="size-3.5" aria-hidden="true" />
              {t("collection")}
            </span>
            {entries.length > 0 && (
              <span className="inline-flex items-center gap-2 rounded-full border border-[#dbe8d2] bg-[#f2f8ef]/72 px-3 py-1.5 text-[12px] font-bold text-[#4d7651] dark:border-[#7a9e7e]/24 dark:bg-[#7a9e7e]/12 dark:text-[#a7c9aa]">
                <Coffee className="size-3.5" aria-hidden="true" />
                {t("savedCafeTotalPlain", { count: entries.length })}
              </span>
            )}
          </div>

          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
              <h1 className="font-lora text-[2rem] font-bold leading-[1.04] text-[var(--foreground)] sm:text-[3.1rem] lg:text-[3.75rem]">
                {t("collectionTitle")}
              </h1>
              <p className="mt-3 max-w-2xl text-[14px] leading-6 text-[var(--foreground-muted)] sm:text-base sm:leading-7">
                {t("collectionSubtitle")}
              </p>
            </div>
            {entries.length > 0 && (
              <div className="grid grid-cols-2 gap-2 sm:min-w-[240px]">
                <div className="rounded-[18px] border border-[#ffe3b7]/70 bg-white/56 px-4 py-3 shadow-[0_10px_28px_rgba(44,26,14,0.05)] dark:border-white/10 dark:bg-white/5">
                  <p className="text-[11px] font-bold uppercase text-[var(--foreground-muted)]">{t("total")}</p>
                  <p className="mt-1 text-2xl font-bold text-[var(--foreground)]">{entries.length}</p>
                </div>
                <div className="rounded-[18px] border border-[#ffe3b7]/70 bg-white/56 px-4 py-3 shadow-[0_10px_28px_rgba(44,26,14,0.05)] dark:border-white/10 dark:bg-white/5">
                  <p className="text-[11px] font-bold uppercase text-[var(--foreground-muted)]">{t("folders")}</p>
                  <p className="mt-1 text-2xl font-bold text-[var(--foreground)]">{collections.length}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="relative hidden overflow-hidden rounded-[28px] border border-[#ffe3b7]/45 bg-[#1f1209] shadow-[0_24px_70px_rgba(44,26,14,0.16)] lg:block">
          <Image
            src="/image/home-polaroid-1.jpg"
            alt={t("collectionVisualAlt")}
            fill
            priority
            sizes="360px"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-[#1f1209]/92 via-[#1f1209]/32 to-transparent" />
          <div className="absolute right-4 bottom-4 left-4 rounded-[20px] border border-[#ffe3b7]/20 bg-[#1f1209]/44 p-4 text-[#fff0d2] backdrop-blur-xl">
            <p className="text-[12px] font-bold text-[#ffd18c]">{t("collectionVisualKicker")}</p>
            <p className="mt-2 text-sm leading-6 text-[#fff7e8]/84">{t("collectionVisualCaption")}</p>
          </div>
        </div>
      </div>

      <div className={`${seasonal.panel} rounded-[28px] border border-[#ffe3b7]/60 bg-[#fffaf2]/64 p-3 shadow-[0_20px_70px_rgba(44,26,14,0.09)] backdrop-blur dark:border-white/10 dark:bg-white/5 sm:p-5`}>

      {/* ── Collections row ──────────────────────────────────────────────────── */}
      {(entries.length > 0 || collections.length > 0) && (
        <section className="mb-5" aria-label={t("folders")}>
          <div className="mb-3 flex items-center justify-between gap-3 px-1">
            <h2 className="inline-flex items-center gap-2 text-sm font-bold text-[var(--foreground)] sm:text-base">
              <FolderOpen className="size-4 text-[var(--accent)]" aria-hidden="true" />
              {t("folders")}
            </h2>
            <button
              type="button"
              onClick={() => setShowCreateFolder(true)}
              className="inline-flex min-h-10 cursor-pointer items-center gap-1.5 rounded-full border border-[#ffe3b7]/75 bg-white/64 px-3.5 py-2 text-sm font-bold text-[var(--accent)] shadow-[0_8px_22px_rgba(44,26,14,0.05)] transition-colors hover:bg-[#fff8f2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#fff8ed] dark:border-white/10 dark:bg-white/6 dark:text-[var(--accent)] dark:focus-visible:ring-offset-[#1f1209]"
            >
              <FolderPlus size={15} />
              {t("createFolder")}
            </button>
          </div>

          <div className="-mx-1 flex gap-4 overflow-x-auto px-1 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {/* "All" pseudo-folder */}
            <FolderCard
              group={{ name: t("all"), cafes: entries.map((e) => e.cafe) }}
              active={activeCollection === "all"}
              onClick={() => setActiveCollection("all")}
            />

            {/* User collections */}
            {collections.map((col) => (
              <FolderCard
                key={col.name}
                group={col}
                active={activeCollection === col.name}
                canManage
                onClick={() => setActiveCollection(col.name)}
                onRename={() => setRenameTarget(col.name)}
                onDelete={() => setDeleteTarget(col.name)}
              />
            ))}

            {/* New folder CTA card */}
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => setShowCreateFolder(true)}
              type="button"
              className="group min-w-[150px] shrink-0 cursor-pointer rounded-[20px] text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#fff8ed] dark:focus-visible:ring-offset-[#1f1209] sm:min-w-[168px]"
            >
              <div className="mb-3 flex aspect-[4/3] items-center justify-center rounded-[18px] border-2 border-dashed border-[#d7c3b1] bg-[#fffaf2]/76 transition-all group-hover:border-[var(--accent)]/60 group-hover:bg-[#fff8f2] dark:border-white/12 dark:bg-white/5">
                <FolderPlus size={28} className="text-[#c8a97a] transition-colors group-hover:text-[var(--accent)]" />
              </div>
              <span className="block text-sm font-bold text-[var(--foreground-muted)] group-hover:text-[var(--accent)]">{t("newFolder")}</span>
              <span className="block text-xs text-[#b99d7f]">{t("createNow")}</span>
            </motion.button>
          </div>
        </section>
      )}

      {/* ── Toolbar ──────────────────────────────────────────────────────────── */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between" aria-label={t("filters")}>
        <div className="flex flex-wrap items-center gap-2">
          {/* Mobile toggle */}
          <button
            type="button"
            onClick={() => setFiltersOpen((v) => !v)}
            className={cn(
              "inline-flex min-h-10 cursor-pointer items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm font-bold transition-all sm:hidden",
              filtersOpen || activeFilterCount > 0
                ? "border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-foreground)]"
                : "border-[#ffe3b7]/70 bg-[#fffaf2]/72 text-[var(--foreground)]"
            )}
          >
            <SlidersHorizontal size={14} />
            {t("filters")}
            {activeFilterCount > 0 && (
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white/30 text-[10px] font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Desktop chips */}
          <div className="hidden items-center gap-2 sm:flex sm:flex-wrap">
            <FilterChip active={quickFilter === "all"} onClick={() => setQuickFilter("all")}>
              {t("all")}
            </FilterChip>
            <FilterChip
              active={quickFilter === "open"}
              onClick={() => setQuickFilter(quickFilter === "open" ? "all" : "open")}
              icon={<span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />}
            >
              {t("openNow")}
            </FilterChip>
            <FilterChip
              active={quickFilter === "parking"}
              onClick={() => setQuickFilter(quickFilter === "parking" ? "all" : "parking")}
              icon={<Car size={13} />}
            >
              {t("hasParking")}
            </FilterChip>
            <DistrictDropdown value={district} onChange={setDistrict} />
          </div>
        </div>

        <SearchBar value={search} onChange={setSearch} />
      </div>

      {/* Mobile filter panel */}
      <AnimatePresence>
        {filtersOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="mb-4 overflow-hidden sm:hidden"
          >
            <div className="flex flex-wrap gap-2 pb-3">
              <FilterChip active={quickFilter === "all"} onClick={() => setQuickFilter("all")}>{t("all")}</FilterChip>
              <FilterChip
                active={quickFilter === "open"}
                onClick={() => setQuickFilter(quickFilter === "open" ? "all" : "open")}
                icon={<span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />}
              >
                {t("openNow")}
              </FilterChip>
              <FilterChip
                active={quickFilter === "parking"}
                onClick={() => setQuickFilter(quickFilter === "parking" ? "all" : "parking")}
                icon={<Car size={13} />}
              >
                {t("hasParking")}
              </FilterChip>
              <DistrictDropdown value={district} onChange={setDistrict} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active filter summary */}
      {activeFilterCount > 0 && (
        <div className="mb-4 flex flex-wrap items-center gap-2 px-1 text-sm text-[var(--foreground-muted)]">
          <span>{t("resultCount", { count: visibleCafes.length })}</span>
          <button
            type="button"
            onClick={() => { setQuickFilter("all"); setDistrict(""); setSearch("") }}
            className="inline-flex min-h-8 cursor-pointer items-center gap-1 rounded-full border border-[#ffe3b7]/70 bg-white/70 px-2.5 py-1 text-xs font-bold text-[var(--accent)] transition-colors hover:bg-[#fff1ea] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] dark:border-white/10 dark:bg-white/6 dark:text-[var(--accent)]"
          >
            <X size={11} />
            {t("clearFilters")}
          </button>
        </div>
      )}

      {/* ── Grid ─────────────────────────────────────────────────────────────── */}
      {entriesLoading ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <CafeCardSkeleton key={index} />
          ))}
        </div>
      ) : visibleCafes.length === 0 ? (
        <EmptyState
          title={entries.length === 0 ? t("empty") : t("noResults")}
          subtitle={entries.length === 0 ? t("emptySubtitle") : t("noResultsSubtitle")}
          cta={t("explore")}
        />
      ) : (
        <motion.div
          key={`${activeCollection}-${quickFilter}-${district}-${search}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {visibleCafes.map((cafe, index) => (
            <SavedCafeCard
              key={cafe.id}
              cafe={cafe}
              locale={locale}
              index={index}
              onSavedChange={(saved) => handleSavedChange(cafe.id, saved)}
              onAddToFolder={(c) => setMoveTarget(c)}
            />
          ))}
        </motion.div>
      )}

      {/* ── Bottom CTA ────────────────────────────────────────────────────────── */}
      {entries.length > 0 && (
        <div className="mt-10 flex justify-center">
          <Link
            href="/search"
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[#ffe3b7]/75 bg-[#fffaf2]/78 px-5 py-2.5 text-sm font-bold text-[var(--accent)] shadow-[0_10px_26px_rgba(44,26,14,0.06)] transition-all hover:border-[#c8a97a] hover:bg-[#fff8f2] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#fff8ed] dark:border-white/10 dark:bg-white/6 dark:text-[var(--accent)] dark:focus-visible:ring-offset-[#1f1209]"
          >
            <Search size={16} />
            {t("exploreMore")}
          </Link>
        </div>
      )}

      {/* ── Modals ───────────────────────────────────────────────────────────── */}

      <SavedModals state={state} />
      </div>
      </div>
    </section>
  )
}
