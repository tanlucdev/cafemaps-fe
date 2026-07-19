import type { Cafe } from "@/types/cafe";
import { apiFetch, isUnauthorizedError } from "@/apis/http";
import { mapApiCafe } from "@/apis/cafes/mapper";
import { buildQuery } from "@/apis/cafes/query";

export interface VisitedCafeEntry {
  cafe: Cafe;
  visitedAt?: string;
  createdAt?: string;
}

export async function getVisitedCafeEntries(
  token: string,
  locale?: string | null,
): Promise<VisitedCafeEntry[]> {
  try {
    const raw = await apiFetch<
      Array<Cafe | { cafe: Cafe; visitedAt?: string; visited_at?: string; createdAt?: string }>
    >(`/visited${buildQuery(undefined, locale)}`, {
      cache: "no-store",
      headers: token === "cafe-auth-token" ? undefined : { Authorization: `Bearer ${token}` },
    });

    return raw
      .map((item) => {
        const cafe = "cafe" in item ? item.cafe : item;
        return {
          cafe: mapApiCafe(cafe, locale),
          visitedAt: "cafe" in item ? (item.visitedAt ?? item.visited_at) : undefined,
          createdAt: "cafe" in item ? item.createdAt : undefined,
        };
      })
      .filter((entry) => entry.cafe.id);
  } catch (error) {
    if (isUnauthorizedError(error)) throw error;
    return [];
  }
}

export async function markVisitedCafe(cafeId: string, token: string): Promise<void> {
  await apiFetch("/visited", {
    method: "POST",
    headers: token === "cafe-auth-token" ? undefined : { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ cafeId }),
  });
}

export async function unmarkVisitedCafe(cafeId: string, token: string): Promise<void> {
  await apiFetch(`/visited/${encodeURIComponent(cafeId)}`, {
    method: "DELETE",
    headers: token === "cafe-auth-token" ? undefined : { Authorization: `Bearer ${token}` },
  });
}
