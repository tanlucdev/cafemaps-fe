import type { Cafe } from "@/types/cafe";

export type InstagramLink = {
  href: string;
  label: string;
};

export type PhotoCreditWithInstagram = NonNullable<Cafe["photoCredits"]>[number] & {
  instagram: InstagramLink;
  key: string;
};

export interface CafeDetailInfoProps {
  cafe: Cafe;
  locale: string;
  saved: boolean;
  loadingSave: boolean;
  visited: boolean;
  loadingVisited: boolean;
  mapsUrl: string;
  saveLabel: string;
  visitedLabel: string;
  voteLabel: string;
  votedLabel: string;
  voted: boolean;
  loadingVote: boolean;
  directionsLabel: string;
  onSave: () => void | Promise<void>;
  onVisited: () => void | Promise<void>;
  onVote: () => void | Promise<void>;
}

export type DetailActionsProps = Omit<CafeDetailInfoProps, "cafe" | "locale"> & {
  saveAriaLabel: string;
  visitedAriaLabel: string;
};

export type GoodForItem = {
  emoji: string;
  label: string;
};

export type ResolvedDistance = Pick<Cafe, "distanceKm" | "distanceMode" | "durationMin">;

export type CafeTextAliases = Cafe & {
  onlineEn?: string | null;
  online_en?: string | null;
  one_line_en?: string | null;
};

export type LocalizedText = {
  vi?: string | null;
  en?: string | null;
};
