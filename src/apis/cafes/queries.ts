import type { Cafe, CafeFilter, CafesResponse } from "@/types/cafe"
import { apiFetch, type NextRequestInit } from "@/apis/http"
import { mapApiCafe, type RawCafe } from "./mapper"
import { buildQuery } from "./query"

async function loadDevFallback(options?: NextRequestInit) {
  if (process.env.NODE_ENV === "production" || options?.fallback === false || options?.cache === "no-store") {
    return null
  }
  return import("@/apis/cafes/dev-fallback")
}

function emptyCafesPage(filter?: CafeFilter) {
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

export async function getCafes(filter?: CafeFilter, locale?: string | null): Promise<Cafe[]> {
  try {
    const data = await apiFetch<CafesResponse | Cafe[]>(`/cafes${buildQuery(filter, locale)}`)
    const raw = Array.isArray(data) ? data : data.data
    return raw.map((cafe) => mapApiCafe(cafe, locale))
  } catch (err) {
    console.error("getCafes failed:", err)
    const fallback = await loadDevFallback()
    return fallback?.fallbackCafes(filter) ?? []
  }
}

export async function getCafesWithMeta(
  filter?: CafeFilter,
  locale?: string | null,
  options?: NextRequestInit
): Promise<{
  cafes: Cafe[]
  meta: { total: number; page: number; limit: number; totalPages: number }
}> {
  try {
    const data = await apiFetch<CafesResponse | Cafe[]>(`/cafes${buildQuery(filter, locale)}`, options)
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
        totalPages:
          data.meta?.totalPages ??
          Math.ceil((data.meta?.total ?? data.total ?? data.data.length) / (data.meta?.limit ?? data.limit ?? 12)),
      },
    }
  } catch (err) {
    if (options?.fallback === false || options?.cache === "no-store") throw err
    console.error("getCafesWithMeta failed:", err)
    const fallback = await loadDevFallback(options)
    return fallback?.paginateFallbackCafes(filter) ?? emptyCafesPage(filter)
  }
}

export async function getCafeBySlug(slug: string, locale?: string | null): Promise<Cafe | null> {
  try {
    const raw = await apiFetch<Cafe>(`/cafes/${slug}${buildQuery(undefined, locale)}`)
    return mapApiCafe(raw, locale)
  } catch (err) {
    console.error("getCafeBySlug failed:", err)
    const fallback = await loadDevFallback()
    return fallback?.fallbackCafeBySlug(slug) ?? null
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
    const raw = await apiFetch<RawCafe[]>(`/cafes/nearby?${params.toString()}`, { cache: "no-store" })
    return raw.map((cafe) => mapApiCafe(cafe, _locale))
  } catch (err) {
    console.error("getNearbyCafes failed:", err)
    return []
  }
}

export async function getCafeDistricts(locale?: string | null): Promise<string[]> {
  try {
    return await apiFetch<string[]>(`/cafes/districts${buildQuery(undefined, locale)}`)
  } catch (err) {
    console.error("getCafeDistricts failed:", err)
    const fallback = await loadDevFallback()
    return fallback?.fallbackDistricts() ?? []
  }
}

export async function getQuizMatchCafes(
  filter?: CafeFilter,
  locale?: string | null
): Promise<Cafe[]> {
  try {
    const data = await apiFetch<CafesResponse | Cafe[]>(`/cafes/quiz-match${buildQuery(filter, locale)}`)
    const raw = Array.isArray(data) ? data : data.data
    return raw.map((cafe) => mapApiCafe(cafe, locale))
  } catch (err) {
    console.error("getQuizMatchCafes failed:", err)
    const fallback = await loadDevFallback()
    return fallback?.fallbackCafes(filter) ?? []
  }
}
