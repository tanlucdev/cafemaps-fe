"use client";

import ChristmasArt from "@/components/seasonal/ChristmasArt";
import styles from "./ChristmasFilter.module.css";
import { useTranslations } from "next-intl";
import { Search } from "lucide-react";
import type { Vibe, Purpose } from "@/types/cafe";
import { FilterChipButton } from "@/components/cafe/GuidedFilterBar/FilterChipButton";
import { FilterOptionGroups } from "@/components/cafe/GuidedFilterBar/FilterOptionGroups";
import type { StagedFilter } from "@/components/cafe/hooks/useGuidedFilter";
import type { FilterTag } from "@/components/cafe/constants/filter-constants";
import { DISTANCE_OPTIONS } from "@/components/cafe/constants/filter-constants";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

interface MobileFilterSheetProps {
  open: boolean;
  isMobile: boolean;
  filterNearMe: boolean | undefined;
  staged: StagedFilter;
  onClose: () => void;
  onApply: () => void;
  onClearAll: () => void;
  onToggleVibe: (vibe: Vibe) => void;
  onTogglePurpose: (purpose: Purpose) => void;
  onToggleTag: (tag: FilterTag) => void;
  onSetPrice: (price: string) => void;
  onSetHours: (hours: StagedFilter["hours"]) => void;
  onSetDistance: (km: number) => void;
}
export function MobileFilterSheet({
  open,
  isMobile,
  filterNearMe,
  staged,
  onClose,
  onApply,
  onClearAll,
  onToggleVibe,
  onTogglePurpose,
  onToggleTag,
  onSetPrice,
  onSetHours,
  onSetDistance,
}: MobileFilterSheetProps) {
  const tf = useTranslations("filters");
  const tg = useTranslations("guidedFilter");

  if (!isMobile) return null;

  return (
    <Sheet open={open} onOpenChange={(next) => !next && onClose()}>
      <SheetContent
        side="bottom"
        overlayClassName="z-[89]"
        className={`${styles.sheet} z-[90] max-h-[88dvh] gap-0 rounded-t-[24px] border-[var(--border)] bg-[var(--card)] p-0`}
      >
        <SheetHeader className="sticky top-0 z-10 shrink-0 border-b border-[var(--border)] bg-[var(--card)] pr-12">
          <SheetTitle className="flex items-center gap-2 text-[var(--season-pine)]">
            <ChristmasArt kind="tree" className="size-6" />{tg("mobile.title")}
          </SheetTitle>
          <SheetDescription>{tg("mobile.description")}</SheetDescription>
        </SheetHeader>
        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3 sm:px-6">
          {filterNearMe && (
            <section className="mb-6">
              <p className="mb-3 text-[10px] font-extrabold tracking-[0.09em] text-[var(--foreground-muted)] uppercase">
                {tg("mobile.distance")}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {DISTANCE_OPTIONS.map(({ km }) => (
                  <FilterChipButton
                    key={km}
                    active={(staged.radiusKm ?? 2) === km}
                    onClick={() => onSetDistance(km)}
                  >
                    {km} km
                  </FilterChipButton>
                ))}
              </div>
            </section>
          )}
          <div className="space-y-3">
            <FilterOptionGroups
              staged={staged}
              onToggleVibe={onToggleVibe}
              onTogglePurpose={onTogglePurpose}
              onToggleTag={onToggleTag}
              onSetPrice={onSetPrice}
            />
            <section className={styles.group}>
              <p className={styles.groupHeading}>
                <ChristmasArt kind="cocoa" />{tf("openingHours")}
              </p>
              <div className="flex flex-wrap gap-1.5">
                <FilterChipButton
                  active={staged.hours === "open_at_7"}
                  onClick={() => onSetHours("open_at_7")}
                >
                  {tg("openFromSeven")}
                </FilterChipButton>
                <FilterChipButton
                  active={staged.hours === "open_24h"}
                  onClick={() => onSetHours("open_24h")}
                >
                  {tg("open24Hours")}
                </FilterChipButton>
              </div>
            </section>
          </div>
        </div>
        <SheetFooter className="sticky bottom-0 z-10 shrink-0 flex-row items-center justify-between border-t border-[var(--border)] bg-[var(--card)] px-4 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <button
            type="button"
            onClick={onClearAll}
            className="cursor-pointer text-xs font-bold text-[var(--foreground-muted)] underline underline-offset-2 focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
          >
            {tf("clearAll")}
          </button>
          <button
            type="button"
            onClick={onApply}
            className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full bg-[var(--accent)] px-6 py-2 text-xs font-black text-[var(--accent-foreground)] shadow-[var(--shadow-sm)] focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2"
          >
            <Search size={14} />
            {tg("mobile.viewResults")}
          </button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
