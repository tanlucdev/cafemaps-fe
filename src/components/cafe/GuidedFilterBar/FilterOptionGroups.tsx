"use client";

import { useTranslations } from "next-intl";
import type { Purpose, Vibe } from "@/types/cafe";
import { FilterChipButton } from "@/components/cafe/GuidedFilterBar/FilterChipButton";
import type { StagedFilter } from "@/components/cafe/hooks/useGuidedFilter";
import {
  FILTER_TAGS,
  PRICE_OPTIONS,
  PURPOSES,
  PURPOSE_ICONS,
  PURPOSE_TRANSLATION_KEYS,
  TAG_ICONS,
  TAG_TRANSLATION_KEYS,
  VIBES,
  VIBE_ICONS,
  VIBE_TRANSLATION_KEYS,
  type FilterTag,
} from "@/components/cafe/constants/filter-constants";

interface FilterOptionGroupsProps {
  staged: StagedFilter;
  onToggleVibe: (vibe: Vibe) => void;
  onTogglePurpose: (purpose: Purpose) => void;
  onToggleTag: (tag: FilterTag) => void;
  onSetPrice: (price: string) => void;
}
export function FilterOptionGroups({
  staged,
  onToggleVibe,
  onTogglePurpose,
  onToggleTag,
  onSetPrice,
}: FilterOptionGroupsProps) {
  const tf = useTranslations("filters");
  const groups = [
    {
      label: tf("vibe"),
      content: VIBES.map((vibe) => (
        <FilterChipButton key={vibe} active={staged.vibes.includes(vibe)} onClick={() => onToggleVibe(vibe)}>
          {VIBE_ICONS[vibe]}
          {tf(`vibes.${VIBE_TRANSLATION_KEYS[vibe]}`)}
        </FilterChipButton>
      )),
    },
    {
      label: tf("purpose"),
      content: PURPOSES.map((purpose) => (
        <FilterChipButton key={purpose} active={staged.purposes.includes(purpose)} onClick={() => onTogglePurpose(purpose)}>
          {PURPOSE_ICONS[purpose]}
          {tf(`purposes.${PURPOSE_TRANSLATION_KEYS[purpose]}`)}
        </FilterChipButton>
      )),
    },
    {
      label: tf("tags.label"),
      content: FILTER_TAGS.map((tag) => (
        <FilterChipButton key={tag} active={staged.tags.includes(tag)} onClick={() => onToggleTag(tag)}>
          {TAG_ICONS[tag]}
          {tf(`tags.${TAG_TRANSLATION_KEYS[tag]}`)}
        </FilterChipButton>
      )),
    },
    {
      label: tf("price"),
      content: PRICE_OPTIONS.map((option) => (
        <FilterChipButton key={option.value} active={staged.price === option.value} onClick={() => onSetPrice(option.value)}>
          {tf(`priceRanges.${option.translationKey}`)}
        </FilterChipButton>
      )),
    },
  ];

  return groups.map((group) => (
    <section key={group.label}>
      <p className="mb-3 text-[10px] font-extrabold tracking-[0.09em] text-[var(--foreground-muted)] uppercase">
        {group.label}
      </p>
      <div className="flex flex-wrap gap-2">{group.content}</div>
    </section>
  ));
}
