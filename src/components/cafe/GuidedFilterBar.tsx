"use client";

import type { CafeFilter as Filter } from "@/types/cafe";
import { useGuidedFilter } from "@/components/cafe/hooks/useGuidedFilter";
import { FilterChipsRow } from "@/components/cafe/GuidedFilterBar/FilterChipsRow";
import { FilterDropdownPanel } from "@/components/cafe/GuidedFilterBar/FilterDropdownPanel";
import { ActiveFilterChips } from "@/components/cafe/GuidedFilterBar/ActiveFilterChips";
import { MobileFilterBar } from "@/components/cafe/GuidedFilterBar/MobileFilterBar";
import { MobileFilterSheet } from "@/components/cafe/GuidedFilterBar/MobileFilterSheet";

interface GuidedFilterBarProps {
  filter: Filter;
  onChange: (filter: Filter) => void;
  districts?: string[];
}
export default function GuidedFilterBar({ filter, onChange, districts }: GuidedFilterBarProps) {
  const {
    dropdownOpen,
    dropdownMounted,
    openDropdown,
    toggleDropdown,
    mobileSheetOpen,
    isMobile,
    openMobileSheet,
    closeMobileSheet,
    staged,
    toggleVibeStaged,
    togglePurposeStaged,
    toggleTagStaged,
    setPriceStaged,
    setHoursStaged,
    setDistanceStaged,
    clearStaged,
    applyDropdown,
    applyMobileSheet,
    toggleVibeInstant,
    toggleOpenNow,
    setDistrict,
    setDistance,
    clearAll,
    activeCount,
    mobileAdvancedCount,
    dropdownRef,
    toggleBtnRef,
    extraVibeBtnRef,
  } = useGuidedFilter(filter, onChange);

  return (
    <div>
      <div className="relative hidden md:block">
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
          setDistrict={setDistrict}
          setDistance={setDistance}
          clearAll={clearAll}
          districts={districts}
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
            onSetHoursStaged={setHoursStaged}
            onApply={applyDropdown}
            onClearAll={clearAll}
          />
        )}
      </div>

      <MobileFilterBar
        filter={filter}
        onChange={onChange}
        activeCount={mobileAdvancedCount}
        onOpen={openMobileSheet}
        districts={districts}
      />
      <MobileFilterSheet
        open={mobileSheetOpen}
        isMobile={isMobile}
        filterNearMe={filter.nearMe}
        staged={staged}
        onClose={closeMobileSheet}
        onApply={applyMobileSheet}
        onClearAll={clearStaged}
        onToggleVibe={toggleVibeStaged}
        onTogglePurpose={togglePurposeStaged}
        onToggleTag={toggleTagStaged}
        onSetPrice={setPriceStaged}
        onSetHours={setHoursStaged}
        onSetDistance={setDistanceStaged}
      />

      <ActiveFilterChips filter={filter} onChange={onChange} clearAll={clearAll} />
    </div>
  );
}
