import { getCafeRatingValue } from "@/lib/cafe-rating"
import { isCafeOpenNow } from "@/lib/opening-hours"
import type { Cafe, CafeFilter as Filter } from "@/types/cafe"

export const PAGE_SIZE = 9

export type ViewMode = "grid" | "list"

export interface ServerMeta {
  total: number
  page: number
  limit: number
  totalPages: number
}

export function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371
  const dLat = (lat2 - lat1) * (Math.PI / 180)
  const dLng = (lng2 - lng1) * (Math.PI / 180)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

function numericScore(value: number | null | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0
}

export function cafeRating(cafe: Cafe): number {
  return getCafeRatingValue(cafe) ?? 0
}

export function cafePopularity(cafe: Cafe): number {
  const featuredScore = cafe.isFeatured ? 1_000_000 : 0
  const featuredOrderScore = cafe.featuredOrder != null ? 100_000 - cafe.featuredOrder : 0
  const savedScore = numericScore(cafe.savedCount) * 10
  const reviewScore = numericScore(cafe.reviewCount) * 5
  const viewScore = numericScore(cafe.viewCount)
  return featuredScore + featuredOrderScore + savedScore + reviewScore + viewScore + cafeRating(cafe)
}

export function cafeCreatedTime(cafe: Cafe): number {
  const value = cafe.createdAt ? new Date(cafe.createdAt).getTime() : 0
  return Number.isFinite(value) ? value : 0
}

export function filterNearbyCafes(cafes: Cafe[], filter: Filter): Cafe[] {
  return cafes.filter((cafe) => {
    if (filter.openNow && !isCafeOpenNow(cafe)) return false
    if (filter.vibes?.length && !filter.vibes.some((vibe) => cafe.vibes.includes(vibe))) {
      return false
    }
    if (
      filter.purposes?.length &&
      !filter.purposes.some((purpose) => cafe.purposes.includes(purpose))
    ) {
      return false
    }
    if (filter.tags?.length && !filter.tags.some((tag) => cafe.tags.includes(tag))) return false
    if (filter.district && cafe.district !== filter.district) return false
    return true
  })
}
