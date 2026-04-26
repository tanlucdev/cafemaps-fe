import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { PriceRange } from "@/types/cafe"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const PRICE_LABELS: Record<PriceRange, string> = {
  under_50k: "< 50k",
  "50k_100k": "50–100k",
  "100k_150k": "100–150k",
  above_150k: "> 150k",
}

export function formatPriceRange(range?: PriceRange | null): string {
  if (!range) return ""
  return PRICE_LABELS[range] ?? range
}
