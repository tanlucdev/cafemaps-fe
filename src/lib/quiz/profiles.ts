import type { QuizProfile, QuizProfileId, QuizResultVariant } from "@/types/quiz";

const ids = [
  "cozy-plant-corner",
  "quiet-city-window",
  "lively-friends-table",
  "late-night-work",
  "vintage-tea-nostalgia",
  "sunny-iced-coffee",
  "lazy-afternoon-nap",
  "deadline-chaos",
  "aesthetic-latte-shot",
  "slow-tea-time",
  "cafe-hopping",
  "quiet-reading-nook",
  "neon-wall-selfie",
  "friends-photo-corner",
] as const satisfies readonly QuizProfileId[];

export const QUIZ_PROFILE_IDS = ids;

export const OLD_QUIZ_PROFILE_IDS: Record<string, QuizProfileId> = {
  "quiet-work-nook": "quiet-reading-nook",
  "garden-reset": "cozy-plant-corner",
  "vintage-story-corner": "vintage-tea-nostalgia",
  "date-glow": "slow-tea-time",
  "creative-hangout": "lively-friends-table",
  "minimal-sprint": "late-night-work",
};

export const QUIZ_PROFILES: QuizProfile[] = [
  p("cozy-plant-corner", "CP", "leaf", ["thiên nhiên", "yên tĩnh"], ["chill một mình"], ["green", "cozy"]),
  p("quiet-city-window", "QC", "city-walk", ["yên tĩnh", "hiện đại"], ["học tập"], ["window", "quiet"], "50k_100k"),
  p("lively-friends-table", "LF", "sparkle", ["nhộn nhịp", "sáng tạo"], ["gặp bạn bè", "họp nhóm"], ["group", "music"]),
  p("late-night-work", "LW", "desk", ["minimalist", "hiện đại"], ["làm việc"], ["wifi", "ổ điện"], "50k_100k"),
  p("vintage-tea-nostalgia", "VT", "steam", ["vintage", "yên tĩnh"], ["chill một mình"], ["old-saigon", "tea"]),
  p("sunny-iced-coffee", "SI", "date-light", ["hiện đại", "thiên nhiên"], ["gặp bạn bè"], ["sunlight", "iced"]),
  p("lazy-afternoon-nap", "LA", "leaf", ["ấm cúng", "yên tĩnh"], ["chill một mình"], ["sofa", "cozy"]),
  p("deadline-chaos", "DC", "desk", ["nhộn nhịp", "hiện đại"], ["làm việc", "họp nhóm"], ["wifi", "group"]),
  p("aesthetic-latte-shot", "AL", "sparkle", ["sáng tạo", "hiện đại"], ["gặp bạn bè"], ["photo", "dessert"]),
  p("slow-tea-time", "ST", "date-light", ["lãng mạn", "vintage"], ["hẹn hò"], ["warm-light", "tea"], "100k_150k"),
  p("cafe-hopping", "CH", "city-walk", ["hiện đại", "nhộn nhịp"], ["gặp bạn bè"], ["specialty", "photo"]),
  p("quiet-reading-nook", "QR", "steam", ["yên tĩnh", "vintage"], ["học tập", "chill một mình"], ["books", "quiet"]),
  p("neon-wall-selfie", "NW", "sparkle", ["sáng tạo", "hiện đại"], ["gặp bạn bè"], ["photo", "neon"]),
  p("friends-photo-corner", "FP", "sparkle", ["nhộn nhịp", "sáng tạo"], ["gặp bạn bè", "họp nhóm"], ["photo", "group"]),
];

export function resolveQuizPosterImage(slug: string, variant: QuizResultVariant = "woman") {
  return `/quiz/results/${variant}/${slug}.webp`;
}

export function resolveQuizWideImage(slug: string, variant: QuizResultVariant = "woman") {
  return `/quiz/wide/${variant}/${slug}.webp`;
}

export function normalizeQuizProfileId(value: unknown) {
  if (typeof value !== "string") return undefined;
  return ids.includes(value as QuizProfileId)
    ? (value as QuizProfileId)
    : OLD_QUIZ_PROFILE_IDS[value];
}

export function normalizeQuizResultVariant(value: unknown): QuizResultVariant {
  return value === "man" || value === "woman" ? value : "woman";
}

function p(
  id: QuizProfileId,
  code: string,
  sticker: QuizProfile["sticker"],
  vibes: string[],
  purposes: string[],
  tags: string[],
  priceRange?: QuizProfile["priceRange"],
): QuizProfile {
  const posterImageSlug = `${ids.indexOf(id) + 1}-${id}`;
  return { id, code, sticker, posterImageSlug, posterImage: resolveQuizPosterImage(posterImageSlug), vibes, purposes, tags, priceRange };
}
