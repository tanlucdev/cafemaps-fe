import { apiFetch, authHeaders } from "@/apis/http";
import type { CafeReview, CafeReviewListResponse, UpsertCafeReviewInput } from "@/types/review";

export function getCafeReviews(cafeId: string, page = 1, limit = 10) {
  return apiFetch<CafeReviewListResponse>(
    `/cafes/${encodeURIComponent(cafeId)}/reviews?page=${page}&limit=${limit}`,
    { cache: "no-store" },
  );
}

export function getMyCafeReview(cafeId: string, token: string) {
  return apiFetch<CafeReview | null>(`/cafes/${encodeURIComponent(cafeId)}/reviews/me`, {
    cache: "no-store",
    headers: authHeaders(token),
  });
}

export function upsertCafeReview(cafeId: string, token: string, data: UpsertCafeReviewInput) {
  return apiFetch<CafeReview>(`/cafes/${encodeURIComponent(cafeId)}/reviews`, {
    method: "PUT",
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
}

export function deleteMyCafeReview(cafeId: string, token: string) {
  return apiFetch<{ deleted: boolean }>(`/cafes/${encodeURIComponent(cafeId)}/reviews/me`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
}
