"use client";

import { useTranslations } from "next-intl";
import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Vibe, Purpose } from "@/types/cafe";
import { AREAS } from "@/types/cafe";
import {
  VIBES,
  PURPOSES,
  PRICE_OPTIONS,
  VIBE_ICONS,
  PURPOSE_ICONS,
  VIBE_TRANSLATION_KEYS,
  PURPOSE_TRANSLATION_KEYS,
} from "@/components/cafe/constants/filter-constants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface StagedFilter {
  vibes: Vibe[];
  purposes: Purpose[];
  price: string | undefined;
  district: string | undefined;
}

interface FilterDropdownPanelProps {
  staged: StagedFilter;
  dropdownOpen: boolean;
  dropdownRef: React.RefObject<HTMLDivElement | null>;
  onToggleVibeStaged: (v: Vibe) => void;
  onTogglePurposeStaged: (p: Purpose) => void;
  onSetPriceStaged: (val: string) => void;
  onSetDistrictStaged: (val: string) => void;
  onApply: () => void;
  onClearAll: () => void;
}

export function FilterDropdownPanel({
  staged,
  dropdownOpen,
  dropdownRef,
  onToggleVibeStaged,
  onTogglePurposeStaged,
  onSetPriceStaged,
  onSetDistrictStaged,
  onApply,
  onClearAll,
}: FilterDropdownPanelProps) {
  const tf = useTranslations("filters");
  const tg = useTranslations("guidedFilter");

  const stagedActiveCount =
    staged.vibes.length +
    staged.purposes.length +
    (staged.price != null ? 1 : 0) +
    (staged.district ? 1 : 0);

  return (
    <div
      ref={dropdownRef}
      className={cn(
        "absolute top-full right-0 left-0 z-50 mt-1 transition-all duration-300",
        dropdownOpen
          ? "translate-y-0 opacity-100"
          : "pointer-events-none -translate-y-2 opacity-0",
      )}
    >
      <div className="rounded-2xl border border-[#E0D3C0] bg-white shadow-[0_16px_48px_rgba(40,22,4,0.16)] dark:border-[#3A2A20] dark:bg-[#1C1210]">
        <div className="grid gap-6 p-6 sm:grid-cols-3">
          {/* Phong cách */}
          <div>
            <p className="mb-3 text-[10px] font-extrabold tracking-[0.09em] text-[#9B8B73] uppercase">
              {tf("vibe")}
            </p>
            <div className="flex flex-wrap gap-2">
              {VIBES.map((v) => (
                <button
                  key={v}
                  onClick={() => onToggleVibeStaged(v)}
                  className={cn(
                    "inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-150 active:scale-95",
                    staged.vibes.includes(v)
                      ? "border-accent text-accent bg-[rgba(201,135,12,0.13)]"
                      : "hover:border-accent hover:text-accent border-[#E0D3C0] text-[#5C4A2F]",
                  )}
                >
                  {VIBE_ICONS[v]}
                  {tf(`vibes.${VIBE_TRANSLATION_KEYS[v]}`)}
                </button>
              ))}
            </div>
          </div>

          {/* Mục đích */}
          <div>
            <p className="mb-3 text-[10px] font-extrabold tracking-[0.09em] text-[#9B8B73] uppercase">
              {tf("purpose")}
            </p>
            <div className="flex flex-wrap gap-2">
              {PURPOSES.map((p) => (
                <button
                  key={p}
                  onClick={() => onTogglePurposeStaged(p)}
                  className={cn(
                    "inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-150 active:scale-95",
                    staged.purposes.includes(p)
                      ? "border-accent text-accent bg-[rgba(201,135,12,0.13)]"
                      : "hover:border-accent hover:text-accent border-[#E0D3C0] text-[#5C4A2F]",
                  )}
                >
                  {PURPOSE_ICONS[p]}
                  {tf(`purposes.${PURPOSE_TRANSLATION_KEYS[p]}`)}
                </button>
              ))}
            </div>
          </div>

          {/* Giá + Khu vực */}
          <div className="flex flex-col gap-5">
            <div>
              <p className="mb-3 text-[10px] font-extrabold tracking-[0.09em] text-[#9B8B73] uppercase">
                {tf("price")}
              </p>
              <div className="flex flex-wrap gap-2">
                {PRICE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => onSetPriceStaged(opt.value)}
                    className={cn(
                      "cursor-pointer rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-150 active:scale-95",
                      staged.price === opt.value
                        ? "border-accent text-accent bg-[rgba(201,135,12,0.13)]"
                        : "hover:border-accent hover:text-accent border-[#E0D3C0] text-[#5C4A2F]",
                    )}
                  >
                    {tf(`priceRanges.${opt.translationKey}`)}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 text-[10px] font-extrabold tracking-[0.09em] text-[#9B8B73] uppercase">
                {tf("district")}
              </p>
              <Select
                value={staged.district ?? ""}
                onValueChange={(val) => onSetDistrictStaged(val ?? "")}
              >
                <SelectTrigger className="focus-visible:border-accent h-9 w-full rounded-lg border border-[#E0D3C0] bg-[#FAF6F1] px-3 text-xs font-medium text-[#1C1209] dark:border-[#3A2A20] dark:bg-[#2C1A0E] dark:text-[#FFE3D3]">
                  <MapPin size={12} className="shrink-0 text-[#9B8B73]" />
                  <SelectValue placeholder={tg("allDistricts")} />
                </SelectTrigger>
                <SelectContent align="start" sideOffset={4}>
                  <SelectItem value="">{tg("allDistricts")}</SelectItem>
                  {AREAS.map((area) => (
                    <SelectItem key={area} value={area}>
                      {area}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-[#ECE4D6] px-6 py-4 dark:border-[#2A211B]">
          <button
            onClick={onClearAll}
            className="cursor-pointer text-xs text-[#9B8B73] underline underline-offset-2 transition-colors hover:text-[#5C4A2F]"
          >
            {tf("clear")}
          </button>
          <button
            onClick={onApply}
            className="bg-accent cursor-pointer rounded-xl px-6 py-2 text-xs font-bold text-white transition-colors hover:bg-(--accent-hover)"
          >
            {stagedActiveCount > 0 ? `${tf("apply")} (${stagedActiveCount})` : tf("apply")}
          </button>
        </div>
      </div>
    </div>
  );
}
