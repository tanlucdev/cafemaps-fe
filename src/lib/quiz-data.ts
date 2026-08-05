import type { LocalizedQuizQuestion, QuizOption, QuizProfile } from "@/types/quiz";
import { MORE_QUIZ_QUESTIONS } from "./quiz-data-more";

export const QUIZ_PROFILES: QuizProfile[] = [
  {
    id: "quiet-work-nook",
    code: "QW",
    sticker: "desk",
    posterImage: "/quiz/results/quiet-work-nook.webp",
    vibes: ["yên tĩnh", "minimalist"],
    purposes: ["làm việc", "học tập", "chill một mình"],
    tags: ["quiet", "wifi", "solo"],
    priceRange: "50k_100k",
  },
  {
    id: "garden-reset",
    code: "GR",
    sticker: "leaf",
    posterImage: "/quiz/results/garden-reset.webp",
    vibes: ["thiên nhiên", "yên tĩnh"],
    purposes: ["chill một mình", "gặp bạn bè"],
    tags: ["outdoor", "pet-friendly", "green"],
  },
  {
    id: "vintage-story-corner",
    code: "VS",
    sticker: "steam",
    posterImage: "/quiz/results/vintage-story-corner.webp",
    vibes: ["vintage", "yên tĩnh"],
    purposes: ["chill một mình", "hẹn hò"],
    tags: ["books", "old-saigon", "cozy"],
  },
  {
    id: "date-glow",
    code: "DG",
    sticker: "date-light",
    posterImage: "/quiz/results/date-glow.webp",
    vibes: ["lãng mạn", "vintage"],
    purposes: ["hẹn hò", "gặp bạn bè"],
    tags: ["warm-light", "dessert", "photo"],
    priceRange: "100k_150k",
  },
  {
    id: "creative-hangout",
    code: "CH",
    sticker: "sparkle",
    posterImage: "/quiz/results/creative-hangout.webp",
    vibes: ["sáng tạo", "hiện đại", "nhộn nhịp"],
    purposes: ["gặp bạn bè", "họp nhóm"],
    tags: ["photo", "music", "group"],
  },
  {
    id: "minimal-sprint",
    code: "MS",
    sticker: "city-walk",
    posterImage: "/quiz/results/minimal-sprint.webp",
    vibes: ["minimalist", "hiện đại"],
    purposes: ["làm việc", "ghé nhanh"],
    tags: ["specialty", "quick", "wifi"],
    priceRange: "50k_100k",
  },
];

export const QUIZ_QUESTIONS: Array<
  Omit<LocalizedQuizQuestion, "text" | "options"> & {
    options: QuizOption[];
  }
