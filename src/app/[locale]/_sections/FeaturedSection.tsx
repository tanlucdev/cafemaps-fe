"use client";

import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import type { Cafe, CafeFilter as Filter } from "@/types/cafe";
import {
  buildSearchParams,
  filterFromSearchParams,
  hasActiveSearchFilters,
  setLastSearchState,
  sortFromSearchParams,
  type SearchSort,
} from "@/lib/search-state";
import { isCafeOpenNow } from "@/lib/opening-hours";
import { getCafeDistricts, getCafesWithMeta, getNearbyCafes } from "@/lib/api";
import { cafeListQueryKey } from "@/apis/cafes/query";
import FeaturedSectionControls from "./FeaturedSectionControls";
import FeaturedSectionResults from "./FeaturedSectionResults";
import FeaturedSectionToolbar from "./FeaturedSectionToolbar";
import {
  cafeCreatedTime,
  cafePopularity,
  cafeRating,
  filterNearbyCafes,
  haversineKm,
  PAGE_SIZE,
  type ServerMeta,
  type ViewMode,
} from "./featured-section-helpers";
import { useMinimumLoading } from "./useMinimumLoading";

interface FeaturedSectionProps {
  cafes: Cafe[];
  locale: string;
  districts?: string[];
  serverMeta?: ServerMeta;
  deferData?: boolean;
}

