"use client";

import { useEffect, useMemo } from "react";
import { useTranslations } from "next-intl";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import type { Cafe, CafeFilter as Filter } from "@/types/cafe";
import { isCafeOpenNow, matchesCafeHours } from "@/lib/opening-hours";
import { includesDistrict } from "@/lib/district-filter";
import FeaturedSectionControls from "../FeaturedSectionControls";
import FeaturedSectionResults from "../FeaturedSectionResults";
import FeaturedSectionToolbar from "../FeaturedSectionToolbar";
import {
  cafeCreatedTime,
  compareCafePopularity,
  cafeRating,
  clampDiscoveryPage,
  displayDiscoveryTotal,
  haversineKm,
  type ServerMeta,
} from "../featured-section-helpers";
import { useFeaturedSectionData } from "../useFeaturedSectionData";
import { useMinimumLoading } from "../useMinimumLoading";
import { useFeaturedSectionState } from "./useFeaturedSectionState";

interface FeaturedSectionProps {
  cafes: Cafe[];
  locale: string;
  districts?: string[];
  serverMeta?: ServerMeta;
  serverFilter?: Filter;
  deferData?: boolean;
}

export default function FeaturedSection({
  cafes,
  locale,
  districts,
  serverMeta,
  serverFilter,
  deferData = false,
}: FeaturedSectionProps) {
  const ts = useTranslations("search");
  const reduceMotion = usePrefersReducedMotion();
  const {
    animationType,
    canAnimate,
    clampPage,
    filter,
    handleFilterChange,
    handlePageChange,
    handleSearchSubmit,
    handleSortChange,
    handleViewModeChange,
    page,
    pageSize,
    resultsRef,
    searchInput,
    searchInputRef,
    setSearchInput,
    sortMode,
    viewMode,
  } = useFeaturedSectionState(locale, reduceMotion);
  const queryFilter = useMemo(
    () => ({ ...filter, page, limit: pageSize, sort: sortMode }),
    [filter, page, pageSize, sortMode],
  );
  const { activeCafes, activeDistricts, activeMeta, cafesQuery, dataError, shouldFetchCafes } =
    useFeaturedSectionData({
      cafes,
      deferData,
      districts,
      filter: queryFilter,
      locale,
      serverFilter,
      serverMeta,
    });
  const dataLoading = useMinimumLoading(shouldFetchCafes && cafesQuery.isFetching, 900);

  const filtered = useMemo(() => {
    if (activeMeta) return activeCafes;
    let result = activeCafes;
    const { search, districts, vibes, purposes, priceRange, openNow, hours } = filter;
    if (search?.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          (c.address ?? "").toLowerCase().includes(q) ||
          (c.district ?? "").toLowerCase().includes(q),
      );
    }
    if (districts?.length) result = result.filter((c) => includesDistrict(districts, c.district));
    if (vibes?.length) result = result.filter((c) => vibes.some((v) => c.vibes.includes(v)));
    if (purposes?.length)
      result = result.filter((c) => purposes.some((p) => c.purposes.includes(p)));
    if (priceRange)
      result = result.filter((c) => {
        const min = c.priceMin ?? 0;
        const max = c.priceMax ?? min;
        if (priceRange === "under_50k") return min < 50000;
        if (priceRange === "price_50k_100k" || priceRange === "50k_100k")
          return min <= 100000 && max >= 50000;
        if (priceRange === "price_100k_150k" || priceRange === "100k_150k")
          return min <= 150000 && max >= 100000;
        return priceRange !== "above_150k" || max > 150000;
      });
    if (openNow) result = result.filter(isCafeOpenNow);
    if (hours) result = result.filter((cafe) => matchesCafeHours(cafe, hours));
    if (filter.nearMe && filter.lat !== undefined && filter.lng !== undefined) {
      const radius = filter.radiusKm ?? 2;
      if (result.some((c) => c.lat != null && c.lng != null))
        result = result.filter(
          (c) =>
            c.lat != null &&
            c.lng != null &&
            haversineKm(filter.lat!, filter.lng!, c.lat, c.lng) <= radius,
        );
    }
    return result;
  }, [activeCafes, activeMeta, filter]);

  const sorted = useMemo(() => {
    if (activeMeta) return activeCafes;
    if (sortMode === "rating") return [...filtered].sort((a, b) => cafeRating(b) - cafeRating(a));
    if (sortMode === "popular")
      return [...filtered].sort(compareCafePopularity);
    if (sortMode === "newest")
      return [...filtered].sort((a, b) => cafeCreatedTime(b) - cafeCreatedTime(a));
    return filtered;
  }, [activeCafes, activeMeta, filtered, sortMode]);

  const total = activeMeta ? displayDiscoveryTotal(activeMeta) : sorted.length;
  const paginationTotal = total;
  const previewTotal = activeMeta?.discovery?.previewTotal;
  const maxAccessiblePage =
    typeof previewTotal === "number" ? Math.ceil(previewTotal / pageSize) : undefined;
  const paginated = activeMeta ? sorted : sorted.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => {
    const clampedPage = clampDiscoveryPage(page, activeMeta);
    if (clampedPage !== page) {
      clampPage(clampedPage);
    }
  }, [activeMeta, clampPage, page]);
  const sortLabel =
    sortMode === "rating"
      ? ts("sortRating")
      : sortMode === "newest"
        ? ts("sortNewest")
        : ts("sortPopular");
  const headerMotion =
    canAnimate && !reduceMotion
      ? {
          initial: false,
          animate: { opacity: 1 },
          whileHover: { y: -1 },
          transition: {
            duration: 0.18,
            ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
          },
        }
      : { initial: false, animate: { opacity: 1 }, transition: { duration: 0 } };

  return (
    <div className="relative isolate min-h-[100svh] w-full max-w-full overflow-x-hidden bg-[var(--background)] text-[var(--foreground)]">
      <div className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(circle_at_12%_0%,rgba(200,132,42,0.12),transparent_32%),radial-gradient(circle_at_86%_10%,rgba(122,158,126,0.12),transparent_30%),linear-gradient(180deg,var(--background)_0%,var(--surface)_44%,var(--background-secondary)_100%)]" />
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
      <main
        ref={resultsRef}
        className="mx-auto max-w-7xl scroll-mt-24 px-4 pt-4 pb-[calc(var(--mobile-bottom-nav-height)+env(safe-area-inset-bottom,0px)+1.5rem)] sm:px-6 sm:pt-6 md:pb-12 lg:px-8"
      >
        <FeaturedSectionToolbar
          reduceMotion={reduceMotion}
          sortLabel={sortLabel}
          sortMode={sortMode}
          total={total}
          loading={dataLoading}
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
          pageSize={pageSize}
          paginated={paginated}
          paginationTotal={paginationTotal}
          maxAccessiblePage={maxAccessiblePage}
          teaserSlots={activeMeta?.discovery?.teaserSlots ?? 0}
          reduceMotion={reduceMotion}
          canAnimate={canAnimate}
          serverBacked={Boolean(activeMeta)}
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
