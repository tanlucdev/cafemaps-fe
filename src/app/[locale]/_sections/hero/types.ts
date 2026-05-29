import type { Cafe } from "@/types/cafe";

export type KeywordFilter = {
  keywords: string[];
  vibe?: string;
  purpose?: string;
};

export type HeroImage = {
  src: string;
  captionKey: string;
};

export type BackgroundCafe = {
  name: string;
  src: string;
  tileClassName: string;
};

export type PolaroidItem = {
  image: HeroImage;
  className: string;
};

export type QuickFilter = {
  emoji: string;
  labelKey: string;
  vibe?: string;
  purpose?: string;
  openNow?: boolean;
  featured?: boolean;
};

export type SmartSuggestion = {
  label: string;
  query: string;
};

export type CafeSuggestion = Cafe;
