import Image from "next/image";
import { ArrowUpRight, Clock3, MapPin } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { meetupPurposeLabel, type CoffeeMeetup } from "@/apis/coffee-meetups";
import { formatCafeDistanceParts } from "@/lib/distance";
import { formatMeetupDateParts, isEnded, remainingSeats } from "./format";
import PurposeIcon from "./PurposeIcon";
import CoffeeSticker from "./CoffeeSticker";
import { getInvitationDesign } from "@/apis/coffee-meetups/invitation";
import variants from "./invitation-variants.module.css";
import styles from "./invitation.module.css";

export default function MeetupCard({ meetup }: { meetup: CoffeeMeetup }) {
  const t = useTranslations("coffeeMeetups");
  const locale = useLocale();
  const seats = remainingSeats(meetup);
  const full = seats <= 0 || meetup.status === "full";
  const ended = ["cancelled", "completed"].includes(meetup.status) || isEnded(meetup);
  const date = formatMeetupDateParts(meetup, locale);
  const image = meetup.imageUrl ?? meetup.cafe?.coverImage ?? meetup.cafe?.images?.[0] ?? "";
  const place = meetup.place.kind === "external" ? meetup.place.name : meetup.cafe?.name;
  const distance = meetup.cafe
    ? formatCafeDistanceParts(
        {
          distanceKm: meetup.distanceKm ?? meetup.cafe.distanceKm ?? undefined,
          distanceMode: meetup.distanceMode ?? meetup.cafe.distanceMode ?? undefined,
          durationMin: meetup.cafe.durationMin ?? undefined,
        },
        locale,
      ).join(" · ")
    : "";
  const design = getInvitationDesign(meetup.invitationTemplate, meetup.invitationColor);
  const href = `/coffee-meetups/${meetup.id}`;

  return (
    <article
      className={`${styles.page} ${styles.card} ${styles.listCard} ${variants.card} group min-w-0 transition-shadow hover:shadow-lg`}
      data-template={design.template}
      data-color={design.color}
    >
      <div className={`${styles.frame} flex h-full min-w-0 flex-col`}>
        <Link
          href={href}
          aria-label={meetup.title}
          className="relative isolate block h-32 shrink-0 rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-ink)] sm:h-36"
        >
          <div
            data-invitation-photo
            className={`${styles.cover} absolute inset-0 overflow-hidden rounded-xl bg-[var(--wash)]`}
          >
            {image ? (
              <Image
                fill
                src={image}
                alt=""
                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 380px"
                className="object-cover motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover:scale-[1.03]"
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-[var(--background-secondary)] text-[var(--accent)]/60">
                {meetup.place.kind === "external" ? (
                  <MapPin size={38} aria-hidden="true" />
                ) : (
                  <CoffeeSticker className="w-20" />
                )}
              </div>
            )}
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent"
            />
          </div>
          <div className="absolute top-3 left-3 z-10 w-14 overflow-hidden rounded-xl bg-[var(--paper)] text-center text-[var(--ink)] shadow-sm">
            <p className="bg-[var(--wash)] py-1 text-[10px] font-bold uppercase">{date.month}</p>
            <p className="font-lora py-1.5 text-2xl leading-none">{date.day}</p>
          </div>
          <span
            className={`absolute right-3 bottom-3 z-10 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold ${ended || full ? "bg-[var(--background-secondary)] text-[var(--accent-ink)]" : "bg-[var(--status-open-background)] text-[var(--status-open-foreground)]"}`}
          >
            <span
              aria-hidden="true"
              className={`size-1.5 rounded-full ${ended || full ? "bg-[var(--foreground-muted)]" : "bg-[var(--status-open)]"}`}
            />
            {ended ? t("cta.ended") : full ? t("status.full") : t("seatsLeft", { count: seats })}
          </span>
        </Link>
        <div className="flex flex-1 flex-col pt-3">
          <p className="flex w-fit items-center gap-2 rounded-full bg-[var(--wash)] px-3 py-1.5 text-xs font-semibold text-[var(--accent-ink)]">
            <PurposeIcon name={meetup.purposeIcon} color={meetup.purposeColor} />
            {meetupPurposeLabel(meetup.purpose, t.raw("purposes") as string[])}
          </p>
          <h2 className="font-lora mt-3 text-lg leading-snug font-semibold tracking-tight text-[var(--ink)]">
            <Link
              href={href}
              className="line-clamp-2 wrap-anywhere transition hover:text-[var(--accent-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
            >
              {meetup.title}
            </Link>
          </h2>
          {meetup.description && (
            <p className="mt-2 line-clamp-2 text-xs leading-6 text-[var(--accent-ink)]">
              {meetup.description}
            </p>
          )}
          <div className="mt-3 grid gap-1.5 text-xs leading-5 text-[var(--accent-ink)]">
            <p className="flex items-start gap-2">
              <Clock3 size={15} className="mt-0.5 shrink-0" aria-hidden="true" />
              <span>
                {date.weekday} · {date.time}
              </span>
            </p>
            <p className="flex items-start gap-2">
              <MapPin size={15} className="mt-0.5 shrink-0" aria-hidden="true" />
              <span className="min-w-0 truncate">
                {place}
                {meetup.cafe?.district && ` · ${meetup.cafe.district}`}
                {distance && ` · ${distance}`}
              </span>
            </p>
            {meetup.place.kind === "external" && (
              <a
                className="ml-6 w-fit underline underline-offset-4 hover:text-[var(--accent-hover)]"
                href={meetup.place.googleMapsUrl}
                target="_blank"
                rel="noreferrer"
              >
                {t("form.googleMapsOpen")}
              </a>
            )}
          </div>
          <div className="mt-auto pt-3">
            <div className="flex items-center justify-between gap-3 border-t border-[var(--line)] pt-2">
              <div className="flex min-w-0 items-center gap-2.5">
                <span
                  aria-hidden="true"
                  className="font-lora flex size-8 shrink-0 items-center justify-center rounded-full bg-[var(--background-secondary)] text-sm text-[var(--accent-ink)]"
                >
                  {meetup.organizerName.slice(0, 1)}
                </span>
                <p className="truncate text-xs font-semibold text-[var(--accent-ink)]">
                  {meetup.organizerName}
                </p>
              </div>
              <Link
                href={href}
                aria-label={`${t("actions.view")}: ${meetup.title}`}
                className="flex min-h-11 shrink-0 items-center justify-center gap-1.5 rounded-full bg-[var(--wash)] px-3 text-xs font-semibold text-[var(--accent-ink)] transition hover:bg-[var(--accent)] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
              >
                {t("actions.view")}
                <ArrowUpRight size={16} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
