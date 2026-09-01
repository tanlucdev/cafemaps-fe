export const EN_VIBE_VALUES: Record<string, string> = {
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
  "lãng mạn": "romantic",
  romantic: "romantic",
  minimalist: "minimalist",
}

export const EN_PURPOSE_VALUES: Record<string, string> = {
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
}

export const EN_TAG_VALUES: Record<string, string> = {
  "ngoài trời": "outdoor seating",
  outdoor: "outdoor seating",
  "outdoor seating": "outdoor seating",
  "chỗ hút thuốc": "smoking allowed",
  smoking: "smoking allowed",
  "smoking allowed": "smoking allowed",
}

export function localizeFilterValues(
  values: string[] | undefined,
  map: Record<string, string>,
  locale: "vi" | "en",
): string[] | undefined {
  if (!values?.length) return undefined
  if (locale !== "en") return values
  return values.map((value) => map[value.toLowerCase()] ?? map[value] ?? value)
}
