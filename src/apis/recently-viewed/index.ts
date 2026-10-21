import { authHeaders, apiFetch } from "@/apis/http";
import { mapApiCafe, type RawCafe } from "@/apis/cafes/mapper";
import type { Cafe } from "@/types/cafe";

export interface RecentlyViewedCafe {
  cafe: Cafe;
  viewedAt?: string;
}

type RecentlyViewedItem = RawCafe | { cafe: RawCafe; viewedAt?: string };
type RecentlyViewedResponse = RecentlyViewedItem[] | { data?: RecentlyViewedItem[] };

export async function getRecentlyViewed(
  token: string,
  locale: string,
  limit = 20,
): Promise<RecentlyViewedCafe[]> {
  const params = new URLSearchParams({
    locale,
    limit: String(Math.min(20, Math.max(1, Math.floor(limit)))),
  });

  try {
    const response = await apiFetch<RecentlyViewedResponse>(`/recently-viewed?${params}`, {
      headers: authHeaders(token),
      cache: "no-store",
      fallback: false,
      timeoutMs: 1500,
    });
    const items = Array.isArray(response) ? response : (response.data ?? []);

    return items.map((item) => {
      const entry = "cafe" in item ? item : { cafe: item };
      return { cafe: mapApiCafe(entry.cafe, locale), viewedAt: entry.viewedAt };
    });
  } catch {
    return [];
  }
}
