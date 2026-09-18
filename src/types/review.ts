export interface CafeReview {
  id: string
  cafeId: string
  rating: number | null
  content: string | null
  authorName: string
  createdAt: string
  updatedAt: string
  isMine?: boolean
}

export interface CafeReviewSummary {
  reviewCount: number
  ratingCount: number
  averageRating: number | null
}

export interface CafeReviewListResponse {
  data: CafeReview[]
  summary: CafeReviewSummary
  meta: { total: number; page: number; limit: number; totalPages: number }
}

export interface UpsertCafeReviewInput {
  rating?: number | null
  content?: string | null
}

export type ProfileReview = CafeReview & {
  cafe: {
    id: string
    name: string
    slug: string
    address?: string | null
    district?: string | null
    coverImage?: string | null
    isPublished: boolean
  }
}

export interface ProfileReviewListResponse {
  data: ProfileReview[]
  total: number
  meta: { total: number; page: number; limit: number; totalPages: number }
}
