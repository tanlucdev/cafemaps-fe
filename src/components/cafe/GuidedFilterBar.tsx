"use client";

import type { CafeFilter as Filter } from "@/types/cafe";
import { useGuidedFilter } from "@/components/cafe/hooks/useGuidedFilter";
import { FilterChipsRow } from "@/components/cafe/GuidedFilterBar/FilterChipsRow";
import { FilterDropdownPanel } from "@/components/cafe/GuidedFilterBar/FilterDropdownPanel";
import { ActiveFilterChips } from "@/components/cafe/GuidedFilterBar/ActiveFilterChips";

interface GuidedFilterBarProps {
  filter: Filter;
  onChange: (filter: Filter) => void;
  districts?: string[];
  viewMode?: "grid" | "list";
  onViewModeChange?: (mode: "grid" | "list") => void;
}

export default function GuidedFilterBar({
  filter,
  onChange,
  districts,
}: GuidedFilterBarProps) {
  const {
    dropdownOpen,
    dropdownMounted,
    openDropdown,
    toggleDropdown,
    staged,
    toggleVibeStaged,
    togglePurposeStaged,
    toggleTagStaged,
    setPriceStaged,
    setDistrictStaged,
    applyStaged,
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
    <div>
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
        />

        {dropdownMounted && (
          <FilterDropdownPanel
            staged={staged}
            dropdownOpen={dropdownOpen}
            dropdownRef={dropdownRef}
            onToggleVibeStaged={toggleVibeStaged}
            onTogglePurposeStaged={togglePurposeStaged}
            onToggleTagStaged={toggleTagStaged}
            onSetPriceStaged={setPriceStaged}
            onSetDistrictStaged={setDistrictStaged}
            districts={districts}
            onApply={applyStaged}
            onClearAll={clearAll}
          />
        )}
      </div>

      {/* ── Active filter chips ── */}
      <ActiveFilterChips filter={filter} onChange={onChange} clearAll={clearAll} />
    </div>
  );
}
