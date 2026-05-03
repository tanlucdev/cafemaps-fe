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
  AREAS,
  type CafeFilter as Filter,
} from "@/types/cafe"

const PRICE_OPTIONS = [
  { label: "< 50k", value: "under_50k" },
  { label: "50–100k", value: "price_50k_100k" },
  { label: "100–150k", value: "price_100k_150k" },
  { label: "> 150k", value: "above_150k" },
]

interface CafeFilterProps {
  filter: Filter
  onChange: (filter: Filter) => void
}

export default function CafeFilter({ filter, onChange }: CafeFilterProps) {
  const t = useTranslations("filters")

  function toggleArray<T extends string>(key: "vibes" | "purposes", value: T) {
    const current = (filter[key] ?? []) as T[]
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value]
    onChange({ ...filter, [key]: next })
  }

  function handleAreaChange(val: string | null) {
    const district = val === "" || val == null ? undefined : val
    onChange({ ...filter, district })
  }

  const hasFilters =
    filter.vibes?.length ||
    filter.purposes?.length ||
    filter.priceRange != null ||
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
              active={filter.vibes?.includes(vibe)}
              onClick={() => toggleArray("vibes", vibe)}
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
              active={filter.purposes?.includes(purpose)}
              onClick={() => toggleArray("purposes", purpose)}
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
          {PRICE_OPTIONS.map((opt) => {
            const active = filter.priceRange === opt.value
            return (
              <button
                key={opt.label}
                onClick={() =>
                  onChange({ ...filter, priceRange: active ? undefined : opt.value })
                }
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium border transition-all duration-150",
                  active
                    ? "bg-accent text-white border-accent"
                    : "border-border text-(--foreground-muted) hover:border-accent hover:text-accent"
                )}
              >
                {opt.label}
              </button>
            )
          })}
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
