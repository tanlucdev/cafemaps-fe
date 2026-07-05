import type { Cafe } from "@/types/cafe";

function toRatingNumber(value: unknown): number | null {
  const parsed = typeof value === "string" ? Number(value) : value;
  return typeof parsed === "number" && Number.isFinite(parsed) && parsed > 0
    ? Math.min(5, Math.max(1, parsed))
    : null;
}

export function getCafeRatingValue(cafe: Cafe): number | null {
  return (
    toRatingNumber(cafe.rating) ??
    toRatingNumber(cafe.averageRating) ??
    toRatingNumber(cafe.curatedRating)
  );
}

export function formatCafeRating(cafe: Cafe, fallback?: number): string {
  const rating = getCafeRatingValue(cafe) ?? fallback;
  return typeof rating === "number" && Number.isFinite(rating) ? rating.toFixed(1) : "";
}
