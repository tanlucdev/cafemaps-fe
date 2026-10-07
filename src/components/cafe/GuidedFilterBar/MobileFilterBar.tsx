"use client";

import { useEffect, useState } from "react";
import { ChevronRight, SlidersHorizontal } from "lucide-react";
import { useTranslations } from "next-intl";
import NearMeButton from "@/components/cafe/NearMeButton";
import { cn } from "@/lib/utils";
import type { CafeFilter } from "@/types/cafe";
import { DistrictMultiSelect } from "./DistrictMultiSelect";

interface MobileFilterBarProps {
  filter: CafeFilter;
  onChange: (filter: CafeFilter) => void;
  activeCount: number;
  onOpen: () => void;
  districts?: string[];
}

export function MobileFilterBar({
  filter,
  onChange,
  activeCount,
  onOpen,
  districts,
}: MobileFilterBarProps) {
  const tg = useTranslations("guidedFilter");
  const [showHint, setShowHint] = useState(true);
  useEffect(() => {
    const timer = window.setTimeout(() => setShowHint(false), 3000);
    return () => window.clearTimeout(timer);
  }, []);

  const menuCardClass =
    "flex h-10 min-w-0 w-full cursor-pointer items-center justify-center gap-1.5 rounded-[14px] border px-2 text-[13px] font-bold shadow-[var(--shadow-sm)] backdrop-blur-md transition-all duration-150 hover:-translate-y-px hover:scale-[1.01] focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] active:scale-[0.98]";
  const creamCardClass =
    "border-[var(--border)] bg-white/62 text-[var(--foreground-muted)] hover:border-[var(--accent)] hover:bg-[var(--accent-light)] hover:text-[var(--accent)] dark:bg-[var(--card)]";

  return (
    <>
      <div className="grid grid-cols-2 gap-2 rounded-[20px] border border-[var(--border)] bg-[#fffaf2]/76 p-2 shadow-[var(--shadow-sm)] backdrop-blur-md md:hidden dark:bg-[var(--card)]">
        <button
          type="button"
          onClick={onOpen}
          className={cn(
            menuCardClass,
            activeCount > 0
              ? "border-[var(--accent)] bg-[var(--accent)] text-white hover:brightness-95"
              : creamCardClass,
          )}
        >
          <SlidersHorizontal size={15} className="shrink-0" />
          <span className="truncate">{tg("mobile.title")}</span>
          {activeCount > 0 && (
            <span className="flex h-4 min-w-4 shrink-0 items-center justify-center rounded-full bg-[#fff0d2] px-0.5 text-[10px] font-extrabold text-[#201006]">
              {activeCount}
            </span>
          )}
          <ChevronRight size={15} className="shrink-0" aria-hidden="true" />
        </button>
        <button
          type="button"
          aria-pressed={filter.openNow ?? false}
          onClick={() => onChange({ ...filter, openNow: !filter.openNow })}
          className={cn(
            menuCardClass,
            filter.openNow
              ? "border-[#8fd6a8] bg-[var(--status-open-background)] text-[var(--status-open-foreground)] hover:brightness-95"
              : creamCardClass,
          )}
        >
          <span
            className={cn(
              "h-2 w-2 shrink-0 rounded-full",
              filter.openNow ? "bg-[var(--status-open)]" : "bg-[var(--status-closed)]",
            )}
          />
          <span className="truncate">{tg("mobile.openNowShort")}</span>
        </button>
        <NearMeButton
          filter={filter}
          onChange={onChange}
          className={cn(menuCardClass, "justify-center")}
        />

        <DistrictMultiSelect className="min-w-0 w-full" districts={districts} filter={filter} onChange={onChange} />
      </div>
      {showHint && (
        <button
          type="button"
          onClick={onOpen}
          className="mt-2 flex w-full min-h-8 items-center rounded-xl bg-[#201006] px-3 py-1.5 text-left text-xs leading-4 text-white shadow-[var(--shadow-sm)] transition-colors hover:bg-[#3a1d0c] focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] md:hidden"
        >
          {tg("mobile.hint")}
        </button>
      )}
    </>
  );
}
