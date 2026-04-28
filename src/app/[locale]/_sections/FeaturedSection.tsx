"use client"

import { useState, useMemo, useCallback, useRef } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useLenis } from "@/components/providers/LenisProvider"
import { useTranslations } from "next-intl"
import CafeGrid from "@/components/cafe/CafeGrid"
import CafeList from "@/components/cafe/CafeList"
import GuidedFilterBar from "@/components/cafe/GuidedFilterBar"
import Pagination from "@/components/ui/Pagination"
import { LayoutGrid, LayoutList, Search, Coffee } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Cafe, CafeFilter as Filter, PriceRange } from "@/types/cafe"

type ViewMode = "grid" | "list"
type SortMode = "default" | "rating" | "newest"

const PAGE_SIZE = 10

interface FeaturedSectionProps {
  cafes: Cafe[]
  locale: string
}

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371
  const dLat = (lat2 - lat1) * (Math.PI / 180)
  const dLng = (lng2 - lng1) * (Math.PI / 180)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

function filterFromParams(searchParams: ReturnType<typeof useSearchParams>): Filter {
  return {
    search: searchParams.get("search") ?? undefined,
    vibe: searchParams.get("vibe") ? searchParams.get("vibe")!.split(",") : undefined,
    purpose: searchParams.get("purpose") ? searchParams.get("purpose")!.split(",") : undefined,
    district: searchParams.get("district") ?? undefined,
    ward: searchParams.get("ward") ?? undefined,
    priceRange: (searchParams.get("price") as PriceRange) ?? undefined,
  }
}

export default function FeaturedSection({ cafes, locale }: FeaturedSectionProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const lenis = useLenis()
  const ts = useTranslations("search")

  const [filter, setFilter] = useState<Filter>(() => filterFromParams(searchParams))
  const [viewMode, setViewMode] = useState<ViewMode>("grid")
  const [sortMode, setSortMode] = useState<SortMode>("default")
  const [animationType, setAnimationType] = useState<"slide" | "fade">("fade")
  const [searchInput, setSearchInput] = useState(filter.search ?? "")
  const searchInputRef = useRef<HTMLInputElement>(null)

  const page = Number(searchParams.get("page") ?? "1")

  const updateUrl = useCallback(
    (newFilter: Filter, newPage: number) => {
      const params = new URLSearchParams()
      if (newFilter.search) params.set("search", newFilter.search)
      if (newFilter.vibe?.length) params.set("vibe", newFilter.vibe.join(","))
      if (newFilter.purpose?.length) params.set("purpose", newFilter.purpose.join(","))
      if (newFilter.district) params.set("district", newFilter.district)
      if (newFilter.ward) params.set("ward", newFilter.ward)
      if (newFilter.priceRange) params.set("price", newFilter.priceRange)
      if (newPage > 1) params.set("page", String(newPage))
      const query = params.toString()
      router.replace(query ? `?${query}` : "?", { scroll: false })
    },
    [router]
  )

  function handleFilterChange(newFilter: Filter) {
    setFilter(newFilter)
    setAnimationType("slide")
    updateUrl(newFilter, 1)
  }

  function handleSearchSubmit() {
    const newFilter = { ...filter, search: searchInput.trim() || undefined }
    handleFilterChange(newFilter)
  }

  function handlePageChange(newPage: number) {
    setAnimationType("fade")
    updateUrl(filter, newPage)
    if (lenis) lenis.scrollTo(0, { duration: 0.6 })
    else window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const filtered = useMemo(() => {
    let result = cafes
    const { search, district, ward, vibe, purpose, priceRange, nearMe, lat, lng, radiusKm } = filter

    if (search?.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.address.toLowerCase().includes(q) ||
          c.district.toLowerCase().includes(q)
      )
    }
    if (district) result = result.filter((c) => c.district === district)
    if (ward) result = result.filter((c) => (c as Cafe & { ward?: string }).ward === ward)
    if (vibe?.length) result = result.filter((c) => vibe.some((v) => c.vibe.includes(v)))
    if (purpose?.length) result = result.filter((c) => purpose.some((p) => c.purpose.includes(p)))
    if (priceRange) result = result.filter((c) => c.priceRange === priceRange)
    if (nearMe && lat != null && lng != null && radiusKm) {
      result = result.filter((c) => haversineKm(lat, lng, c.lat, c.lng) <= radiusKm)
    }

    return result
  }, [cafes, filter])

  const sorted = useMemo(() => {
    if (sortMode === "rating") {
      return [...filtered].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
    }
    if (sortMode === "newest") {
      return [...filtered].sort((a, b) => {
        const da = a.createdAt ? new Date(a.createdAt).getTime() : 0
        const db = b.createdAt ? new Date(b.createdAt).getTime() : 0
        return db - da
      })
    }
    return filtered
  }, [filtered, sortMode])

  const total = sorted.length
  const paginated = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <>
      {/* Search bar at top of search page */}
      <div className="bg-(--background-secondary) border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex gap-2 max-w-xl">
            <div className="flex-1 relative">
              <Search
                size={15}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-(--foreground-muted)"
              />
              <input
                ref={searchInputRef}
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearchSubmit()}
                placeholder={ts("placeholder")}
                className="w-full h-10 rounded-xl border border-border bg-background text-foreground text-sm pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-accent transition-all"
              />
            </div>
            <button
              onClick={handleSearchSubmit}
              className="h-10 px-5 rounded-xl bg-accent text-white text-sm font-medium hover:bg-(--accent-hover) transition-colors shrink-0"
            >
              {ts("button")}
            </button>
          </div>
        </div>
      </div>

      <GuidedFilterBar filter={filter} onChange={handleFilterChange} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        {/* Toolbar: results count + sort + view toggle */}
        <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
          <p className="text-sm text-(--foreground-muted)">
            {total > 0
              ? `${total} quán`
              : null}
          </p>

          <div className="flex items-center gap-2 ml-auto">
            {/* Sort selector */}
            <select
              value={sortMode}
              onChange={(e) => setSortMode(e.target.value as SortMode)}
              className="h-8 px-2 rounded-lg border border-border bg-background text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-accent cursor-pointer"
              aria-label={ts("sortLabel")}
            >
              <option value="default">{ts("sortDefault")}</option>
              <option value="rating">{ts("sortRating")}</option>
              <option value="newest">{ts("sortNewest")}</option>
            </select>

            {/* View toggle */}
            <div className="flex items-center border border-border rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                title="Grid view"
                className={cn(
                  "p-1.5 transition-colors",
                  viewMode === "grid"
                    ? "bg-accent text-white"
                    : "text-(--foreground-muted) hover:text-accent"
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
                    : "text-(--foreground-muted) hover:text-accent"
                )}
              >
                <LayoutList size={15} />
              </button>
            </div>
          </div>
        </div>

        {total === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
            <Coffee size={40} className="text-(--foreground-muted) opacity-40" />
            <p className="text-(--foreground-muted) text-base font-medium">
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
  )
}
