import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(min?: number | null, max?: number | null): string {
  if (!min && !max) return ""
  const fmt = (n: number) => (n >= 1000 ? `${Math.round(n / 1000)}k` : `${n}`)
  if (min && max) return `${fmt(min)}–${fmt(max)}`
  if (min) return `từ ${fmt(min)}`
  if (max) return `đến ${fmt(max)}`
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
