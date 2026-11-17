export function formatViewedAt(value: string, locale: string) {
  const viewedAt = new Date(value);
  if (Number.isNaN(viewedAt.getTime())) return null;

  return new Intl.DateTimeFormat(locale === "en" ? "en-US" : "vi-VN", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: "Asia/Ho_Chi_Minh",
  }).format(viewedAt);
}
