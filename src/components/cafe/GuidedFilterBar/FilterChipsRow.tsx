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
        "inline-flex flex-none cursor-pointer items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-[13px] font-bold whitespace-nowrap shadow-[var(--shadow-sm)] backdrop-blur-md transition-all duration-150 hover:-translate-y-px hover:scale-[1.02] focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] active:scale-95",
        active
          ? "border-[var(--accent)] bg-[var(--accent-light)] text-[var(--accent)] shadow-[0_10px_24px_rgba(200,132,42,0.14)]"
          : "border-[var(--border)] bg-white/62 text-[var(--foreground-muted)] hover:border-[var(--accent)] hover:bg-[var(--accent-light)] hover:text-[var(--accent)] dark:bg-[var(--card)]",
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
    <div className="scrollbar-hide flex items-center gap-2 overflow-x-auto pt-3 pb-3.5">
      {/* Bộ lọc dropdown toggle */}
      <button
        ref={toggleBtnRef}
        onClick={onToggleDropdown}
        className={cn(
          "inline-flex flex-none cursor-pointer items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-[13px] font-bold whitespace-nowrap shadow-[var(--shadow-sm)] backdrop-blur-md transition-all duration-150 hover:-translate-y-px hover:scale-[1.02] focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] active:scale-95",
          dropdownMounted || activeCount > 0
            ? "border-[var(--accent)] bg-[var(--accent-light)] text-[var(--accent)] shadow-[0_10px_24px_rgba(200,132,42,0.14)]"
            : "border-[var(--border)] bg-white/62 text-[var(--foreground-muted)] hover:border-[var(--accent)] hover:bg-[var(--accent-light)] hover:text-[var(--accent)] dark:bg-[var(--card)]",
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
          <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-[#fff0d2] px-0.5 text-[10px] font-extrabold text-[#201006]">
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
      <div className="mx-0.5 h-4 w-px flex-none border-l border-[var(--border)]" />

      {/* Open Now */}
      <button
        onClick={toggleOpenNow}
        className={cn(
          "inline-flex flex-none cursor-pointer items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-[13px] font-bold whitespace-nowrap shadow-[var(--shadow-sm)] backdrop-blur-md transition-all duration-150 hover:-translate-y-px hover:scale-[1.02] focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] active:scale-95",
          filter.openNow
            ? "border-[#8fd6a8] bg-[var(--status-open-background)] text-[var(--status-open-foreground)] shadow-[0_10px_24px_rgba(30,160,85,0.12)]"
            : "border-[var(--border)] bg-white/62 text-[var(--foreground-muted)] hover:border-[#8fd6a8] hover:bg-[var(--status-open-background)] hover:text-[var(--status-open-foreground)] dark:bg-[var(--card)]",
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
      <div className="mx-0.5 h-4 w-px flex-none border-l border-[var(--border)]" />

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
            "flex-none cursor-pointer rounded-full border border-dashed px-3.5 py-1.5 text-[13px] font-bold whitespace-nowrap shadow-[var(--shadow-sm)] backdrop-blur-md transition-all hover:-translate-y-px hover:scale-[1.02] focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]",
            dropdownMounted && dropdownOpen
              ? "border-[var(--accent)] bg-[var(--accent-light)] text-[var(--accent)]"
              : "border-[var(--border)] bg-white/52 text-[var(--foreground-muted)] hover:border-[var(--accent)] hover:text-[var(--accent)] dark:bg-[var(--card)]",
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
          className="flex flex-none cursor-pointer items-center gap-1 text-xs font-bold whitespace-nowrap text-[var(--foreground-muted)] transition-colors hover:text-[var(--accent)] focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
        >
          <X size={12} />
          {tf("clear")}
        </button>
      )}
    </div>
  );
}
