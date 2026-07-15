import { apiFetch } from "@/apis/http"

export interface CafeVoteResponse {
  cafeId: string
  weeklyVoteCount: number
  voteCount: number
  voted: boolean
}

export function voteCafe(cafeId: string, token: string) {
  void token
  return apiFetch<CafeVoteResponse>(`/cafes/${cafeId}/vote`, {
    method: "POST",
  })
}

export function unvoteCafe(cafeId: string, token: string) {
  void token
  return apiFetch<CafeVoteResponse>(`/cafes/${cafeId}/vote`, {
    method: "DELETE",
  })
}

export function getMyCafeVotes(token: string) {
  void token
  return apiFetch<string[]>("/cafes/votes/me", {
    cache: "no-store",
  })
}
