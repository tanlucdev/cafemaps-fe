export const VIBE_TRANSLATION_KEYS: Record<string, string> = {
  "yên tĩnh": "quiet",
  quiet: "quiet",
  "nhộn nhịp": "lively",
  lively: "lively",
  vintage: "vintage",
  "hiện đại": "modern",
  modern: "modern",
  "thiên nhiên": "nature",
  nature: "nature",
  "sáng tạo": "creative",
  creative: "creative",
  Artistic: "artistic",
  artistic: "artistic",
  Cozy: "cozy",
  cozy: "cozy",
  Peaceful: "peaceful",
  peaceful: "peaceful",
  "lãng mạn": "romantic",
  romantic: "romantic",
  minimalist: "minimalist",
};

export const PURPOSE_TRANSLATION_KEYS: Record<string, string> = {
  "làm việc": "work",
  work: "work",
  "học tập": "study",
  study: "study",
  "hẹn hò": "date",
  date: "date",
  "họp nhóm": "group",
  group: "group",
  "chill một mình": "solo",
  solo: "solo",
  "gặp bạn bè": "friends",
  friends: "friends",
  "chụp ảnh": "photo",
  "photo spot": "photo",
};

const ENGLISH_AREA_LABELS: Record<string, string> = {
  "Bình Thạnh": "Binh Thanh",
  "Gò Vấp": "Go Vap",
  "Phú Nhuận": "Phu Nhuan",
  "Tân Bình": "Tan Binh",
  "Tân Phú": "Tan Phu",
  "Bình Tân": "Binh Tan",
  "Thủ Đức": "Thu Duc",
};

const ENGLISH_CITY_LABELS: Record<string, string> = {
  "Hồ Chí Minh": "Ho Chi Minh City",
  "TP. Hồ Chí Minh": "Ho Chi Minh City",
  "TP.HCM": "Ho Chi Minh City",
};

function formatPrimaryArea(area: string): string {
  const districtMatch = area.match(/^Quận\s+(\d+)$/i);
  if (districtMatch) return `District ${districtMatch[1]}`;

  const areaWithoutDistrictPrefix = area.replace(/^Quận\s+/i, "");

  return ENGLISH_AREA_LABELS[area] ?? ENGLISH_AREA_LABELS[areaWithoutDistrictPrefix] ?? area;
}

export function getCafeTagTranslation(
  tag: string,
): { group: "vibes"; key: string } | { group: "purposes"; key: string } | null {
  const vibeKey = VIBE_TRANSLATION_KEYS[tag];
  if (vibeKey) return { group: "vibes", key: vibeKey };

  const purposeKey = PURPOSE_TRANSLATION_KEYS[tag];
  if (purposeKey) return { group: "purposes", key: purposeKey };

  return null;
}

export function formatCafeArea(area: string | null | undefined, locale: string): string {
  if (!area) return "";
  if (locale.startsWith("vi")) return area;

  const [primaryArea, ...cityParts] = area.split(",").map((part) => part.trim());
  const formattedArea = formatPrimaryArea(primaryArea);
  const formattedCityParts = cityParts.map((part) => ENGLISH_CITY_LABELS[part] ?? part);

  return [formattedArea, ...formattedCityParts].filter(Boolean).join(", ");
}
