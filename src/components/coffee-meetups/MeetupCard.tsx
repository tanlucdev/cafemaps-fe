import Image from "next/image";
import { ArrowRight, CalendarClock, Coffee, MapPin, UsersRound } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { CoffeeMeetup } from "@/apis/coffee-meetups";
import { cn } from "@/lib/utils";
import { formatCafeDistanceParts } from "@/lib/distance";
import { formatMeetupDateParts, remainingSeats } from "./format";
import PurposeIcon from "./PurposeIcon";

export default function MeetupCard({ meetup }: { meetup: CoffeeMeetup }) {
  const t = useTranslations("coffeeMeetups");
  const locale = useLocale();
  const seats = remainingSeats(meetup);
  const full = seats <= 0 || meetup.status === "full";
  const date = formatMeetupDateParts(meetup, locale);
  const image = meetup.imageUrl ?? meetup.cafe?.coverImage ?? meetup.cafe?.images?.[0] ?? "";
  const place = [meetup.cafe?.name, meetup.cafe?.district || "TP.HCM"].filter(Boolean).join(" · ");
  const distance = meetup.cafe
    ? formatCafeDistanceParts(
        {
          distanceKm: meetup.cafe.distanceKm ?? undefined,
          distanceMode: meetup.cafe.distanceMode ?? undefined,
          durationMin: meetup.cafe.durationMin ?? undefined,
        },
        locale,
      ).join(" · ")
    : "";
  const href = `/coffee-meetups/${meetup.id}`;

  return (
    <article className="group grid overflow-hidden rounded-[24px] border border-[var(--border)] bg-[#fffaf2]/90 shadow-[var(--shadow-sm)] transition hover:-translate-y-0.5 hover:border-[#d7b98f] hover:shadow-[var(--shadow-warm)] dark:bg-[var(--card)] sm:grid-cols-[152px_minmax(0,1fr)] lg:grid-cols-[152px_118px_minmax(0,1fr)_164px]">
      <Link
        href={href}
        aria-label={meetup.title}
        className="relative block min-h-[150px] overflow-hidden bg-[#f2e4cf] focus-visible:ring-3 focus-visible:ring-[var(--ring)]/30 focus-visible:outline-none sm:min-h-full"
      >
        {image ? (
          <Image
            fill
            src={image}
            alt=""
            sizes="(max-width: 640px) 100vw, 152px"
            className="object-cover transition duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full min-h-[150px] items-center justify-center bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.64),transparent_34%),linear-gradient(135deg,#fff1dc_0%,#ead2af_50%,#d9eadb_100%)]">
            <Coffee className="size-10 text-[var(--accent)]/65" aria-hidden="true" />
          </div>
        )}
        <div className="absolute top-3 left-3 rounded-full bg-[#1f1209]/62 px-2.5 py-1 text-[11px] font-black text-white backdrop-blur-md lg:hidden">
          {date.weekday} · {date.day} {date.month}
        </div>
      </Link>

      <div className="hidden border-r border-[var(--border)]/70 px-4 py-5 text-center lg:block">
        <p className="text-xs font-black text-[var(--accent)] uppercase">{date.weekday}</p>
        <p className="mt-1 text-4xl leading-none font-black text-[var(--foreground)]">{date.day}</p>
        <p className="mt-1 text-xs font-black text-[var(--foreground-muted)] uppercase">
          {date.month}
        </p>
        <p className="mt-4 inline-flex items-center gap-1 text-xs font-black text-[var(--accent)]">
          <CalendarClock size={13} aria-hidden="true" />
          {date.time}
        </p>
      </div>

      <div className="min-w-0 p-4 sm:p-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-[var(--accent-light)] px-3 py-1 text-xs font-black text-[var(--accent)] dark:text-[var(--accent)]">
            <PurposeIcon name={meetup.purposeIcon} color={meetup.purposeColor} className="mr-1.5 inline" />{meetup.purpose}
          </span>
          <span
            className={cn(
              "rounded-full px-3 py-1 text-xs font-black",
              full ? "bg-[#f6e6e1] text-[#8a3c2f]" : "bg-[#e6f5ee] text-[#166638]",
            )}
          >
            {full ? t("status.full") : t("status.available")}
          </span>
        </div>

        <h2 className="mt-3 text-lg leading-snug font-black text-[var(--foreground)]">
          <Link
            href={href}
            className="outline-none transition hover:text-[var(--accent-hover)] focus-visible:rounded-md focus-visible:ring-3 focus-visible:ring-[var(--ring)]/30"
          >
            {meetup.title}
          </Link>
        </h2>

        <div className="mt-3 grid gap-2 text-sm font-semibold text-[var(--foreground-muted)]">
          <p className="flex min-w-0 items-center gap-2">
            <MapPin size={16} className="shrink-0 text-[var(--accent)]" aria-hidden="true" />
            <span className="min-w-0 truncate">
              {place}
              {distance && <span className="text-[var(--accent)]"> · {distance}</span>}
            </span>
          </p>
          <p className="flex items-center gap-2 lg:hidden">
            <CalendarClock size={16} className="shrink-0 text-[var(--accent)]" aria-hidden="true" />
            {date.time}
          </p>
          <p className="flex min-w-0 items-center gap-2">
            <UsersRound size={16} className="shrink-0 text-[var(--accent)]" aria-hidden="true" />
            <span className="truncate">
              {t("card.organizerSeats", { name: meetup.organizerName, count: seats })}
            </span>
          </p>
        </div>
      </div>

      <div className="flex items-center px-4 pb-4 sm:px-5 lg:border-l lg:border-[var(--border)]/70 lg:p-5">
        <Link
          href={href}
          className={cn(
            "inline-flex h-11 w-full items-center justify-center gap-2 rounded-full px-4 text-sm font-black whitespace-nowrap transition focus-visible:ring-3 focus-visible:ring-[var(--ring)]/30 focus-visible:outline-none",
            full
              ? "border border-[var(--border)] bg-[#fffaf2] text-[var(--foreground)] hover:border-[var(--accent)] hover:text-[var(--accent-hover)]"
              : "bg-[var(--accent)] text-[var(--accent-foreground)] shadow-[0_10px_24px_rgba(200,132,42,0.2)] hover:bg-[var(--accent-hover)]",
          )}
        >
          {t("actions.view")}
          <ArrowRight size={15} aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}
