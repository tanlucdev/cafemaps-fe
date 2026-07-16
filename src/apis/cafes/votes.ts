import { apiFetch, authHeaders } from "@/apis/http"

export interface CafeVoteResponse {
  cafeId: string
  weeklyVoteCount: number
  voteCount: number
  voted: boolean
}

export function voteCafe(cafeId: string, token: string) {
  return apiFetch<CafeVoteResponse>(`/cafes/${cafeId}/vote`, {
    method: "POST",
    headers: authHeaders(token),
  })
}

export function unvoteCafe(cafeId: string, token: string) {
  return apiFetch<CafeVoteResponse>(`/cafes/${cafeId}/vote`, {
    method: "DELETE",
    headers: authHeaders(token),
  })
}

export function getMyCafeVotes(token: string) {
  return apiFetch<string[]>("/cafes/votes/me", {
    cache: "no-store",
    headers: authHeaders(token),
  })
}
