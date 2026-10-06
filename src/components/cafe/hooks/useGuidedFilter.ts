"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import type { CafeFilter as Filter, Vibe, Purpose } from "@/types/cafe";
import type { FilterTag } from "@/components/cafe/constants/filter-constants";

export interface StagedFilter {
  vibes: Vibe[];
  purposes: Purpose[];
  tags: FilterTag[];
  price: string | undefined;
  radiusKm?: number;
  hours: Filter["hours"];
}
function toggleInArray<T>(items: T[], item: T) {
  return items.includes(item) ? items.filter((x) => x !== item) : [...items, item];
}

interface UseGuidedFilterReturn {
  // Dropdown state
  dropdownOpen: boolean;
  dropdownMounted: boolean;
  openDropdown: () => void;
  closeDropdown: () => void;
  toggleDropdown: () => void;

  // Mobile sheet state
  mobileSheetOpen: boolean;
  isMobile: boolean;
  openMobileSheet: () => void;
  closeMobileSheet: () => void;

  // Staged state shared by desktop dropdown and mobile sheet
  staged: StagedFilter;
  toggleVibeStaged: (v: Vibe) => void;
  togglePurposeStaged: (p: Purpose) => void;
  toggleTagStaged: (tag: FilterTag) => void;
  setPriceStaged: (val: string) => void;
  setHoursStaged: (hours: Filter["hours"]) => void;
  setDistanceStaged: (km: number) => void;
  clearStaged: () => void;
  applyDropdown: () => void;
  applyMobileSheet: () => void;

  // Instant handlers (quick chips — write directly to committed filter)
  toggleVibeInstant: (v: Vibe) => void;
  toggleOpenNow: () => void;
  setDistrict: (val: string) => void;
  setDistance: (km: number) => void;
  clearAll: () => void;

  // Derived
  activeCount: number;
  mobileAdvancedCount: number;

  // Refs for click-outside detection
  dropdownRef: React.RefObject<HTMLDivElement | null>;
  toggleBtnRef: React.RefObject<HTMLButtonElement | null>;
  extraVibeBtnRef: React.RefObject<HTMLButtonElement | null>;
}

