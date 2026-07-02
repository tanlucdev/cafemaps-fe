import type { Cafe, CafeFilter, CafesResponse, SavedCafeEntry, SavedCollection } from "@/types/cafe"
import { MOCK_CAFES } from "@/lib/mock-data"
import { isCafeOpenNow } from "@/lib/opening-hours"

const DEFAULT_API_URL = "https://cafe-finder-be.onrender.com/api"
const BASE_URL =
  typeof window === "undefined"
    ? (process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? DEFAULT_API_URL)
    : "/api-proxy"

const READ_REVALIDATE_SECONDS = 300
const API_TIMEOUT_MS = 12000
type ApiLocale = "vi" | "en"

const EN_VIBE_VALUES: Record<string, string> = {
  "yên tĩnh": "Quiet",
  "nhộn nhịp": "Lively",
  vintage: "Vintage",
  "hiện đại": "Modern",
  "thiên nhiên": "Nature",
  "sáng tạo": "Creative",
  "lãng mạn": "Romantic",
  minimalist: "Minimalist",
}

const EN_PURPOSE_VALUES: Record<string, string> = {
  "làm việc": "Work",
  "học tập": "Study",
  "hẹn hò": "Date",
  "họp nhóm": "Group",
  "chill một mình": "Solo",
  "gặp bạn bè": "Friends",
}

const EN_TAG_VALUES: Record<string, string> = {
  "ngoài trời": "outdoor seating",
  "chỗ hút thuốc": "smoking allowed",
}

const INFERRED_TAG_RULES = [
  {
    terms: ["ngoài trời", "sân vườn", "ban công", "rooftop", "terrace", "garden", "outdoor", "balcony"],
    labels: { vi: "ngoài trời", en: "outdoor seating" },
  },
  {
    terms: ["hút thuốc", "khói thuốc", "cho phép hút thuốc", "smoking", "smoking allowed"],
    labels: { vi: "chỗ hút thuốc", en: "smoking allowed" },
  },
]

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number
  ) {
    super(message)
    this.name = "ApiError"
  }
}

type NextRequestInit = RequestInit & {
  next?: {
    revalidate?: number
    tags?: string[]
  }
}

async function apiFetch<T>(
  path: string,
  options?: NextRequestInit
): Promise<T> {
  const method = options?.method?.toUpperCase() ?? "GET"
  const isPublicRead =
    method === "GET" && !(options?.headers && "Authorization" in options.headers)
  const useReadCache = isPublicRead && options?.cache !== "no-store"
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), API_TIMEOUT_MS)

  const res = await fetch(`${BASE_URL}${path}`, {
    ...(useReadCache
      ? {
          cache: "force-cache",
          next: {
            revalidate: READ_REVALIDATE_SECONDS,
            tags: ["cafes"],
            ...options?.next,
          },
        }
      : {}),
    ...options,
    signal: options?.signal ?? controller.signal,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  }).finally(() => clearTimeout(timeout))

  if (!res.ok) {
    throw new ApiError(`API error: ${res.status} ${res.statusText}`, res.status)
  }

  return res.json() as Promise<T>
}

export function isUnauthorizedError(error: unknown) {
  return error instanceof ApiError && (error.status === 401 || error.status === 403)
}

export function normalizeCafeLocale(locale?: string | null): ApiLocale {
  return locale === "en" ? "en" : "vi"
}

function localizeFilterValues(
  values: string[] | undefined,
  map: Record<string, string>,
  locale: ApiLocale
): string[] | undefined {
  if (!values?.length) return undefined
  if (locale !== "en") return values
  return values.map((value) => map[value] ?? value)
}

function buildQuery(filter?: CafeFilter, locale?: string | null): string {
  const params = new URLSearchParams()
  const apiLocale = normalizeCafeLocale(locale)
  params.set("locale", apiLocale)
  if (filter?.search) params.set("search", filter.search)
  if (filter?.district) params.set("district", filter.district)
  if (filter?.priceRange) params.set("priceRange", filter.priceRange)
  if (filter?.openNow) params.set("openNow", "true")
  const vibes = localizeFilterValues(filter?.vibes ?? filter?.vibe, EN_VIBE_VALUES, apiLocale)
  const purposes = localizeFilterValues(filter?.purposes ?? filter?.purpose, EN_PURPOSE_VALUES, apiLocale)
  const tags = localizeFilterValues(filter?.tags, EN_TAG_VALUES, apiLocale)
  if (vibes?.length) params.set("vibes", vibes.join(","))
  if (purposes?.length) params.set("purposes", purposes.join(","))
  if (tags?.length) params.set("tags", tags.join(","))
  if (filter?.sort && filter.sort !== "popular") params.set("sort", filter.sort)
  if (filter?.page !== undefined) params.set("page", String(filter.page))
  if (filter?.limit !== undefined) params.set("limit", String(filter.limit))
  const q = params.toString()
  return q ? `?${q}` : ""
}

