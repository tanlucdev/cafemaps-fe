import type { LastSearchState } from "@/lib/search-state";
import type { Cafe } from "@/types/cafe";
import { VIBE_MAP } from "./data";
import type { SmartSuggestion } from "./types";

export function normalize(str: string) {
  return str.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

export function getNameSuggestions(input: string, cafes: Cafe[]) {
  if (input.length < 2) return [];
  const q = normalize(input);
  return cafes
    .filter(
      (cafe) =>
        normalize(cafe.name).includes(q) || cafe.name.toLowerCase().includes(input.toLowerCase()),
    )
    .slice(0, 4);
}

export function getSmartSuggestions(input: string, lang: string): SmartSuggestion[] {
  if (input.length < 2) return [];
  const lower = input.toLowerCase();
  const normalizedLower = normalize(input);
  const suggestions: SmartSuggestion[] = [];

  let detectedVibe: string | null = null;
  for (const [keyword, vibe] of Object.entries(VIBE_MAP)) {
    if (normalizedLower.includes(normalize(keyword)) || lower.includes(keyword)) {
      detectedVibe = vibe;
      break;
    }
  }

  let detectedDistrict: string | null = null;
  const districtMatch = lower.match(/qu[aậ]n\s*(\d+|[a-zÀ-ɏ\s]+)/i);
  if (districtMatch) {
    detectedDistrict = districtMatch[0]
      .replace(/qu[aậ]n/i, "Quận")
      .replace(/\s+/g, " ")
      .trim();
  }

  const isVi = lang === "vi";

  if (detectedVibe && !detectedDistrict) {
    const popular = ["Quận 1", "Quận 3", "Bình Thạnh", "Phú Nhuận", "Quận 7"];
    popular.forEach((district) => {
      suggestions.push({
        label: isVi ? `Quán ${detectedVibe} ở ${district}` : `${detectedVibe} cafes in ${district}`,
        query: `${detectedVibe} ${district}`,
      });
    });
  } else if (detectedVibe && detectedDistrict) {
    suggestions.push({
      label: isVi
        ? `Quán ${detectedVibe} ở ${detectedDistrict}`
        : `${detectedVibe} cafes in ${detectedDistrict}`,
      query: `${detectedVibe} ${detectedDistrict}`,
    });
  } else if (detectedDistrict && !detectedVibe) {
    const vibes = ["yên tĩnh", "làm việc", "thiên nhiên"];
    vibes.forEach((vibe) => {
      suggestions.push({
        label: isVi ? `Quán ${vibe} ở ${detectedDistrict}` : `${vibe} cafes in ${detectedDistrict}`,
        query: `${vibe} ${detectedDistrict}`,
      });
    });
  }

  return suggestions.slice(0, 3);
}

export function getLastSearchLabel(lastSearch: LastSearchState, locale: string) {
  if (lastSearch.query) return lastSearch.query;
  if (lastSearch.filter.vibes?.length) return lastSearch.filter.vibes.join(", ");
  if (lastSearch.filter.purposes?.length) return lastSearch.filter.purposes.join(", ");
  if (lastSearch.filter.openNow) return locale === "vi" ? "quán đang mở" : "open cafes";
  if (lastSearch.filter.nearMe) return locale === "vi" ? "quán gần tôi" : "cafes near me";
  return locale === "vi" ? "tìm kiếm trước" : "last search";
}
