import type { Cafe } from "@/types/cafe";
import type {
  LocalizedQuizProfile,
  LocalizedQuizQuestion,
  QuizOption,
  QuizProfile,
  QuizProfileId,
  QuizResult,
} from "@/types/quiz";

export type QuizMessages = {
  questions: Array<{
    id: string;
    text: string;
    options: Array<{ id: string; label: string }>;
  }>;
  profiles: Record<
    QuizProfileId,
    {
      title: string;
      subtitle: string;
      description: string;
      shareTitle: string;
      shareDescription: string;
      reasons: string[];
      personalityTraits: string[];
      bestFor: string[];
      avoidWhen: string[];
    }
  >;
  matchReasons: Record<QuizProfileId, string[]>;
};

export const QUIZ_PROFILES: QuizProfile[] = [
  {
    id: "quiet-work-nook",
    code: "QW",
    sticker: "desk",
    posterImage: "/quiz/results/quiet-work-nook.webp",
    vibes: ["yên tĩnh", "minimalist"],
    purposes: ["làm việc", "học tập", "chill một mình"],
    tags: ["wifi", "ổ điện", "quiet"],
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
    purposes: ["chill một mình", "học tập"],
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
    purposes: ["làm việc", "học tập"],
    tags: ["specialty", "espresso", "wifi"],
    priceRange: "50k_100k",
  },
];

export const QUIZ_QUESTIONS: Array<
  Omit<LocalizedQuizQuestion, "text" | "options"> & {
    options: QuizOption[];
  }
