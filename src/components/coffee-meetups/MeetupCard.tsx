import { CalendarClock, MapPin, UsersRound } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { CoffeeMeetup } from "@/apis/coffee-meetups";
import { formatMeetupTime, remainingSeats } from "./format";

export default function MeetupCard({ meetup }: { meetup: CoffeeMeetup }) {
  const seats = remainingSeats(meetup);
  const full = seats <= 0 || meetup.status === "full";

  return (
    <article className="rounded-[24px] border border-[var(--border)] bg-[#fffaf2]/88 p-4 shadow-[var(--shadow-sm)] dark:bg-[var(--card)]">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-[var(--accent-light)] px-3 py-1 text-xs font-black text-[#875200] dark:text-[#f0b869]">
          {meetup.purpose}
        </span>
        <span
          className={
            full
              ? "rounded-full bg-[#f6e6e1] px-3 py-1 text-xs font-black text-[#8a3c2f]"
              : "rounded-full bg-[#e6f5ee] px-3 py-1 text-xs font-black text-[#166638]"
          }
        >
          {full ? "Đã đủ" : "Còn chỗ"}
        </span>
      </div>
      <h2 className="mt-3 text-lg leading-snug font-black text-[var(--foreground)]">
        <Link href={`/coffee-meetups/${meetup.id}`} className="hover:text-[var(--accent)]">
          {meetup.title}
        </Link>
      </h2>
      <div className="mt-3 grid gap-2 text-sm font-semibold text-[var(--foreground-muted)]">
        <p className="flex items-center gap-2">
          <MapPin size={16} /> {meetup.cafe?.name} · {meetup.cafe?.district || "TP.HCM"}
        </p>
        <p className="flex items-center gap-2">
          <CalendarClock size={16} /> {formatMeetupTime(meetup)}
        </p>
        <p className="flex items-center gap-2">
          <UsersRound size={16} /> Chủ kèo: {meetup.organizerName} · còn {seats} chỗ
        </p>
      </div>
      <Link
        href={`/coffee-meetups/${meetup.id}`}
        className="mt-4 inline-flex h-11 w-full items-center justify-center rounded-full bg-[var(--accent)] px-4 text-sm font-black text-white hover:bg-[var(--accent-hover)] focus-visible:ring-3 focus-visible:ring-[var(--ring)]/30 focus-visible:outline-none sm:w-auto"
      >
        Xem kèo
      </Link>
    </article>
  );
}
