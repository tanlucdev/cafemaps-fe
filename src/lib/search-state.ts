import { AREAS, type CafeFilter, type Vibe } from "@/types/cafe"
import { normalizeCafeHoursFilter } from "./opening-hours"

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

type DistrictSearchParse = {
  district?: string
  search?: string
  matched: boolean
}

function normalizeSearchText(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/\s+/g, " ")
    .trim()
}

function normalizeSearchTextWithMap(value: string) {
  let text = ""
  const map: number[] = []
  let lastWasSpace = true

  for (let index = 0; index < value.length; index += 1) {
    const normalized = normalizeSearchText(value[index])
    for (const char of normalized || (/\s/.test(value[index]) ? " " : "")) {
      if (char === " ") {
        if (lastWasSpace) continue
        lastWasSpace = true
      } else {
        lastWasSpace = false
      }
      text += char
      map.push(index)
    }
  }

  if (text.endsWith(" ")) {
    text = text.slice(0, -1)
    map.pop()
  }

  return { text, map }
}

function isSearchWordChar(value: string | undefined) {
  return Boolean(value && /[a-z0-9]/.test(value))
}

function isDistrictBoundary(text: string, index: number, direction: -1 | 1) {
  const adjacent = text[index]
  if (isSearchWordChar(adjacent)) return false
  if (adjacent === "," || adjacent === ";" || adjacent === ":") return true
  if (adjacent === "/" || adjacent === ".") {
    return !isSearchWordChar(text[index + direction])
  }
  return true
}

const DISTRICT_SEARCH_ENTRIES = AREAS.flatMap((district) => {
  const number = district.match(/^Quận\s+(\d+)$/i)?.[1]
  const prefixVariants = ["quan", "district"]
  const labels = new Set([district, normalizeSearchText(district)])
  if (number) prefixVariants.forEach((prefix) => labels.add(`${prefix} ${number}`))
  return [...new Set([...labels].map(normalizeSearchText))].map((label) => ({ district, label }))
})

export function parseDistrictSearch(input: string, locale: "vi" | "en"): DistrictSearchParse {
  const trimmed = input.trim()
  if (!trimmed) return { matched: false }

  const { text, map } = normalizeSearchTextWithMap(trimmed)
  const matches = []
  const entries =
    locale === "en"
      ? [...DISTRICT_SEARCH_ENTRIES].sort((a) => (a.label.startsWith("district") ? -1 : 1))
      : DISTRICT_SEARCH_ENTRIES

  for (const entry of entries) {
    let start = text.indexOf(entry.label)
    while (start !== -1) {
      const end = start + entry.label.length
      if (isDistrictBoundary(text, start - 1, -1) && isDistrictBoundary(text, end, 1)) {
        matches.push({ ...entry, start, end })
      }
      start = text.indexOf(entry.label, start + 1)
    }
  }

  if (matches.length !== 1) return { search: trimmed, matched: false }

  const [match] = matches
  let originalStart = map[match.start]
  let originalEnd = map[match.end - 1] + 1
  const opening = trimmed[originalStart - 1]
  const closing = trimmed[originalEnd]
  if ((opening === "(" && closing === ")") || (opening === "[" && closing === "]")) {
    originalStart -= 1
    originalEnd += 1
  }

  const search = `${trimmed
    .slice(0, originalStart)
    .replace(/[\s,;:/-]+$/g, "")} ${trimmed
    .slice(originalEnd)
    .replace(/^[\s,;:/-]+/g, "")}`
    .replace(/\s+/g, " ")
    .trim()

  return { district: match.district, search: search || undefined, matched: true }
}

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

  const explicitDistrict = searchParams.get("district") ?? undefined
  const legacySearch = searchParams.get("search") ?? undefined
  const legacyDistrict = explicitDistrict ? undefined : parseDistrictSearch(legacySearch ?? "", "vi")

  return {
    search: legacyDistrict?.matched ? legacyDistrict.search : legacySearch,
    vibes: allVibes.length ? allVibes : undefined,
    purposes: purposes?.length ? purposes : undefined,
    tags: tags.length ? tags : undefined,
    district: explicitDistrict ?? legacyDistrict?.district,
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
  if (filter.district) params.set("district", filter.district)
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
      filter.district ||
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
