"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import Badge from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { VIBES, PURPOSES, AREAS, type CafeFilter as Filter } from "@/types/cafe";
import {
  FILTER_TAGS,
  TAG_ICONS,
  TAG_TRANSLATION_KEYS,
  type FilterTag,
} from "@/components/cafe/constants/filter-constants";
import {
  Leaf,
  Coffee,
  Lightbulb,
  Heart,
  Music,
  Wine,
  Wind,
  Smile,
  Briefcase,
  BookOpen,
  Users,
  User,
  PartyPopper,
  MessageCircle,
} from "lucide-react";

const VIBE_ICONS: Record<string, React.ElementType> = {
  "yên tĩnh": Wind,
  "nhộn nhịp": Smile,
  vintage: Coffee,
  "hiện đại": Lightbulb,
  "thiên nhiên": Leaf,
  "sáng tạo": Lightbulb,
  "lãng mạn": Heart,
  minimalist: Leaf,
  "sôi động": PartyPopper,
  chill: Wine,
  acoustic: Music,
};

const PURPOSE_ICONS: Record<string, React.ElementType> = {
  "làm việc": Briefcase,
  "học tập": BookOpen,
  "hẹn hò": Heart,
  "họp nhóm": Users,
  "chill một mình": User,
  "gặp bạn bè": MessageCircle,
};

const PRICE_OPTIONS = [
  { translationKey: "under_50k", value: "under_50k" },
  { translationKey: "50k_100k", value: "price_50k_100k" },
  { translationKey: "100k_150k", value: "price_100k_150k" },
  { translationKey: "above_150k", value: "above_150k" },
];

interface CafeFilterProps {
  filter: Filter;
  onChange: (filter: Filter) => void;
}

export default function CafeFilter({ filter, onChange }: CafeFilterProps) {
  const t = useTranslations("filters");
  const [staged, setStaged] = useState<Filter>(filter);

  function toggleArray<T extends string>(key: "vibes" | "purposes" | "tags", value: T) {
    const current = (staged[key] ?? []) as T[];
    const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
    setStaged((s) => ({ ...s, [key]: next }));
  }

  function handleAreaChange(val: string | null) {
    const districts = val === "" || val == null ? undefined : [val];
    setStaged((s) => ({ ...s, districts }));
  }

  function handleApply() {
    onChange(staged);
  }

  // Sync staged when filter is reset externally (e.g. "Clear all" in sidebar header)
  useEffect(() => {
    setStaged(filter);
  }, [filter]);

  return (
    <div className="flex flex-col gap-6">
      {/* Vibe */}
      <section>
        <h3 className="mb-3 text-xs font-semibold tracking-wider text-(--foreground-muted) uppercase">
          {t("vibe")}
        </h3>
        <div className="flex flex-wrap gap-2">
          {VIBES.map((vibe) => {
            const Icon = VIBE_ICONS[vibe] || Coffee;
            return (
              <Badge
                key={vibe}
                label={vibe}
                variant="vibe"
                active={staged.vibes?.includes(vibe)}
                onClick={() => toggleArray("vibes", vibe)}
                className="flex cursor-pointer items-center gap-1.5 px-4 py-2 text-sm"
              >
                {Icon && <Icon size={14} />}
                {vibe}
              </Badge>
            );
          })}
        </div>
      </section>

      {/* Purpose */}
      <section>
        <h3 className="mb-3 text-xs font-semibold tracking-wider text-(--foreground-muted) uppercase">
          {t("purpose")}
        </h3>
        <div className="flex flex-wrap gap-2">
          {PURPOSES.map((purpose) => {
            const Icon = PURPOSE_ICONS[purpose] || User;
            return (
              <Badge
                key={purpose}
                label={purpose}
                variant="default"
                active={staged.purposes?.includes(purpose)}
                onClick={() => toggleArray("purposes", purpose)}
                className="flex cursor-pointer items-center gap-1.5 px-4 py-2 text-sm"
              >
                {Icon && <Icon size={14} />}
                {purpose}
              </Badge>
            );
          })}
        </div>
      </section>

      {/* Tags */}
      <section>
        <h3 className="mb-3 text-xs font-semibold tracking-wider text-(--foreground-muted) uppercase">
          {t("tags.label")}
        </h3>
        <div className="flex flex-wrap gap-2">
          {FILTER_TAGS.map((tag) => (
            <Badge
              key={tag}
              label={tag}
              variant="default"
              active={staged.tags?.includes(tag)}
              onClick={() => toggleArray("tags", tag)}
              className="flex cursor-pointer items-center gap-1.5 px-4 py-2 text-sm"
            >
              {TAG_ICONS[tag]}
              {t(`tags.${TAG_TRANSLATION_KEYS[tag as FilterTag]}`)}
            </Badge>
          ))}
        </div>
      </section>

      {/* Price */}
      <section>
        <h3 className="mb-3 text-xs font-semibold tracking-wider text-(--foreground-muted) uppercase">
          {t("price")}
        </h3>
        <div className="flex flex-wrap gap-2">
          {PRICE_OPTIONS.map((opt) => {
            const active = staged.priceRange === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() =>
                  setStaged((s) => ({ ...s, priceRange: active ? undefined : opt.value }))
                }
                className={cn(
                  "rounded-full border px-4 py-2 text-sm font-medium transition-all duration-150",
                  active
                    ? "bg-accent border-accent text-white"
                    : "border-border hover:border-accent hover:text-accent text-(--foreground-muted)",
                )}
              >
                {t(`priceRanges.${opt.translationKey}`)}
              </button>
            );
          })}
        </div>
      </section>

      <section>
        <h3 className="mb-3 text-xs font-semibold tracking-wider text-(--foreground-muted) uppercase">
          {t("openingHours")}
        </h3>
        <div className="flex flex-wrap gap-2">
          {(["open_at_7", "open_24h"] as const).map((hours) => {
            const active = staged.hours === hours;
            return (
              <button
                key={hours}
                onClick={() => setStaged((s) => ({ ...s, hours: active ? undefined : hours }))}
                className={cn(
                  "rounded-full border px-4 py-2 text-sm font-medium transition-all duration-150",
                  active
                    ? "bg-accent border-accent text-white"
                    : "border-border hover:border-accent hover:text-accent text-(--foreground-muted)",
                )}
              >
                {t(hours === "open_at_7" ? "openFromSeven" : "open24Hours")}
              </button>
            );
          })}
        </div>
      </section>

      {/* Khu vực */}
      <section>
        <h3 className="mb-3 text-xs font-semibold tracking-wider text-(--foreground-muted) uppercase">
          KHU VỰC
        </h3>
        <Select value={staged.districts?.[0] ?? ""} onValueChange={handleAreaChange}>
          <SelectTrigger className="h-10 w-full rounded-xl text-sm">
            <SelectValue placeholder="Tất cả khu vực" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Tất cả khu vực</SelectItem>
            {AREAS.map((area) => (
              <SelectItem key={area} value={area}>
                {area}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </section>

      {/* Apply button */}
      <button
        onClick={handleApply}
        className="bg-accent hover:bg-(--accent-hover) mt-2 w-full cursor-pointer rounded-xl py-2.5 text-sm font-semibold text-white transition-all active:scale-95"
      >
        {t("apply")}
      </button>
    </div>
  );
}
