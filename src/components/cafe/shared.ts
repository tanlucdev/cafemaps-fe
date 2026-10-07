import { formatCafeRating } from "@/lib/cafe-rating";
import type { Cafe } from "@/types/cafe";

export interface CafeCardProps {
  cafe: Cafe;
  locale: string;
  index?: number;
  animationType?: "slide" | "fade";
  variant?: "default" | "cinematic";
  imageEager?: boolean;
  mobileCompact?: boolean;
  initialSaved?: boolean;
  onSavedChange?: (saved: boolean) => void;
}

export interface CafeListProps {
  cafes: Cafe[];
  locale: string;
  animationType?: "slide" | "fade";
  variant?: "default" | "cinematic";
  eagerFirstImage?: boolean;
}

export const VIBE_TAG_CLASSES: Record<string, string> = {
  quiet: "bg-[#E6EEF8] text-[#2A5278] dark:bg-[#12203A] dark:text-[#90B4D8]",
  lively: "bg-[#FEF2E6] text-[#B85C0A] dark:bg-[#3A2010] dark:text-[#F3A66A]",
  vintage: "bg-[#F5E8F3] text-[#893568] dark:bg-[#3A1630] dark:text-[#E09AC8]",
  modern: "bg-[#E6F2ED] text-[#1E6640] dark:bg-[#12321E] dark:text-[#7DC89E]",
  nature: "bg-[#E8F2E8] text-[#2B6E2B] dark:bg-[#142814] dark:text-[#90C890]",
  creative: "bg-[#FFF1E6] text-[#B84E0A] dark:bg-[#3A1E0A] dark:text-[#F3A66A]",
  romantic: "bg-[#FDEEF4] text-[#B4325E] dark:bg-[#3A1224] dark:text-[#E890B4]",
  minimalist: "bg-[#EEEAF8] text-[#5B4A8A] dark:bg-[#22183A] dark:text-[#B8A8E0]",
};

export function ratingFor(cafe: Cafe, index: number) {
  return formatCafeRating(cafe, 4.5 + (index % 5) * 0.1);
}
