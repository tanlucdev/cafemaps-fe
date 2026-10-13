export { AREAS, DISTRICTS } from "@/constants/areas";
export { WARDS_BY_AREA } from "@/constants/wards-by-area";

export type Vibe =
  | "yên tĩnh"
  | "nhộn nhịp"
  | "vintage"
  | "hiện đại"
  | "thiên nhiên"
  | "sáng tạo"
  | "lãng mạn"
  | "minimalist";

export type Purpose =
  | "làm việc"
  | "học tập"
  | "hẹn hò"
  | "họp nhóm"
  | "chill một mình"
  | "gặp bạn bè"
  | "chụp ảnh";

export interface PhotoCredit {
  ig: string;
  note?: string | null;
}

export interface Cafe {
  id: string;
  name: string;
  nameEn?: string | null;
  slug: string;
  address?: string | null;
  addressEn?: string | null;
  district?: string | null;
  districtEn?: string | null;
  district_legacy?: string | null;
  googlePlaceId?: string | null;
  googleMapsUrl?: string | null;
  websiteUrl?: string | null;
  openingTime?: string | null;
  closingTime?: string | null;
  priceMin?: number | null;
  priceMax?: number | null;
  oneLiner?: string | null;
  oneLinerEn?: string | null;
  onlineEn?: string | null;
  description?: string | null;
  descriptionEn?: string | null;
  vibes: string[];
  vibesEn?: string[];
  purposes: string[];
  purposesEn?: string[];
  amenities: string[];
  amenitiesEn?: string[];
  tags: string[];
  tagsEn?: string[];
  signatureDrink?: string | null;
  signatureDrinkEn?: string | null;
  parking_location?: string | null;
  parkingLocation?: string | null;
  parkingLocationEn?: string | null;
  images: string[];
  image_orientations: string[] | null;
  coverImage?: string | null;
  coverImageCrop?: { x: number; y: number } | null;
  menuImage?: string | null;
  menuImages?: string[] | null;
  instagramUrl?: string | null;
  photoCredits?: PhotoCredit[] | null;
  isFeatured?: boolean | null;
  featuredOrder?: number | null;
  isPublished: boolean;
  lat?: number | null;
  lng?: number | null;
  distanceKm?: number;
  durationMin?: number;
  distanceMode?: "straight" | "route";
  straightDistanceKm?: number;
  rating?: number | null;
  averageRating?: number | null;
  curatedRating?: number | null;
  reviewCount?: number | null;
  savedCount?: number | null;
  weeklyVoteCount?: number;
  voteCount?: number;
  hasUserVote?: boolean;
  viewCount?: number | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CafeFilter {
  districts?: string[];
  city?: string;
  vibes?: string[];
  vibe?: string[];
  purposes?: string[];
  purpose?: string[];
  tags?: string[];
  priceRange?: string;
  search?: string;
  openNow?: boolean;
  hours?: "open_at_7" | "open_24h";
  nearMe?: boolean;
  lat?: number;
  lng?: number;
  radiusKm?: number;
  page?: number;
  limit?: number;
  sort?: "popular" | "rating" | "newest";
}

export interface CafesResponse {
  data: Cafe[];
  total: number;
  page: number;
  limit: number;
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    discovery?: DiscoveryMeta;
  };
}

export interface DiscoveryMeta {
  displayTotal: number;
  totalPages: number;
  teaserSlots: number;
}

export interface SavedCafeEntry {
  cafe: Cafe;
  collectionName?: string | null;
  createdAt?: string;
}

export interface SavedCollection {
  name: string;
  createdAt?: string;
}

export const VIBES: Vibe[] = [
  "yên tĩnh",
  "nhộn nhịp",
  "vintage",
  "hiện đại",
  "thiên nhiên",
  "sáng tạo",
  "lãng mạn",
  "minimalist",
];

export const PURPOSES: Purpose[] = [
  "làm việc",
  "học tập",
  "hẹn hò",
  "họp nhóm",
  "chill một mình",
  "gặp bạn bè",
  "chụp ảnh",
];
