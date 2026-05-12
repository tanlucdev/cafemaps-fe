"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { SlidersHorizontal, X, Navigation, Loader2 } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import Badge from "@/components/ui/Badge";
import CafeFilter from "@/components/cafe/CafeFilter";
import { cn } from "@/lib/utils";
import { VIBES, type CafeFilter as Filter, type Vibe } from "@/types/cafe";

interface GuidedFilterBarProps {
  filter: Filter;
  onChange: (filter: Filter) => void;
}

const TOP_VIBES: Vibe[] = ["yên tĩnh", "vintage", "thiên nhiên", "hiện đại"];
const DISTANCE_OPTIONS = [
  { label: "< 2km", km: 2 },
  { label: "< 5km", km: 5 },
  { label: "< 10km", km: 10 },
];

export default function GuidedFilterBar({ filter, onChange }: GuidedFilterBarProps) {
  const t = useTranslations("guidedFilter");
  const tf = useTranslations("filters");
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoError, setGeoError] = useState(false);

  const extraVibes = VIBES.length - TOP_VIBES.length;

  const activeCount =
    (filter.vibes?.length ?? 0) +
    (filter.purposes?.length ?? 0) +
    (filter.priceRange != null ? 1 : 0) +
    (filter.district ? 1 : 0) +
    (filter.openNow ? 1 : 0);

  function toggleVibe(v: Vibe) {
    const current = filter.vibes ?? [];
    onChange({
      ...filter,
      vibes: current.includes(v) ? current.filter((x) => x !== v) : [...current, v],
    });
  }

  function toggleOpenNow() {
    onChange({ ...filter, openNow: !filter.openNow });
  }

  function toggleNearMe() {
    if (filter.nearMe) {
      onChange({ ...filter, nearMe: false, lat: undefined, lng: undefined, radiusKm: undefined });
      return;
    }
    if (!navigator.geolocation) return;
    setGeoLoading(true);
    setGeoError(false);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGeoLoading(false);
        onChange({
          ...filter,
          nearMe: true,
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          radiusKm: 2,
        });
      },
      () => {
        setGeoLoading(false);
        setGeoError(true);
        setTimeout(() => setGeoError(false), 3000);
      },
    );
  }

  function setDistance(km: number) {
    onChange({ ...filter, radiusKm: km });
  }

  return (
    <div className="bg-background/90 border-border sticky top-16 z-30 border-b backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="scrollbar-hide flex items-center gap-2 overflow-x-auto py-2.5">
          {/* Bộ lọc — always visible first */}
          <Sheet>
            <SheetTrigger
              className={cn(
                "flex flex-none items-center gap-1.5 rounded-full border-2 px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-all duration-150",
                activeCount > 0
                  ? "bg-accent border-accent text-white"
                  : "border-accent text-accent hover:bg-accent bg-(--accent-light) hover:text-white",
              )}
            >
              <SlidersHorizontal size={12} />
              {activeCount > 0 ? t("activeCount", { count: activeCount }) : "Bộ lọc"}
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[85vw] overflow-y-auto sm:w-[450px] sm:max-w-md"
            >
              <SheetHeader className="border-border border-b pb-4">
                <SheetTitle className="font-display text-base">Bộ lọc thêm</SheetTitle>
              </SheetHeader>
              <div className="px-4 py-5">
                <CafeFilter filter={filter} onChange={onChange} />
              </div>
            </SheetContent>
          </Sheet>

          {/* Divider */}
          <div className="bg-border mx-1 h-5 w-px flex-none" />

          {/* Open Now toggle */}
          <button
            onClick={toggleOpenNow}
            className={cn(
              "flex flex-none items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-all duration-150",
              filter.openNow
                ? "bg-accent border-accent text-white"
                : "border-border hover:border-accent hover:text-accent text-(--foreground-muted)",
            )}
          >
            <span
              className={cn(
                "h-1.5 w-1.5 rounded-full",
                filter.openNow ? "bg-white" : "bg-green-500",
              )}
            />
            {t("openNow")}
          </button>

          {/* Divider */}
          <div className="bg-border mx-1 h-5 w-px flex-none" />

          {/* Gần tôi toggle */}
          <button
            onClick={toggleNearMe}
            disabled={geoLoading}
            title={geoError ? "Không thể lấy vị trí" : undefined}
            className={cn(
              "flex flex-none items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-all duration-150",
              filter.nearMe
                ? "bg-accent border-accent text-white"
                : geoError
                  ? "border-red-300 text-red-500"
                  : "border-border hover:border-accent hover:text-accent text-(--foreground-muted)",
              geoLoading && "cursor-not-allowed opacity-60",
            )}
          >
            {geoLoading ? <Loader2 size={12} className="animate-spin" /> : <Navigation size={12} />}
            Gần tôi
          </button>

          {/* Distance chips — only when nearMe active */}
          {filter.nearMe &&
            DISTANCE_OPTIONS.map(({ label, km }) => (
              <button
                key={km}
                onClick={() => setDistance(km)}
                className={cn(
                  "flex-none rounded-full border px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-all duration-150",
                  filter.radiusKm === km
                    ? "bg-accent border-accent text-white"
                    : "border-border hover:border-accent hover:text-accent text-(--foreground-muted)",
                )}
              >
                {label}
              </button>
            ))}

          {/* Divider */}
          <div className="bg-border mx-1 h-5 w-px flex-none" />

          {/* Top vibes */}
          {TOP_VIBES.map((v) => (
            <Badge
              key={v}
              label={v}
              variant="vibe"
              className="flex-none px-3 py-1 whitespace-nowrap capitalize"
              active={filter.vibes?.includes(v)}
              onClick={() => toggleVibe(v)}
            />
          ))}

          {extraVibes > 0 && (
            <span className="flex-none pl-0.5 text-xs whitespace-nowrap text-(--foreground-muted)">
              {t("moreVibes", { count: extraVibes })}
            </span>
          )}

          {/* Clear all */}
          {(activeCount > 0 || filter.nearMe) && (
            <button
              onClick={() => onChange({})}
              className="hover:text-accent flex flex-none items-center gap-1 text-xs whitespace-nowrap text-(--foreground-muted) transition-colors"
            >
              <X size={12} />
              {tf("clear")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