function fallbackCafes(filter?: CafeFilter): Cafe[] {
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

  if (sort === "newest") return [...result].reverse()
  return result
}

function paginateFallbackCafes(filter?: CafeFilter) {
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

function fallbackDistricts(): string[] {
  return [...new Set(MOCK_CAFES.map((cafe) => cafe.district).filter(Boolean) as string[])].sort()
}

// Parse PostGIS EWKB hex → { lat, lng }
function parseEwkbPoint(hex: string): { lat: number; lng: number } | null {
  try {
    // EWKB little-endian: 1B order + 4B type + 4B SRID (if present) + 8B x + 8B y
    const bytes = new Uint8Array(hex.length / 2)
    for (let i = 0; i < bytes.length; i++) {
      bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16)
    }
    const view = new DataView(bytes.buffer)
    const littleEndian = view.getUint8(0) === 1
    const wkbType = view.getUint32(1, littleEndian)
    const hasSrid = (wkbType & 0x20000000) !== 0
    const offset = 5 + (hasSrid ? 4 : 0)
    const lng = view.getFloat64(offset, littleEndian)
    const lat = view.getFloat64(offset + 8, littleEndian)
    if (!isFinite(lat) || !isFinite(lng)) return null
    return { lat, lng }
  } catch {
    return null
  }
}

type RawCafe = Omit<
  Cafe,
  | "vibes"
  | "purposes"
  | "amenities"
  | "tags"
  | "images"
  | "image_orientations"
  | "isPublished"
  | "distanceKm"
  | "durationMin"
  | "distanceMode"
  | "straightDistanceKm"
  | "rating"
  | "averageRating"
  | "curatedRating"
  | "reviewCount"
  | "savedCount"
  | "viewCount"
> & {
  vibes?: string[]
  vibe?: string[]
  vibesEn?: string[]
  vibes_en?: string[]
  purposes?: string[]
  purpose?: string[]
  purposesEn?: string[]
  purposes_en?: string[]
  amenities?: string[]
  amenitiesEn?: string[]
  amenities_en?: string[]
  tags?: string[]
  tagsEn?: string[]
  tags_en?: string[]
  images?: string[]
  image_orientations?: string[] | null
  imageOrientations?: string[] | null
  image_orientation?: string[] | null
  imageOrientation?: string[] | null
  menu_image?: string | null
  website_url?: string | null
  website?: string | null
  opening_time?: string | null
  opening_time_local?: string | null
  closing_time?: string | null
  closing_time_local?: string | null
  isPublished?: boolean
  location?: string
  distance_km?: number | string | null
  distanceKm?: number | string | null
  duration_min?: number | string | null
  durationMin?: number | string | null
  distance_mode?: "straight" | "route" | null
  distanceMode?: "straight" | "route" | null
  straight_distance_km?: number | string | null
  straightDistanceKm?: number | string | null
  rating?: number | string | null
  average_rating?: number | string | null
  averageRating?: number | string | null
  curated_rating?: number | string | null
  curatedRating?: number | string | null
  review_count?: number | string | null
  reviewCount?: number | string | null
  saved_count?: number | string | null
  savedCount?: number | string | null
  view_count?: number | string | null
  viewCount?: number | string | null
  name_en?: string | null
  address_en?: string | null
  district_en?: string | null
  one_liner_en?: string | null
  onlineEn?: string | null
  online_en?: string | null
  oneLineEn?: string | null
  one_line_en?: string | null
  description_en?: string | null
  signature_drink_en?: string | null
  parking_location_en?: string | null
}

function toFiniteNumber(value: number | string | null | undefined): number | undefined {
  const parsed = typeof value === "string" ? Number(value) : value
  return typeof parsed === "number" && Number.isFinite(parsed) ? parsed : undefined
}

function normalizeDistanceMode(
  mode: "straight" | "route" | null | undefined
): Cafe["distanceMode"] {
  return mode === "straight" || mode === "route" ? mode : undefined
}

function pickLocalized<T>(locale: ApiLocale, base: T, localized: T | null | undefined): T {
  if (locale !== "en") return base
  if (Array.isArray(localized)) return (localized.length > 0 ? localized : base) as T
  return (localized ?? base) as T
}

