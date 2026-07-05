import type { Cafe } from "@/types/cafe"

export type ApiLocale = "vi" | "en"

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
export function normalizeCafeLocale(locale?: string | null): ApiLocale {
  return locale === "en" ? "en" : "vi"
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

export type RawCafe = Omit<
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

export function normalizeLabelKey(value: string): string {
  return value.trim().toLowerCase()
}

export function withInferredTags(raw: RawCafe, tags: string[], locale: ApiLocale): string[] {
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

export function mapApiCafe(raw: RawCafe, locale?: string | null): Cafe {
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
