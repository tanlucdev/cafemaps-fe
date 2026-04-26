"use client"

import { useTranslations } from "next-intl"
import Badge from "@/components/ui/Badge"
import { cn } from "@/lib/utils"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  VIBES,
  PURPOSES,
  PRICE_RANGES,
  AREAS,
  WARDS_BY_AREA,
  type CafeFilter as Filter,
  type PriceRange,
} from "@/types/cafe"

interface CafeFilterProps {
  filter: Filter
  onChange: (filter: Filter) => void
}

const PRICE_LABELS: Record<PriceRange, string> = {
  under_50k: "< 50k",
  "50k_100k": "50–100k",
  "100k_150k": "100–150k",
  above_150k: "> 150k",
}

export default function CafeFilter({ filter, onChange }: CafeFilterProps) {
  const t = useTranslations("filters")

  function toggleArray<T extends string>(key: "vibe" | "purpose", value: T) {
    const current = (filter[key] ?? []) as T[]
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value]
    onChange({ ...filter, [key]: next })
  }

  function handleAreaChange(val: string) {
    onChange({ ...filter, district: val || undefined, ward: undefined })
  }

  function handleWardChange(val: string) {
    onChange({ ...filter, ward: val || undefined })
  }

  const wardsForArea = filter.district ? (WARDS_BY_AREA[filter.district] ?? []) : []

  const hasFilters =
    filter.vibe?.length ||
    filter.purpose?.length ||
    filter.priceRange ||
    filter.district

  return (
    <div className="space-y-6">
      {/* Vibe */}
      <section>
        <h3 className="text-xs font-semibold text-(--foreground-muted) uppercase tracking-wider mb-3">
          {t("vibe")}
        </h3>
        <div className="flex flex-wrap gap-2">
          {VIBES.map((vibe) => (
            <Badge
              key={vibe}
              label={vibe}
              variant="vibe"
              active={filter.vibe?.includes(vibe)}
              onClick={() => toggleArray("vibe", vibe)}
              className="text-sm px-4 py-2 cursor-pointer"
            />
          ))}
        </div>
      </section>

      {/* Purpose */}
      <section>
        <h3 className="text-xs font-semibold text-(--foreground-muted) uppercase tracking-wider mb-3">
          {t("purpose")}
        </h3>
        <div className="flex flex-wrap gap-2">
          {PURPOSES.map((purpose) => (
            <Badge
              key={purpose}
              label={purpose}
              active={filter.purpose?.includes(purpose)}
              onClick={() => toggleArray("purpose", purpose)}
              className="text-sm px-4 py-2 cursor-pointer"
            />
          ))}
        </div>
      </section>

      {/* Price */}
      <section>
        <h3 className="text-xs font-semibold text-(--foreground-muted) uppercase tracking-wider mb-3">
          {t("price")}
        </h3>
        <div className="flex flex-wrap gap-2">
          {PRICE_RANGES.map((price) => (
            <button
              key={price}
              onClick={() =>
                onChange({ ...filter, priceRange: filter.priceRange === price ? undefined : price })
              }
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium border transition-all duration-150",
                filter.priceRange === price
                  ? "bg-accent text-white border-accent"
                  : "border-border text-(--foreground-muted) hover:border-accent hover:text-accent"
              )}
            >
              {PRICE_LABELS[price]}
            </button>
          ))}
        </div>
      </section>

      {/* Khu vực + Phường */}
      <section>
        <h3 className="text-xs font-semibold text-(--foreground-muted) uppercase tracking-wider mb-3">
          KHU VỰC
        </h3>
        <div className="space-y-2">
          <Select
            value={filter.district ?? ""}
            onValueChange={handleAreaChange}
          >
            <SelectTrigger className="w-full h-10 rounded-xl text-sm">
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

          {wardsForArea.length > 0 && (
            <Select
              value={filter.ward ?? ""}
              onValueChange={handleWardChange}
            >
              <SelectTrigger className="w-full h-10 rounded-xl text-sm">
                <SelectValue placeholder="Tất cả phường" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tất cả phường</SelectItem>
                {wardsForArea.map((ward) => (
                  <SelectItem key={ward} value={ward}>
                    {ward}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </section>

      {hasFilters ? (
        <button
          onClick={() => onChange({})}
          className="text-sm text-accent hover:underline"
        >
          {t("clear")}
        </button>
      ) : null}
    </div>
  )
}
