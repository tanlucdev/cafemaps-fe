import type { Cafe, CafeFilter, CafesResponse } from "@/types/cafe"
import { MOCK_CAFES } from "./mock-data"

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api"

async function apiFetch<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  })

  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`)
  }

  return res.json() as Promise<T>
}

function buildQuery(filter?: CafeFilter): string {
  if (!filter) return ""
  const params = new URLSearchParams()
  if (filter.search) params.set("search", filter.search)
  if (filter.district) params.set("district", filter.district)
  if (filter.city) params.set("city", filter.city)
  if (filter.priceRange) params.set("priceRange", filter.priceRange)
  if (filter.vibe?.length) filter.vibe.forEach((v) => params.append("vibe", v))
  if (filter.purpose?.length) filter.purpose.forEach((p) => params.append("purpose", p))
  if (filter.lat) params.set("lat", String(filter.lat))
  if (filter.lng) params.set("lng", String(filter.lng))
  if (filter.radiusKm) params.set("radiusKm", String(filter.radiusKm))
  if (filter.page) params.set("page", String(filter.page))
  if (filter.limit) params.set("limit", String(filter.limit))
  const q = params.toString()
  return q ? `?${q}` : ""
}

export async function getCafes(filter?: CafeFilter): Promise<Cafe[]> {
  try {
    const data = await apiFetch<CafesResponse | Cafe[]>(
      `/cafes${buildQuery(filter)}`
    )
    return Array.isArray(data) ? data : data.data
  } catch {
    return MOCK_CAFES
  }
}

export async function getCafeBySlug(slug: string): Promise<Cafe | null> {
  try {
    return await apiFetch<Cafe>(`/cafes/${slug}`)
  } catch {
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
