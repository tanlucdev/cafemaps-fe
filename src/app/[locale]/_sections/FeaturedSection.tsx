"use client"

import { useState, useMemo, useCallback } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import CafeGrid from "@/components/cafe/CafeGrid"
import CafeList from "@/components/cafe/CafeList"
import GuidedFilterBar from "@/components/cafe/GuidedFilterBar"
import Pagination from "@/components/ui/Pagination"
import { LayoutGrid, LayoutList } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Cafe, CafeFilter as Filter, PriceRange } from "@/types/cafe"

type ViewMode = "grid" | "list"

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

  const [filter, setFilter] = useState<Filter>(() => filterFromParams(searchParams))
  const [viewMode, setViewMode] = useState<ViewMode>("grid")
  const [animationType, setAnimationType] = useState<"slide" | "fade">("fade")

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

  function handlePageChange(newPage: number) {
    setAnimationType("fade")
    updateUrl(filter, newPage)
    window.scrollTo({ top: 0, behavior: "smooth" })
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

  const total = filtered.length
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <>
      <GuidedFilterBar filter={filter} onChange={handleFilterChange} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex items-center justify-between mb-4 gap-4">
          <p className="text-sm text-(--foreground-muted)">
            {total > 0 ? `${total} quán` : "Không tìm thấy quán nào"}
          </p>
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

        {viewMode === "grid" ? (
          <CafeGrid key={`${page}-${animationType}`} cafes={paginated} locale={locale} animationType={animationType} />
        ) : (
          <CafeList key={`${page}-${animationType}`} cafes={paginated} locale={locale} animationType={animationType} />
        )}

        <Pagination
          page={page}
          total={total}
          limit={PAGE_SIZE}
          onPageChange={handlePageChange}
        />
      </main>
    </>
  )
}
