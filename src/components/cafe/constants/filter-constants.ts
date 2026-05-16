import type { ReactNode } from "react";
import {
  Zap,
  Sparkles,
  Heart,
  Minus,
  Coffee,
  Palette,
  Leaf,
  Briefcase,
  BookOpen,
  Users,
  User,
} from "lucide-react";
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
};

// Map from priceRange value to translation key in filters.priceRanges
export const PRICE_RANGE_TRANSLATION_KEYS: Record<string, string> = {
  under_50k: "under_50k",
  price_50k_100k: "50k_100k",
  price_100k_150k: "100k_150k",
  above_150k: "above_150k",
};

export const VIBE_ICONS: Record<Vibe, ReactNode> = {
  "yên tĩnh": createElement(Minus, { size: 11 }),
  "nhộn nhịp": createElement(Zap, { size: 11 }),
  vintage: createElement(Coffee, { size: 11 }),
  "hiện đại": createElement(Sparkles, { size: 11 }),
  "thiên nhiên": createElement(Leaf, { size: 11 }),
  "sáng tạo": createElement(Palette, { size: 11 }),
  "lãng mạn": createElement(Heart, { size: 11 }),
  minimalist: createElement(Minus, { size: 11 }),
};

export const PURPOSE_ICONS: Record<Purpose, ReactNode> = {
  "làm việc": createElement(Briefcase, { size: 11 }),
  "học tập": createElement(BookOpen, { size: 11 }),
  "hẹn hò": createElement(Heart, { size: 11 }),
  "họp nhóm": createElement(Users, { size: 11 }),
  "chill một mình": createElement(User, { size: 11 }),
  "gặp bạn bè": createElement(Users, { size: 11 }),
};
