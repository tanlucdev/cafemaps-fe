"use client";

import { useState, useMemo, useCallback, useRef } from "react";
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

type ViewMode = "grid" | "list";
type SortMode = "default" | "rating" | "newest";

const PAGE_SIZE = 10;

interface FeaturedSectionProps {
  cafes: Cafe[];
  locale: string;
}

// function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
//   const R = 6371
//   const dLat = (lat2 - lat1) * (Math.PI / 180)
//   const dLng = (lng2 - lng1) * (Math.PI / 180)
//   const a =
//     Math.sin(dLat / 2) ** 2 +
//     Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLng / 2) ** 2
//   return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
// }

function filterFromParams(searchParams: ReturnType<typeof useSearchParams>): Filter {
  return {
    search: searchParams.get("search") ?? undefined,
    vibes: searchParams.get("vibes") ? searchParams.get("vibes")!.split(",") : undefined,
    purposes: searchParams.get("purposes") ? searchParams.get("purposes")!.split(",") : undefined,
    district: searchParams.get("district") ?? undefined,
  };
}

export default function FeaturedSection({ cafes, locale }: FeaturedSectionProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const lenis = useLenis();
  const ts = useTranslations("search");

  const [filter, setFilter] = useState<Filter>(() => filterFromParams(searchParams));
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortMode, setSortMode] = useState<SortMode>("default");
  const [animationType, setAnimationType] = useState<"slide" | "fade">("fade");
  const [searchInput, setSearchInput] = useState(filter.search ?? "");
  const searchInputRef = useRef<HTMLInputElement>(null);

  const page = Number(searchParams.get("page") ?? "1");

  const updateUrl = useCallback(
    (newFilter: Filter, newPage: number) => {
      const params = new URLSearchParams();
      if (newFilter.search) params.set("search", newFilter.search);
      if (newFilter.vibes?.length) params.set("vibes", newFilter.vibes.join(","));
      if (newFilter.purposes?.length) params.set("purposes", newFilter.purposes.join(","));
      if (newFilter.district) params.set("district", newFilter.district);
      if (newPage > 1) params.set("page", String(newPage));
      const query = params.toString();
      router.replace(query ? `?${query}` : "?", { scroll: false });
    },
    [router],
  );

  function handleFilterChange(newFilter: Filter) {
    setFilter(newFilter);
    setAnimationType("slide");
    updateUrl(newFilter, 1);
  }

  function handleSearchSubmit() {
    const newFilter = { ...filter, search: searchInput.trim() || undefined };
    handleFilterChange(newFilter);
  }

  function handlePageChange(newPage: number) {
    setAnimationType("fade");
    updateUrl(filter, newPage);
    if (lenis) lenis.scrollTo(0, { duration: 0.6 });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const filtered = useMemo(() => {
    let result = cafes;
    const { search, district, vibes, purposes } = filter;

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

    return result;
  }, [cafes, filter]);

  const sorted = useMemo(() => {
    if (sortMode === "rating") {
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
          <p className="text-sm text-(--foreground-muted)">{total > 0 ? `${total} quán` : null}</p>

          <div className="ml-auto flex items-center gap-2">
            {/* Sort selector */}
            <select
              value={sortMode}
              onChange={(e) => setSortMode(e.target.value as SortMode)}
              className="border-border bg-background text-foreground focus:ring-accent h-8 cursor-pointer rounded-lg border px-2 text-xs focus:ring-1 focus:outline-none"
              aria-label={ts("sortLabel")}
            >
              <option value="default">{ts("sortDefault")}</option>
              <option value="rating">{ts("sortRating")}</option>
              <option value="newest">{ts("sortNewest")}</option>
            </select>

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
