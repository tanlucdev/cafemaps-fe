import type { CafeFilter } from "@/types/cafe"
import { normalizeCafeLocale } from "./mapper"
import {
  EN_PURPOSE_VALUES,
  EN_TAG_VALUES,
  EN_VIBE_VALUES,
  localizeFilterValues,
} from "./filter-normalization"

export function buildQuery(filter?: CafeFilter, locale?: string | null): string {
  const params = new URLSearchParams()
  const apiLocale = normalizeCafeLocale(locale)
  params.set("locale", apiLocale)
  if (filter?.search) params.set("search", filter.search)
  if (filter?.district) params.set("district", filter.district)
  if (filter?.priceRange) params.set("priceRange", filter.priceRange)
  if (filter?.openNow) params.set("openNow", "true")
  const vibes = localizeFilterValues(filter?.vibes ?? filter?.vibe, EN_VIBE_VALUES, apiLocale)
  const purposes = localizeFilterValues(filter?.purposes ?? filter?.purpose, EN_PURPOSE_VALUES, apiLocale)
  const tags = localizeFilterValues(filter?.tags, EN_TAG_VALUES, apiLocale)
  if (vibes?.length) params.set("vibes", vibes.join(","))
  if (purposes?.length) params.set("purposes", purposes.join(","))
  if (tags?.length) params.set("tags", tags.join(","))
  if (filter?.sort && filter.sort !== "popular") params.set("sort", filter.sort)
  if (filter?.page !== undefined) params.set("page", String(filter.page))
  if (filter?.limit !== undefined) params.set("limit", String(filter.limit))
  const q = params.toString()
  return q ? `?${q}` : ""
}

export function cafeListQueryKey(filter: CafeFilter, locale: string) {
  return [
    "cafes",
    locale,
    filter.search ?? "",
    filter.district ?? "",
    filter.priceRange ?? "",
    filter.openNow ?? false,
    filter.sort ?? "popular",
    filter.page ?? 1,
    filter.limit ?? 9,
    filter.nearMe ?? false,
    filter.lat ?? null,
    filter.lng ?? null,
    filter.radiusKm ?? null,
    [...(filter.vibes ?? [])].sort().join(","),
    [...(filter.purposes ?? [])].sort().join(","),
    [...(filter.tags ?? [])].sort().join(","),
  ] as const
}
