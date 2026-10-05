import { getCafeRatingValue } from "@/lib/cafe-rating";
import { isCafeOpenNow, matchesCafeHours } from "@/lib/opening-hours";
import type { Cafe, CafeFilter as Filter } from "@/types/cafe";

export const PAGE_SIZE = 9;

export type ViewMode = "grid" | "list";

export interface ServerMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLng = (lng2 - lng1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function numericScore(value: number | null | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function cafeRating(cafe: Cafe): number {
  return getCafeRatingValue(cafe) ?? 0;
}

export function cafePopularity(cafe: Cafe): number {
  const featuredScore = cafe.isFeatured ? 1_000_000 : 0;
  const featuredOrderScore = cafe.featuredOrder != null ? 100_000 - cafe.featuredOrder : 0;
  const savedScore = numericScore(cafe.savedCount) * 10;
  const reviewScore = numericScore(cafe.reviewCount) * 5;
  const viewScore = numericScore(cafe.viewCount);
  return (
    featuredScore + featuredOrderScore + savedScore + reviewScore + viewScore + cafeRating(cafe)
  );
}

export function cafeCreatedTime(cafe: Cafe): number {
  const value = cafe.createdAt ? new Date(cafe.createdAt).getTime() : 0;
  return Number.isFinite(value) ? value : 0;
}

function filterByDistance(cafes: Cafe[], filter: Filter): Cafe[] {
  if (!filter.nearMe || filter.lat === undefined || filter.lng === undefined) return cafes;
  if (!cafes.some((cafe) => cafe.lat != null && cafe.lng != null)) return cafes;

  const radius = filter.radiusKm ?? 2;
  return cafes.filter((cafe) => {
    if (cafe.lat == null || cafe.lng == null) return false;
    return haversineKm(filter.lat!, filter.lng!, cafe.lat, cafe.lng) <= radius;
  });
}

export function filterClientCafes(cafes: Cafe[], filter: Filter): Cafe[] {
  let result = cafes;
  const { search, district, vibes, purposes, tags, priceRange, openNow, hours } = filter;

  if (search?.trim()) {
    const query = search.toLowerCase();
    result = result.filter(
      (cafe) =>
        cafe.name.toLowerCase().includes(query) ||
        (cafe.address ?? "").toLowerCase().includes(query) ||
        (cafe.district ?? "").toLowerCase().includes(query),
    );
  }
  if (district) result = result.filter((cafe) => cafe.district === district);
  if (vibes?.length) result = result.filter((cafe) => vibes.some((vibe) => cafe.vibes.includes(vibe)));
  if (purposes?.length) {
    result = result.filter((cafe) => purposes.some((purpose) => cafe.purposes.includes(purpose)));
  }
  if (tags?.length) result = result.filter((cafe) => tags.some((tag) => cafe.tags.includes(tag)));
  if (priceRange) {
    result = result.filter((cafe) => {
      const min = cafe.priceMin ?? 0;
      const max = cafe.priceMax ?? min;
      if (priceRange === "under_50k") return min < 50000;
      if (priceRange === "price_50k_100k" || priceRange === "50k_100k") {
        return min <= 100000 && max >= 50000;
      }
      if (priceRange === "price_100k_150k" || priceRange === "100k_150k") {
        return min <= 150000 && max >= 100000;
      }
      if (priceRange === "above_150k") return max > 150000;
      return true;
    });
  }
  if (openNow) result = result.filter(isCafeOpenNow);
  if (hours) result = result.filter((cafe) => matchesCafeHours(cafe, hours));
  return filterByDistance(result, filter);
}

export function filterFeaturedCafes(
  cafes: Cafe[],
  filter: Filter,
  serverFiltered: boolean,
): Cafe[] {
  return serverFiltered ? filterByDistance(cafes, filter) : filterClientCafes(cafes, filter);
}

export function filterNearbyCafes(cafes: Cafe[], filter: Filter): Cafe[] {
  return filterClientCafes(cafes, filter);
}
