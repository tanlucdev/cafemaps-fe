import type { LocalizedQuizQuestion, QuizOption, QuizProfileId, QuizScoreTarget } from "@/types/quiz";

type Question = Omit<LocalizedQuizQuestion, "text" | "options"> & { options: QuizOption[] };
const scoreIds: QuizProfileId[] = [
  "cozy-plant-corner", "quiet-city-window", "lively-friends-table", "late-night-work",
  "vintage-tea-nostalgia", "sunny-iced-coffee", "lazy-afternoon-nap", "deadline-chaos",
  "aesthetic-latte-shot", "slow-tea-time", "cafe-hopping", "quiet-reading-nook",
];

const directScores: Record<string, QuizProfileId> = {
  "neon-mirror": "neon-wall-selfie",
  "photo-corner-crew": "friends-photo-corner",
  "solo-selfie": "neon-wall-selfie",
  "group-photo": "friends-photo-corner",
};

const bonusScores: Record<string, QuizScoreTarget[]> = {
  "city-buzz": [{ profile: "friends-photo-corner", weight: 2 }],
  "camera-cake": [{ profile: "neon-wall-selfie", weight: 2 }],
  "friends-laughing": [{ profile: "friends-photo-corner", weight: 2 }],
  "photo-booth": [{ profile: "friends-photo-corner", weight: 2 }],
  "low-key": [{ profile: "neon-wall-selfie", weight: 1 }],
  "rain-group": [{ profile: "friends-photo-corner", weight: 2 }],
  "sweet-latte": [{ profile: "neon-wall-selfie", weight: 1 }],
  "clean-shot": [{ profile: "neon-wall-selfie", weight: 2 }],
  "friends-shot": [{ profile: "friends-photo-corner", weight: 2 }],
  "big-table": [{ profile: "friends-photo-corner", weight: 2 }],
  "sofa-seat": [{ profile: "neon-wall-selfie", weight: 1 }],
  "golden-hour": [{ profile: "neon-wall-selfie", weight: 1 }],
  "split-table": [{ profile: "friends-photo-corner", weight: 2 }],
};

const optionMeta: Record<string, Omit<QuizOption, "id" | "scores">> = {
  "quiet-laptop": m(["yên tĩnh", "minimalist"], ["làm việc"], ["wifi", "ổ điện"], "50k_100k"),
  "green-window": m(["thiên nhiên", "yên tĩnh"], ["chill một mình"], ["green", "window"]),
  "warm-lamp": m(["lãng mạn", "vintage"], ["hẹn hò"], ["warm-light", "cozy"], "100k_150k"),
  "city-buzz": m(["nhộn nhịp", "hiện đại"], ["gặp bạn bè"], ["music", "group"]),
  "book-cup": m(["vintage", "yên tĩnh"], ["học tập"], ["books", "tea"]),
  "clean-espresso": m(["minimalist", "hiện đại"], ["làm việc"], ["specialty", "espresso"], "50k_100k"),
  "camera-cake": m(["sáng tạo", "hiện đại"], ["gặp bạn bè"], ["photo", "dessert"]),
  "plant-sun": m(["thiên nhiên", "hiện đại"], ["chill một mình"], ["green", "sunlight"]),
  "keyboard-soft": m(["yên tĩnh", "minimalist"], ["làm việc"], ["quiet", "wifi"]),
  "leaves-glass": m(["thiên nhiên", "yên tĩnh"], ["chill một mình"], ["green", "iced"]),
  "old-record": m(["vintage", "lãng mạn"], ["chill một mình"], ["old-saigon", "warm-light"]),
  "friends-laughing": m(["nhộn nhịp", "sáng tạo"], ["gặp bạn bè"], ["group", "music"]),
  "small-talk": m(["lãng mạn", "vintage"], ["hẹn hò"], ["warm-light", "dessert"], "100k_150k"),
  "walk-after": m(["thiên nhiên", "lãng mạn"], ["hẹn hò"], ["green", "outdoor"]),
  "photo-booth": m(["sáng tạo", "hiện đại"], ["gặp bạn bè"], ["photo", "group"]),
  "low-key": m(["minimalist", "yên tĩnh"], ["chill một mình"], ["quiet", "espresso"], "50k_100k"),
  "rain-work": m(["yên tĩnh", "minimalist"], ["làm việc"], ["quiet", "wifi"], "50k_100k"),
  "rain-window": m(["thiên nhiên", "yên tĩnh"], ["chill một mình"], ["green", "window"]),
  "rain-date": m(["lãng mạn", "vintage"], ["hẹn hò"], ["warm-light", "dessert"], "100k_150k"),
  "rain-group": m(["nhộn nhịp", "sáng tạo"], ["họp nhóm"], ["group", "music"]),
  "filter-calm": m(["minimalist", "hiện đại"], ["làm việc"], ["specialty", "espresso"], "50k_100k"),
  "sweet-latte": m(["lãng mạn", "hiện đại"], ["hẹn hò"], ["dessert", "photo"]),
  "old-coffee": m(["vintage", "yên tĩnh"], ["chill một mình"], ["old-saigon", "cozy"]),
  "iced-tea": m(["thiên nhiên", "yên tĩnh"], ["chill một mình"], ["tea", "iced"]),
  "clean-shot": m(["minimalist", "hiện đại"], ["làm việc"], ["specialty", "photo"]),
  "leaf-shot": m(["thiên nhiên", "lãng mạn"], ["chill một mình"], ["green", "photo"]),
  "film-shot": m(["vintage", "yên tĩnh"], ["chill một mình"], ["old-saigon", "cozy"]),
  "friends-shot": m(["sáng tạo", "nhộn nhịp"], ["gặp bạn bè"], ["photo", "group"]),
  "corner-seat": m(["yên tĩnh", "minimalist"], ["học tập"], ["quiet", "wifi"]),
  "garden-seat": m(["thiên nhiên", "yên tĩnh"], ["chill một mình"], ["green", "outdoor"]),
  "sofa-seat": m(["lãng mạn", "vintage"], ["hẹn hò"], ["warm-light", "sofa"]),
  "big-table": m(["hiện đại", "sáng tạo"], ["họp nhóm"], ["group", "wifi"]),
  "early-focus": m(["minimalist", "yên tĩnh"], ["làm việc"], ["espresso", "wifi"], "50k_100k"),
  "late-morning": m(["thiên nhiên", "yên tĩnh"], ["chill một mình"], ["green", "sunlight"]),
  "golden-hour": m(["lãng mạn", "hiện đại"], ["hẹn hò"], ["warm-light", "photo"], "100k_150k"),
  "slow-night": m(["vintage", "lãng mạn"], ["chill một mình"], ["old-saigon", "cozy"]),
  "student-friendly": m(["yên tĩnh", "minimalist"], ["học tập"], ["wifi", "quiet"], "50k_100k"),
  "worth-splurge": m(["lãng mạn", "hiện đại"], ["hẹn hò"], ["dessert", "warm-light"], "100k_150k"),
  "stay-long": m(["thiên nhiên", "yên tĩnh"], ["chill một mình"], ["green", "cozy"]),
  "split-table": m(["nhộn nhịp", "sáng tạo"], ["gặp bạn bè"], ["group", "photo"]),
  "neon-mirror": m(["sáng tạo", "hiện đại"], ["gặp bạn bè"], ["photo", "neon"]),
  "photo-corner-crew": m(["nhộn nhịp", "sáng tạo"], ["gặp bạn bè", "họp nhóm"], ["photo", "group"]),
  "solo-selfie": m(["sáng tạo", "hiện đại"], ["chill một mình"], ["photo", "selfie"]),
  "group-photo": m(["nhộn nhịp", "sáng tạo"], ["gặp bạn bè", "họp nhóm"], ["photo", "group"]),
};

