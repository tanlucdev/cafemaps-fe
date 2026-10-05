import type { Cafe, CafeFilter } from "@/types/cafe"
import { MOCK_CAFES } from "@/lib/mock-data"
import { isCafeOpenNow, matchesCafeHours } from "@/lib/opening-hours"
import { normalizeLabelKey, withInferredTags, type RawCafe } from "./mapper"

export function fallbackCafes(filter?: CafeFilter): Cafe[] {
  let result = MOCK_CAFES
  const { search, district, vibes, purposes, tags, priceRange, sort } = filter ?? {}

  if (search?.trim()) {
    const q = search.toLowerCase()
    result = result.filter(
      (cafe) =>
        cafe.name.toLowerCase().includes(q) ||
        (cafe.address ?? "").toLowerCase().includes(q) ||
        (cafe.district ?? "").toLowerCase().includes(q)
    )
  }
  if (district) result = result.filter((cafe) => cafe.district === district)
  if (vibes?.length) result = result.filter((cafe) => vibes.some((vibe) => cafe.vibes.includes(vibe)))
  if (purposes?.length) {
    result = result.filter((cafe) => purposes.some((purpose) => cafe.purposes.includes(purpose)))
  }
  if (tags?.length) {
    result = result.filter((cafe) => {
      const cafeTags = withInferredTags(cafe as RawCafe, cafe.tags, "vi").map(normalizeLabelKey)
      return tags.some((tag) => cafeTags.includes(normalizeLabelKey(tag)))
    })
  }
  if (priceRange) {
    result = result.filter((cafe) => {
      const min = cafe.priceMin ?? 0
      const max = cafe.priceMax ?? min
      if (priceRange === "under_50k") return min < 50000
      if (priceRange === "price_50k_100k" || priceRange === "50k_100k") return min <= 100000 && max >= 50000
      if (priceRange === "price_100k_150k" || priceRange === "100k_150k") return min <= 150000 && max >= 100000
      if (priceRange === "above_150k") return max > 150000
      return true
    })
  }
  if (filter?.openNow) result = result.filter(isCafeOpenNow)
  if (filter?.hours) result = result.filter((cafe) => matchesCafeHours(cafe, filter.hours))

  if (sort === "newest") return [...result].reverse()
  return result
}

export function paginateFallbackCafes(filter?: CafeFilter) {
  const cafes = fallbackCafes(filter)
  const page = filter?.page ?? 1
  const limit = filter?.limit ?? (cafes.length || 12)
  const start = (page - 1) * limit
  const paginated = cafes.slice(start, start + limit)

  return {
    cafes: paginated,
    meta: {
      total: cafes.length,
      page,
      limit,
      totalPages: Math.ceil(cafes.length / limit),
    },
  }
}

export function fallbackCafeBySlug(slug: string): Cafe | null {
  return MOCK_CAFES.find((cafe) => cafe.slug === slug) ?? null
}

export function fallbackDistricts(): string[] {
  return [...new Set(MOCK_CAFES.map((cafe) => cafe.district).filter(Boolean) as string[])].sort()
}
