import type { Cafe, Chain, SimilarCafe } from "@/types/cafe";
import { apiFetch } from "@/apis/http";
import { mapApiCafe, type RawCafe } from "@/apis/cafes/mapper";

export interface ChainsResponse {
  data: Chain[];
  total: number;
  page: number;
  limit: number;
}

type RawChain = Chain & {
  nameEn?: string | null;
  name_en?: string | null;
  description_en?: string | null;
  cover_image?: string | null;
  branch_count?: number;
};

function mapChain(raw: RawChain, locale?: string | null): Chain {
  const nameEn = raw.nameEn ?? raw.name_en;
  const descriptionEn = raw.descriptionEn ?? raw.description_en;
  return {
    ...raw,
    name: locale === "en" && nameEn ? nameEn : raw.name,
    description: locale === "en" && descriptionEn ? descriptionEn : raw.description,
    descriptionEn,
    coverImage: raw.coverImage ?? raw.cover_image ?? null,
    branchCount: raw.branchCount ?? raw.branch_count ?? 0,
  };
}

function localeQuery(locale?: string | null) {
  return `locale=${locale === "en" ? "en" : "vi"}`;
}

export async function getChains(locale?: string | null, page = 1, limit = 12) {
  const params = new URLSearchParams({
    locale: locale === "en" ? "en" : "vi",
    page: String(page),
    limit: String(Math.min(limit, 50)),
  });
  const result = await apiFetch<ChainsResponse>(`/chains?${params}`, {
    next: { revalidate: 300, tags: ["cafes"] },
  });
  return { ...result, data: result.data.map((chain) => mapChain(chain as RawChain, locale)) };
}

export async function getChainBySlug(slug: string, locale?: string | null) {
  const result = await apiFetch<Chain & { districts: string[] }>(
    `/chains/${encodeURIComponent(slug)}?${localeQuery(locale)}`,
    { next: { revalidate: 300, tags: ["cafes"] } },
  );
  return { ...mapChain(result as RawChain, locale), districts: result.districts };
}

export async function getSimilarCafes(
  slug: string,
  locale?: string | null,
): Promise<SimilarCafe[]> {
  const data = await apiFetch<{ data: Array<{ cafe: RawCafe | Cafe; matchedVibe: string }> }>(
    `/cafes/${encodeURIComponent(slug)}/similar?${localeQuery(locale)}`,
    { next: { revalidate: 300, tags: ["cafes"] } },
  );
  return data.data.map((item) => ({
    cafe: mapApiCafe(item.cafe as RawCafe, locale),
    matchedVibe: item.matchedVibe,
  }));
}
