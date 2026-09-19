import { parseDistrictSearch, type LastSearchState } from "@/lib/search-state";
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

type SmartSuggestionCopy = {
  vibeInDistrict: (vibe: string, district: string) => string;
};

type LastSearchCopy = {
  openNow: string;
  nearMe: string;
  fallback: string;
};

export function getSmartSuggestions(
  input: string,
  copy: SmartSuggestionCopy,
  locale: "vi" | "en",
): SmartSuggestion[] {
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

  const districtSearch = parseDistrictSearch(input, locale);
  const detectedDistrict = districtSearch.matched ? districtSearch.district ?? null : null;

  if (detectedVibe && !detectedDistrict) {
    const popular = ["Quận 1", "Quận 3", "Bình Thạnh", "Phú Nhuận", "Quận 7"];
    popular.forEach((district) => {
      suggestions.push({
        label: copy.vibeInDistrict(detectedVibe, district),
        query: `${detectedVibe} ${district}`,
      });
    });
  } else if (detectedVibe && detectedDistrict) {
    suggestions.push({
      label: copy.vibeInDistrict(detectedVibe, detectedDistrict),
      query: `${detectedVibe} ${detectedDistrict}`,
    });
  } else if (detectedDistrict && !detectedVibe) {
    const vibes = ["yên tĩnh", "làm việc", "thiên nhiên"];
    vibes.forEach((vibe) => {
      suggestions.push({
        label: copy.vibeInDistrict(vibe, detectedDistrict),
        query: `${vibe} ${detectedDistrict}`,
      });
    });
  }

  return suggestions.slice(0, 3);
}

export function getLastSearchLabel(lastSearch: LastSearchState, copy: LastSearchCopy) {
  if (lastSearch.query) return lastSearch.query;
  if (lastSearch.filter.vibes?.length) return lastSearch.filter.vibes.join(", ");
  if (lastSearch.filter.purposes?.length) return lastSearch.filter.purposes.join(", ");
  if (lastSearch.filter.openNow) return copy.openNow;
  if (lastSearch.filter.nearMe) return copy.nearMe;
  return copy.fallback;
}
