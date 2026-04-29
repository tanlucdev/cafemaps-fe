"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { SlidersHorizontal, X, Navigation, Loader2 } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import CafeFilter from "@/components/cafe/CafeFilter"
import { cn } from "@/lib/utils"
import { VIBES, type CafeFilter as Filter, type Vibe } from "@/types/cafe"

interface GuidedFilterBarProps {
  filter: Filter
  onChange: (filter: Filter) => void
}

const TOP_VIBES: Vibe[] = ["yên tĩnh", "vintage", "thiên nhiên", "hiện đại"]
const DISTANCE_OPTIONS = [
  { label: "< 2km", km: 2 },
  { label: "< 5km", km: 5 },
  { label: "< 10km", km: 10 },
]

export default function GuidedFilterBar({ filter, onChange }: GuidedFilterBarProps) {
  const t = useTranslations("guidedFilter")
  const tf = useTranslations("filters")
  const [geoLoading, setGeoLoading] = useState(false)
  const [geoError, setGeoError] = useState(false)

  const extraVibes = VIBES.length - TOP_VIBES.length

  const activeCount =
    (filter.vibe?.length ?? 0) +
    (filter.purpose?.length ?? 0) +
    (filter.priceRange ? 1 : 0) +
    (filter.district ? 1 : 0) +
    (filter.ward ? 1 : 0)

  function toggleVibe(v: Vibe) {
    const current = filter.vibe ?? []
    onChange({
      ...filter,
      vibe: current.includes(v) ? current.filter((x) => x !== v) : [...current, v],
    })
  }

  function toggleOpenNow() {
    onChange({ ...filter, openNow: !filter.openNow })
  }

  function toggleNearMe() {
    if (filter.nearMe) {
      onChange({ ...filter, nearMe: false, lat: undefined, lng: undefined, radiusKm: undefined })
      return
    }
    if (!navigator.geolocation) return
    setGeoLoading(true)
    setGeoError(false)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGeoLoading(false)
        onChange({
          ...filter,
          nearMe: true,
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          radiusKm: 2,
        })
      },
      () => {
        setGeoLoading(false)
        setGeoError(true)
        setTimeout(() => setGeoError(false), 3000)
      }
    )
  }

  function setDistance(km: number) {
    onChange({ ...filter, radiusKm: km })
  }

  return (
    <div className="sticky top-16 z-30 bg-background/90 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 py-2.5 overflow-x-auto scrollbar-hide">

          {/* Bộ lọc — always visible first */}
          <Sheet>
            <SheetTrigger
              className={cn(
                "flex-none flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border-2 transition-all duration-150 whitespace-nowrap",
                activeCount > 0
                  ? "bg-accent text-white border-accent"
                  : "border-accent text-accent bg-(--accent-light) hover:bg-accent hover:text-white"
              )}
            >
              <SlidersHorizontal size={12} />
              {activeCount > 0 ? t("activeCount", { count: activeCount }) : "Bộ lọc"}
            </SheetTrigger>
            <SheetContent side="right" className="w-80 overflow-y-auto">
              <SheetHeader className="border-b border-border pb-4">
                <SheetTitle className="text-base font-display">Bộ lọc thêm</SheetTitle>
              </SheetHeader>
              <div className="px-4 py-5">
                <CafeFilter filter={filter} onChange={onChange} />
              </div>
            </SheetContent>
          </Sheet>

          {/* Divider */}
          <div className="flex-none w-px h-5 bg-border mx-1" />

          {/* Open Now toggle */}
          <button
            onClick={toggleOpenNow}
            className={cn(
              "flex-none flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-150 whitespace-nowrap",
              filter.openNow
                ? "bg-accent text-white border-accent"
                : "border-border text-(--foreground-muted) hover:border-accent hover:text-accent"
            )}
          >
            <span className={cn("w-1.5 h-1.5 rounded-full", filter.openNow ? "bg-white" : "bg-green-500")} />
            {t("openNow")}
          </button>

          {/* Divider */}
          <div className="flex-none w-px h-5 bg-border mx-1" />

          {/* Gần tôi toggle */}
          <button
            onClick={toggleNearMe}
            disabled={geoLoading}
            title={geoError ? "Không thể lấy vị trí" : undefined}
            className={cn(
              "flex-none flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-150 whitespace-nowrap",
              filter.nearMe
                ? "bg-accent text-white border-accent"
                : geoError
                  ? "border-red-300 text-red-500"
                  : "border-border text-(--foreground-muted) hover:border-accent hover:text-accent",
              geoLoading && "opacity-60 cursor-not-allowed"
            )}
          >
            {geoLoading
              ? <Loader2 size={12} className="animate-spin" />
              : <Navigation size={12} />
            }
            Gần tôi
          </button>

          {/* Distance chips — only when nearMe active */}
          {filter.nearMe && DISTANCE_OPTIONS.map(({ label, km }) => (
            <button
              key={km}
              onClick={() => setDistance(km)}
              className={cn(
                "flex-none px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-150 whitespace-nowrap",
                filter.radiusKm === km
                  ? "bg-accent text-white border-accent"
                  : "border-border text-(--foreground-muted) hover:border-accent hover:text-accent"
              )}
            >
              {label}
            </button>
          ))}

          {/* Divider */}
          <div className="flex-none w-px h-5 bg-border mx-1" />

          {/* Top vibes */}
          {TOP_VIBES.map((v) => (
            <button
              key={v}
              onClick={() => toggleVibe(v)}
              className={cn(
                "flex-none px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-150 whitespace-nowrap capitalize",
                filter.vibe?.includes(v)
                  ? "bg-accent text-white border-accent"
                  : "border-border text-(--foreground-muted) hover:border-accent hover:text-accent"
              )}
            >
              {v}
            </button>
          ))}

          {extraVibes > 0 && (
            <span className="flex-none text-xs text-(--foreground-muted) whitespace-nowrap pl-0.5">
              {t("moreVibes", { count: extraVibes })}
            </span>
          )}

          {/* Clear all */}
          {(activeCount > 0 || filter.nearMe) && (
            <button
              onClick={() => onChange({})}
              className="flex-none flex items-center gap-1 text-xs text-(--foreground-muted) hover:text-accent transition-colors whitespace-nowrap"
            >
              <X size={12} />
              {tf("clear")}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