export function useGuidedFilter(
  filter: Filter,
  onChange: (filter: Filter) => void,
): UseGuidedFilterReturn {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownMounted, setDropdownMounted] = useState(false);
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [staged, setStaged] = useState<StagedFilter>({
    vibes: [],
    purposes: [],
    tags: [],
    price: undefined,
    radiusKm: undefined,
    hours: undefined,
  });

  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const toggleBtnRef = useRef<HTMLButtonElement>(null);
  const extraVibeBtnRef = useRef<HTMLButtonElement>(null);

  const snapshotStaged = useCallback(() => {
    setStaged({
      vibes: (filter.vibes ?? []) as Vibe[],
      purposes: (filter.purposes ?? []) as Purpose[],
      tags: (filter.tags ?? []) as FilterTag[],
      price: filter.priceRange,
      radiusKm: filter.radiusKm,
      hours: filter.hours,
    });
  }, [filter]);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");
    const sync = () => setIsMobile(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  const openDropdown = useCallback(() => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    snapshotStaged();
    setDropdownMounted(true);
    requestAnimationFrame(() => setDropdownOpen(true));
  }, [snapshotStaged]);

  const closeDropdown = useCallback(() => {
    setDropdownOpen(false);
    closeTimerRef.current = setTimeout(() => setDropdownMounted(false), 250);
  }, []);

  const toggleDropdown = useCallback(() => {
    if (dropdownMounted && dropdownOpen) closeDropdown();
    else openDropdown();
  }, [dropdownMounted, dropdownOpen, closeDropdown, openDropdown]);

  const openMobileSheet = useCallback(() => {
    if (!isMobile) return;
    snapshotStaged();
    setMobileSheetOpen(true);
  }, [isMobile, snapshotStaged]);

  const closeMobileSheet = useCallback(() => {
    setMobileSheetOpen(false);
    snapshotStaged();
  }, [snapshotStaged]);

  useEffect(() => {
    if (!isMobile && mobileSheetOpen) closeMobileSheet();
  }, [isMobile, mobileSheetOpen, closeMobileSheet]);

  useEffect(() => {
    if (!dropdownMounted) return;
    function handler(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        !toggleBtnRef.current?.contains(e.target as Node) &&
        !extraVibeBtnRef.current?.contains(e.target as Node)
      ) {
        closeDropdown();
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [dropdownMounted, closeDropdown]);

  const toggleVibeStaged = useCallback((v: Vibe) => {
    setStaged((prev) => ({
      ...prev,
      vibes: toggleInArray(prev.vibes, v),
    }));
  }, []);

  const togglePurposeStaged = useCallback((p: Purpose) => {
    setStaged((prev) => ({
      ...prev,
      purposes: toggleInArray(prev.purposes, p),
    }));
  }, []);

  const toggleTagStaged = useCallback((tag: FilterTag) => {
    setStaged((prev) => ({
      ...prev,
      tags: toggleInArray(prev.tags, tag),
    }));
  }, []);

  const setPriceStaged = useCallback((val: string) => {
    setStaged((prev) => ({
      ...prev,
      price: prev.price === val ? undefined : val,
    }));
  }, []);

  const setHoursStaged = useCallback((hours: Filter["hours"]) => {
    setStaged((prev) => ({ ...prev, hours: prev.hours === hours ? undefined : hours }));
  }, []);

  const setDistanceStaged = useCallback((km: number) => {
    setStaged((prev) => ({ ...prev, radiusKm: km }));
  }, []);

  const clearStaged = useCallback(() => {
    setStaged({ vibes: [], purposes: [], tags: [], price: undefined, radiusKm: undefined, hours: undefined });
  }, []);

  const applyDropdown = useCallback(() => {
    onChange({
      ...filter,
      vibes: staged.vibes.length > 0 ? staged.vibes : undefined,
      purposes: staged.purposes.length > 0 ? staged.purposes : undefined,
      tags: staged.tags.length > 0 ? staged.tags : undefined,
      priceRange: staged.price,
      hours: staged.hours,
    });
    closeDropdown();
  }, [filter, staged, onChange, closeDropdown]);

  const applyMobileSheet = useCallback(() => {
    onChange({
      ...filter,
      vibes: staged.vibes.length > 0 ? staged.vibes : undefined,
      purposes: staged.purposes.length > 0 ? staged.purposes : undefined,
      tags: staged.tags.length > 0 ? staged.tags : undefined,
      priceRange: staged.price,
      radiusKm: staged.radiusKm,
      hours: staged.hours,
    });
    setMobileSheetOpen(false);
  }, [filter, staged, onChange]);

  const toggleVibeInstant = useCallback(
    (v: Vibe) => {
      const current = (filter.vibes ?? []) as Vibe[];
      const next = toggleInArray(current, v);
      onChange({ ...filter, vibes: next.length > 0 ? next : undefined });
    },
    [filter, onChange],
  );

  const toggleOpenNow = useCallback(() => {
    onChange({ ...filter, openNow: !filter.openNow });
  }, [filter, onChange]);

  const setDistrict = useCallback(
    (val: string) => {
      onChange({ ...filter, district: val === "" ? undefined : val });
    },
    [filter, onChange],
  );

  const setDistance = useCallback(
    (km: number) => {
      onChange({ ...filter, radiusKm: km });
    },
    [filter, onChange],
  );

  const clearAll = useCallback(() => {
    onChange({});
    setStaged({ vibes: [], purposes: [], tags: [], price: undefined, radiusKm: undefined, hours: undefined });
    setMobileSheetOpen(false);
  }, [onChange]);

  const activeCount =
    (filter.vibes?.length ?? 0) +
    (filter.purposes?.length ?? 0) +
    (filter.tags?.length ?? 0) +
    (filter.priceRange != null ? 1 : 0) +
    (filter.openNow ? 1 : 0) +
    (filter.hours ? 1 : 0);

  const mobileAdvancedCount =
    (filter.vibes?.length ?? 0) +
    (filter.purposes?.length ?? 0) +
    (filter.tags?.length ?? 0) +
    (filter.priceRange != null ? 1 : 0) +
    (filter.hours ? 1 : 0) +
    (filter.nearMe && filter.radiusKm != null && filter.radiusKm !== 2 ? 1 : 0);

  return {
    dropdownOpen,
    dropdownMounted,
    openDropdown,
    closeDropdown,
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
  };
}
