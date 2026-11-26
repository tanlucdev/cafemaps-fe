import type { Cafe } from "@/types/cafe";

export type RawCafe = Omit<
  Cafe,
  | "vibes"
  | "purposes"
  | "amenities"
  | "tags"
  | "images"
  | "image_orientations"
  | "isPublished"
  | "distanceKm"
  | "durationMin"
  | "distanceMode"
  | "straightDistanceKm"
  | "rating"
  | "averageRating"
  | "curatedRating"
  | "reviewCount"
  | "savedCount"
  | "viewCount"
  | "weeklyVoteCount"
  | "voteCount"
  | "hasUserVote"
> & {
  vibes?: string[];
  vibe?: string[];
  vibesEn?: string[];
  vibes_en?: string[];
  purposes?: string[];
  purpose?: string[];
  purposesEn?: string[];
  purposes_en?: string[];
  amenities?: string[];
  amenitiesEn?: string[];
  amenities_en?: string[];
  tags?: string[];
  tagsEn?: string[];
  tags_en?: string[];
  images?: string[];
  image_orientations?: string[] | null;
  imageOrientations?: string[] | null;
  image_orientation?: string[] | null;
  imageOrientation?: string[] | null;
  menu_image?: string | null;
  menu_images?: string[] | null;
  website_url?: string | null;
  website?: string | null;
  opening_time?: string | null;
  opening_time_local?: string | null;
  closing_time?: string | null;
  closing_time_local?: string | null;
  isPublished?: boolean;
  location?: string;
  distance_km?: number | string | null;
  distanceKm?: number | string | null;
  duration_min?: number | string | null;
  durationMin?: number | string | null;
  distance_mode?: "straight" | "route" | null;
  distanceMode?: "straight" | "route" | null;
  straight_distance_km?: number | string | null;
  straightDistanceKm?: number | string | null;
  rating?: number | string | null;
  average_rating?: number | string | null;
  averageRating?: number | string | null;
  curated_rating?: number | string | null;
  curatedRating?: number | string | null;
  review_count?: number | string | null;
  reviewCount?: number | string | null;
  saved_count?: number | string | null;
  savedCount?: number | string | null;
  view_count?: number | string | null;
  viewCount?: number | string | null;
  weekly_vote_count?: number | string | null;
  weeklyVoteCount?: number | string | null;
  vote_count?: number | string | null;
  voteCount?: number | string | null;
  has_user_vote?: boolean | null;
  hasUserVote?: boolean | null;
  name_en?: string | null;
  address_en?: string | null;
  district_en?: string | null;
  one_liner_en?: string | null;
  onlineEn?: string | null;
  online_en?: string | null;
  oneLineEn?: string | null;
  one_line_en?: string | null;
  description_en?: string | null;
  signature_drink_en?: string | null;
  parking_location_en?: string | null;
  chain?: Cafe["chain"];
  chain_id?: string | null;
};
