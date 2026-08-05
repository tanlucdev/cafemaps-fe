import type { LocalizedQuizQuestion, QuizOption } from "@/types/quiz";

export const MORE_QUIZ_QUESTIONS: Array<
  Omit<LocalizedQuizQuestion, "text" | "options"> & {
    options: QuizOption[];
  }
> = [
  {
    id: "drink-mood",
    sticker: "steam",
    options: [
      {
        id: "quick-sip",
        scores: [
          { profile: "minimal-sprint", weight: 2 },
          { profile: "quiet-work-nook", weight: 1 },
        ],
        vibes: ["minimalist", "hiện đại"],
        purposes: ["ghé nhanh", "làm việc"],
        tags: ["specialty", "quick"],
        priceRange: "50k_100k",
      },
      {
        id: "mood-drink",
        scores: [
          { profile: "date-glow", weight: 3 },
          { profile: "creative-hangout", weight: 1 },
        ],
        vibes: ["lãng mạn", "hiện đại"],
        purposes: ["hẹn hò", "gặp bạn bè"],
        tags: ["dessert", "photo"],
      },
      {
        id: "familiar-drink",
        scores: [{ profile: "vintage-story-corner", weight: 3 }],
        vibes: ["vintage", "yên tĩnh"],
        purposes: ["chill một mình"],
        tags: ["old-saigon", "cozy"],
      },
      {
        id: "iced-tea",
        scores: [
          { profile: "garden-reset", weight: 3 },
          { profile: "creative-hangout", weight: 1 },
        ],
        vibes: ["thiên nhiên", "yên tĩnh"],
        purposes: ["chill một mình", "gặp bạn bè"],
        tags: ["green", "outdoor"],
      },
    ],
  },
  {
    id: "photo-style",
    sticker: "sparkle",
    options: [
      {
        id: "clean-shot",
        scores: [
          { profile: "minimal-sprint", weight: 2 },
          { profile: "creative-hangout", weight: 1 },
        ],
        vibes: ["minimalist", "hiện đại"],
        purposes: ["ghé nhanh"],
        tags: ["specialty", "photo"],
      },
      {
        id: "leaf-shot",
        scores: [
          { profile: "garden-reset", weight: 3 },
          { profile: "date-glow", weight: 1 },
        ],
        vibes: ["thiên nhiên", "lãng mạn"],
        purposes: ["chill một mình", "hẹn hò"],
        tags: ["green", "photo"],
      },
      {
        id: "film-shot",
        scores: [{ profile: "vintage-story-corner", weight: 3 }],
        vibes: ["vintage", "yên tĩnh"],
        purposes: ["chill một mình"],
        tags: ["old-saigon", "cozy"],
      },
      {
        id: "friends-shot",
        scores: [{ profile: "creative-hangout", weight: 3 }],
        vibes: ["sáng tạo", "nhộn nhịp"],
        purposes: ["gặp bạn bè", "họp nhóm"],
        tags: ["photo", "group"],
      },
    ],
  },
  {
    id: "seat-choice",
    sticker: "desk",
    options: [
      {
        id: "corner-seat",
        scores: [{ profile: "quiet-work-nook", weight: 2 }],
        vibes: ["yên tĩnh", "minimalist"],
        purposes: ["chill một mình", "làm việc", "học tập"],
        tags: ["quiet", "wifi"],
      },
      {
        id: "garden-seat",
        scores: [{ profile: "garden-reset", weight: 3 }],
        vibes: ["thiên nhiên", "yên tĩnh"],
        purposes: ["chill một mình"],
        tags: ["green", "outdoor"],
      },
      {
        id: "sofa-seat",
        scores: [
          { profile: "date-glow", weight: 3 },
          { profile: "vintage-story-corner", weight: 1 },
        ],
        vibes: ["lãng mạn", "vintage"],
        purposes: ["hẹn hò", "gặp bạn bè"],
        tags: ["warm-light", "cozy"],
      },
      {
        id: "big-table",
        scores: [
          { profile: "creative-hangout", weight: 3 },
          { profile: "date-glow", weight: 1 },
        ],
        vibes: ["hiện đại", "sáng tạo", "nhộn nhịp"],
        purposes: ["họp nhóm", "gặp bạn bè"],
        tags: ["group", "photo"],
      },
    ],
  },
  {
    id: "time-of-day",
    sticker: "city-walk",
    options: [
      {
        id: "early-focus",
        scores: [
          { profile: "minimal-sprint", weight: 2 },
          { profile: "quiet-work-nook", weight: 1 },
        ],
        vibes: ["minimalist", "yên tĩnh"],
        purposes: ["ghé nhanh", "làm việc", "học tập"],
        tags: ["quick", "wifi"],
        priceRange: "50k_100k",
      },
      {
        id: "late-morning",
        scores: [{ profile: "garden-reset", weight: 3 }],
        vibes: ["thiên nhiên", "yên tĩnh"],
        purposes: ["chill một mình"],
        tags: ["green", "sunlight"],
      },
      {
        id: "golden-hour",
        scores: [
          { profile: "date-glow", weight: 3 },
          { profile: "creative-hangout", weight: 1 },
        ],
        vibes: ["lãng mạn", "hiện đại"],
        purposes: ["hẹn hò", "gặp bạn bè"],
        tags: ["warm-light", "photo"],
        priceRange: "100k_150k",
      },
      {
        id: "slow-night",
        scores: [
          { profile: "vintage-story-corner", weight: 3 },
          { profile: "date-glow", weight: 1 },
        ],
        vibes: ["vintage", "lãng mạn"],
        purposes: ["chill một mình", "gặp bạn bè", "hẹn hò"],
        tags: ["old-saigon", "cozy"],
      },
    ],
  },
  {
    id: "budget-mood",
    sticker: "date-light",
    options: [
      {
        id: "student-friendly",
        scores: [
          { profile: "quiet-work-nook", weight: 2 },
          { profile: "minimal-sprint", weight: 1 },
        ],
        vibes: ["yên tĩnh", "minimalist"],
        purposes: ["học tập", "làm việc", "chill một mình"],
        tags: ["wifi", "quiet"],
        priceRange: "50k_100k",
      },
      {
        id: "worth-splurge",
        scores: [{ profile: "date-glow", weight: 3 }],
        vibes: ["lãng mạn", "hiện đại"],
        purposes: ["hẹn hò"],
        tags: ["dessert", "warm-light"],
        priceRange: "100k_150k",
      },
      {
        id: "stay-long",
        scores: [
          { profile: "garden-reset", weight: 3 },
          { profile: "vintage-story-corner", weight: 1 },
        ],
        vibes: ["thiên nhiên", "yên tĩnh"],
        purposes: ["chill một mình", "gặp bạn bè"],
        tags: ["green", "cozy"],
      },
      {
        id: "split-table",
        scores: [{ profile: "creative-hangout", weight: 3 }],
        vibes: ["nhộn nhịp", "sáng tạo"],
        purposes: ["gặp bạn bè", "họp nhóm"],
        tags: ["group", "photo"],
      },
    ],
  },
];
