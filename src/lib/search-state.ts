import type { CafeFilter } from "@/types/cafe"

export const LAST_SEARCH_STORAGE_KEY = "cafemaps_last_search"

export type SearchSort = "popular" | "rating" | "newest"

export interface LastSearchState {
  query?: string
  filter: CafeFilter
  sort: SearchSort
  params: string
}

export function splitParam(value: string | null): string[] | undefined {
  if (!value) return undefined
  const items = value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
  return items.length ? items : undefined
}

type SearchParamsReader = Pick<URLSearchParams, "get" | "getAll">

export function filterFromSearchParams(searchParams: SearchParamsReader): CafeFilter {
  const vibes =
    splitParam(searchParams.get("tags")) ??
    splitParam(searchParams.get("vibes")) ??
    searchParams.getAll("vibe")
  const purposes = splitParam(searchParams.get("purposes")) ?? searchParams.getAll("purpose")
  const rawSort = searchParams.get("sort")
  const sort: SearchSort | undefined =
    rawSort === "rating" || rawSort === "newest" || rawSort === "popular" ? rawSort : undefined
  const rawPage = searchParams.get("page")
  const page = rawPage ? Number(rawPage) : undefined

  return {
    search: searchParams.get("search") ?? undefined,
    vibes: vibes.length ? vibes : undefined,
    purposes: purposes.length ? purposes : undefined,
    district: searchParams.get("district") ?? undefined,
    priceRange: searchParams.get("priceRange") ?? undefined,
    openNow:
      searchParams.get("open") === "true" || searchParams.get("openNow") === "true" || undefined,
    nearMe: searchParams.get("nearMe") === "true" || undefined,
    lat: searchParams.get("lat") ? Number(searchParams.get("lat")) : undefined,
    lng: searchParams.get("lng") ? Number(searchParams.get("lng")) : undefined,
    radiusKm: searchParams.get("radiusKm") ? Number(searchParams.get("radiusKm")) : undefined,
    sort,
    page: page && page > 0 ? page : undefined,
  }
}

export function sortFromSearchParams(searchParams: SearchParamsReader): SearchSort {
  const sort = searchParams.get("sort")
  if (sort === "rating" || sort === "newest") return sort
  return "popular"
}

export function buildSearchParams(filter: CafeFilter, sort: SearchSort, page = 1): URLSearchParams {
  const params = new URLSearchParams()

  if (filter.search) params.set("search", filter.search)
  if (filter.vibes?.length) params.set("tags", filter.vibes.join(","))
  if (filter.purposes?.length) params.set("purposes", filter.purposes.join(","))
  if (filter.district) params.set("district", filter.district)
  if (filter.priceRange) params.set("priceRange", filter.priceRange)
  if (filter.openNow) params.set("open", "true")
  if (filter.nearMe) params.set("nearMe", "true")
  if (filter.lat !== undefined) params.set("lat", String(filter.lat))
  if (filter.lng !== undefined) params.set("lng", String(filter.lng))
  if (filter.radiusKm !== undefined) params.set("radiusKm", String(filter.radiusKm))
  params.set("sort", sort)
  if (page > 1) params.set("page", String(page))

  return params
}

export function hasActiveSearchFilters(filter: CafeFilter): boolean {
  return Boolean(
    filter.search ||
      filter.vibes?.length ||
      filter.purposes?.length ||
      filter.district ||
      filter.priceRange ||
      filter.openNow ||
      filter.nearMe,
  )
}

export function getLastSearchState(): LastSearchState | null {
  try {
    const raw = window.localStorage.getItem(LAST_SEARCH_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<LastSearchState>
    if (!parsed.params) return null
    return {
      query: parsed.query,
      filter: parsed.filter ?? {},
      sort: parsed.sort ?? "popular",
      params: parsed.params,
    }
  } catch {
    return null
  }
}

export function setLastSearchState(state: LastSearchState) {
  window.localStorage.setItem(LAST_SEARCH_STORAGE_KEY, JSON.stringify(state))
}

export function clearLastSearchState() {
  window.localStorage.removeItem(LAST_SEARCH_STORAGE_KEY)
}
