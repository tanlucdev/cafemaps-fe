import { getCafeRatingValue } from "@/lib/cafe-rating";
import type { Cafe, DiscoveryMeta } from "@/types/cafe";

export const PAGE_SIZE = 9;
export const MOBILE_PAGE_SIZE = 10;

export type ViewMode = "grid" | "list";

export interface ServerMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  discovery?: DiscoveryMeta;
}

export function displayDiscoveryTotal(meta?: ServerMeta): number {
  return meta?.total ?? 0;
}

export function discoveryPageLimit(meta?: ServerMeta): number {
  return meta?.totalPages ?? 0;
}

export function clampDiscoveryPage(page: number, meta?: ServerMeta): number {
  const lastPage = discoveryPageLimit(meta);
  return lastPage ? Math.min(page, lastPage) : page;
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

export function compareCafePopularity(left: Cafe, right: Cafe): number {
  const comparisons = [
    numericScore(right.viewCount) - numericScore(left.viewCount),
    numericScore(right.weeklyVoteCount) - numericScore(left.weeklyVoteCount),
    numericScore(right.voteCount) - numericScore(left.voteCount),
    Number(Boolean(right.isFeatured)) - Number(Boolean(left.isFeatured)),
    numericScore(left.featuredOrder) - numericScore(right.featuredOrder),
    numericScore(right.savedCount) - numericScore(left.savedCount),
    cafeCreatedTime(right) - cafeCreatedTime(left),
  ];
  return comparisons.find((comparison) => comparison !== 0) ?? 0;
}

export function cafeCreatedTime(cafe: Cafe): number {
  const value = cafe.createdAt ? new Date(cafe.createdAt).getTime() : 0;
  return Number.isFinite(value) ? value : 0;
}