> = [
  {
    id: "deadline-hideout",
    sticker: "desk",
    options: [
      {
        id: "quiet-laptop",
        scores: [
          { profile: "quiet-work-nook", weight: 3 },
          { profile: "minimal-sprint", weight: 1 },
        ],
        vibes: ["yên tĩnh", "minimalist"],
        purposes: ["làm việc", "học tập"],
        tags: ["wifi", "ổ điện"],
        priceRange: "50k_100k",
      },
      {
        id: "green-window",
        scores: [
          { profile: "garden-reset", weight: 3 },
          { profile: "quiet-work-nook", weight: 1 },
        ],
        vibes: ["thiên nhiên", "yên tĩnh"],
        purposes: ["chill một mình", "học tập"],
        tags: ["green", "outdoor"],
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
          { profile: "minimal-sprint", weight: 1 },
        ],
        vibes: ["nhộn nhịp", "hiện đại", "sáng tạo"],
        purposes: ["gặp bạn bè", "họp nhóm"],
        tags: ["photo", "music"],
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
        purposes: ["chill một mình", "học tập"],
        tags: ["books", "cozy"],
      },
      {
        id: "clean-espresso",
        scores: [
          { profile: "minimal-sprint", weight: 3 },
          { profile: "quiet-work-nook", weight: 1 },
        ],
        vibes: ["minimalist", "hiện đại"],
        purposes: ["làm việc"],
        tags: ["specialty", "espresso"],
        priceRange: "50k_100k",
      },
      {
        id: "camera-cake",
        scores: [
          { profile: "creative-hangout", weight: 3 },
          { profile: "date-glow", weight: 1 },
        ],
        vibes: ["sáng tạo", "hiện đại"],
        purposes: ["gặp bạn bè", "hẹn hò"],
        tags: ["photo", "dessert"],
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
          { profile: "quiet-work-nook", weight: 3 },
          { profile: "minimal-sprint", weight: 2 },
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
          { profile: "garden-reset", weight: 2 },
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
          { profile: "minimal-sprint", weight: 2 },
          { profile: "quiet-work-nook", weight: 2 },
        ],
        vibes: ["minimalist", "yên tĩnh"],
        purposes: ["làm việc", "chill một mình"],
        tags: ["quiet", "espresso"],
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
          { profile: "quiet-work-nook", weight: 3 },
          { profile: "minimal-sprint", weight: 1 },
        ],
        vibes: ["yên tĩnh", "minimalist"],
        purposes: ["làm việc", "học tập"],
        tags: ["quiet", "wifi", "ổ điện"],
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
  {
    id: "coffee-order",
    sticker: "steam",
    options: [
      {
        id: "filter-calm",
        scores: [
          { profile: "minimal-sprint", weight: 3 },
          { profile: "quiet-work-nook", weight: 1 },
        ],
        vibes: ["minimalist", "hiện đại"],
        purposes: ["làm việc", "chill một mình"],
        tags: ["specialty", "espresso"],
        priceRange: "50k_100k",
      },
      {
        id: "sweet-latte",
        scores: [
          { profile: "date-glow", weight: 3 },
          { profile: "creative-hangout", weight: 1 },
        ],
        vibes: ["lãng mạn", "hiện đại"],
        purposes: ["hẹn hò", "gặp bạn bè"],
        tags: ["dessert", "photo"],
      },
      {
        id: "old-coffee",
        scores: [{ profile: "vintage-story-corner", weight: 3 }],
        vibes: ["vintage", "yên tĩnh"],
        purposes: ["chill một mình"],
        tags: ["old-saigon", "cozy"],
      },
      {
        id: "iced-tea",
        scores: [{ profile: "garden-reset", weight: 3 }],
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
        scores: [{ profile: "minimal-sprint", weight: 3 }],
        vibes: ["minimalist", "hiện đại"],
        purposes: ["làm việc"],
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
        scores: [{ profile: "quiet-work-nook", weight: 3 }],
        vibes: ["yên tĩnh", "minimalist"],
        purposes: ["làm việc", "học tập"],
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
          { profile: "minimal-sprint", weight: 1 },
        ],
        vibes: ["hiện đại", "sáng tạo"],
        purposes: ["họp nhóm", "gặp bạn bè"],
        tags: ["group", "wifi"],
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
          { profile: "minimal-sprint", weight: 3 },
          { profile: "quiet-work-nook", weight: 2 },
        ],
        vibes: ["minimalist", "yên tĩnh"],
        purposes: ["làm việc", "học tập"],
        tags: ["espresso", "wifi"],
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
        scores: [{ profile: "vintage-story-corner", weight: 3 }],
        vibes: ["vintage", "lãng mạn"],
        purposes: ["chill một mình", "gặp bạn bè"],
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
          { profile: "minimal-sprint", weight: 2 },
        ],
        vibes: ["yên tĩnh", "minimalist"],
        purposes: ["học tập", "làm việc"],
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
        purposes: ["chill một mình", "học tập"],
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

export function getLocalizedQuizQuestions(messages: QuizMessages): LocalizedQuizQuestion[] {
  return QUIZ_QUESTIONS.map((question) => {
    const copy = messages.questions.find((item) => item.id === question.id);
    return {
      ...question,
      text: copy?.text ?? question.id,
      options: question.options.map((option) => ({
        ...option,
        label: copy?.options.find((item) => item.id === option.id)?.label ?? option.id,
      })),
    };
  });
}

export function getLocalizedQuizProfiles(messages: QuizMessages): LocalizedQuizProfile[] {
  return QUIZ_PROFILES.map((profile) => ({
    ...profile,
    title: messages.profiles[profile.id].title,
    subtitle: messages.profiles[profile.id].subtitle,
    description: messages.profiles[profile.id].description,
    shareTitle: messages.profiles[profile.id].shareTitle,
    shareDescription: messages.profiles[profile.id].shareDescription,
    reasons: messages.profiles[profile.id].reasons,
    personalityTraits: messages.profiles[profile.id].personalityTraits,
    bestFor: messages.profiles[profile.id].bestFor,
    avoidWhen: messages.profiles[profile.id].avoidWhen,
  }));
}

export function resolveQuizResult({
  answers,
  cafes,
  messages,
}: {
  answers: QuizOption[];
  cafes: Cafe[];
  messages: QuizMessages;
}): QuizResult {
  const scores = new Map<QuizProfileId, number>();
  for (const profile of QUIZ_PROFILES) scores.set(profile.id, 0);

  for (const answer of answers) {
    for (const target of answer.scores) {
      scores.set(target.profile, (scores.get(target.profile) ?? 0) + target.weight);
    }
  }

  const winnerId = [...scores.entries()].sort(
    (a, b) => b[1] - a[1] || profileOrder(a[0]) - profileOrder(b[0]),
  )[0][0];
  const profiles = getLocalizedQuizProfiles(messages);
  const profile = profiles.find((item) => item.id === winnerId) ?? profiles[0];
  const topScore = Math.max(1, scores.get(profile.id) ?? 1);
  const selectedVibes = unique([...profile.vibes, ...answers.flatMap((answer) => answer.vibes)]);
  const selectedPurposes = unique([
    ...profile.purposes,
    ...answers.flatMap((answer) => answer.purposes),
  ]);
  const selectedTags = unique([...profile.tags, ...answers.flatMap((answer) => answer.tags)]);
  const selectedPriceRange =
    [...answers].reverse().find((answer) => answer.priceRange)?.priceRange ?? profile.priceRange;

  const ranked = cafes
    .map((cafe, index) => {
      const vibeMatches = selectedVibes.filter((vibe) => cafe.vibes.includes(vibe)).length;
      const purposeMatches = selectedPurposes.filter((purpose) =>
        cafe.purposes.includes(purpose),
      ).length;
      const tagMatches = selectedTags.filter((tag) =>
        cafe.tags.map(normalize).includes(normalize(tag)),
      ).length;
      const priceMatch = selectedPriceRange ? priceRangeMatches(cafe, selectedPriceRange) : false;
      return {
        cafe,
        index,
        score: vibeMatches * 4 + purposeMatches * 3 + tagMatches * 2 + (priceMatch ? 1 : 0),
      };
    })
    .sort((a, b) => b.score - a.score || a.index - b.index);

  const reasons = messages.matchReasons[profile.id];
  const matchedCafes = ranked.slice(0, 6).map(({ cafe }, index) => ({
    ...cafe,
    matchReason: reasons[index % reasons.length],
  }));

  return {
    profile,
    cafes: matchedCafes,
    score: Math.min(98, Math.round((topScore / Math.max(1, answers.length * 3)) * 100)),
    dna: createQuizDna(profile, answers),
    chips: unique([
      ...profile.reasons,
      ...selectedVibes.slice(0, 2),
      ...selectedPurposes.slice(0, 1),
    ]).slice(0, 6),
  };
}

export function resolveQuizPreviewResult({
  profileId,
  dna,
  cafes,
  messages,
}: {
  profileId: QuizProfileId;
  dna?: string;
  cafes: Cafe[];
  messages: QuizMessages;
}): QuizResult {
  const profiles = getLocalizedQuizProfiles(messages);
  const profile = profiles.find((item) => item.id === profileId) ?? profiles[0];
  const selectedVibes = unique(profile.vibes);
  const selectedPurposes = unique(profile.purposes);
  const selectedTags = unique(profile.tags);
  const ranked = cafes
    .map((cafe, index) => {
      const vibeMatches = selectedVibes.filter((vibe) => cafe.vibes.includes(vibe)).length;
      const purposeMatches = selectedPurposes.filter((purpose) =>
        cafe.purposes.includes(purpose),
      ).length;
      const tagMatches = selectedTags.filter((tag) =>
        cafe.tags.map(normalize).includes(normalize(tag)),
      ).length;
      const priceMatch = profile.priceRange ? priceRangeMatches(cafe, profile.priceRange) : false;
      return {
        cafe,
        index,
        score: vibeMatches * 4 + purposeMatches * 3 + tagMatches * 2 + (priceMatch ? 1 : 0),
      };
    })
    .sort((a, b) => b.score - a.score || a.index - b.index);
  const reasons = messages.matchReasons[profile.id];
  const matchedCafes = ranked.slice(0, 6).map(({ cafe }, index) => ({
    ...cafe,
    matchReason: reasons[index % reasons.length],
  }));

  return {
    profile,
    cafes: matchedCafes,
    score: 88,
    dna: dna && dna.startsWith(`${profile.code}-`) ? dna : `${profile.code}-0000-0000`,
    chips: unique([...profile.reasons, ...profile.personalityTraits, ...profile.bestFor]).slice(
      0,
      6,
    ),
  };
}

export function isQuizProfileId(value: unknown): value is QuizProfileId {
  return typeof value === "string" && QUIZ_PROFILES.some((profile) => profile.id === value);
}

function profileOrder(id: QuizProfileId) {
  return QUIZ_PROFILES.findIndex((profile) => profile.id === id);
}

function unique(values: string[]) {
  return [...new Set(values.filter(Boolean))];
}

function createQuizDna(profile: LocalizedQuizProfile, answers: QuizOption[]) {
  const path = answers
    .map((answer, questionIndex) => {
      const optionIndex =
        QUIZ_QUESTIONS[questionIndex]?.options.findIndex((option) => option.id === answer.id) ?? -1;
      return Math.max(0, optionIndex) + 1;
    })
    .join("");
  const seed = answers.reduce(
    (total, answer, answerIndex) => {
      const optionScore = answer.scores.reduce(
        (sum, target) => sum + profileOrder(target.profile) * 7 + target.weight * 13,
        0,
      );
      return total + optionScore * (answerIndex + 3);
    },
    profileOrder(profile.id) * 97,
  );
  const left = String((seed * 31 + path.length * 17) % 10000).padStart(4, "0");
  const right = String((seed * 47 + Number(path.slice(-4) || 0)) % 10000).padStart(4, "0");
  return `${profile.code}-${left}-${right}`;
}

function normalize(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[\s_-]+/g, "");
}

function priceRangeMatches(cafe: Cafe, priceRange: string) {
  const min = cafe.priceMin ?? 0;
  const max = cafe.priceMax ?? min;
  if (priceRange === "under_50k") return min < 50000;
  if (priceRange === "50k_100k" || priceRange === "price_50k_100k")
    return min <= 100000 && max >= 50000;
  if (priceRange === "100k_150k" || priceRange === "price_100k_150k")
    return min <= 150000 && max >= 100000;
  if (priceRange === "above_150k") return max > 150000;
  return true;
}
