import type { Cafe, CafeFilter } from "@/types/cafe";

export type QuizProfileId =
  | "cozy-plant-corner"
  | "quiet-city-window"
  | "lively-friends-table"
  | "late-night-work"
  | "vintage-tea-nostalgia"
  | "sunny-iced-coffee"
  | "lazy-afternoon-nap"
  | "deadline-chaos"
  | "aesthetic-latte-shot"
  | "slow-tea-time"
  | "cafe-hopping"
  | "quiet-reading-nook"
  | "neon-wall-selfie"
  | "friends-photo-corner";

export type QuizResultVariant = "man" | "woman";

export type QuizStickerId = "steam" | "sparkle" | "leaf" | "desk" | "date-light" | "city-walk";

export interface QuizScoreTarget {
  profile: QuizProfileId;
  weight: number;
}

export interface QuizOption {
  id: string;
  scores: QuizScoreTarget[];
  vibes: string[];
  purposes: string[];
  tags: string[];
  priceRange?: CafeFilter["priceRange"];
}

export interface QuizQuestion {
  id: string;
  sticker: QuizStickerId;
  options: QuizOption[];
}

export interface LocalizedQuizOption extends QuizOption {
  label: string;
}

export interface LocalizedQuizQuestion extends Omit<QuizQuestion, "options"> {
  text: string;
  options: LocalizedQuizOption[];
}

export interface QuizProfile {
  id: QuizProfileId;
  code: string;
  sticker: QuizStickerId;
  posterImageSlug: string;
  posterImage: string;
  vibes: string[];
  purposes: string[];
  tags: string[];
  priceRange?: CafeFilter["priceRange"];
}

export interface LocalizedQuizProfile extends QuizProfile {
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

export interface QuizResult {
  profile: LocalizedQuizProfile;
  cafes: Array<Cafe & { matchReason: string }>;
  score: number;
  dna: string;
  chips: string[];
}
