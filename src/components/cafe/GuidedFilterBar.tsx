"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { LayoutGrid, LayoutList, Loader2, Navigation, SlidersHorizontal, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { VIBES, PURPOSES, AREAS, type CafeFilter as Filter, type Vibe } from "@/types/cafe";

interface GuidedFilterBarProps {
  filter: Filter;
  onChange: (filter: Filter) => void;
  viewMode?: "grid" | "list";
  onViewModeChange?: (mode: "grid" | "list") => void;
}

const TOP_VIBES: Vibe[] = ["yên tĩnh", "vintage", "thiên nhiên", "hiện đại"];
const PRICE_OPTIONS = [
  { label: "< 50k", value: "under_50k" },
  { label: "50–100k", value: "price_50k_100k" },
  { label: "100–150k", value: "price_100k_150k" },
  { label: "> 150k", value: "above_150k" },
];
const DISTANCE_OPTIONS = [
  { label: "< 2km", km: 2 },
  { label: "< 5km", km: 5 },
  { label: "< 10km", km: 10 },
];

function ChipFilter({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex flex-none cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-all duration-150 active:scale-95",
        active
          ? "border-accent bg-[rgba(201,135,12,0.13)] text-accent"
          : "border-border hover:border-accent hover:text-accent text-(--foreground-muted) bg-white dark:bg-[#1C1210]",
      )}
    >
      {children}
    </button>
  );
}

