"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { SlidersHorizontal, X, ChevronDown, LayoutGrid, LayoutList } from "lucide-react";
import { motion, useSpring, useTransform } from "framer-motion";
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
  viewMode?: "grid" | "list";
  onViewModeChange?: (mode: "grid" | "list") => void;
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
        "inline-flex flex-none cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-all duration-150 active:scale-95",
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
  viewMode = "grid",
  onViewModeChange,
}: FilterChipsRowProps) {
  const tf = useTranslations("filters");
  const tg = useTranslations("guidedFilter");

  const extraVibes = VIBES.length - TOP_VIBES.length;

  // Stretchy toggle indicator
  const indicatorX = useSpring(viewMode === "list" ? 28 : 0, {
    stiffness: 280,
    damping: 18,
    mass: 0.5,
  });
  const scaleX = useTransform(indicatorX, [0, 14, 28], [1, 1.45, 1]);

  useEffect(() => {
    indicatorX.set(viewMode === "list" ? 28 : 0);
  }, [viewMode, indicatorX]);

  return (
    <div className="scrollbar-hide flex items-center gap-2 overflow-x-auto py-2.5">
      {/* Bộ lọc dropdown toggle */}
      <button
        ref={toggleBtnRef}
        onClick={onToggleDropdown}
        className={cn(
          "inline-flex flex-none cursor-pointer items-center gap-1.5 rounded-full border-2 px-3 py-1.5 text-xs font-bold whitespace-nowrap transition-all duration-150 active:scale-95",
          dropdownMounted || activeCount > 0
            ? "border-accent text-accent bg-[rgba(201,135,12,0.13)]"
            : "border-border hover:border-accent hover:text-accent bg-white text-(--foreground-muted) dark:bg-[#1C1210]",
        )}
      >
        <SlidersHorizontal size={12} />
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
          "inline-flex flex-none cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-all duration-150 active:scale-95",
          filter.openNow
            ? "border-[#1EA055] bg-[#E6F5EE] text-[#166638]"
            : "border-border bg-white text-(--foreground-muted) hover:border-[#1EA055] hover:text-[#166638] dark:bg-[#1C1210]",
        )}
      >
        <span className="relative flex h-2 w-2">
          <span
            className={cn(
              "absolute inline-flex h-full w-full rounded-full opacity-75",
              filter.openNow ? "animate-ping bg-[#1EA055]" : "bg-[#9B8B73]",
            )}
          />
          <span
            className={cn(
              "relative inline-flex h-2 w-2 rounded-full",
              filter.openNow ? "bg-[#1EA055]" : "bg-[#9B8B73]",
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
            "border-border hover:border-accent hover:text-accent flex-none cursor-pointer rounded-full border border-dashed px-3 py-1.5 text-xs whitespace-nowrap transition-colors",
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

      {/* View toggle — desktop only, right side */}
      <div className="ml-auto hidden items-center rounded-lg border border-[#FEDCC8]/60 bg-[#FFF1EA] p-0.5 md:flex dark:border-[#3A2A20] dark:bg-[#2C1A0E]">
        {/* Sliding indicator — always in DOM, spring x + stretch scaleX */}
        <div className="relative flex items-center">
          <motion.div
            className="absolute h-7 w-7 origin-left rounded-md bg-white shadow-sm dark:bg-[#1C1210]"
            style={{ x: indicatorX, scaleX }}
          />
          {(["grid", "list"] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => {
                indicatorX.set(mode === "list" ? 28 : 0);
                onViewModeChange?.(mode);
              }}
              className="relative z-10 flex h-7 w-7 items-center justify-center rounded-md"
              aria-label={mode === "grid" ? "Grid view" : "List view"}
            >
              <motion.span
                animate={{ color: viewMode === mode ? "var(--accent)" : "#847465" }}
                transition={{ duration: 0.15 }}
              >
                {mode === "grid" ? <LayoutGrid size={15} /> : <LayoutList size={15} />}
              </motion.span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
