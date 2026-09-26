"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import type { StagedFilter } from "@/components/cafe/hooks/useGuidedFilter";
import { FilterOptionGroups } from "@/components/cafe/GuidedFilterBar/FilterOptionGroups";
import type { Vibe, Purpose } from "@/types/cafe";
import type { FilterTag } from "@/components/cafe/constants/filter-constants";

interface FilterDropdownPanelProps {
  staged: StagedFilter;
  dropdownOpen: boolean;
  dropdownRef: React.RefObject<HTMLDivElement | null>;
  onToggleVibeStaged: (v: Vibe) => void;
  onTogglePurposeStaged: (p: Purpose) => void;
  onToggleTagStaged: (tag: FilterTag) => void;
  onSetPriceStaged: (val: string) => void;
  onApply: () => void;
  onClearAll: () => void;
}
export function FilterDropdownPanel({
  staged,
  dropdownOpen,
  dropdownRef,
  onToggleVibeStaged,
  onTogglePurposeStaged,
  onToggleTagStaged,
  onSetPriceStaged,
  onApply,
  onClearAll,
}: FilterDropdownPanelProps) {
  const tf = useTranslations("filters");

  const stagedActiveCount =
    staged.vibes.length +
    staged.purposes.length +
    staged.tags.length +
    (staged.price != null ? 1 : 0);

  return (
    <div
      ref={dropdownRef}
      className={cn(
        "absolute top-full right-0 left-0 z-50 mt-1 transition-all duration-300",
        dropdownOpen ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-2 opacity-0",
      )}
    >
      <div className="rounded-[24px] border border-[var(--border)] bg-[#fffaf2]/96 shadow-[0_20px_56px_rgba(44,26,14,0.14)] backdrop-blur-xl dark:bg-[var(--card)]">
        <div className="grid gap-6 p-4 sm:grid-cols-4 sm:p-6">
          <FilterOptionGroups
            staged={staged}
            onToggleVibe={onToggleVibeStaged}
            onTogglePurpose={onTogglePurposeStaged}
            onToggleTag={onToggleTagStaged}
            onSetPrice={onSetPriceStaged}
          />
        </div>

        <div className="flex items-center justify-between border-t border-[var(--border)] px-4 py-4 sm:px-6">
          <button
            onClick={onClearAll}
            className="cursor-pointer text-xs font-bold text-[var(--foreground-muted)] underline underline-offset-2 transition-colors hover:text-[var(--accent)] focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
          >
            {tf("clear")}
          </button>
          <button
            onClick={onApply}
            className="cursor-pointer rounded-full bg-[var(--accent)] px-6 py-2 text-xs font-black text-white shadow-[0_10px_24px_rgba(200,132,42,0.18)] transition-all hover:-translate-y-px hover:scale-[1.02] hover:bg-[var(--accent-hover)] focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] active:scale-95"
          >
            {stagedActiveCount > 0 ? `${tf("apply")} (${stagedActiveCount})` : tf("apply")}
          </button>
        </div>
      </div>
    </div>
  );
}
