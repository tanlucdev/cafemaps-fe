export type Vibe =
  | "yên tĩnh"
  | "nhộn nhịp"
  | "vintage"
  | "hiện đại"
  | "thiên nhiên"
  | "sáng tạo"
  | "lãng mạn"
  | "minimalist"

export type Purpose =
  | "làm việc"
  | "học tập"
  | "hẹn hò"
  | "họp nhóm"
  | "chill một mình"
  | "gặp bạn bè"

export interface PhotoCredit {
  ig: string
  note?: string | null
}

export interface Cafe {
  id: string
  name: string
  slug: string
  address?: string | null
  district?: string | null
  district_legacy?: string | null
  googlePlaceId?: string | null
  googleMapsUrl?: string | null
  openingTime?: string | null
  closingTime?: string | null
  priceMin?: number | null
  priceMax?: number | null
  oneLiner?: string | null
  description?: string | null
  vibes: string[]
  purposes: string[]
  amenities: string[]
  signatureDrink?: string | null
  parking_location?: string | null
  images: string[]
  image_orientations: string[] | null
  coverImage?: string | null
  instagramUrl?: string | null
  photoCredits?: PhotoCredit[] | null
  isFeatured?: boolean | null
  featuredOrder?: number | null
  isPublished: boolean
  lat?: number | null
  lng?: number | null
  distanceKm?: number
  createdAt?: string
  updatedAt?: string
}

export interface CafeFilter {
  district?: string
  city?: string
  vibes?: string[]
  vibe?: string[]
  purposes?: string[]
  purpose?: string[]
  priceRange?: string
  search?: string
  openNow?: boolean
  nearMe?: boolean
  lat?: number
  lng?: number
  radiusKm?: number
  page?: number
  limit?: number
  sort?: "popular" | "rating" | "newest"
}

