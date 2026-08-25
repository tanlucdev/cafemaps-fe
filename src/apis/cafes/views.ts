import { apiFetch } from "@/apis/http"
import { getCafeViewCountOverride, setCafeViewCountOverride } from "./view-count-overrides"

export interface CafeViewResponse {
  viewCount: number
  counted: boolean
}

const VIEW_TTL_MS = 24 * 60 * 60 * 1000
const PENDING_TTL_MS = 30 * 1000
const PENDING_KEY_PREFIX = "cafe:view-count-pending:"
const inFlight = new Map<string, Promise<CafeViewResponse | null>>()

export function trackCafeView(cafeId: string) {
  return apiFetch<CafeViewResponse>(`/cafes/${cafeId}/view`, {
    method: "POST",
    body: JSON.stringify({ source: "detail" }),
  })
}

function pendingKey(cafeId: string) {
  return `${PENDING_KEY_PREFIX}${cafeId}`
}

async function withViewLock<T>(cafeId: string, callback: () => Promise<T>): Promise<T> {
  const locks = typeof navigator === "undefined" ? undefined : navigator.locks
  return locks ? await locks.request(`cafe:view:${cafeId}`, callback) : callback()
}

async function claimPending(cafeId: string, requestId: string) {
  if (typeof window === "undefined") return true
  try {
    const key = pendingKey(cafeId)
    const pending = JSON.parse(localStorage.getItem(key) ?? "null") as { requestId?: string; expiresAt?: number } | null
    if (pending?.expiresAt && pending.expiresAt > Date.now()) return false
    localStorage.setItem(key, JSON.stringify({ requestId, expiresAt: Date.now() + PENDING_TTL_MS }))
    await new Promise((resolve) => setTimeout(resolve, 25))
    return JSON.parse(localStorage.getItem(key) ?? "null")?.requestId === requestId
  } catch {
    return true
  }
}

function releasePending(cafeId: string, requestId: string) {
  if (typeof window === "undefined") return
  try {
    const key = pendingKey(cafeId)
    const pending = JSON.parse(localStorage.getItem(key) ?? "null") as { requestId?: string } | null
    if (pending?.requestId === requestId) localStorage.removeItem(key)
  } catch {
    return
  }
}

export function trackCafeViewOnce(cafeId: string) {
  const override = getCafeViewCountOverride(cafeId)
  if (override !== null) return Promise.resolve({ viewCount: override, counted: false })
  const pending = inFlight.get(cafeId)
  if (pending) return pending

  const requestId = `${Date.now()}:${Math.random()}`
  const expiresAt = Date.now() + VIEW_TTL_MS
  const request = withViewLock(cafeId, async () => {
    const latestOverride = getCafeViewCountOverride(cafeId)
    if (latestOverride !== null) return { viewCount: latestOverride, counted: false }
    const claimed = await claimPending(cafeId, requestId)
    if (!claimed) return null
    return trackCafeView(cafeId)
      .then((result) => {
        if (Number.isFinite(result.viewCount)) setCafeViewCountOverride(cafeId, result.viewCount, expiresAt)
        return result
      })
      .catch(() => {
        releasePending(cafeId, requestId)
        return null
      })
  })
    .finally(() => inFlight.delete(cafeId))

  inFlight.set(cafeId, request)
  return request
}
