"use client";

import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useLenis } from "@/components/providers/LenisProvider";
import { useTranslations } from "next-intl";
import CafeGrid from "@/components/cafe/CafeGrid";
import CafeList from "@/components/cafe/CafeList";
import GuidedFilterBar from "@/components/cafe/GuidedFilterBar";
import Pagination from "@/components/ui/Pagination";
import { LayoutGrid, LayoutList, Search, Coffee } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Cafe, CafeFilter as Filter } from "@/types/cafe";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  buildSearchParams,
  filterFromSearchParams,
  hasActiveSearchFilters,
  setLastSearchState,
  sortFromSearchParams,
  type SearchSort,
} from "@/lib/search-state";

type ViewMode = "grid" | "list";

const PAGE_SIZE = 10;

interface FeaturedSectionProps {
  cafes: Cafe[];
  locale: string;
}

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLng = (lng2 - lng1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function FeaturedSection({ cafes, locale }: FeaturedSectionProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const lenis = useLenis();
  const ts = useTranslations("search");

  const [filter, setFilter] = useState<Filter>(() => filterFromSearchParams(searchParams));
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortMode, setSortMode] = useState<SearchSort>(() => sortFromSearchParams(searchParams));
  const [animationType, setAnimationType] = useState<"slide" | "fade">("fade");
  const [searchInput, setSearchInput] = useState(filter.search ?? "");
  const searchInputRef = useRef<HTMLInputElement>(null);

  const page = Number(searchParams.get("page") ?? "1");

  const updateUrl = useCallback(
    (newFilter: Filter, newSort: SearchSort, newPage: number) => {
      const params = buildSearchParams(newFilter, newSort, newPage);
      const query = params.toString();
      router.push(query ? `?${query}` : "?", { scroll: false });
      if (query && hasActiveSearchFilters(newFilter)) {
        setLastSearchState({
          query: newFilter.search,
          filter: newFilter,
          sort: newSort,
          params: query,
        });
      }
    },
    [router],
  );

  useEffect(() => {
    const nextFilter = filterFromSearchParams(searchParams);
    const nextSort = sortFromSearchParams(searchParams);
    setFilter(nextFilter);
    setSortMode(nextSort);
    setSearchInput(nextFilter.search ?? "");
  }, [searchParams]);

  function handleFilterChange(newFilter: Filter) {
    setFilter(newFilter);
    setAnimationType("slide");
    updateUrl(newFilter, sortMode, 1);
  }

  function handleSearchSubmit() {
    const newFilter = { ...filter, search: searchInput.trim() || undefined };
    handleFilterChange(newFilter);
  }

  function handlePageChange(newPage: number) {
    setAnimationType("fade");
    updateUrl(filter, sortMode, newPage);
    if (lenis) lenis.scrollTo(0, { duration: 0.6 });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleSortChange(newSort: SearchSort) {
    setSortMode(newSort);
    updateUrl(filter, newSort, 1);
  }

  function isOpenNow(cafe: Cafe) {
    if (!cafe.openingTime || !cafe.closingTime) return true;
    const now = new Date();
    const current = now.getHours() * 60 + now.getMinutes();
    const [openHour = "0", openMinute = "0"] = cafe.openingTime.split(":");
    const [closeHour = "0", closeMinute = "0"] = cafe.closingTime.split(":");
    const open = Number(openHour) * 60 + Number(openMinute);
    const close = Number(closeHour) * 60 + Number(closeMinute);

    if (close < open) return current >= open || current <= close;
    return current >= open && current <= close;
  }

  const filtered = useMemo(() => {
    let result = cafes;
    const { search, district, vibes, purposes, priceRange, openNow } = filter;

    if (search?.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          (c.address ?? "").toLowerCase().includes(q) ||
          (c.district ?? "").toLowerCase().includes(q),
      );
    }
    if (district) result = result.filter((c) => c.district === district);
    if (vibes?.length) result = result.filter((c) => vibes.some((v) => c.vibes.includes(v)));
    if (purposes?.length)
      result = result.filter((c) => purposes.some((p) => c.purposes.includes(p)));
    if (priceRange) {
      result = result.filter((c) => {
        const min = c.priceMin ?? 0;
        const max = c.priceMax ?? min;
        if (priceRange === "under_50k") return min < 50000;
        if (priceRange === "price_50k_100k" || priceRange === "50k_100k")
          return min <= 100000 && max >= 50000;
        if (priceRange === "price_100k_150k" || priceRange === "100k_150k")
          return min <= 150000 && max >= 100000;
        if (priceRange === "above_150k") return max > 150000;
        return true;
      });
    }
    if (openNow) result = result.filter(isOpenNow);
    // When nearMe is active, server already filtered via PostGIS — skip client-side haversine.
    // Only apply client-side as fallback when cafes have lat/lng but weren't server-filtered.
    if (filter.nearMe && filter.lat !== undefined && filter.lng !== undefined) {
      const hasCoords = result.some((c) => c.lat != null && c.lng != null);
      if (hasCoords) {
        const radius = filter.radiusKm ?? 2;
        result = result.filter((c) => {
          if (c.lat == null || c.lng == null) return false;
          return haversineKm(filter.lat!, filter.lng!, c.lat, c.lng) <= radius;
        });
      }
    }

    return result;
  }, [cafes, filter]);

  const sorted = useMemo(() => {
    if (sortMode === "rating" || sortMode === "popular") {
      return filtered;
    }
    if (sortMode === "newest") {
      return [...filtered].sort((a, b) => {
        const da = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const db = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return db - da;
      });
    }
    return filtered;
  }, [filtered, sortMode]);

  const total = sorted.length;
  const paginated = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const hasFilters = hasActiveSearchFilters(filter);
  const sortLabel =
    sortMode === "newest"
      ? ts("sortNewest")
      : sortMode === "rating"
        ? ts("sortRating")
        : ts("sortPopular");

  return (
    <>
      {/* Search bar at top of search page */}
      <div className="border-border border-b bg-(--background-secondary)">
        <div className="mx-auto max-w-7xl px-4 pt-2 pb-4 sm:px-6 lg:px-8">
          <div className="flex max-w-xl gap-2">
            <div className="relative flex-1">
              <Search
                size={15}
                className="absolute top-1/2 left-3.5 -translate-y-1/2 text-(--foreground-muted)"
              />
              <input
                ref={searchInputRef}
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearchSubmit()}
                placeholder={ts("placeholder")}
                className="border-border bg-background text-foreground focus:ring-accent h-10 w-full rounded-xl border pr-4 pl-10 text-sm transition-all focus:ring-2 focus:outline-none"
              />
            </div>
            <button
              onClick={handleSearchSubmit}
              className="bg-accent h-10 shrink-0 rounded-xl px-5 text-sm font-medium text-white transition-colors hover:bg-(--accent-hover)"
            >
              {ts("button")}
            </button>
          </div>
        </div>
      </div>

      <GuidedFilterBar filter={filter} onChange={handleFilterChange} />

      <main className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        {/* Toolbar: results count + sort + view toggle */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-(--foreground-muted)">
            {!hasFilters && sortMode === "popular"
              ? ts("defaultResultsLabel", { count: total })
              : total > 0
                ? `${total} quán · ${ts("sortPrefix")}: ${sortLabel}`
                : null}
          </p>

          <div className="ml-auto flex items-center gap-2">
            {/* Sort selector */}
            <Select
              value={sortMode}
              onValueChange={(value) => handleSortChange(value as SearchSort)}
            >
              <SelectTrigger
                className="border-border bg-background text-foreground focus:ring-accent h-8 w-32 rounded-lg border px-2 text-xs focus:ring-1 focus:ring-offset-0 focus:outline-none"
                aria-label={ts("sortLabel")}
              >
                <SelectValue placeholder={ts("sortLabel")} />
              </SelectTrigger>
              <SelectContent sideOffset={4} align="end">
                <SelectItem value="popular">{ts("sortPopular")}</SelectItem>
                <SelectItem value="rating">{ts("sortRating")}</SelectItem>
                <SelectItem value="newest">{ts("sortNewest")}</SelectItem>
              </SelectContent>
            </Select>

            {/* View toggle */}
            <div className="border-border flex items-center overflow-hidden rounded-lg border">
              <button
                onClick={() => setViewMode("grid")}
                title="Grid view"
                className={cn(
                  "p-1.5 transition-colors",
                  viewMode === "grid"
                    ? "bg-accent text-white"
                    : "hover:text-accent text-(--foreground-muted)",
                )}
              >
                <LayoutGrid size={15} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                title="List view"
                className={cn(
                  "p-1.5 transition-colors",
                  viewMode === "list"
                    ? "bg-accent text-white"
                    : "hover:text-accent text-(--foreground-muted)",
                )}
              >
                <LayoutList size={15} />
              </button>
            </div>
          </div>
        </div>

        {total === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
            <Coffee size={40} className="text-(--foreground-muted) opacity-40" />
            <p className="text-base font-medium text-(--foreground-muted)">
              {ts("noResultsMessage")}
            </p>
          </div>
        ) : (
          <>
            {viewMode === "grid" ? (
              <CafeGrid
                key={`${page}-${animationType}`}
                cafes={paginated}
                locale={locale}
                animationType={animationType}
              />
            ) : (
              <CafeList
                key={`${page}-${animationType}`}
                cafes={paginated}
                locale={locale}
                animationType={animationType}
              />
            )}

            <Pagination
              page={page}
              total={total}
              limit={PAGE_SIZE}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </main>
    </>
  );
}
