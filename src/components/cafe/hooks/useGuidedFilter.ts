"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import type { CafeFilter as Filter, Vibe, Purpose } from "@/types/cafe";
import type { FilterTag } from "@/components/cafe/constants/filter-constants";

interface StagedFilter {
  vibes: Vibe[];
  purposes: Purpose[];
  tags: FilterTag[];
  price: string | undefined;
  district: string | undefined;
}

interface UseGuidedFilterReturn {
  // Dropdown state
  dropdownOpen: boolean;
  dropdownMounted: boolean;
  openDropdown: () => void;
  closeDropdown: () => void;
  toggleDropdown: () => void;

  // Staged state (for dropdown panel only)
  staged: StagedFilter;
  toggleVibeStaged: (v: Vibe) => void;
  togglePurposeStaged: (p: Purpose) => void;
  toggleTagStaged: (tag: FilterTag) => void;
  setPriceStaged: (val: string) => void;
  setDistrictStaged: (val: string) => void;
  applyStaged: () => void;
  cancelStaged: () => void;

  // Instant handlers (quick chips — write directly to committed filter)
  toggleVibeInstant: (v: Vibe) => void;
  toggleOpenNow: () => void;
  setDistance: (km: number) => void;
  clearAll: () => void;

  // Derived
  activeCount: number;

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
  const [staged, setStaged] = useState<StagedFilter>({
    vibes: [],
    purposes: [],
    tags: [],
    price: undefined,
    district: undefined,
  });

  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const toggleBtnRef = useRef<HTMLButtonElement>(null);
  const extraVibeBtnRef = useRef<HTMLButtonElement>(null);

  const openDropdown = useCallback(() => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    // Snapshot current committed filter into staged state
    setStaged({
      vibes: (filter.vibes ?? []) as Vibe[],
      purposes: (filter.purposes ?? []) as Purpose[],
      tags: (filter.tags ?? []) as FilterTag[],
      price: filter.priceRange,
      district: filter.district,
    });
    setDropdownMounted(true);
    requestAnimationFrame(() => setDropdownOpen(true));
  }, [filter]);

  const closeDropdown = useCallback(() => {
    setDropdownOpen(false);
    closeTimerRef.current = setTimeout(() => setDropdownMounted(false), 250);
  }, []);

  const toggleDropdown = useCallback(() => {
    if (dropdownMounted && dropdownOpen) closeDropdown();
    else openDropdown();
  }, [dropdownMounted, dropdownOpen, closeDropdown, openDropdown]);

  // Click-outside to close
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

  // Staged handlers (panel only — do not call onChange)
  const toggleVibeStaged = useCallback((v: Vibe) => {
    setStaged((prev) => ({
      ...prev,
      vibes: prev.vibes.includes(v) ? prev.vibes.filter((x) => x !== v) : [...prev.vibes, v],
    }));
  }, []);

  const togglePurposeStaged = useCallback((p: Purpose) => {
    setStaged((prev) => ({
      ...prev,
      purposes: prev.purposes.includes(p)
        ? prev.purposes.filter((x) => x !== p)
        : [...prev.purposes, p],
    }));
  }, []);

  const toggleTagStaged = useCallback((tag: FilterTag) => {
    setStaged((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((x) => x !== tag)
        : [...prev.tags, tag],
    }));
  }, []);

  const setPriceStaged = useCallback((val: string) => {
    setStaged((prev) => ({
      ...prev,
      price: prev.price === val ? undefined : val,
    }));
  }, []);

  const setDistrictStaged = useCallback((val: string) => {
    setStaged((prev) => ({
      ...prev,
      district: val === "" ? undefined : val,
    }));
  }, []);

  const applyStaged = useCallback(() => {
    onChange({
      ...filter,
      vibes: staged.vibes.length > 0 ? staged.vibes : undefined,
      purposes: staged.purposes.length > 0 ? staged.purposes : undefined,
      tags: staged.tags.length > 0 ? staged.tags : undefined,
      priceRange: staged.price,
      district: staged.district,
    });
    closeDropdown();
  }, [filter, staged, onChange, closeDropdown]);

  const cancelStaged = useCallback(() => {
    closeDropdown();
  }, [closeDropdown]);

  // Instant handlers (quick chips — bypass staged, write directly)
  const toggleVibeInstant = useCallback(
    (v: Vibe) => {
      const current = (filter.vibes ?? []) as Vibe[];
      const next = current.includes(v) ? current.filter((x) => x !== v) : [...current, v];
      onChange({ ...filter, vibes: next.length > 0 ? next : undefined });
    },
    [filter, onChange],
  );

  const toggleOpenNow = useCallback(() => {
    onChange({ ...filter, openNow: !filter.openNow });
  }, [filter, onChange]);

  const setDistance = useCallback(
    (km: number) => {
      onChange({ ...filter, radiusKm: km });
    },
    [filter, onChange],
  );

  const clearAll = useCallback(() => {
    onChange({});
  }, [onChange]);

  const activeCount =
    (filter.vibes?.length ?? 0) +
    (filter.purposes?.length ?? 0) +
    (filter.tags?.length ?? 0) +
    (filter.priceRange != null ? 1 : 0) +
    (filter.district ? 1 : 0) +
    (filter.openNow ? 1 : 0);

  return {
    dropdownOpen,
    dropdownMounted,
    openDropdown,
    closeDropdown,
    toggleDropdown,
    staged,
    toggleVibeStaged,
    togglePurposeStaged,
    toggleTagStaged,
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
  };
}
