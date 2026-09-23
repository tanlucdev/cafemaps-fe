import type { CoffeeMeetup } from "@/apis/coffee-meetups";

export function formatMeetupTime(meetup: Pick<CoffeeMeetup, "startsAt" | "endsAt">) {
  const start = new Date(meetup.startsAt);
  const end = new Date(meetup.endsAt);
  return `${start.toLocaleDateString("vi-VN", { weekday: "short", day: "2-digit", month: "2-digit" })} · ${start.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}-${end.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}`;
}

export function remainingSeats(meetup: Pick<CoffeeMeetup, "maxParticipants" | "acceptedCount">) {
  return Math.max(0, meetup.maxParticipants - meetup.acceptedCount);
}

export function isEnded(meetup: Pick<CoffeeMeetup, "endsAt">) {
  return new Date(meetup.endsAt) <= new Date();
}
