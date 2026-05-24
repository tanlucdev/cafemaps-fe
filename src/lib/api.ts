import type { Cafe, CafeFilter, CafesResponse, SavedCafeEntry } from "@/types/cafe"
import { MOCK_CAFES } from "./mock-data"

const BASE_URL =
  typeof window === "undefined"
    ? (process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api")
    : "/api-proxy"

const READ_REVALIDATE_SECONDS = 300
const API_TIMEOUT_MS = 12000

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

function buildQuery(filter?: CafeFilter): string {
  if (!filter) return ""
  const params = new URLSearchParams()
  if (filter.search) params.set("search", filter.search)
  if (filter.district) params.set("district", filter.district)
  if (filter.priceRange) params.set("priceRange", filter.priceRange)
  const vibes = filter.vibes ?? filter.vibe
  const purposes = filter.purposes ?? filter.purpose
  if (vibes?.length) params.set("vibes", vibes.join(","))
  if (purposes?.length) params.set("purposes", purposes.join(","))
  if (filter.page !== undefined) params.set("page", String(filter.page))
  if (filter.limit !== undefined) params.set("limit", String(filter.limit))
  const q = params.toString()
  return q ? `?${q}` : ""
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
  | "images"
  | "image_orientations"
  | "isPublished"
  | "distanceKm"
  | "durationMin"
  | "distanceMode"
  | "straightDistanceKm"
> & {
  vibes?: string[]
  vibe?: string[]
  purposes?: string[]
  purpose?: string[]
  amenities?: string[]
  images?: string[]
  image_orientations?: string[] | null
  imageOrientations?: string[] | null
  image_orientation?: string[] | null
  imageOrientation?: string[] | null
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

function mapApiCafe(raw: RawCafe): Cafe {
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

  return {
    ...raw,
    lat,
    lng,
    vibes: raw.vibes ?? raw.vibe ?? [],
    purposes: raw.purposes ?? raw.purpose ?? [],
    amenities: raw.amenities ?? [],
    images: raw.images ?? [],
    image_orientations:
      raw.image_orientations ??
      raw.imageOrientations ??
      raw.image_orientation ??
      raw.imageOrientation ??
      null,
    isPublished: raw.isPublished ?? true,
    distanceKm: distanceKmValue,
    durationMin,
    distanceMode,
    straightDistanceKm,
  }
}

export async function getCafes(filter?: CafeFilter): Promise<Cafe[]> {
  try {
    const data = await apiFetch<CafesResponse | Cafe[]>(
      `/cafes${buildQuery(filter)}`
    )
    const raw = Array.isArray(data) ? data : data.data
    return raw.map(mapApiCafe)
  } catch (err) {
    console.error("getCafes failed:", err)
    return MOCK_CAFES
  }
}

export async function getCafesWithMeta(filter?: CafeFilter): Promise<{
  cafes: Cafe[]
  meta: { total: number; page: number; limit: number; totalPages: number }
}> {
  try {
    const data = await apiFetch<CafesResponse | Cafe[]>(
      `/cafes${buildQuery(filter)}`
    )
    if (Array.isArray(data)) {
      return {
        cafes: data.map(mapApiCafe),
        meta: { total: data.length, page: 1, limit: data.length, totalPages: 1 },
      }
    }
    return {
      cafes: data.data.map(mapApiCafe),
      meta: {
        total: data.meta?.total ?? data.total ?? data.data.length,
        page: data.meta?.page ?? data.page ?? 1,
        limit: data.meta?.limit ?? data.limit ?? 12,
        totalPages: data.meta?.totalPages ?? Math.ceil((data.meta?.total ?? data.total ?? data.data.length) / (data.meta?.limit ?? data.limit ?? 12)),
      },
    }
  } catch (err) {
    console.error("getCafesWithMeta failed:", err)
    return {
      cafes: MOCK_CAFES,
      meta: { total: MOCK_CAFES.length, page: 1, limit: MOCK_CAFES.length, totalPages: 1 },
    }
  }
}

export async function getCafeBySlug(slug: string): Promise<Cafe | null> {
  try {
    const raw = await apiFetch<Cafe>(`/cafes/${slug}`)
    return mapApiCafe(raw)
  } catch (err) {
    console.error("getCafeBySlug failed:", err)
    return MOCK_CAFES.find((c) => c.slug === slug) ?? null
  }
}

export async function getNearbyCafes(
  lat: number,
  lng: number,
  radiusKm = 2
): Promise<Cafe[]> {
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
    return raw.map(mapApiCafe)
  } catch {
    return MOCK_CAFES.slice(0, 4)
  }
}

export async function getSavedCafeEntries(token: string): Promise<SavedCafeEntry[]> {
  try {
    const raw = await apiFetch<Array<{
      cafe: Cafe
      collectionName?: string
      createdAt?: string
    }>>("/saved", {
      headers: { Authorization: `Bearer ${token}` },
    })
    return raw.map(({ cafe, collectionName, createdAt }) => ({
      cafe: mapApiCafe(cafe),
      collectionName: collectionName ?? "Yeu thich",
      createdAt,
    }))
  } catch {
    return []
  }
}

export async function getSavedCafes(token: string): Promise<Cafe[]> {
  const entries = await getSavedCafeEntries(token)
  return entries.map((entry) => entry.cafe)
}

export async function toggleSaveCafe(
  cafeId: string,
  token: string,
  currentlySaved?: boolean
): Promise<{ saved: boolean }> {
  if (currentlySaved) {
    await apiFetch(`/saved/${cafeId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })
    return { saved: false }
  }

  try {
    await apiFetch(`/saved`, {
      method: "POST",
      body: JSON.stringify({ cafeId }),
      headers: { Authorization: `Bearer ${token}` },
    })
    return { saved: true }
  } catch (error) {
    if (error instanceof ApiError && error.status === 409) {
      return { saved: true }
    }
    throw error
  }
}

export async function moveToCollection(
  cafeId: string,
  collectionName: string,
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
