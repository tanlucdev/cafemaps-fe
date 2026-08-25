const OVERRIDE_KEY = "cafe:view-count-overrides"
export const CAFE_VIEW_COUNT_OVERRIDE_EVENT = "cafe:view-count-override"

type ViewCountOverride = {
  cafeId: string
  viewCount: number
  expiresAt: number
}

function readOverrides(): Record<string, ViewCountOverride> {
  if (typeof window === "undefined") return {}
  try {
    return JSON.parse(localStorage.getItem(OVERRIDE_KEY) ?? "{}") as Record<string, ViewCountOverride>
  } catch {
    return {}
  }
}

export function getCafeViewCountOverride(cafeId: string) {
  const override = readOverrides()[cafeId]
  if (!override || override.expiresAt <= Date.now() || !Number.isFinite(override.viewCount)) return null
  return override.viewCount
}

export function setCafeViewCountOverride(cafeId: string, viewCount: number, expiresAt: number) {
  if (typeof window === "undefined" || !Number.isFinite(viewCount)) return
  try {
    localStorage.setItem(
      OVERRIDE_KEY,
      JSON.stringify({ ...readOverrides(), [cafeId]: { cafeId, viewCount, expiresAt } }),
    )
    window.dispatchEvent(new CustomEvent(CAFE_VIEW_COUNT_OVERRIDE_EVENT, { detail: { cafeId, viewCount } }))
  } catch {
    return
  }
}
