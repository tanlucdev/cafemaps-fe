import type { CoffeeMeetup } from "@/apis/coffee-meetups";

export function formatMeetupTime(meetup: Pick<CoffeeMeetup, "startsAt" | "endsAt">, locale = "vi-VN") {
  const start = new Date(meetup.startsAt);
  const end = new Date(meetup.endsAt);
  return `${start.toLocaleDateString(locale, { weekday: "short", day: "2-digit", month: "2-digit" })} · ${start.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" })}-${end.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" })}`;
}

export function formatMeetupDateParts(meetup: Pick<CoffeeMeetup, "startsAt" | "endsAt">, locale = "vi-VN") {
  const start = new Date(meetup.startsAt);
  const end = new Date(meetup.endsAt);
  return {
    day: start.toLocaleDateString(locale, { day: "2-digit" }),
    month: start.toLocaleDateString(locale, { month: "short" }),
    weekday: start.toLocaleDateString(locale, { weekday: "short" }),
    time: `${start.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" })}-${end.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" })}`,
  };
}

export function remainingSeats(meetup: Pick<CoffeeMeetup, "maxParticipants" | "acceptedCount">) {
  return Math.max(0, meetup.maxParticipants - meetup.acceptedCount);
}

export function isEnded(meetup: Pick<CoffeeMeetup, "endsAt">) {
  return new Date(meetup.endsAt) <= new Date();
}