function normalizeLabelKey(value: string): string {
  return value.trim().toLowerCase()
}

function withInferredTags(raw: RawCafe, tags: string[], locale: ApiLocale): string[] {
  const source = [
    ...tags,
    ...(raw.amenities ?? []),
    ...(raw.amenitiesEn ?? raw.amenities_en ?? []),
    ...(raw.vibes ?? raw.vibe ?? []),
    ...(raw.vibesEn ?? raw.vibes_en ?? []),
    raw.oneLiner ?? "",
    raw.oneLinerEn ?? raw.one_liner_en ?? raw.onlineEn ?? raw.online_en ?? raw.oneLineEn ?? raw.one_line_en ?? "",
    raw.description ?? "",
    raw.descriptionEn ?? raw.description_en ?? "",
  ]
    .join(" ")
    .toLowerCase()

  const next = [...tags]
  const seen = new Set(next.map(normalizeLabelKey))

  for (const rule of INFERRED_TAG_RULES) {
    const label = locale === "en" ? rule.labels.en : rule.labels.vi
    const equivalents = [...rule.terms, rule.labels.vi, rule.labels.en].map(normalizeLabelKey)
    const hasEquivalent = equivalents.some((tag) => seen.has(tag))
    if (rule.terms.some((term) => source.includes(term)) && !hasEquivalent) {
      next.push(label)
      seen.add(normalizeLabelKey(label))
    }
  }

  return next
}

function mapApiCafe(raw: RawCafe, locale?: string | null): Cafe {
  const apiLocale = normalizeCafeLocale(locale)
  let lat = raw.lat ?? null
  let lng = raw.lng ?? null

  if ((lat == null || lng == null) && typeof raw.location === "string" && raw.location.length > 0) {
    const point = parseEwkbPoint(raw.location)
    if (point) {
      lat = point.lat
      lng = point.lng
    }
  }

  const rawDistance = raw.distanceKm ?? raw.distance_km
  const distanceKmValue = toFiniteNumber(rawDistance)
  const durationMin = toFiniteNumber(raw.durationMin ?? raw.duration_min)
  const straightDistanceKm = toFiniteNumber(
    raw.straightDistanceKm ?? raw.straight_distance_km
  )
  const distanceMode = normalizeDistanceMode(raw.distanceMode ?? raw.distance_mode)
  const rating = toFiniteNumber(raw.rating)
  const averageRating = toFiniteNumber(raw.averageRating ?? raw.average_rating)
  const curatedRating = toFiniteNumber(raw.curatedRating ?? raw.curated_rating)
  const reviewCount = toFiniteNumber(raw.reviewCount ?? raw.review_count)
  const savedCount = toFiniteNumber(raw.savedCount ?? raw.saved_count)
  const viewCount = toFiniteNumber(raw.viewCount ?? raw.view_count)

  const nameEn = raw.nameEn ?? raw.name_en
  const addressEn = raw.addressEn ?? raw.address_en
  const districtEn = raw.districtEn ?? raw.district_en
  const oneLinerEn =
    raw.oneLinerEn ?? raw.one_liner_en ?? raw.onlineEn ?? raw.online_en ?? raw.oneLineEn ?? raw.one_line_en
  const descriptionEn = raw.descriptionEn ?? raw.description_en
  const signatureDrinkEn = raw.signatureDrinkEn ?? raw.signature_drink_en
  const vibesEn = raw.vibesEn ?? raw.vibes_en
  const purposesEn = raw.purposesEn ?? raw.purposes_en
  const amenitiesEn = raw.amenitiesEn ?? raw.amenities_en
  const tagsEn = raw.tagsEn ?? raw.tags_en
  const parkingLocationEn = raw.parkingLocationEn ?? raw.parking_location_en
  const vibes = raw.vibes ?? raw.vibe ?? []
  const purposes = raw.purposes ?? raw.purpose ?? []
  const amenities = raw.amenities ?? []
  const tags = raw.tags ?? []
  const parkingLocation = raw.parkingLocation ?? raw.parking_location ?? null
  const localizedTags = pickLocalized(apiLocale, tags, tagsEn)

  return {
    ...raw,
    name: pickLocalized(apiLocale, raw.name, nameEn),
    nameEn,
    address: pickLocalized(apiLocale, raw.address, addressEn),
    addressEn,
    district: pickLocalized(apiLocale, raw.district, districtEn),
    districtEn,
    oneLiner: pickLocalized(apiLocale, raw.oneLiner, oneLinerEn),
    oneLinerEn,
    description: pickLocalized(apiLocale, raw.description, descriptionEn),
    descriptionEn,
    signatureDrink: pickLocalized(apiLocale, raw.signatureDrink, signatureDrinkEn),
    signatureDrinkEn,
    lat,
    lng,
    vibes: pickLocalized(apiLocale, vibes, vibesEn),
    vibesEn,
    purposes: pickLocalized(apiLocale, purposes, purposesEn),
    purposesEn,
    amenities: pickLocalized(apiLocale, amenities, amenitiesEn),
    amenitiesEn,
    tags: withInferredTags(raw, localizedTags, apiLocale),
    tagsEn,
    openingTime: raw.openingTime ?? raw.opening_time ?? raw.opening_time_local ?? null,
    closingTime: raw.closingTime ?? raw.closing_time ?? raw.closing_time_local ?? null,
    websiteUrl: raw.websiteUrl ?? raw.website_url ?? raw.website ?? null,
    parking_location: pickLocalized(apiLocale, raw.parking_location ?? raw.parkingLocation ?? null, parkingLocationEn),
    parkingLocation: pickLocalized(apiLocale, parkingLocation, parkingLocationEn),
    parkingLocationEn,
    images: raw.images ?? [],
    image_orientations:
      raw.image_orientations ??
      raw.imageOrientations ??
      raw.image_orientation ??
      raw.imageOrientation ??
      null,
    menuImage: raw.menuImage ?? raw.menu_image ?? null,
    isPublished: raw.isPublished ?? true,
    distanceKm: distanceKmValue,
    durationMin,
    distanceMode,
    straightDistanceKm,
    rating,
    averageRating,
    curatedRating,
    reviewCount,
    savedCount,
    viewCount,
  }
}

