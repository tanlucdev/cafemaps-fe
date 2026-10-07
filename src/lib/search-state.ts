import { AREAS, type CafeFilter, type Vibe } from "@/types/cafe"
import { normalizeDistricts, parseDistrictParams, serializeDistricts } from "./district-filter"
import { parseDistrictSearch } from "./district-search"
import { normalizeCafeHoursFilter } from "./opening-hours"

export { parseDistrictSearch } from "./district-search"
export type { DistrictSearchParse } from "./district-search"

export const LAST_SEARCH_STORAGE_KEY = "cafemaps_last_search"

export type SearchSort = "popular" | "rating" | "newest"

export interface LastSearchState {
  query?: string
  filter: CafeFilter
  sort: SearchSort
  params: string
}

const VIBE_PARAM_VALUES: Record<string, string> = {
  "yên tĩnh": "yên tĩnh",
  quiet: "yên tĩnh",
  "nhộn nhịp": "nhộn nhịp",
  lively: "nhộn nhịp",
  vintage: "vintage",
  "hiện đại": "hiện đại",
  modern: "hiện đại",
  "thiên nhiên": "thiên nhiên",
  nature: "thiên nhiên",
  "sáng tạo": "sáng tạo",
  creative: "sáng tạo",
  "lãng mạn": "lãng mạn",
  romantic: "lãng mạn",
  minimalist: "minimalist",
}

const PURPOSE_PARAM_VALUES: Record<string, string> = {
  "làm việc": "làm việc",
  work: "làm việc",
  "học tập": "học tập",
  study: "học tập",
  "hẹn hò": "hẹn hò",
  date: "hẹn hò",
  "họp nhóm": "họp nhóm",
  group: "họp nhóm",
  "chill một mình": "chill một mình",
  solo: "chill một mình",
  "gặp bạn bè": "gặp bạn bè",
  friends: "gặp bạn bè",
  "chụp ảnh": "chụp ảnh",
  "chup anh": "chụp ảnh",
  checkin: "chụp ảnh",
  "check-in": "chụp ảnh",
  photo: "chụp ảnh",
  photo_spot: "chụp ảnh",
  "photo spot": "chụp ảnh",
}

const TAG_PARAM_VALUES: Record<string, string> = {
  "ngoài trời": "ngoài trời",
  outdoor: "ngoài trời",
  "outdoor seating": "ngoài trời",
  "chỗ hút thuốc": "chỗ hút thuốc",
  smoking: "chỗ hút thuốc",
  "smoking allowed": "chỗ hút thuốc",
}

const VIBE_VALUES = Object.values(VIBE_PARAM_VALUES).filter(
  (value, index, values): value is Vibe => values.indexOf(value) === index,
)

function normalizeParamValues(values: string[] | undefined, map: Record<string, string>): string[] | undefined {
  if (!values?.length) return undefined
  const normalized = values.map((value) => map[value.toLowerCase()] ?? map[value] ?? value).filter(Boolean)
  return normalized.length ? normalized : undefined
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
  const tagParams = normalizeParamValues(splitParam(searchParams.get("tags")), TAG_PARAM_VALUES) ?? []
  const legacyVibes = tagParams.filter((tag) => VIBE_VALUES.includes(tag as Vibe))
  const tags = tagParams.filter((tag) => !legacyVibes.includes(tag))
  const vibes =
    normalizeParamValues(splitParam(searchParams.get("vibes")) ?? searchParams.getAll("vibe"), VIBE_PARAM_VALUES) ??
    []
  const allVibes = [...vibes, ...legacyVibes]
  const purposes = normalizeParamValues(
    splitParam(searchParams.get("purposes")) ?? searchParams.getAll("purpose"),
    PURPOSE_PARAM_VALUES,
  )
  const rawSort = searchParams.get("sort")
  const sort: SearchSort | undefined =
    rawSort === "rating" || rawSort === "newest" || rawSort === "popular" ? rawSort : undefined
  const rawPage = searchParams.get("page")
  const page = rawPage ? Number(rawPage) : undefined

  const explicitDistricts = searchParams.get("districts")
  const explicitDistrict = searchParams.get("district")
  const legacySearch = searchParams.get("search") ?? undefined
  const legacyDistrict = parseDistrictSearch(legacySearch ?? "", "vi")
  const hasExplicitDistrict = Boolean(
    normalizeDistricts(splitParam(explicitDistricts), AREAS) ??
      normalizeDistricts(explicitDistrict ? [explicitDistrict] : undefined, AREAS),
  )

  return {
    search: !hasExplicitDistrict && legacyDistrict.matched ? legacyDistrict.search : legacySearch,
    vibes: allVibes.length ? allVibes : undefined,
    purposes: purposes?.length ? purposes : undefined,
    tags: tags.length ? tags : undefined,
    districts: parseDistrictParams(explicitDistricts, explicitDistrict, legacyDistrict?.district, AREAS),
    priceRange: searchParams.get("priceRange") ?? undefined,
    openNow:
      searchParams.get("open") === "true" || searchParams.get("openNow") === "true" || undefined,
    hours: normalizeCafeHoursFilter(searchParams.get("hours")),
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
  if (filter.vibes?.length) params.set("vibes", filter.vibes.join(","))
  if (filter.purposes?.length) params.set("purposes", filter.purposes.join(","))
  if (filter.tags?.length) params.set("tags", filter.tags.join(","))
  const districts = serializeDistricts(filter.districts, AREAS)
  if (districts) params.set("districts", districts)
  if (filter.priceRange) params.set("priceRange", filter.priceRange)
  if (filter.openNow) params.set("open", "true")
  const hours = normalizeCafeHoursFilter(filter.hours)
  if (hours) params.set("hours", hours)
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
      filter.tags?.length ||
      filter.districts?.length ||
      filter.priceRange ||
      filter.openNow ||
      filter.hours ||
      filter.nearMe,
  )
}

export function getLastSearchState(): LastSearchState | null {
  try {
    const raw = window.localStorage.getItem(LAST_SEARCH_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<LastSearchState>
    if (!parsed.params) return null
    const legacyHours = (parsed.filter as { hours?: string } | undefined)?.hours
    const filter: CafeFilter = {
      ...(parsed.filter ?? {}),
      hours: normalizeCafeHoursFilter(legacyHours),
    }
    const sort = parsed.sort ?? "popular"
    const state = {
      query: parsed.query,
      filter,
      sort,
      params: buildSearchParams(filter, sort, filter.page ?? 1).toString(),
    }
    if (state.params !== parsed.params || state.filter.hours !== legacyHours) setLastSearchState(state)
    return state
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