> = [
  {
    id: "cafe-plan",
    sticker: "desk",
    options: [
      {
        id: "quiet-corner",
        scores: [
          { profile: "quiet-work-nook", weight: 2 },
          { profile: "minimal-sprint", weight: 1 },
        ],
        vibes: ["yên tĩnh", "minimalist"],
        purposes: ["làm việc", "học tập", "chill một mình"],
        tags: ["wifi", "quiet", "solo"],
        priceRange: "50k_100k",
      },
      {
        id: "green-window",
        scores: [
          { profile: "garden-reset", weight: 3 },
          { profile: "vintage-story-corner", weight: 1 },
        ],
        vibes: ["thiên nhiên", "yên tĩnh"],
        purposes: ["chill một mình", "gặp bạn bè"],
        tags: ["green", "outdoor", "sunlight"],
      },
      {
        id: "warm-lamp",
        scores: [
          { profile: "date-glow", weight: 3 },
          { profile: "vintage-story-corner", weight: 1 },
        ],
        vibes: ["lãng mạn", "vintage"],
        purposes: ["hẹn hò", "gặp bạn bè"],
        tags: ["warm-light", "cozy"],
        priceRange: "100k_150k",
      },
      {
        id: "city-buzz",
        scores: [
          { profile: "creative-hangout", weight: 3 },
          { profile: "date-glow", weight: 1 },
        ],
        vibes: ["nhộn nhịp", "hiện đại", "sáng tạo"],
        purposes: ["gặp bạn bè", "họp nhóm"],
        tags: ["photo", "music", "group"],
      },
    ],
  },
  {
    id: "perfect-table",
    sticker: "steam",
    options: [
      {
        id: "book-cup",
        scores: [
          { profile: "vintage-story-corner", weight: 3 },
          { profile: "quiet-work-nook", weight: 1 },
        ],
        vibes: ["vintage", "yên tĩnh"],
        purposes: ["chill một mình"],
        tags: ["books", "cozy"],
      },
      {
        id: "clean-menu",
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
        id: "camera-cake",
        scores: [
          { profile: "creative-hangout", weight: 3 },
          { profile: "date-glow", weight: 1 },
        ],
        vibes: ["sáng tạo", "hiện đại", "nhộn nhịp"],
        purposes: ["gặp bạn bè", "hẹn hò", "họp nhóm"],
        tags: ["photo", "dessert", "group"],
      },
      {
        id: "plant-sun",
        scores: [
          { profile: "garden-reset", weight: 3 },
          { profile: "date-glow", weight: 1 },
        ],
        vibes: ["thiên nhiên", "lãng mạn"],
        purposes: ["chill một mình", "hẹn hò"],
        tags: ["green", "sunlight"],
      },
    ],
  },
  {
    id: "door-sound",
    sticker: "sparkle",
    options: [
      {
        id: "keyboard-soft",
        scores: [
          { profile: "quiet-work-nook", weight: 2 },
          { profile: "minimal-sprint", weight: 1 },
        ],
        vibes: ["yên tĩnh", "minimalist"],
        purposes: ["làm việc", "học tập"],
        tags: ["wifi", "quiet"],
      },
      {
        id: "leaves-glass",
        scores: [{ profile: "garden-reset", weight: 3 }],
        vibes: ["thiên nhiên", "yên tĩnh"],
        purposes: ["chill một mình"],
        tags: ["green", "outdoor"],
      },
      {
        id: "old-record",
        scores: [
          { profile: "vintage-story-corner", weight: 3 },
          { profile: "date-glow", weight: 1 },
        ],
        vibes: ["vintage", "lãng mạn"],
        purposes: ["chill một mình", "gặp bạn bè"],
        tags: ["old-saigon", "warm-light"],
      },
      {
        id: "friends-laughing",
        scores: [{ profile: "creative-hangout", weight: 3 }],
        vibes: ["nhộn nhịp", "sáng tạo"],
        purposes: ["gặp bạn bè", "họp nhóm"],
        tags: ["music", "group"],
      },
    ],
  },
  {
    id: "cute-date",
    sticker: "date-light",
    options: [
      {
        id: "small-talk",
        scores: [
          { profile: "date-glow", weight: 3 },
          { profile: "vintage-story-corner", weight: 1 },
        ],
        vibes: ["lãng mạn", "vintage"],
        purposes: ["hẹn hò"],
        tags: ["warm-light", "dessert"],
        priceRange: "100k_150k",
      },
      {
        id: "walk-after",
        scores: [
          { profile: "garden-reset", weight: 3 },
          { profile: "date-glow", weight: 2 },
        ],
        vibes: ["thiên nhiên", "lãng mạn"],
        purposes: ["hẹn hò", "chill một mình"],
        tags: ["green", "outdoor"],
      },
      {
        id: "photo-booth",
        scores: [
          { profile: "creative-hangout", weight: 3 },
          { profile: "date-glow", weight: 1 },
        ],
        vibes: ["sáng tạo", "hiện đại"],
        purposes: ["gặp bạn bè", "hẹn hò"],
        tags: ["photo", "group"],
      },
      {
        id: "low-key",
        scores: [
          { profile: "quiet-work-nook", weight: 2 },
          { profile: "minimal-sprint", weight: 1 },
        ],
        vibes: ["minimalist", "yên tĩnh"],
        purposes: ["chill một mình", "ghé nhanh"],
        tags: ["quiet", "specialty"],
        priceRange: "50k_100k",
      },
    ],
  },
  {
    id: "rain-plan",
    sticker: "leaf",
    options: [
      {
        id: "rain-work",
        scores: [
          { profile: "quiet-work-nook", weight: 2 },
          { profile: "minimal-sprint", weight: 1 },
        ],
        vibes: ["yên tĩnh", "minimalist"],
        purposes: ["làm việc", "học tập"],
        tags: ["quiet", "wifi"],
        priceRange: "50k_100k",
      },
      {
        id: "rain-window",
        scores: [
          { profile: "garden-reset", weight: 3 },
          { profile: "vintage-story-corner", weight: 1 },
        ],
        vibes: ["thiên nhiên", "yên tĩnh"],
        purposes: ["chill một mình"],
        tags: ["green", "sunlight", "cozy"],
      },
      {
        id: "rain-date",
        scores: [{ profile: "date-glow", weight: 3 }],
        vibes: ["lãng mạn", "vintage"],
        purposes: ["hẹn hò"],
        tags: ["warm-light", "dessert"],
        priceRange: "100k_150k",
      },
      {
        id: "rain-group",
        scores: [{ profile: "creative-hangout", weight: 3 }],
        vibes: ["nhộn nhịp", "sáng tạo"],
        purposes: ["gặp bạn bè", "họp nhóm"],
        tags: ["group", "music"],
      },
    ],
  },
  ...MORE_QUIZ_QUESTIONS,
];