export interface CafesResponse {
  data: Cafe[]
  total: number
  page: number
  limit: number
  meta?: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export interface SavedCafeEntry {
  cafe: Cafe
  collectionName?: string | null
  createdAt?: string
}

export const AREAS = [
  "Quận 1",
  "Quận 3",
  "Quận 4",
  "Quận 5",
  "Quận 6",
  "Quận 7",
  "Quận 8",
  "Quận 10",
  "Quận 11",
  "Quận 12",
  "Bình Thạnh",
  "Gò Vấp",
  "Phú Nhuận",
  "Tân Bình",
  "Tân Phú",
  "Bình Tân",
  "Thủ Đức",
] as const

/** Alias giữ tương thích ngược với code cũ còn dùng DISTRICTS */
export const DISTRICTS = AREAS

export const WARDS_BY_AREA: Record<string, string[]> = {
  "Quận 1": ["Bến Nghé", "Bến Thành", "Cầu Ông Lãnh", "Cô Giang", "Đa Kao", "Nguyễn Cư Trinh", "Nguyễn Thái Bình", "Phạm Ngũ Lão", "Tân Định"],
  "Quận 3": ["Phường 1", "Phường 2", "Phường 3", "Phường 4", "Phường 5", "Phường 6", "Phường 7", "Phường 8", "Phường 9", "Phường 10", "Phường 11", "Phường 12", "Phường 13", "Phường 14", "Võ Thị Sáu"],
  "Quận 4": ["Phường 1", "Phường 2", "Phường 3", "Phường 4", "Phường 6", "Phường 8", "Phường 9", "Phường 10", "Phường 13", "Phường 14", "Phường 15", "Phường 16", "Phường 18"],
  "Quận 5": ["Phường 1", "Phường 2", "Phường 3", "Phường 4", "Phường 5", "Phường 6", "Phường 7", "Phường 8", "Phường 9", "Phường 10", "Phường 11", "Phường 12", "Phường 13", "Phường 14", "Phường 15"],
  "Quận 6": ["Phường 1", "Phường 2", "Phường 3", "Phường 4", "Phường 5", "Phường 6", "Phường 7", "Phường 8", "Phường 9", "Phường 10", "Phường 11", "Phường 12", "Phường 13", "Phường 14"],
  "Quận 7": ["Bình Thuận", "Phú Mỹ", "Phú Thuận", "Tân Hưng", "Tân Kiểng", "Tân Phong", "Tân Quy", "Tân Thuận Đông", "Tân Thuận Tây", "Bình Thuận"],
  "Quận 8": ["Phường 1", "Phường 2", "Phường 3", "Phường 4", "Phường 5", "Phường 6", "Phường 7", "Phường 8", "Phường 9", "Phường 10", "Phường 11", "Phường 12", "Phường 13", "Phường 14", "Phường 15", "Phường 16"],
  "Quận 10": ["Phường 1", "Phường 2", "Phường 3", "Phường 4", "Phường 5", "Phường 6", "Phường 7", "Phường 8", "Phường 9", "Phường 10", "Phường 11", "Phường 12", "Phường 13", "Phường 14", "Phường 15"],
  "Quận 11": ["Phường 1", "Phường 2", "Phường 3", "Phường 4", "Phường 5", "Phường 6", "Phường 7", "Phường 8", "Phường 9", "Phường 10", "Phường 11", "Phường 12", "Phường 13", "Phường 14", "Phường 15", "Phường 16"],
  "Quận 12": ["An Phú Đông", "Đông Hưng Thuận", "Hiệp Thành", "Tân Chánh Hiệp", "Tân Hưng Thuận", "Tân Thới Hiệp", "Tân Thới Nhất", "Thạnh Lộc", "Thạnh Xuân", "Thới An", "Trung Mỹ Tây"],
  "Bình Thạnh": ["Phường 1", "Phường 2", "Phường 3", "Phường 5", "Phường 6", "Phường 7", "Phường 11", "Phường 12", "Phường 13", "Phường 14", "Phường 15", "Phường 17", "Phường 19", "Phường 21", "Phường 22", "Phường 24", "Phường 25", "Phường 26", "Phường 27", "Phường 28"],
  "Gò Vấp": ["Phường 1", "Phường 3", "Phường 4", "Phường 5", "Phường 6", "Phường 7", "Phường 8", "Phường 9", "Phường 10", "Phường 11", "Phường 12", "Phường 13", "Phường 14", "Phường 15", "Phường 16", "Phường 17"],
  "Phú Nhuận": ["Phường 1", "Phường 2", "Phường 3", "Phường 4", "Phường 5", "Phường 7", "Phường 8", "Phường 9", "Phường 10", "Phường 11", "Phường 12", "Phường 13", "Phường 14", "Phường 15", "Phường 17"],
  "Tân Bình": ["Phường 1", "Phường 2", "Phường 3", "Phường 4", "Phường 5", "Phường 6", "Phường 7", "Phường 8", "Phường 9", "Phường 10", "Phường 11", "Phường 12", "Phường 13", "Phường 14", "Phường 15"],
  "Tân Phú": ["Hiệp Tân", "Hòa Thạnh", "Phú Thạnh", "Phú Thọ Hòa", "Phú Trung", "Sơn Kỳ", "Tân Quý", "Tân Sơn Nhì", "Tân Thành", "Tân Thới Hòa", "Tây Thạnh"],
  "Bình Tân": ["An Lạc", "An Lạc A", "Bình Hưng Hòa", "Bình Hưng Hòa A", "Bình Hưng Hòa B", "Bình Trị Đông", "Bình Trị Đông A", "Bình Trị Đông B", "Tân Tạo", "Tân Tạo A"],
  "Thủ Đức": ["An Khánh", "An Lợi Đông", "An Phú", "Bình Chiểu", "Bình Thọ", "Cát Lái", "Hiệp Bình Chánh", "Hiệp Bình Phước", "Hiệp Phú", "Linh Chiểu", "Linh Đông", "Linh Tây", "Linh Trung", "Linh Xuân", "Long Bình", "Long Phước", "Long Thạnh Mỹ", "Long Trường", "Phú Hữu", "Phước Bình", "Phước Long A", "Phước Long B", "Tam Bình", "Tam Phú", "Tân Phú", "Thảo Điền", "Trường Thạnh", "Trường Thọ"],
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
]

export const PURPOSES: Purpose[] = [
  "làm việc",
  "học tập",
  "hẹn hò",
  "họp nhóm",
  "chill một mình",
  "gặp bạn bè",
]
