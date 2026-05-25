import type { Cafe } from "@/types/cafe"

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

  const nowMins = now.getHours() * 60 + now.getMinutes()
  if (closeMins < openMins) return nowMins >= openMins || nowMins < closeMins
  return nowMins >= openMins && nowMins < closeMins
}

export function isCafeOpenNow(cafe: Pick<Cafe, "openingTime" | "closingTime">): boolean {
  return getCafeOpenStatus(cafe.openingTime, cafe.closingTime) === true
}
