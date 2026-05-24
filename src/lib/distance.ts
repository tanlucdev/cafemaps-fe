import type { Cafe } from "@/types/cafe"

type DistanceFields = Pick<Cafe, "distanceKm" | "distanceMode" | "durationMin">

export function formatDistanceKm(
  distanceKm?: number | null,
  { approximate = false }: { approximate?: boolean } = {},
): string {
  if (distanceKm == null || !Number.isFinite(distanceKm)) return ""

  const normalizedDistance = Math.max(0, distanceKm)
  const formatted =
    normalizedDistance < 1
      ? `${Math.max(1, Math.round(normalizedDistance * 1000))}m`
      : `${normalizedDistance < 10 ? normalizedDistance.toFixed(1) : Math.round(normalizedDistance)} km`

  return approximate ? `~${formatted}` : formatted
}

export function formatDurationMin(durationMin?: number | null, locale = "vi"): string {
  if (durationMin == null || !Number.isFinite(durationMin)) return ""

  const minutes = Math.max(1, Math.round(durationMin))
  return locale === "vi" ? `${minutes} phút` : `${minutes} min`
}

export function formatCafeDistanceParts(cafe: DistanceFields, locale: string): string[] {
  const isRouteDistance = cafe.distanceMode === "route"
  const distance = formatDistanceKm(cafe.distanceKm, { approximate: !isRouteDistance })
  const duration = isRouteDistance ? formatDurationMin(cafe.durationMin, locale) : ""

  return [distance, duration].filter(Boolean)
}