export default function GuidedFilterBar({
  filter,
  onChange,
  viewMode = "grid",
  onViewModeChange,
}: GuidedFilterBarProps) {
  const tf = useTranslations("filters");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownMounted, setDropdownMounted] = useState(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function openDropdown() {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    setDropdownMounted(true);
    requestAnimationFrame(() => setDropdownOpen(true));
  }

  function closeDropdown() {
    setDropdownOpen(false);
    closeTimerRef.current = setTimeout(() => setDropdownMounted(false), 250);
  }

  function toggleDropdown() {
    if (dropdownMounted) closeDropdown();
    else openDropdown();
  }
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoError, setGeoError] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const toggleBtnRef = useRef<HTMLButtonElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  const extraVibes = VIBES.length - TOP_VIBES.length;

  const activeCount =
    (filter.vibes?.length ?? 0) +
    (filter.purposes?.length ?? 0) +
    (filter.priceRange != null ? 1 : 0) +
    (filter.district ? 1 : 0) +
    (filter.openNow ? 1 : 0);

  // Active filter chips for display
  const activeChips: { label: string; remove: () => void }[] = [
    ...(filter.vibes ?? []).map((v) => ({
      label: v,
      remove: () =>
        onChange({ ...filter, vibes: filter.vibes?.filter((x) => x !== v) }),
    })),
    ...(filter.purposes ?? []).map((p) => ({
      label: p,
      remove: () =>
        onChange({ ...filter, purposes: filter.purposes?.filter((x) => x !== p) }),
    })),
    ...(filter.priceRange
      ? [
          {
            label: PRICE_OPTIONS.find((o) => o.value === filter.priceRange)?.label ?? filter.priceRange,
            remove: () => onChange({ ...filter, priceRange: undefined }),
          },
        ]
      : []),
    ...(filter.district
      ? [{ label: filter.district, remove: () => onChange({ ...filter, district: undefined }) }]
      : []),
    ...(filter.openNow
      ? [{ label: "Đang mở cửa", remove: () => onChange({ ...filter, openNow: false }) }]
      : []),
  ];

  useEffect(() => {
    if (!dropdownMounted) return;
    function handler(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        !toggleBtnRef.current?.contains(e.target as Node)
      ) {
        closeDropdown();
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [dropdownMounted]);

  function toggleVibe(v: string) {
    const current = filter.vibes ?? [];
    onChange({
      ...filter,
      vibes: current.includes(v) ? current.filter((x) => x !== v) : [...current, v],
    });
  }

  function togglePurpose(p: string) {
    const current = filter.purposes ?? [];
    onChange({
      ...filter,
      purposes: current.includes(p) ? current.filter((x) => x !== p) : [...current, p],
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

  function togglePrice(val: string) {
    onChange({ ...filter, priceRange: filter.priceRange === val ? undefined : val });
  }

  function setDistrict(val: string) {
    onChange({ ...filter, district: val === "" ? undefined : val });
  }

  return (
    <div className="bg-background/95 border-border sticky top-16 z-30 border-b backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* ── Filter strip ── */}
        <div ref={barRef} className="relative">
          <div className="scrollbar-hide flex items-center gap-2 overflow-x-auto py-2.5">

            {/* Bộ lọc dropdown toggle */}
            <button
              ref={toggleBtnRef}
              onClick={toggleDropdown}
              className={cn(
                "inline-flex flex-none cursor-pointer items-center gap-1.5 rounded-full border-2 px-3 py-1.5 text-xs font-bold whitespace-nowrap transition-all duration-150 active:scale-95",
                dropdownMounted || activeCount > 0
                  ? "border-accent bg-[rgba(201,135,12,0.13)] text-accent"
                  : "border-border hover:border-accent hover:text-accent text-(--foreground-muted) bg-white dark:bg-[#1C1210]",
              )}
            >
              <SlidersHorizontal size={12} />
              Bộ lọc
              {activeCount > 0 ? (
                <span className="bg-accent flex h-4 min-w-4 items-center justify-center rounded-full px-0.5 text-[10px] font-extrabold text-white">
                  {activeCount}
                </span>
              ) : (
                <ChevronDown
                  size={12}
                  className={cn("transition-transform duration-150", dropdownMounted && "rotate-180")}
                />
              )}
            </button>

            {/* Divider */}
            <div className="border-border mx-0.5 h-4 w-px flex-none border-l" />

            {/* Open Now */}
            <button
              onClick={toggleOpenNow}
              className={cn(
                "inline-flex flex-none cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-all duration-150 active:scale-95",
                filter.openNow
                  ? "border-[#1EA055] bg-[#E6F5EE] text-[#166638]"
                  : "border-border hover:border-[#1EA055] hover:text-[#166638] text-(--foreground-muted) bg-white dark:bg-[#1C1210]",
              )}
            >
              <span className="relative flex h-2 w-2">
                <span
                  className={cn(
                    "absolute inline-flex h-full w-full rounded-full opacity-75",
                    filter.openNow ? "animate-ping bg-[#1EA055]" : "bg-[#9B8B73]",
                  )}
                />
                <span
                  className={cn(
                    "relative inline-flex h-2 w-2 rounded-full",
                    filter.openNow ? "bg-[#1EA055]" : "bg-[#9B8B73]",
                  )}
                />
              </span>
              Đang mở cửa
            </button>

            {/* Gần tôi */}
            <button
              onClick={toggleNearMe}
              disabled={geoLoading}
              title={geoError ? "Không thể lấy vị trí" : undefined}
              className={cn(
                "inline-flex flex-none cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-all duration-150 active:scale-95",
                filter.nearMe
                  ? "border-accent bg-[rgba(201,135,12,0.13)] text-accent"
                  : geoError
                    ? "border-red-300 text-red-500"
                    : "border-border hover:border-accent hover:text-accent text-(--foreground-muted) bg-white dark:bg-[#1C1210]",
                geoLoading && "cursor-not-allowed opacity-60",
              )}
            >
              {geoLoading ? (
                <Loader2 size={12} className="animate-spin" />
              ) : (
                <Navigation size={12} />
              )}
              Gần tôi
            </button>

            {/* Distance chips when nearMe active */}
            {filter.nearMe &&
              DISTANCE_OPTIONS.map(({ label, km }) => (
                <ChipFilter
                  key={km}
                  active={filter.radiusKm === km}
                  onClick={() => setDistance(km)}
                >
                  {label}
                </ChipFilter>
              ))}

            {/* Divider */}
            <div className="border-border mx-0.5 h-4 w-px flex-none border-l" />

            {/* Quick vibes */}
            {TOP_VIBES.map((v) => (
              <ChipFilter
                key={v}
                active={filter.vibes?.includes(v) ?? false}
                onClick={() => toggleVibe(v)}
              >
                {v}
              </ChipFilter>
            ))}

            {extraVibes > 0 && (
              <button
                onClick={openDropdown}
                className="border-border flex-none cursor-pointer rounded-full border border-dashed px-3 py-1.5 text-xs whitespace-nowrap text-(--foreground-muted) transition-colors hover:border-accent hover:text-accent"
              >
                +{extraVibes} phong cách
              </button>
            )}

            {/* Clear all */}
            {activeCount > 0 && (
              <button
                onClick={() => onChange({})}
                className="hover:text-accent flex flex-none cursor-pointer items-center gap-1 text-xs whitespace-nowrap text-(--foreground-muted) transition-colors"
              >
                <X size={12} />
                {tf("clear")}
              </button>
            )}

            {/* View toggle — desktop only, right side */}
            <div className="ml-auto hidden items-center gap-0.5 rounded-lg border border-[#FEDCC8]/60 bg-[#FFF1EA] p-0.5 md:flex dark:border-[#3A2A20] dark:bg-[#2C1A0E]">
              <button
                onClick={() => onViewModeChange?.("grid")}
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-md transition-colors",
                  viewMode === "grid"
                    ? "bg-white text-accent shadow-sm dark:bg-[#1C1210]"
                    : "text-[#847465]",
                )}
                aria-label="Grid view"
              >
                <LayoutGrid size={15} />
              </button>
              <button
                onClick={() => onViewModeChange?.("list")}
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-md transition-colors",
                  viewMode === "list"
                    ? "bg-white text-accent shadow-sm dark:bg-[#1C1210]"
                    : "text-[#847465]",
                )}
                aria-label="List view"
              >
                <LayoutList size={15} />
              </button>
            </div>
          </div>

          {/* ── Dropdown Filter Panel ── */}
          {dropdownMounted && (
            <div
              ref={dropdownRef}
              className={cn(
                "absolute top-full right-0 left-0 z-50 mt-1 transition-all duration-300",
                dropdownOpen ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0 pointer-events-none",
              )}
            >
              <div className="rounded-2xl border border-[#E0D3C0] bg-white shadow-[0_16px_48px_rgba(40,22,4,0.16)] dark:border-[#3A2A20] dark:bg-[#1C1210]">
                <div className="grid gap-6 p-6 sm:grid-cols-3">
                  {/* Phong cách */}
                  <div>
                    <p className="mb-3 text-[10px] font-extrabold uppercase tracking-[0.09em] text-[#9B8B73]">
                      Phong cách
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {VIBES.map((v) => (
                        <button
                          key={v}
                          onClick={() => toggleVibe(v)}
                          className={cn(
                            "cursor-pointer rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-150 active:scale-95",
                            filter.vibes?.includes(v)
                              ? "border-accent bg-[rgba(201,135,12,0.13)] text-accent"
                              : "border-[#E0D3C0] text-[#5C4A2F] hover:border-accent hover:text-accent",
                          )}
                        >
                          {v}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Mục đích */}
                  <div>
                    <p className="mb-3 text-[10px] font-extrabold uppercase tracking-[0.09em] text-[#9B8B73]">
                      Mục đích
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {PURPOSES.map((p) => (
                        <button
                          key={p}
                          onClick={() => togglePurpose(p)}
                          className={cn(
                            "cursor-pointer rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-150 active:scale-95",
                            filter.purposes?.includes(p)
                              ? "border-accent bg-[rgba(201,135,12,0.13)] text-accent"
                              : "border-[#E0D3C0] text-[#5C4A2F] hover:border-accent hover:text-accent",
                          )}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Giá + Khu vực */}
                  <div className="flex flex-col gap-5">
                    <div>
                      <p className="mb-3 text-[10px] font-extrabold uppercase tracking-[0.09em] text-[#9B8B73]">
                        Giá
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {PRICE_OPTIONS.map((opt) => (
                          <button
                            key={opt.value}
                            onClick={() => togglePrice(opt.value)}
                            className={cn(
                              "cursor-pointer rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-150 active:scale-95",
                              filter.priceRange === opt.value
                                ? "border-accent bg-[rgba(201,135,12,0.13)] text-accent"
                                : "border-[#E0D3C0] text-[#5C4A2F] hover:border-accent hover:text-accent",
                            )}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="mb-2 text-[10px] font-extrabold uppercase tracking-[0.09em] text-[#9B8B73]">
                        Khu vực
                      </p>
                      <div className="relative">
                        <select
                          value={filter.district ?? ""}
                          onChange={(e) => setDistrict(e.target.value)}
                          className="w-full cursor-pointer appearance-none rounded-lg border border-[#E0D3C0] bg-[#FAF6F1] px-3 py-2 pr-8 text-xs font-medium text-[#1C1209] outline-none transition-colors focus:border-accent dark:border-[#3A2A20] dark:bg-[#2C1A0E] dark:text-[#FFE3D3]"
                        >
                          <option value="">Tất cả khu vực</option>
                          {AREAS.map((area) => (
                            <option key={area} value={area}>
                              {area}
                            </option>
                          ))}
                        </select>
                        <ChevronDown
                          size={13}
                          className="pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2 text-[#9B8B73]"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between border-t border-[#ECE4D6] px-6 py-4 dark:border-[#2A211B]">
                  <button
                    onClick={() => onChange({})}
                    className="cursor-pointer text-xs text-[#9B8B73] underline underline-offset-2 transition-colors hover:text-[#5C4A2F]"
                  >
                    Xóa bộ lọc
                  </button>
                  <button
                    onClick={closeDropdown}
                    className="bg-accent hover:bg-(--accent-hover) cursor-pointer rounded-xl px-6 py-2 text-xs font-bold text-white transition-colors"
                  >
                    {activeCount > 0 ? `Áp dụng (${activeCount})` : "Áp dụng"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Active filter chips ── */}
        {activeChips.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pb-2.5">
            <span className="text-xs font-medium text-(--foreground-muted)">Đang lọc:</span>
            {activeChips.map((chip) => (
              <button
                key={chip.label}
                onClick={chip.remove}
                className="border-accent text-accent bg-[rgba(201,135,12,0.13)] inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold transition-all active:scale-95"
              >
                {chip.label}
                <X size={11} />
              </button>
            ))}
            <button
              onClick={() => onChange({})}
              className="cursor-pointer text-xs text-(--foreground-muted) underline underline-offset-2 transition-colors hover:text-accent"
            >
              Xóa tất cả
            </button>
          </div>
        )}

        {/* ── Mobile: view toggle row ── */}
        <div className="flex items-center justify-between gap-3 pb-2.5 md:hidden">
          <div className="flex items-center gap-0.5 rounded-lg border border-[#FEDCC8]/60 bg-[#FFF1EA] p-0.5 dark:border-[#3A2A20] dark:bg-[#2C1A0E]">
            <button
              onClick={() => onViewModeChange?.("grid")}
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-md transition-colors",
                viewMode === "grid"
                  ? "bg-white text-accent shadow-sm dark:bg-[#1C1210]"
                  : "text-[#847465]",
              )}
              aria-label="Grid view"
            >
              <LayoutGrid size={15} />
            </button>
            <button
              onClick={() => onViewModeChange?.("list")}
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-md transition-colors",
                viewMode === "list"
                  ? "bg-white text-accent shadow-sm dark:bg-[#1C1210]"
                  : "text-[#847465]",
              )}
              aria-label="List view"
            >
              <LayoutList size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