export async function getCafes(filter?: CafeFilter, locale?: string | null): Promise<Cafe[]> {
  try {
    const data = await apiFetch<CafesResponse | Cafe[]>(
      `/cafes${buildQuery(filter, locale)}`
    )
    const raw = Array.isArray(data) ? data : data.data
    return raw.map((cafe) => mapApiCafe(cafe, locale))
  } catch (err) {
    console.error("getCafes failed:", err)
    return fallbackCafes(filter)
  }
}

export async function getCafesWithMeta(filter?: CafeFilter, locale?: string | null, options?: NextRequestInit): Promise<{
  cafes: Cafe[]
  meta: { total: number; page: number; limit: number; totalPages: number }
}> {
  try {
    const data = await apiFetch<CafesResponse | Cafe[]>(
      `/cafes${buildQuery(filter, locale)}`,
      options
    )
    if (Array.isArray(data)) {
      return {
        cafes: data.map((cafe) => mapApiCafe(cafe, locale)),
        meta: { total: data.length, page: 1, limit: data.length, totalPages: 1 },
      }
    }
    return {
      cafes: data.data.map((cafe) => mapApiCafe(cafe, locale)),
      meta: {
        total: data.meta?.total ?? data.total ?? data.data.length,
        page: data.meta?.page ?? data.page ?? 1,
        limit: data.meta?.limit ?? data.limit ?? 12,
        totalPages: data.meta?.totalPages ?? Math.ceil((data.meta?.total ?? data.total ?? data.data.length) / (data.meta?.limit ?? data.limit ?? 12)),
      },
    }
  } catch (err) {
    console.error("getCafesWithMeta failed:", err)
    return paginateFallbackCafes(filter)
  }
}

export async function getCafeBySlug(slug: string, locale?: string | null): Promise<Cafe | null> {
  try {
    const raw = await apiFetch<Cafe>(`/cafes/${slug}${buildQuery(undefined, locale)}`)
    return mapApiCafe(raw, locale)
  } catch (err) {
    console.error("getCafeBySlug failed:", err)
    return MOCK_CAFES.find((cafe) => cafe.slug === slug) ?? null
  }
}

export async function getNearbyCafes(
  lat: number,
  lng: number,
  radiusKm = 2,
  _locale?: string | null
): Promise<Cafe[]> {
  void _locale
  try {
    const params = new URLSearchParams({
      lat: String(lat),
      lng: String(lng),
      radius: String(radiusKm),
      distanceMode: "route",
    })
    const raw = await apiFetch<RawCafe[]>(
      `/cafes/nearby?${params.toString()}`,
      { cache: "no-store" }
    )
    return raw.map((cafe) => mapApiCafe(cafe, _locale))
  } catch (err) {
    console.error("getNearbyCafes failed:", err)
    return MOCK_CAFES
  }
}

