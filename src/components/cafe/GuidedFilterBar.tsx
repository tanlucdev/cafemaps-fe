"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import type { CafeFilter as Filter } from "@/types/cafe";
import { useGuidedFilter } from "@/components/cafe/hooks/useGuidedFilter";
import { FilterChipsRow } from "@/components/cafe/GuidedFilterBar/FilterChipsRow";
import { FilterDropdownPanel } from "@/components/cafe/GuidedFilterBar/FilterDropdownPanel";
import { ActiveFilterChips } from "@/components/cafe/GuidedFilterBar/ActiveFilterChips";
import { MobileFilterBar } from "@/components/cafe/GuidedFilterBar/MobileFilterBar";
import { MobileFilterSheet } from "@/components/cafe/GuidedFilterBar/MobileFilterSheet";
import {
  disableNearMe,
  invalidateNearMeRequest,
  startNearMeRequest,
} from "@/components/cafe/GuidedFilterBar/near-me-request";

interface GuidedFilterBarProps {
  filter: Filter;
  onChange: (filter: Filter) => void;
  districts?: string[];
}
export default function GuidedFilterBar({ filter, onChange, districts }: GuidedFilterBarProps) {
  const tNearby = useTranslations("nearby");
  const [nearMeLoading, setNearMeLoading] = useState(false);
  const filterRef = useRef(filter);
  const onChangeRef = useRef(onChange);
  const inFlightRef = useRef(false);
  const requestIdRef = useRef(0);

  useEffect(() => {
    filterRef.current = filter;
    onChangeRef.current = onChange;
  }, [filter, onChange]);

  const onNearMe = useCallback(() => {
    const options = {
      geolocation: typeof navigator === "undefined" ? undefined : navigator.geolocation,
      getFilter: () => filterRef.current,
      onChange: (nextFilter: Filter) => onChangeRef.current(nextFilter),
      setLoading: setNearMeLoading,
      onNoSupport: () => toast.error(tNearby("noSupport")),
      onLocationError: () => toast.error(tNearby("locationError")),
      inFlightRef,
      requestIdRef,
    };
    if (filterRef.current.nearMe || inFlightRef.current) {
      disableNearMe(options);
      return;
    }
    startNearMeRequest(options);
  }, [tNearby]);

  useEffect(() => () => invalidateNearMeRequest({ inFlightRef, requestIdRef }), []);

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
          nearMeLoading={nearMeLoading}
          onNearMe={onNearMe}
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
        nearMeLoading={nearMeLoading}
        onNearMe={onNearMe}
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
