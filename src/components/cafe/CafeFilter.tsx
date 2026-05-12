"use client";

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
  { label: "< 50k", value: "under_50k" },
  { label: "50–100k", value: "price_50k_100k" },
  { label: "100–150k", value: "price_100k_150k" },
  { label: "> 150k", value: "above_150k" },
];

interface CafeFilterProps {
  filter: Filter;
  onChange: (filter: Filter) => void;
}

export default function CafeFilter({ filter, onChange }: CafeFilterProps) {
  const t = useTranslations("filters");

  function toggleArray<T extends string>(key: "vibes" | "purposes", value: T) {
    const current = (filter[key] ?? []) as T[];
    const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
    onChange({ ...filter, [key]: next });
  }

  function handleAreaChange(val: string | null) {
    const district = val === "" || val == null ? undefined : val;
    onChange({ ...filter, district });
  }

  const hasFilters =
    filter.vibes?.length || filter.purposes?.length || filter.priceRange != null || filter.district;

  return (
    <div className="space-y-6">
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
                active={filter.vibes?.includes(vibe)}
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
                active={filter.purposes?.includes(purpose)}
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

      {/* Price */}
      <section>
        <h3 className="mb-3 text-xs font-semibold tracking-wider text-(--foreground-muted) uppercase">
          {t("price")}
        </h3>
        <div className="flex flex-wrap gap-2">
          {PRICE_OPTIONS.map((opt) => {
            const active = filter.priceRange === opt.value;
            return (
              <button
                key={opt.label}
                onClick={() => onChange({ ...filter, priceRange: active ? undefined : opt.value })}
                className={cn(
                  "rounded-full border px-4 py-2 text-sm font-medium transition-all duration-150",
                  active
                    ? "bg-accent border-accent text-white"
                    : "border-border hover:border-accent hover:text-accent text-(--foreground-muted)",
                )}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* Khu vực + Phường */}
      <section>
        <h3 className="mb-3 text-xs font-semibold tracking-wider text-(--foreground-muted) uppercase">
          KHU VỰC
        </h3>
        <div className="space-y-2">
          <Select value={filter.district ?? ""} onValueChange={handleAreaChange}>
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
        </div>
      </section>

      {hasFilters ? (
        <button onClick={() => onChange({})} className="text-accent text-sm hover:underline">
          {t("clear")}
        </button>
      ) : null}
    </div>
  );
}
