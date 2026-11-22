const HCMC_OFFSET_MS = 7 * 60 * 60 * 1000;
export const MEETUP_PURPOSES = [
  "study",
  "work",
  "language",
  "reading",
  "friends",
  "chat",
] as const;
const PURPOSE_ALIASES: Record<string, string> = {
  "học tập": "study", study: "study", "làm việc": "work", work: "work",
  "luyện ngoại ngữ": "language", "language practice": "language", language: "language",
  "đọc sách": "reading", reading: "reading", "gặp bạn mới": "friends", friends: "friends",
  "meet new friends": "friends", "trò chuyện": "chat", chat: "chat",
};

export function normalizeMeetupPurpose(value: string) {
  return PURPOSE_ALIASES[value.trim().toLowerCase()] ?? value.trim();
}

export function meetupPurposeLabel(value: string, labels: string[]) {
  const index = MEETUP_PURPOSES.indexOf(
    normalizeMeetupPurpose(value) as (typeof MEETUP_PURPOSES)[number],
  );
  return index < 0 ? value : (labels[index] ?? value);
}

export function meetupCafePurposes(purpose: string) {
  const value = normalizeMeetupPurpose(purpose);
  return MEETUP_PURPOSES.includes(value as (typeof MEETUP_PURPOSES)[number]) ? [value] : undefined;
}

export function meetupLocalDateTimeToIso(date: string, time: string) {
  return new Date(`${date}T${time}:00+07:00`).toISOString();
}

export function meetupDateTimeFields(value: string) {
  const local = new Date(new Date(value).getTime() + HCMC_OFFSET_MS).toISOString();
  return { date: local.slice(0, 10), time: local.slice(11, 16) };
}

export function isMeetupGoogleMapsUrl(value: string) {
  try {
    const trimmed = value.trim();
    const url = new URL(trimmed);
    if (url.protocol !== "https:" || url.username || url.password || url.port || /\s/.test(trimmed)) return false;
    const { hostname, pathname, searchParams } = url;
    return (
      (hostname === "maps.google.com" && pathname === "/" && Boolean(searchParams.get("cid")?.trim())) ||
      (hostname === "maps.app.goo.gl" && pathname.length > 1) ||
      (hostname === "goo.gl" && pathname.startsWith("/maps/") && pathname.length > 6) ||
      ((hostname === "google.com" || hostname === "www.google.com") && pathname.startsWith("/maps"))
    );
  } catch {
    return false;
  }
}
