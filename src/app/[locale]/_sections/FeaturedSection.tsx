"use client";

import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "@/i18n/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import CafeGrid from "@/components/cafe/CafeGrid";
import CafeList from "@/components/cafe/CafeList";
import GuidedFilterBar from "@/components/cafe/GuidedFilterBar";
import Pagination from "@/components/ui/Pagination";
import { Coffee, Search, LayoutGrid, LayoutList } from "lucide-react";
import type { Cafe, CafeFilter as Filter } from "@/types/cafe";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import {
  buildSearchParams,
  filterFromSearchParams,
  hasActiveSearchFilters,
  setLastSearchState,
  sortFromSearchParams,
  type SearchSort,
} from "@/lib/search-state";
import { isCafeOpenNow } from "@/lib/opening-hours";
import { getCafeRatingValue } from "@/lib/cafe-rating";
import { getCafeDistricts, getCafesWithMeta, getNearbyCafes } from "@/lib/api";

type ViewMode = "grid" | "list";

const PAGE_SIZE = 9;

interface ServerMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface FeaturedSectionProps {
  cafes: Cafe[];
  locale: string;
  districts?: string[];
  serverMeta?: ServerMeta;
  deferData?: boolean;
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

function numericScore(value: number | null | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function cafeRating(cafe: Cafe): number {
  return getCafeRatingValue(cafe) ?? 0;
}

function cafePopularity(cafe: Cafe): number {
  const featuredScore = cafe.isFeatured ? 1_000_000 : 0;
  const featuredOrderScore = cafe.featuredOrder != null ? 100_000 - cafe.featuredOrder : 0;
  const savedScore = numericScore(cafe.savedCount) * 10;
  const reviewScore = numericScore(cafe.reviewCount) * 5;
  const viewScore = numericScore(cafe.viewCount);
  return (
    featuredScore + featuredOrderScore + savedScore + reviewScore + viewScore + cafeRating(cafe)
  );
}

function cafeCreatedTime(cafe: Cafe): number {
  const value = cafe.createdAt ? new Date(cafe.createdAt).getTime() : 0;
  return Number.isFinite(value) ? value : 0;
}

function filterNearbyCafes(cafes: Cafe[], filter: Filter): Cafe[] {
  return cafes.filter((cafe) => {
    if (filter.openNow && !isCafeOpenNow(cafe)) return false;
    if (filter.vibes?.length && !filter.vibes.some((vibe) => cafe.vibes.includes(vibe)))
      return false;
    if (
      filter.purposes?.length &&
      !filter.purposes.some((purpose) => cafe.purposes.includes(purpose))
    ) {
      return false;
    }
    if (filter.tags?.length && !filter.tags.some((tag) => cafe.tags.includes(tag))) return false;
    if (filter.district && cafe.district !== filter.district) return false;
    return true;
  });
}

export default function FeaturedSection({
  cafes,
  locale,
  districts,
  serverMeta,
  deferData = false,
}: FeaturedSectionProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const ts = useTranslations("search");
  const reduceMotion = useReducedMotion();

  const [filter, setFilter] = useState<Filter>(() => filterFromSearchParams(searchParams));
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortMode, setSortMode] = useState<SearchSort>(() => sortFromSearchParams(searchParams));
  const [animationType, setAnimationType] = useState<"slide" | "fade">("fade");
  const [searchInput, setSearchInput] = useState(filter.search ?? "");
  const [clientCafes, setClientCafes] = useState(cafes);
  const [clientDistricts, setClientDistricts] = useState(districts);
  const [clientMeta, setClientMeta] = useState(serverMeta);
  const [dataLoading, setDataLoading] = useState(deferData);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const page = Number(searchParams.get("page") ?? "1");
  const activeCafes = deferData ? clientCafes : cafes;
  const activeDistricts = deferData ? clientDistricts : districts;
  const activeMeta = deferData ? clientMeta : serverMeta;

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

  useEffect(() => {
    if (!deferData) return;
    let alive = true;
    const nextFilter = filterFromSearchParams(searchParams);

    async function loadSearchData() {
      setDataLoading(true);
      const nextDistrictsPromise = getCafeDistricts(locale);

      if (nextFilter.nearMe && nextFilter.lat != null && nextFilter.lng != null) {
        const nearbyCafes = await getNearbyCafes(
          nextFilter.lat,
          nextFilter.lng,
          nextFilter.radiusKm ?? 2,
          locale,
        );
        const nextCafes = filterNearbyCafes(nearbyCafes, nextFilter);
        const nextDistricts = await nextDistrictsPromise;
        if (!alive) return;
        setClientCafes(nextCafes);
        setClientDistricts(nextDistricts);
        setClientMeta({ total: nextCafes.length, page: 1, limit: nextCafes.length, totalPages: 1 });
        setDataLoading(false);
        return;
      }

      const [nextDistricts, nextResult] = await Promise.all([
        nextDistrictsPromise,
        getCafesWithMeta({ ...nextFilter, limit: PAGE_SIZE }, locale, { cache: "no-store" }),
      ]);
      if (!alive) return;
      setClientCafes(nextResult.cafes);
      setClientDistricts(nextDistricts);
      setClientMeta(nextResult.meta);
      setDataLoading(false);
    }

    void loadSearchData();
    return () => {
      alive = false;
    };
  }, [deferData, locale, searchParams]);

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
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleSortChange(newSort: SearchSort) {
    setSortMode(newSort);
    updateUrl(filter, newSort, 1);
  }

  function handleViewModeChange(nextMode: ViewMode) {
    if (nextMode === viewMode) return;
    setAnimationType("fade");
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
    <div className="relative isolate min-h-screen overflow-hidden bg-[var(--background)] text-[var(--foreground)]">
      <div className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(circle_at_12%_0%,rgba(200,132,42,0.12),transparent_32%),radial-gradient(circle_at_86%_10%,rgba(122,158,126,0.12),transparent_30%),linear-gradient(180deg,var(--background)_0%,#fffaf2_44%,var(--background-secondary)_100%)]" />
      <div className="pointer-events-none absolute inset-0 -z-10 [background-image:url('data:image/svg+xml,%3Csvg_viewBox=%220_0_160_160%22_xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter_id=%22n%22%3E%3CfeTurbulence_type=%22fractalNoise%22_baseFrequency=%220.72%22_numOctaves=%223%22_stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect_width=%22100%25%22_height=%22100%25%22_filter=%22url(%23n)%22_opacity=%220.36%22/%3E%3C/svg%3E')] opacity-[0.035] mix-blend-multiply" />

      {/* ── Search + Filter block ── */}
      <section className="relative z-30 border-b border-[var(--border)] bg-[#fffaf2]/82 pt-7 pb-4 shadow-[0_12px_34px_rgba(44,26,14,0.06)] backdrop-blur-xl sm:pt-9 sm:pb-5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div {...headerMotion} className="max-w-3xl pb-5">
            <p className="mb-2 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--accent-light)] px-3 py-1.5 text-xs font-bold text-[var(--accent)] shadow-[var(--shadow-sm)] backdrop-blur-md">
              <Coffee size={13} aria-hidden /> CafeMaps search
            </p>
            <h1 className="font-lora text-[34px] leading-tight font-bold text-[var(--foreground)] sm:text-[44px]">
              Tìm quán phù hợp hôm nay
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 font-medium text-[var(--foreground-muted)] sm:text-base">
              Lọc theo mood, khu vực, mức giá và trạng thái mở cửa.
            </p>
          </motion.div>

          {/* Search bar */}
          <motion.div {...headerMotion} className="pb-3">
            <div className="flex max-w-2xl items-center overflow-hidden rounded-full border border-[var(--border)] bg-white/78 shadow-[var(--shadow-sm)] backdrop-blur-md transition-colors outline-none focus-within:border-[var(--accent)] focus-within:ring-2 focus-within:ring-[var(--accent)]/16 dark:bg-[var(--card)]">
              <div className="flex shrink-0 items-center pl-4 text-[var(--foreground-muted)]">
                <Search size={16} />
              </div>
              <input
                ref={searchInputRef}
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearchSubmit()}
                placeholder={ts("placeholder")}
                className="flex-1 appearance-none border-0 bg-transparent py-3 pr-2 pl-3 text-[13.5px] text-[var(--foreground)] shadow-none ring-0 outline-0 placeholder:text-[var(--foreground-muted)] focus:border-0 focus:shadow-none focus:ring-0 focus:outline-none"
              />
              <button
                onClick={handleSearchSubmit}
                className="m-1.5 shrink-0 cursor-pointer rounded-full bg-[var(--accent)] px-5 py-2 text-[13px] font-black text-white shadow-[0_10px_24px_rgba(200,132,42,0.18)] transition-transform hover:-translate-y-px hover:scale-[1.02] hover:bg-[var(--accent-hover)] focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] active:scale-95"
              >
                {ts("button")}
              </button>
            </div>
          </motion.div>

          {/* Filter bar — inline, same background block */}
          <div className="sticky top-16 z-50 -mx-2 rounded-[24px] border border-[var(--border)] bg-[#fffaf2]/90 px-2 shadow-[0_16px_42px_rgba(44,26,14,0.10)] backdrop-blur-xl sm:top-18 sm:mx-0 sm:px-4">
            <GuidedFilterBar
              filter={filter}
              onChange={handleFilterChange}
              districts={activeDistricts}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
            />
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 pt-4 pb-12 sm:px-6 sm:pt-6 lg:px-8">
        {/* Toolbar: results count + sort + view toggle */}
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-[20px] border border-[var(--border)] bg-[#fffaf2]/76 px-3 py-2.5 shadow-[var(--shadow-sm)] backdrop-blur-md sm:rounded-[22px] sm:px-4 sm:py-3">
          <p className="min-w-0 text-sm leading-tight font-medium text-[var(--foreground-muted)]">
            {total > 0 && (
              <>
                Hiển thị <strong className="text-[var(--foreground)]">{total} quán</strong>
              </>
            )}
          </p>
          <div className="ml-auto flex shrink-0 items-center gap-2">
            <Select value={sortMode} onValueChange={(v) => v && handleSortChange(v as SearchSort)}>
              <SelectTrigger
                className="h-9 w-[142px] rounded-full border border-[#e8cfa9] bg-white/86 px-3 text-sm font-black text-[var(--foreground)] shadow-[0_10px_22px_rgba(44,26,14,0.07)] backdrop-blur-md focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/18 focus:ring-offset-0 focus:outline-none sm:h-10 sm:w-[168px] dark:bg-[var(--card)]"
                aria-label={ts("sortLabel")}
              >
                <span className="min-w-0 truncate">{sortLabel}</span>
              </SelectTrigger>
              <SelectContent
                sideOffset={6}
                align="end"
                alignItemWithTrigger={false}
                className="min-w-[224px] rounded-[18px] border border-[#e8cfa9] bg-[#fffaf2]/96 p-1 text-[#2f2116] shadow-[0_18px_48px_rgba(44,26,14,0.14)] ring-0 backdrop-blur-xl"
              >
                <SelectItem
                  value="popular"
                  className="min-h-10 rounded-[13px] px-3.5 py-2 text-sm font-semibold focus:bg-[var(--accent)] focus:text-white data-[highlighted]:bg-[var(--accent)] data-[highlighted]:text-white"
                >
                  {ts("sortPopular")}
                </SelectItem>
                <SelectItem
                  value="rating"
                  className="min-h-10 rounded-[13px] px-3.5 py-2 text-sm font-semibold focus:bg-[var(--accent)] focus:text-white data-[highlighted]:bg-[var(--accent)] data-[highlighted]:text-white"
                >
                  {ts("sortRating")}
                </SelectItem>
                <SelectItem
                  value="newest"
                  className="min-h-10 rounded-[13px] px-3.5 py-2 text-sm font-semibold focus:bg-[var(--accent)] focus:text-white data-[highlighted]:bg-[var(--accent)] data-[highlighted]:text-white"
                >
                  {ts("sortNewest")}
                </SelectItem>
              </SelectContent>
            </Select>
            <div className="relative isolate flex items-center rounded-full border border-[#e8cfa9] bg-white/82 p-0.5 shadow-[0_10px_22px_rgba(44,26,14,0.07)] backdrop-blur-md dark:bg-[var(--card)]">
              <button
                type="button"
                onClick={() => handleViewModeChange("grid")}
                className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-[var(--accent)] sm:h-9 sm:w-9 ${viewMode === "grid" ? `${reduceMotion ? "bg-[var(--accent)] shadow-[0_8px_18px_rgba(200,132,42,0.22)]" : ""} text-white` : "text-[var(--foreground-muted)] hover:text-[var(--foreground)]"}`}
                aria-label="Grid view"
                aria-pressed={viewMode === "grid"}
              >
                {viewMode === "grid" && !reduceMotion && (
                  <motion.span
                    layoutId="featured-view-toggle-thumb"
                    className="absolute inset-0 z-0 rounded-full bg-[var(--accent)] shadow-[0_8px_18px_rgba(200,132,42,0.22)]"
                    transition={{ type: "spring", stiffness: 520, damping: 38, mass: 0.7 }}
                  />
                )}
                <LayoutGrid size={16} className="relative z-10" />
              </button>
              <button
                type="button"
                onClick={() => handleViewModeChange("list")}
                className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-[var(--accent)] sm:h-9 sm:w-9 ${viewMode === "list" ? `${reduceMotion ? "bg-[var(--accent)] shadow-[0_8px_18px_rgba(200,132,42,0.22)]" : ""} text-white` : "text-[var(--foreground-muted)] hover:text-[var(--foreground)]"}`}
                aria-label="List view"
                aria-pressed={viewMode === "list"}
              >
                {viewMode === "list" && !reduceMotion && (
                  <motion.span
                    layoutId="featured-view-toggle-thumb"
                    className="absolute inset-0 z-0 rounded-full bg-[var(--accent)] shadow-[0_8px_18px_rgba(200,132,42,0.22)]"
                    transition={{ type: "spring", stiffness: 520, damping: 38, mass: 0.7 }}
                  />
                )}
                <LayoutList size={16} className="relative z-10" />
              </button>
            </div>
          </div>
        </div>

        {dataLoading ? (
          <CafeGrid cafes={[]} locale={locale} loading desktopColumns="three" />
        ) : total === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-[28px] border border-[var(--border)] bg-[#fffaf2]/78 py-20 text-center shadow-[var(--shadow-sm)] backdrop-blur-md">
            <Coffee size={40} className="text-[var(--accent)]/60" />
            <p className="text-base font-medium text-[var(--foreground-muted)]">
              {ts("noResultsMessage")}
            </p>
          </div>
        ) : (
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={`${viewMode}-${page}-${animationType}`}
              initial={reduceMotion ? false : { opacity: 0, y: 10, scale: 0.992 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.992 }}
              transition={{ duration: reduceMotion ? 0 : 0.22, ease: [0.16, 1, 0.3, 1] }}
            >
              {viewMode === "grid" ? (
                <CafeGrid
                  cafes={paginated}
                  locale={locale}
                  animationType={animationType}
                  desktopColumns="three"
                />
              ) : (
                <CafeList cafes={paginated} locale={locale} animationType={animationType} />
              )}

              <Pagination
                page={page}
                total={total}
                limit={PAGE_SIZE}
                onPageChange={handlePageChange}
              />
            </motion.div>
          </AnimatePresence>
        )}
      </main>
    </div>
  );
}
