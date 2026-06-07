"use client";

import { useTranslations } from "next-intl";
import { X } from "lucide-react";
import type { CafeFilter as Filter } from "@/types/cafe";
import {
  PRICE_OPTIONS,
  VIBE_TRANSLATION_KEYS,
  PURPOSE_TRANSLATION_KEYS,
  TAG_TRANSLATION_KEYS,
  type FilterTag,
} from "@/components/cafe/constants/filter-constants";
import type { Vibe, Purpose } from "@/types/cafe";

interface ActiveFilterChipsProps {
  filter: Filter;
  onChange: (filter: Filter) => void;
  clearAll: () => void;
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function getTagLabel(tag: string, translate: ReturnType<typeof useTranslations>) {
  const key = TAG_TRANSLATION_KEYS[tag as FilterTag];
  return key ? translate(`tags.${key}`) : tag;
}

export function ActiveFilterChips({ filter, onChange, clearAll }: ActiveFilterChipsProps) {
  const tf = useTranslations("filters");
  const tg = useTranslations("guidedFilter");

  const activeChips: { label: string; remove: () => void }[] = [
    ...(filter.vibes ?? []).map((v) => ({
      label: tf(`vibes.${VIBE_TRANSLATION_KEYS[v as Vibe]}`),
      remove: () =>
        onChange({ ...filter, vibes: filter.vibes?.filter((x) => x !== v) }),
    })),
    ...(filter.purposes ?? []).map((p) => ({
      label: tf(`purposes.${PURPOSE_TRANSLATION_KEYS[p as Purpose]}`),
      remove: () =>
        onChange({ ...filter, purposes: filter.purposes?.filter((x) => x !== p) }),
    })),
    ...(filter.tags ?? []).map((tag) => ({
      label: getTagLabel(tag, tf),
      remove: () => onChange({ ...filter, tags: filter.tags?.filter((x) => x !== tag) }),
    })),
    ...(filter.priceRange
      ? [
          {
            label: tf(
              `priceRanges.${PRICE_OPTIONS.find((o) => o.value === filter.priceRange)?.translationKey ?? filter.priceRange}`,
            ),
            remove: () => onChange({ ...filter, priceRange: undefined }),
          },
        ]
      : []),
    ...(filter.district
      ? [
          {
            label: filter.district,
            remove: () => onChange({ ...filter, district: undefined }),
          },
        ]
      : []),
    ...(filter.openNow
      ? [
          {
            label: tg("openNow"),
            remove: () => onChange({ ...filter, openNow: false }),
          },
        ]
      : []),
  ];

  if (activeChips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 pb-2.5">
      <span className="text-xs font-medium text-(--foreground-muted)">{tf("activeLabel")}:</span>
      {activeChips.map((chip) => (
        <button
          key={chip.label}
          onClick={chip.remove}
          className="border-accent text-accent inline-flex cursor-pointer items-center gap-1.5 rounded-full border bg-[rgba(201,135,12,0.13)] px-3 py-1 text-xs font-semibold transition-all active:scale-95"
        >
          {capitalize(chip.label)}
          <X size={11} />
        </button>
      ))}
      <button
        onClick={clearAll}
        className="hover:text-accent cursor-pointer text-xs text-(--foreground-muted) underline underline-offset-2 transition-colors"
      >
        {tf("clearAll")}
      </button>
    </div>
  );
}
