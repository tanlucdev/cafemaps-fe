"use client";

import { useTranslations } from "next-intl";
import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Vibe, Purpose } from "@/types/cafe";
import { AREAS } from "@/types/cafe";
import { FilterChipButton } from "@/components/cafe/GuidedFilterBar/FilterChipButton";
import type { StagedFilter } from "@/components/cafe/hooks/useGuidedFilter";
import {
  VIBES,
  PURPOSES,
  PRICE_OPTIONS,
  VIBE_ICONS,
  PURPOSE_ICONS,
  FILTER_TAGS,
  TAG_ICONS,
  VIBE_TRANSLATION_KEYS,
  PURPOSE_TRANSLATION_KEYS,
  TAG_TRANSLATION_KEYS,
  type FilterTag,
} from "@/components/cafe/constants/filter-constants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FilterDropdownPanelProps {
  staged: StagedFilter;
  dropdownOpen: boolean;
  dropdownRef: React.RefObject<HTMLDivElement | null>;
  districts?: string[];
  onToggleVibeStaged: (v: Vibe) => void;
  onTogglePurposeStaged: (p: Purpose) => void;
  onToggleTagStaged: (tag: FilterTag) => void;
  onSetPriceStaged: (val: string) => void;
  onSetDistrictStaged: (val: string) => void;
  onApply: () => void;
  onClearAll: () => void;
}

export function FilterDropdownPanel({
  staged,
  dropdownOpen,
  dropdownRef,
  districts,
  onToggleVibeStaged,
  onTogglePurposeStaged,
  onToggleTagStaged,
  onSetPriceStaged,
  onSetDistrictStaged,
  onApply,
  onClearAll,
}: FilterDropdownPanelProps) {
  const tf = useTranslations("filters");
  const tg = useTranslations("guidedFilter");
  const districtOptions = districts?.length ? districts : [...AREAS];

  const stagedActiveCount =
    staged.vibes.length +
    staged.purposes.length +
    staged.tags.length +
    (staged.price != null ? 1 : 0) +
    (staged.district ? 1 : 0);

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
          <div>
            <p className="mb-3 text-[10px] font-extrabold tracking-[0.09em] text-[var(--foreground-muted)] uppercase">
              {tf("vibe")}
            </p>
            <div className="flex flex-wrap gap-2">
              {VIBES.map((v) => (
                <FilterChipButton
                  key={v}
                  active={staged.vibes.includes(v)}
                  onClick={() => onToggleVibeStaged(v)}
                >
                  {VIBE_ICONS[v]}
                  {tf(`vibes.${VIBE_TRANSLATION_KEYS[v]}`)}
                </FilterChipButton>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-3 text-[10px] font-extrabold tracking-[0.09em] text-[var(--foreground-muted)] uppercase">
              {tf("purpose")}
            </p>
            <div className="flex flex-wrap gap-2">
              {PURPOSES.map((p) => (
                <FilterChipButton
                  key={p}
                  active={staged.purposes.includes(p)}
                  onClick={() => onTogglePurposeStaged(p)}
                >
                  {PURPOSE_ICONS[p]}
                  {tf(`purposes.${PURPOSE_TRANSLATION_KEYS[p]}`)}
                </FilterChipButton>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-3 text-[10px] font-extrabold tracking-[0.09em] text-[var(--foreground-muted)] uppercase">
              {tf("tags.label")}
            </p>
            <div className="flex flex-wrap gap-2">
              {FILTER_TAGS.map((tag) => (
                <FilterChipButton
                  key={tag}
                  active={staged.tags.includes(tag)}
                  onClick={() => onToggleTagStaged(tag)}
                >
                  {TAG_ICONS[tag]}
                  {tf(`tags.${TAG_TRANSLATION_KEYS[tag]}`)}
                </FilterChipButton>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <div>
              <p className="mb-3 text-[10px] font-extrabold tracking-[0.09em] text-[var(--foreground-muted)] uppercase">
                {tf("price")}
              </p>
              <div className="flex flex-wrap gap-2">
                {PRICE_OPTIONS.map((opt) => (
                  <FilterChipButton
                    key={opt.value}
                    active={staged.price === opt.value}
                    onClick={() => onSetPriceStaged(opt.value)}
                  >
                    {tf(`priceRanges.${opt.translationKey}`)}
                  </FilterChipButton>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 text-[10px] font-extrabold tracking-[0.09em] text-[var(--foreground-muted)] uppercase">
                {tf("district")}
              </p>
              <Select
                value={staged.district ?? ""}
                onValueChange={(val) => onSetDistrictStaged(val ?? "")}
              >
                <SelectTrigger className="h-9 w-full rounded-full border border-[var(--border)] bg-white/68 px-3 text-xs font-bold text-[var(--foreground)] shadow-[var(--shadow-sm)] backdrop-blur-md focus-visible:border-[var(--accent)] focus-visible:ring-2 focus-visible:ring-[var(--accent)]/18 dark:bg-[var(--card)]">
                  <MapPin size={12} className="shrink-0 text-[var(--foreground-muted)]" />
                  <SelectValue placeholder={tg("allDistricts")} />
                </SelectTrigger>
                <SelectContent align="start" sideOffset={4}>
                  <SelectItem value="">{tg("allDistricts")}</SelectItem>
                  {districtOptions.map((area) => (
                    <SelectItem key={area} value={area}>
                      {area}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
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
