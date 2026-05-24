import type { Cafe } from "@/types/cafe";

export type KeywordFilter = {
  keywords: string[];
  vibe?: string;
  purpose?: string;
};

export type HeroImage = {
  src: string;
  alt: string;
  caption: {
    vi: string;
    en: string;
  };
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
  label: {
    vi: string;
    en: string;
  };
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