export const QUIZ_QUESTIONS: Question[] = [
  q("deadline-hideout", "desk", ["quiet-laptop", "green-window", "warm-lamp", "city-buzz"]),
  q("perfect-table", "steam", ["book-cup", "clean-espresso", "camera-cake", "plant-sun"]),
  q("door-sound", "sparkle", ["keyboard-soft", "leaves-glass", "old-record", "friends-laughing"]),
  q("cute-date", "date-light", ["small-talk", "walk-after", "photo-booth", "low-key"]),
  q("rain-plan", "leaf", ["rain-work", "rain-window", "rain-date", "rain-group"]),
  q("coffee-order", "steam", ["filter-calm", "sweet-latte", "old-coffee", "iced-tea"]),
  q("photo-style", "sparkle", ["clean-shot", "leaf-shot", "film-shot", "friends-shot", "solo-selfie", "group-photo"]),
  q("seat-choice", "desk", ["corner-seat", "garden-seat", "sofa-seat", "big-table"]),
  q("time-of-day", "city-walk", ["early-focus", "late-morning", "golden-hour", "slow-night"]),
  q("budget-mood", "date-light", ["student-friendly", "worth-splurge", "stay-long", "split-table"]),
  q("check-in-mood", "sparkle", ["neon-mirror", "photo-corner-crew"]),
];

function q(id: string, sticker: Question["sticker"], optionIds: string[]): Question {
  return { id, sticker, options: optionIds.map((optionId) => o(optionId)) };
}

function o(id: string): QuizOption {
  const index = Object.keys(optionMeta).indexOf(id);
  const direct = directScores[id];
  const profile = direct ?? scoreIds[index % scoreIds.length];
  const secondary = scoreIds[(index + 3) % scoreIds.length];
  return { id, scores: [{ profile, weight: 3 }, { profile: secondary, weight: 1 }, ...(bonusScores[id] ?? [])], ...optionMeta[id] };
}

function m(vibes: string[], purposes: string[], tags: string[], priceRange?: QuizOption["priceRange"]) {
  return { vibes, purposes, tags, priceRange };
}
