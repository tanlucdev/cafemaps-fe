import type { CoffeeMeetup } from "@/apis/coffee-meetups";

export function formatMeetupTime(
  meetup: Pick<CoffeeMeetup, "startsAt" | "endsAt">,
  locale = "vi-VN",
) {
  const start = new Date(meetup.startsAt);
  const end = new Date(meetup.endsAt);
  return `${start.toLocaleDateString(locale, { timeZone: "Asia/Ho_Chi_Minh", weekday: "short", day: "2-digit", month: "2-digit" })} · ${start.toLocaleTimeString(locale, { timeZone: "Asia/Ho_Chi_Minh", hour: "2-digit", minute: "2-digit" })}-${end.toLocaleTimeString(locale, { timeZone: "Asia/Ho_Chi_Minh", hour: "2-digit", minute: "2-digit" })}`;
}

export function formatMeetupDateParts(
  meetup: Pick<CoffeeMeetup, "startsAt" | "endsAt">,
  locale = "vi-VN",
) {
  const start = new Date(meetup.startsAt);
  const end = new Date(meetup.endsAt);
  return {
    day: start.toLocaleDateString(locale, { timeZone: "Asia/Ho_Chi_Minh", day: "2-digit" }),
    month: start.toLocaleDateString(locale, { timeZone: "Asia/Ho_Chi_Minh", month: "short" }),
    weekday: start.toLocaleDateString(locale, { timeZone: "Asia/Ho_Chi_Minh", weekday: "short" }),
    time: `${start.toLocaleTimeString(locale, { timeZone: "Asia/Ho_Chi_Minh", hour: "2-digit", minute: "2-digit" })}-${end.toLocaleTimeString(locale, { timeZone: "Asia/Ho_Chi_Minh", hour: "2-digit", minute: "2-digit" })}`,
  };
}

export function remainingSeats(meetup: Pick<CoffeeMeetup, "maxParticipants" | "acceptedCount">) {
  return Math.max(0, meetup.maxParticipants - meetup.acceptedCount);
}

export function isEnded(meetup: Pick<CoffeeMeetup, "endsAt">) {
  return new Date(meetup.endsAt) <= new Date();
}

export function meetupToday(now = new Date()) {
  return new Date(now.getTime() + 7 * 3600000).toISOString().slice(0, 10);
}

export function isCalendarDate(value: string) {
  return (
    /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    Number.isFinite(Date.parse(`${value}T12:00:00Z`)) &&
    new Date(`${value}T12:00:00Z`).toISOString().slice(0, 10) === value
  );
}

export function shiftCalendarDate(value: string, days = 0, months = 0) {
  const date = new Date(`${value}T12:00:00Z`);
  if (months) {
    const day = date.getUTCDate();
    date.setUTCMonth(date.getUTCMonth() + months, 1);
    const last = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0)).getUTCDate();
    date.setUTCDate(Math.min(day, last));
  }
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

export function calendarDays(value: string) {
  const first = `${value.slice(0, 7)}-01`;
  const offset = (new Date(`${first}T12:00:00Z`).getUTCDay() + 6) % 7;
  return Array.from({ length: 42 }, (_, index) => shiftCalendarDate(first, index - offset));
}
