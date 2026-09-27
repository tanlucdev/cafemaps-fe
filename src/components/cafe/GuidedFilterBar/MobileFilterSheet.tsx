"use client";

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
        className="z-[90] max-h-[88dvh] gap-0 rounded-t-[24px] border-[var(--border)] bg-[#fffaf2] p-0 dark:bg-[var(--card)]"
      >
        <SheetHeader className="sticky top-0 z-10 shrink-0 border-b border-[var(--border)] bg-[#fffaf2] pr-12 dark:bg-[var(--card)]">
          <SheetTitle>{tg("mobile.title")}</SheetTitle>
          <SheetDescription>{tg("mobile.description")}</SheetDescription>
        </SheetHeader>
        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5">
          {filterNearMe && (
            <section className="mb-6">
              <p className="mb-3 text-[10px] font-extrabold tracking-[0.09em] text-[var(--foreground-muted)] uppercase">
                {tg("mobile.distance")}
              </p>
              <div className="flex flex-wrap gap-2">
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
          <div className="space-y-6">
            <FilterOptionGroups
              staged={staged}
              onToggleVibe={onToggleVibe}
              onTogglePurpose={onTogglePurpose}
              onToggleTag={onToggleTag}
              onSetPrice={onSetPrice}
            />
          </div>
        </div>
        <SheetFooter className="sticky bottom-0 z-10 shrink-0 flex-row items-center justify-between border-t border-[var(--border)] bg-[#fffaf2] px-4 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))] dark:bg-[var(--card)]">
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
            className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-[var(--accent)] px-6 py-2 text-xs font-black text-white shadow-[0_10px_24px_rgba(200,132,42,0.18)] focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2"
          >
            <Search size={14} />
            {tg("mobile.viewResults")}
          </button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
