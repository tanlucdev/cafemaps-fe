import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const VND_PER_USD = 26300

export function formatPrice(
  min?: number | null,
  max?: number | null,
  locale = "vi",
): string {
  if (!min && !max) return ""
  const isEnglish = locale.toLowerCase().startsWith("en")
  const fmt = isEnglish
    ? (n: number) => `$${Math.max(1, Math.round(n / VND_PER_USD))}`
    : (n: number) => (n >= 1000 ? `${Math.round(n / 1000)}k` : `${n}`)
  if (min && max) return `${fmt(min)}–${fmt(max)}`
  if (min) return isEnglish ? `from ${fmt(min)}` : `từ ${fmt(min)}`
  if (max) return isEnglish ? `up to ${fmt(max)}` : `đến ${fmt(max)}`
  return ""
}

export function formatOpeningHours(openingTime?: string | null, closingTime?: string | null): string {
  if (!openingTime && !closingTime) return ""
  const fmt = (t: string) => t.slice(0, 5)
  if (openingTime && closingTime) return `${fmt(openingTime)} – ${fmt(closingTime)}`
  if (openingTime) return `từ ${fmt(openingTime)}`
  if (closingTime) return `đến ${fmt(closingTime)}`
  return ""
}
