import type { Cafe, CafeFilter } from "@/types/cafe"

export function fallbackCafes(_filter?: CafeFilter): Cafe[] {
  void _filter
  return []
}

export function paginateFallbackCafes(filter?: CafeFilter) {
  return {
    cafes: [],
    meta: {
      total: 0,
      page: filter?.page ?? 1,
      limit: filter?.limit ?? 12,
      totalPages: 0,
    },
  }
}

export function fallbackCafeBySlug(_slug: string): Cafe | null {
  void _slug
  return null
}

export function fallbackDistricts(): string[] {
  return []
}