export default function FeaturedSection({
  cafes,
  locale,
  districts,
  serverMeta,
  deferData = false,
}: FeaturedSectionProps) {
  const searchParams = useSearchParams();
  const ts = useTranslations("search");
  const reduceMotion = usePrefersReducedMotion();

  const [filter, setFilter] = useState<Filter>(() => filterFromSearchParams(searchParams));
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortMode, setSortMode] = useState<SearchSort>(() => sortFromSearchParams(searchParams));
  const [animationType, setAnimationType] = useState<"slide" | "fade">("fade");
  const [searchInput, setSearchInput] = useState(filter.search ?? "");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLElement>(null);

  const page = Number(searchParams.get("page") ?? "1");
  const queryFilter = useMemo(
    () => ({ ...filter, page, limit: PAGE_SIZE, sort: sortMode }),
    [filter, page, sortMode],
  );
  const districtsQuery = useQuery({
    queryKey: ["cafe-districts", locale],
    queryFn: () => getCafeDistricts(locale),
    enabled: deferData,
    staleTime: 60 * 60 * 1000,
  });
  const cafesQuery = useQuery({
    queryKey: cafeListQueryKey(queryFilter, locale),
    queryFn: async ({ signal }) => {
      if (queryFilter.nearMe && queryFilter.lat != null && queryFilter.lng != null) {
        const nearbyCafes = await getNearbyCafes(
          queryFilter.lat,
          queryFilter.lng,
          queryFilter.radiusKm ?? 2,
          locale,
        );
        const nextCafes = filterNearbyCafes(nearbyCafes, queryFilter);
        return {
          cafes: nextCafes,
          meta: { total: nextCafes.length, page: 1, limit: nextCafes.length, totalPages: 1 },
        };
      }

      return getCafesWithMeta(queryFilter, locale, { signal });
    },
    enabled: deferData,
    staleTime: 30_000,
    placeholderData: keepPreviousData,
  });
  const activeCafes = deferData ? (cafesQuery.data?.cafes ?? cafes) : cafes;
  const activeDistricts = deferData ? (districtsQuery.data ?? districts) : districts;
  const activeMeta = deferData ? cafesQuery.data?.meta : serverMeta;
  const dataLoading = useMinimumLoading(deferData && cafesQuery.isFetching, 900);
  const dataError = deferData && cafesQuery.isError;

  const updateUrl = useCallback(
    (newFilter: Filter, newSort: SearchSort, newPage: number) => {
      const params = buildSearchParams(newFilter, newSort, newPage);
      const query = params.toString();
      window.history.pushState(null, "", query ? `${window.location.pathname}?${query}` : window.location.pathname);
      if (query && hasActiveSearchFilters(newFilter)) {
        setLastSearchState({
          query: newFilter.search,
          filter: newFilter,
          sort: newSort,
          params: query,
        });
      }
    },
    [],
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
    resultsRef.current?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
  }

  function handleSearchSubmit() {
    const newFilter = { ...filter, search: searchInput.trim() || undefined };
    handleFilterChange(newFilter);
  }

  function handlePageChange(newPage: number) {
    setAnimationType("fade");
    updateUrl(filter, sortMode, newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleSortChange(newSort: SearchSort) {
    setSortMode(newSort);
    updateUrl(filter, newSort, 1);
    resultsRef.current?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
  }

  function handleViewModeChange(nextMode: ViewMode) {
    if (nextMode === viewMode) return;
    setAnimationType("slide");
    setViewMode(nextMode);
  }

  const filtered = useMemo(() => {
    // Server already filtered — only apply location checks that require browser coordinates.
    if (activeMeta) {
      let result = activeCafes;
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
    }

    let result = activeCafes;
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
    if (openNow) result = result.filter(isCafeOpenNow);
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
  }, [activeCafes, filter, activeMeta]);

  const sorted = useMemo(() => {
    if (sortMode === "rating") {
      return [...filtered].sort((a, b) => cafeRating(b) - cafeRating(a));
    }
    if (sortMode === "popular") {
      return [...filtered].sort((a, b) => cafePopularity(b) - cafePopularity(a));
    }
    if (sortMode === "newest") {
      return [...filtered].sort((a, b) => cafeCreatedTime(b) - cafeCreatedTime(a));
    }
    return filtered;
  }, [filtered, sortMode]);

  // When serverMeta is present, API already paginated the data — use server total and render cafes as-is
  const total = activeMeta ? activeMeta.total : sorted.length;
  const paginated = activeMeta ? sorted : sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const sortLabel =
    sortMode === "rating"
      ? ts("sortRating")
      : sortMode === "newest"
        ? ts("sortNewest")
        : ts("sortPopular");

  const headerMotion = reduceMotion
    ? { initial: { opacity: 1 }, animate: { opacity: 1 }, transition: { duration: 0 } }
    : {
        initial: { opacity: 0, y: 18 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.52, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
      };

  return (
    <div className="relative isolate min-h-screen w-full max-w-full overflow-x-hidden bg-[var(--background)] text-[var(--foreground)]">
      <div className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(circle_at_12%_0%,rgba(200,132,42,0.12),transparent_32%),radial-gradient(circle_at_86%_10%,rgba(122,158,126,0.12),transparent_30%),linear-gradient(180deg,var(--background)_0%,#fffaf2_44%,var(--background-secondary)_100%)]" />
      <div className="pointer-events-none absolute inset-0 -z-10 [background-image:url('data:image/svg+xml,%3Csvg_viewBox=%220_0_160_160%22_xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter_id=%22n%22%3E%3CfeTurbulence_type=%22fractalNoise%22_baseFrequency=%220.72%22_numOctaves=%223%22_stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect_width=%22100%25%22_height=%22100%25%22_filter=%22url(%23n)%22_opacity=%220.36%22/%3E%3C/svg%3E')] opacity-[0.035] mix-blend-multiply" />

      <FeaturedSectionControls
        activeDistricts={activeDistricts}
        filter={filter}
        headerMotion={headerMotion}
        searchInput={searchInput}
        searchInputRef={searchInputRef}
        setSearchInput={setSearchInput}
        ts={ts}
        onFilterChange={handleFilterChange}
        onSearchSubmit={handleSearchSubmit}
      />

      <main ref={resultsRef} className="mx-auto max-w-7xl scroll-mt-24 px-4 pt-4 pb-12 sm:px-6 sm:pt-6 lg:px-8">
        <FeaturedSectionToolbar
          reduceMotion={reduceMotion}
          sortLabel={sortLabel}
          sortMode={sortMode}
          total={total}
          ts={ts}
          viewMode={viewMode}
          onSortChange={handleSortChange}
          onViewModeChange={handleViewModeChange}
        />

        <FeaturedSectionResults
          animationType={animationType}
          dataError={dataError}
          dataLoading={dataLoading}
          locale={locale}
          page={page}
          paginated={paginated}
          reduceMotion={reduceMotion}
          total={total}
          ts={ts}
          viewMode={viewMode}
          onPageChange={handlePageChange}
          onRetry={() => void cafesQuery.refetch()}
        />
      </main>
    </div>
  );
}
