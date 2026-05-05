import type { Cafe, CafeFilter, CafesResponse } from "@/types/cafe"
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
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), API_TIMEOUT_MS)

  const res = await fetch(`${BASE_URL}${path}`, {
    ...(isPublicRead
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
  if (filter.city) params.set("city", filter.city)
  if (filter.priceRange) params.set("priceRange", filter.priceRange)
  const vibes = filter.vibes ?? filter.vibe
  const purposes = filter.purposes ?? filter.purpose
  if (vibes?.length) vibes.forEach((v) => params.append("vibe", v))
  if (purposes?.length) purposes.forEach((p) => params.append("purpose", p))
  if (filter.openNow !== undefined) params.set("openNow", String(filter.openNow))
  if (filter.nearMe !== undefined) params.set("nearMe", String(filter.nearMe))
  if (filter.lat !== undefined) params.set("lat", String(filter.lat))
  if (filter.lng !== undefined) params.set("lng", String(filter.lng))
  if (filter.radiusKm !== undefined) params.set("radiusKm", String(filter.radiusKm))
  if (filter.page !== undefined) params.set("page", String(filter.page))
  if (filter.limit !== undefined) params.set("limit", String(filter.limit))
  const q = params.toString()
  return q ? `?${q}` : ""
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapApiCafe(raw: any): Cafe {
  return {
    ...raw,
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
    return await apiFetch<Cafe[]>(
      `/cafes/nearby?lat=${lat}&lng=${lng}&radiusKm=${radiusKm}`
    )
  } catch {
    return MOCK_CAFES.slice(0, 4)
  }
}

export async function getSavedCafes(token: string): Promise<Cafe[]> {
  try {
    return await apiFetch<Cafe[]>("/cafes/saved", {
      headers: { Authorization: `Bearer ${token}` },
    })
  } catch {
    return []
  }
}

export async function toggleSaveCafe(
  cafeId: string,
  token: string
): Promise<{ saved: boolean }> {
  return apiFetch<{ saved: boolean }>(`/cafes/${cafeId}/save`, {
    method: "POST",
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
