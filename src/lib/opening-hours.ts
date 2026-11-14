import type { Cafe } from "@/types/cafe"

const OPENING_HOURS_TIME_ZONE = "Asia/Ho_Chi_Minh"

export type CafeHoursFilter = "open_at_7" | "open_24h"

export function normalizeCafeHoursFilter(value: string | null | undefined): CafeHoursFilter | undefined {
  if (value === "from_7") return "open_at_7"
  return value === "open_at_7" || value === "open_24h" ? value : undefined
}

export function parseOpeningTimeMinutes(time: string | null | undefined): number | null {
  if (!time) return null

  const trimmed = time.trim()
  const match = trimmed.match(/^(\d{1,2}):(\d{2})/) ?? trimmed.match(/T(\d{2}):(\d{2})/)
  if (!match) return null

  const hours = Number(match[1])
  const minutes = Number(match[2])
  if (!Number.isInteger(hours) || !Number.isInteger(minutes)) return null
  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return null

  return hours * 60 + minutes
}

export function getCafeOpenStatus(
  openingTime: string | null | undefined,
  closingTime: string | null | undefined,
  now = new Date(),
): boolean | null {
  const openMins = parseOpeningTimeMinutes(openingTime)
  const closeMins = parseOpeningTimeMinutes(closingTime)
  if (openMins == null || closeMins == null) return null

  if (openMins === closeMins) return true

  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: OPENING_HOURS_TIME_ZONE,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(now)
  const hour = Number(parts.find((part) => part.type === "hour")?.value ?? 0) % 24
  const minute = Number(parts.find((part) => part.type === "minute")?.value ?? 0)
  const nowMins = hour * 60 + minute
  if (closeMins < openMins) return nowMins >= openMins || nowMins < closeMins
  return nowMins >= openMins && nowMins < closeMins
}

export function isCafeOpenNow(cafe: Pick<Cafe, "openingTime" | "closingTime">): boolean {
  return getCafeOpenStatus(cafe.openingTime, cafe.closingTime) === true
}

function parseOpeningTimeSeconds(time: string | null | undefined): number | null {
  const match = time
    ?.trim()
    .match(/^(?:\d{4}-\d{2}-\d{2}T)?(\d{1,2}):(\d{2})(?::(\d{2})(\.\d+)?)?Z?$/)
  if (!match) return null
  const hours = Number(match[1])
  const minutes = Number(match[2])
  const seconds = Number(match[3] ?? 0)
  const fraction = Number(match[4] ?? 0)
  if (hours > 23 || minutes > 59 || seconds > 59) return null
  return hours * 3600 + minutes * 60 + seconds + fraction
}

export function matchesCafeHours(
  cafe: Pick<Cafe, "openingTime" | "closingTime">,
  hours: CafeHoursFilter | undefined,
): boolean {
  if (!hours) return true
  const openingTime = parseOpeningTimeSeconds(cafe.openingTime)
  const closingTime = parseOpeningTimeSeconds(cafe.closingTime)
  if (openingTime == null || closingTime == null) return false
  return hours === "open_at_7" ? openingTime === 7 * 3600 : openingTime === closingTime
}
