"use client";

import { LayoutGrid, LayoutList } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CafeFilter as Filter } from "@/types/cafe";
import { useGuidedFilter } from "@/components/cafe/hooks/useGuidedFilter";
import { FilterChipsRow } from "@/components/cafe/GuidedFilterBar/FilterChipsRow";
import { FilterDropdownPanel } from "@/components/cafe/GuidedFilterBar/FilterDropdownPanel";
import { ActiveFilterChips } from "@/components/cafe/GuidedFilterBar/ActiveFilterChips";

interface GuidedFilterBarProps {
  filter: Filter;
  onChange: (filter: Filter) => void;
  viewMode?: "grid" | "list";
  onViewModeChange?: (mode: "grid" | "list") => void;
}

export default function GuidedFilterBar({
  filter,
  onChange,
  viewMode = "grid",
  onViewModeChange,
}: GuidedFilterBarProps) {
  const {
    dropdownOpen,
    dropdownMounted,
    openDropdown,
    toggleDropdown,
    staged,
    toggleVibeStaged,
    togglePurposeStaged,
    setPriceStaged,
    setDistrictStaged,
    applyStaged,
    cancelStaged,
    toggleVibeInstant,
    toggleOpenNow,
    setDistance,
    clearAll,
    activeCount,
    dropdownRef,
    toggleBtnRef,
    extraVibeBtnRef,
  } = useGuidedFilter(filter, onChange);

  return (
    <div className="bg-background/95 border-border sticky top-16 z-30 border-b backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ── Filter strip ── */}
        <div className="relative">
          <FilterChipsRow
            filter={filter}
            onChange={onChange}
            activeCount={activeCount}
            dropdownOpen={dropdownOpen}
            dropdownMounted={dropdownMounted}
            onToggleDropdown={toggleDropdown}
            onOpenDropdown={openDropdown}
            toggleBtnRef={toggleBtnRef}
            extraVibeBtnRef={extraVibeBtnRef}
            toggleVibeInstant={toggleVibeInstant}
            toggleOpenNow={toggleOpenNow}
            setDistance={setDistance}
            clearAll={clearAll}
            viewMode={viewMode}
            onViewModeChange={onViewModeChange}
          />

          {dropdownMounted && (
            <FilterDropdownPanel
              staged={staged}
              dropdownOpen={dropdownOpen}
              dropdownRef={dropdownRef}
              onToggleVibeStaged={toggleVibeStaged}
              onTogglePurposeStaged={togglePurposeStaged}
              onSetPriceStaged={setPriceStaged}
              onSetDistrictStaged={setDistrictStaged}
              onApply={applyStaged}
              onCancel={cancelStaged}
              onClearAll={clearAll}
            />
          )}
        </div>

        {/* ── Active filter chips ── */}
        <ActiveFilterChips filter={filter} onChange={onChange} clearAll={clearAll} />

        {/* ── Mobile: view toggle row ── */}
        <div className="flex items-center justify-between gap-3 pb-2.5 md:hidden">
          <div className="flex items-center gap-0.5 rounded-lg border border-[#FEDCC8]/60 bg-[#FFF1EA] p-0.5 dark:border-[#3A2A20] dark:bg-[#2C1A0E]">
            <button
              onClick={() => onViewModeChange?.("grid")}
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-md transition-colors",
                viewMode === "grid"
                  ? "text-accent bg-white shadow-sm dark:bg-[#1C1210]"
                  : "text-[#847465]",
              )}
              aria-label="Grid view"
            >
              <LayoutGrid size={15} />
            </button>
            <button
              onClick={() => onViewModeChange?.("list")}
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-md transition-colors",
                viewMode === "list"
                  ? "text-accent bg-white shadow-sm dark:bg-[#1C1210]"
                  : "text-[#847465]",
              )}
              aria-label="List view"
            >
              <LayoutList size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
