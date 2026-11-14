import type { Cafe, CafeFilter, CafesResponse, DiscoveryMeta } from "@/types/cafe";
import { apiFetch, type NextRequestInit } from "@/apis/http";
import { mapApiCafe, type RawCafe } from "./mapper";
import { buildQuery } from "./query";

async function loadDevFallback(options?: NextRequestInit) {
  const apiUrl = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "";
  const localApi = apiUrl.includes("localhost") || apiUrl.includes("127.0.0.1");
  if (
    (process.env.NODE_ENV === "production" && !localApi) ||
    options?.fallback === false ||
    options?.cache === "no-store"
  ) {
    return null;
  }
  return import("@/apis/cafes/dev-fallback");
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
  };
}

export async function getCafes(filter?: CafeFilter, locale?: string | null): Promise<Cafe[]> {
  try {
    const data = await apiFetch<CafesResponse | Cafe[]>(`/cafes${buildQuery(filter, locale)}`);
    const raw = Array.isArray(data) ? data : data.data;
    return raw.map((cafe) => mapApiCafe(cafe, locale));
  } catch (err) {
    const fallback = await loadDevFallback();
    if (fallback) return fallback.fallbackCafes(filter);
    console.error("getCafes failed:", err);
    return [];
  }
}

export async function getCafesWithMeta(
  filter?: CafeFilter,
  locale?: string | null,
  options?: NextRequestInit,
): Promise<{
  cafes: Cafe[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    discovery?: DiscoveryMeta;
  };
}> {
  try {
    const data = await apiFetch<CafesResponse | Cafe[]>(`/cafes${buildQuery(filter, locale)}`, {
      ...options,
      cache: "no-store",
    });
    if (Array.isArray(data)) {
      return {
        cafes: data.map((cafe) => mapApiCafe(cafe, locale)),
        meta: { total: data.length, page: 1, limit: data.length, totalPages: 1 },
      };
    }
    return {
      cafes: data.data.map((cafe) => mapApiCafe(cafe, locale)),
      meta: {
        total: data.meta?.total ?? data.total ?? data.data.length,
        page: data.meta?.page ?? data.page ?? 1,
        limit: data.meta?.limit ?? data.limit ?? 12,
        totalPages:
          data.meta?.totalPages ??
          Math.ceil(
            (data.meta?.total ?? data.total ?? data.data.length) /
              (data.meta?.limit ?? data.limit ?? 12),
          ),
        discovery: data.meta?.discovery,
      },
    };
  } catch (err) {
    if (options?.fallback === false || options?.cache === "no-store") throw err;
    const fallback = await loadDevFallback(options);
    if (fallback) return fallback.paginateFallbackCafes(filter);
    console.error("getCafesWithMeta failed:", err);
    return emptyCafesPage(filter);
  }
}

export async function getCafeBySlug(slug: string, locale?: string | null): Promise<Cafe | null> {
  try {
    const raw = await apiFetch<Cafe>(`/cafes/${slug}${buildQuery(undefined, locale)}`, {
      next: { tags: ["cafes", `cafe:${slug}`] },
    });
    return mapApiCafe(raw, locale);
  } catch (err) {
    const fallback = await loadDevFallback();
    if (fallback) return fallback.fallbackCafeBySlug(slug);
    console.error("getCafeBySlug failed:", err);
    return null;
  }
}

export async function getNearbyCafes(
  lat: number,
  lng: number,
  radiusKm = 2,
  _locale?: string | null,
): Promise<Cafe[]> {
  void _locale;
  const params = new URLSearchParams({
    lat: String(lat),
    lng: String(lng),
    radius: String(radiusKm),
    distanceMode: "route",
  });
  const raw = await apiFetch<RawCafe[]>(`/cafes/nearby?${params.toString()}`, {
    cache: "no-store",
  });
  return raw.map((cafe) => mapApiCafe(cafe, _locale));
}

export async function getNearbyDiscoveryCafes(
  filter: CafeFilter,
  locale?: string | null,
  options?: NextRequestInit,
): Promise<{
  cafes: Cafe[];
  meta: { total: number; page: number; limit: number; totalPages: number; discovery?: DiscoveryMeta };
}> {
  if (filter.lat == null || filter.lng == null) throw new Error("Nearby discovery requires coordinates");
  const params = new URLSearchParams(buildQuery(filter, locale).slice(1));
  params.set("lat", String(filter.lat));
  params.set("lng", String(filter.lng));
  params.set("radius", String(filter.radiusKm ?? 2));
  params.set("distanceMode", "route");
  const data = await apiFetch<CafesResponse>(`/cafes/nearby/discovery?${params.toString()}`, {
    ...options,
    cache: "no-store",
  });
  return {
    cafes: data.data.map((cafe) => mapApiCafe(cafe, locale)),
    meta: {
      total: data.meta?.total ?? data.total,
      page: data.meta?.page ?? data.page,
      limit: data.meta?.limit ?? data.limit,
      totalPages: data.meta?.totalPages ?? Math.ceil(data.total / data.limit),
      discovery: data.meta?.discovery,
    },
  };
}

export async function getCafeDistricts(
  locale?: string | null,
  options?: NextRequestInit,
): Promise<string[]> {
  try {
    return await apiFetch<string[]>(`/cafes/districts${buildQuery(undefined, locale)}`, options);
  } catch (err) {
    if (options?.fallback === false || options?.cache === "no-store") throw err;
    const fallback = await loadDevFallback(options);
    if (fallback) return fallback.fallbackDistricts();
    console.error("getCafeDistricts failed:", err);
    return [];
  }
}

export async function getQuizMatchCafes(
  filter?: CafeFilter,
  locale?: string | null,
  options?: NextRequestInit,
): Promise<Cafe[]> {
  try {
    const data = await apiFetch<CafesResponse | Cafe[]>(
      `/cafes/quiz-match${buildQuery(filter, locale)}`,
      options,
    );
    const raw = Array.isArray(data) ? data : data.data;
    return raw.map((cafe) => mapApiCafe(cafe, locale));
  } catch (err) {
    const fallback = await loadDevFallback();
    if (fallback) return fallback.fallbackCafes(filter);
    console.error("getQuizMatchCafes failed:", err);
    return [];
  }
}