export async function getCafeDistricts(locale?: string | null): Promise<string[]> {
  try {
    return await apiFetch<string[]>(`/cafes/districts${buildQuery(undefined, locale)}`)
  } catch (err) {
    console.error("getCafeDistricts failed:", err)
    return fallbackDistricts()
  }
}

export async function getQuizMatchCafes(
  filter?: CafeFilter,
  locale?: string | null
): Promise<Cafe[]> {
  try {
    const data = await apiFetch<CafesResponse | Cafe[]>(
      `/cafes/quiz-match${buildQuery(filter, locale)}`
    )
    const raw = Array.isArray(data) ? data : data.data
    return raw.map((cafe) => mapApiCafe(cafe, locale))
  } catch (err) {
    console.error("getQuizMatchCafes failed:", err)
    return fallbackCafes(filter)
  }
}

export async function getSavedCafeEntries(
  token: string,
  locale?: string | null
): Promise<SavedCafeEntry[]> {
  try {
    const raw = await apiFetch<Array<{
      cafe: Cafe
      collectionName?: string
      createdAt?: string
    }>>(`/saved${buildQuery(undefined, locale)}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return raw.map(({ cafe, collectionName, createdAt }) => ({
      cafe: mapApiCafe(cafe, locale),
      collectionName: collectionName ?? null,
      createdAt,
    }))
  } catch {
    return []
  }
}

export async function getSavedCollections(token: string): Promise<SavedCollection[]> {
  try {
    const raw = await apiFetch<Array<string | SavedCollection>>("/saved/collections", {
      headers: { Authorization: `Bearer ${token}` },
    })
    return raw
      .map((item) => (typeof item === "string" ? { name: item } : item))
      .filter((item) => item.name?.trim())
  } catch {
    return []
  }
}

export async function createSavedCollection(name: string, token: string): Promise<SavedCollection> {
  return apiFetch<SavedCollection>("/saved/collections", {
    method: "POST",
    body: JSON.stringify({ name }),
    headers: { Authorization: `Bearer ${token}` },
  })
}

export async function renameSavedCollection(
  oldName: string,
  name: string,
  token: string
): Promise<SavedCollection> {
  return apiFetch<SavedCollection>(`/saved/collections/${encodeURIComponent(oldName)}`, {
    method: "PATCH",
    body: JSON.stringify({ name }),
    headers: { Authorization: `Bearer ${token}` },
  })
}

export async function deleteSavedCollection(name: string, token: string): Promise<void> {
  await apiFetch(`/saved/collections/${encodeURIComponent(name)}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  })
}

export async function getSavedCafes(token: string, locale?: string | null): Promise<Cafe[]> {
  const entries = await getSavedCafeEntries(token, locale)
  return entries.map((entry) => entry.cafe)
}

export async function toggleSaveCafe(
  cafeId: string,
  token: string,
  currentlySaved?: boolean,
  collectionName?: string | null
): Promise<{ saved: boolean; collectionName?: string | null }> {
  if (currentlySaved) {
    await apiFetch(`/saved/${cafeId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })
    return { saved: false }
  }

  try {
    const result = await apiFetch<{ saved?: boolean; collectionName?: string | null }>(`/saved`, {
      method: "POST",
      body: JSON.stringify({ cafeId, collectionName }),
      headers: { Authorization: `Bearer ${token}` },
    })
    return { saved: true, collectionName: result.collectionName ?? collectionName ?? null }
  } catch (error) {
    if (error instanceof ApiError && error.status === 409) {
      return { saved: true, collectionName: collectionName ?? null }
    }
    throw error
  }
}

export async function moveToCollection(
  cafeId: string,
  collectionName: string | null,
  token: string
): Promise<void> {
  await apiFetch(`/saved/${cafeId}/collection`, {
    method: "PATCH",
    body: JSON.stringify({ collectionName }),
    headers: { Authorization: `Bearer ${token}` },
  })
}

export async function submitCafe(
  data: Partial<Cafe>,
  token: string
): Promise<Cafe> {
  return apiFetch<Cafe>("/cafes/submit", {
    method: "POST",
    body: JSON.stringify(data),
    headers: { Authorization: `Bearer ${token}` },
  })
}

export async function loginUser(
  email: string,
  password: string
): Promise<{ token: string }> {
  return apiFetch<{ token: string }>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  })
}

export async function registerUser(
  email: string,
  password: string
): Promise<{ token?: string; message?: string }> {
  return apiFetch<{ token?: string; message?: string }>("/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  })
}
