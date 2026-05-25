"use client";

import { useTranslations } from "next-intl";
import { X, ChevronDown } from "lucide-react";
import NearMeButton from "@/components/cafe/NearMeButton";
import { cn } from "@/lib/utils";
import type { CafeFilter as Filter, Vibe } from "@/types/cafe";
import {
  TOP_VIBES,
  VIBES,
  DISTANCE_OPTIONS,
  VIBE_ICONS,
  VIBE_TRANSLATION_KEYS,
} from "@/components/cafe/constants/filter-constants";
interface FilterChipsRowProps {
  filter: Filter;
  onChange: (filter: Filter) => void;
  activeCount: number;
  dropdownOpen: boolean;
  dropdownMounted: boolean;
  onToggleDropdown: () => void;
  onOpenDropdown: () => void;
  toggleBtnRef: React.RefObject<HTMLButtonElement | null>;
  extraVibeBtnRef: React.RefObject<HTMLButtonElement | null>;
  toggleVibeInstant: (v: Vibe) => void;
  toggleOpenNow: () => void;
  setDistance: (km: number) => void;
  clearAll: () => void;
}

function ChipFilter({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex flex-none cursor-pointer items-center gap-1.5 rounded-full border-[1.5px] px-3.5 py-1 text-[13px] font-semibold whitespace-nowrap transition-all duration-150 active:scale-95",
        active
          ? "border-accent text-accent bg-[rgba(201,135,12,0.13)]"
          : "border-border hover:border-accent hover:text-accent bg-white text-(--foreground-muted) dark:bg-[#1C1210]",
      )}
    >
      {children}
    </button>
  );
}

export function FilterChipsRow({
  filter,
  onChange,
  activeCount,
  dropdownOpen,
  dropdownMounted,
  onToggleDropdown,
  onOpenDropdown,
  toggleBtnRef,
  extraVibeBtnRef,
  toggleVibeInstant,
  toggleOpenNow,
  setDistance,
  clearAll,
}: FilterChipsRowProps) {
  const tf = useTranslations("filters");
  const tg = useTranslations("guidedFilter");

  const extraVibes = VIBES.length - TOP_VIBES.length;

  return (
    <div className="scrollbar-hide flex items-center gap-1.75 overflow-x-auto pt-2.75 pb-3">
      {/* Bộ lọc dropdown toggle */}
      <button
        ref={toggleBtnRef}
        onClick={onToggleDropdown}
        className={cn(
          "inline-flex flex-none cursor-pointer items-center gap-1.5 rounded-full border-[1.5px] px-3.5 py-1 text-[13px] font-bold whitespace-nowrap transition-all duration-150 active:scale-95",
          dropdownMounted || activeCount > 0
            ? "border-accent text-accent bg-[rgba(201,135,12,0.13)]"
            : "border-border hover:border-accent hover:text-accent bg-white text-(--foreground-muted) dark:bg-[#1C1210]",
        )}
      >
        {/* 3-line funnel icon matching design */}
        <svg
          width={14}
          height={14}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="4" y1="6" x2="20" y2="6" />
          <line x1="8" y1="12" x2="16" y2="12" />
          <line x1="11" y1="18" x2="13" y2="18" />
        </svg>
        {tf("vibe")}
        {activeCount > 0 ? (
          <span className="bg-accent flex h-4 min-w-4 items-center justify-center rounded-full px-0.5 text-[10px] font-extrabold text-white">
            {activeCount}
          </span>
        ) : (
          <ChevronDown
            size={12}
            className={cn(
              "transition-transform duration-150",
              dropdownMounted && dropdownOpen && "rotate-180",
            )}
          />
        )}
      </button>

      {/* Divider */}
      <div className="border-border mx-0.5 h-4 w-px flex-none border-l" />

      {/* Open Now */}
      <button
        onClick={toggleOpenNow}
        className={cn(
          "inline-flex flex-none cursor-pointer items-center gap-1.5 rounded-full border-[1.5px] px-3.5 py-1 text-[13px] font-semibold whitespace-nowrap transition-all duration-150 active:scale-95",
          filter.openNow
            ? "border-[var(--status-open)] bg-[var(--status-open-background)] text-[var(--status-open-foreground)]"
            : "border-border bg-white text-(--foreground-muted) hover:border-[var(--status-open)] hover:text-[var(--status-open-foreground)] dark:bg-[#1C1210]",
        )}
      >
        <span className="relative flex h-2 w-2">
          <span
            className={cn(
              "absolute inline-flex h-full w-full rounded-full opacity-75",
              filter.openNow ? "animate-ping bg-[var(--status-open)]" : "bg-[var(--status-closed)]",
            )}
          />
          <span
            className={cn(
              "relative inline-flex h-2 w-2 rounded-full",
              filter.openNow ? "bg-[var(--status-open)]" : "bg-[var(--status-closed)]",
            )}
          />
        </span>
        {tg("openNow")}
      </button>

      {/* Gần tôi */}
      <NearMeButton filter={filter} onChange={onChange} />

      {/* Distance chips when nearMe active */}
      {filter.nearMe &&
        DISTANCE_OPTIONS.map(({ km }) => (
          <ChipFilter key={km} active={filter.radiusKm === km} onClick={() => setDistance(km)}>
            {"< " + km + "km"}
          </ChipFilter>
        ))}

      {/* Divider */}
      <div className="border-border mx-0.5 h-4 w-px flex-none border-l" />

      {/* Quick vibes — instant */}
      {TOP_VIBES.map((v) => (
        <ChipFilter
          key={v}
          active={filter.vibes?.includes(v) ?? false}
          onClick={() => toggleVibeInstant(v)}
        >
          {VIBE_ICONS[v]}
          {tf(`vibes.${VIBE_TRANSLATION_KEYS[v]}`)}
        </ChipFilter>
      ))}

      {extraVibes > 0 && (
        <button
          ref={extraVibeBtnRef}
          onClick={dropdownMounted && dropdownOpen ? onToggleDropdown : onOpenDropdown}
          className={cn(
            "border-border hover:border-accent hover:text-accent flex-none cursor-pointer rounded-full border-[1.5px] border-dashed px-3.5 py-1 text-[13px] font-semibold whitespace-nowrap transition-colors",
            dropdownMounted && dropdownOpen
              ? "border-accent text-accent bg-[rgba(201,135,12,0.08)]"
              : "text-(--foreground-muted)",
          )}
        >
          {dropdownMounted && dropdownOpen
            ? tg("allVibes")
            : tg("moreVibes", { count: extraVibes })}
        </button>
      )}

      {/* Clear all */}
      {activeCount > 0 && (
        <button
          onClick={clearAll}
          className="hover:text-accent flex flex-none cursor-pointer items-center gap-1 text-xs whitespace-nowrap text-(--foreground-muted) transition-colors"
        >
          <X size={12} />
          {tf("clear")}
        </button>
      )}
    </div>
  );
}
