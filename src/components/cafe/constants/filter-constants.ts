import type { ReactNode } from "react";
import { createElement } from "react";
import type { Vibe, Purpose } from "@/types/cafe";
import { VIBES, PURPOSES } from "@/types/cafe";

export const TOP_VIBES: Vibe[] = ["yên tĩnh", "vintage", "thiên nhiên", "hiện đại"];

export { VIBES, PURPOSES };

export const PRICE_OPTIONS: { value: string; translationKey: string }[] = [
  { value: "under_50k", translationKey: "under_50k" },
  { value: "price_50k_100k", translationKey: "50k_100k" },
  { value: "price_100k_150k", translationKey: "100k_150k" },
  { value: "above_150k", translationKey: "above_150k" },
];

export const DISTANCE_OPTIONS: { km: number }[] = [{ km: 2 }, { km: 5 }, { km: 10 }];

export const FILTER_TAGS = ["ngoài trời", "chỗ hút thuốc"] as const;
export type FilterTag = (typeof FILTER_TAGS)[number];

// Map from Vibe type value to translation key in filters.vibes
export const VIBE_TRANSLATION_KEYS: Record<Vibe, string> = {
  "yên tĩnh": "quiet",
  "nhộn nhịp": "lively",
  vintage: "vintage",
  "hiện đại": "modern",
  "thiên nhiên": "nature",
  "sáng tạo": "creative",
  "lãng mạn": "romantic",
  minimalist: "minimalist",
};

// Map from Purpose type value to translation key in filters.purposes
export const PURPOSE_TRANSLATION_KEYS: Record<Purpose, string> = {
  "làm việc": "work",
  "học tập": "study",
  "hẹn hò": "date",
  "họp nhóm": "group",
  "chill một mình": "solo",
  "gặp bạn bè": "friends",
  "chụp ảnh": "photo",
};

// Map from priceRange value to translation key in filters.priceRanges
export const PRICE_RANGE_TRANSLATION_KEYS: Record<string, string> = {
  under_50k: "under_50k",
  price_50k_100k: "50k_100k",
  price_100k_150k: "100k_150k",
  above_150k: "above_150k",
};

export const TAG_TRANSLATION_KEYS: Record<FilterTag, string> = {
  "ngoài trời": "outdoor",
  "chỗ hút thuốc": "smoking",
};

// ponytail: 72px WebP covers 18px chips up to 4× density; regenerate for larger UI.
function filterIcon(slug: string): ReactNode {
  return createElement("img", {
    src: `/image/christmas/filter/${slug}.webp`,
    width: 18,
    height: 18,
    alt: "",
    "aria-hidden": true,
    loading: "lazy",
    decoding: "async",
    draggable: false,
    className: "shrink-0 object-contain pointer-events-none select-none",
  });
}

export const VIBE_ICONS: Record<Vibe, ReactNode> = {
  "yên tĩnh": filterIcon("vibe-yen-tinh"),
  "nhộn nhịp": filterIcon("vibe-nhon-nhip"),
  vintage: filterIcon("vibe-vintage"),
  "hiện đại": filterIcon("vibe-hien-dai"),
  "thiên nhiên": filterIcon("vibe-thien-nhien"),
  "sáng tạo": filterIcon("vibe-sang-tao"),
  "lãng mạn": filterIcon("vibe-lang-man"),
  minimalist: filterIcon("vibe-minimalist"),
};

export const PURPOSE_ICONS: Record<Purpose, ReactNode> = {
  "làm việc": filterIcon("purpose-lam-viec"),
  "học tập": filterIcon("purpose-hoc-tap"),
  "hẹn hò": filterIcon("purpose-hen-ho"),
  "họp nhóm": filterIcon("purpose-hop-nhom"),
  "chill một mình": filterIcon("purpose-chill-mot-minh"),
  "gặp bạn bè": filterIcon("purpose-gap-ban-be"),
  "chụp ảnh": filterIcon("purpose-check-in-chup-anh"),
};

export const TAG_ICONS: Record<FilterTag, ReactNode> = {
  "ngoài trời": filterIcon("utility-ngoai-troi"),
  "chỗ hút thuốc": filterIcon("utility-cho-hut-thuoc"),
};
