"use client";
import { useState } from "react";
import Image from "next/image";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Heart,
  MapPin,
  ShieldCheck,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { meetupPurposeLabel, type CoffeeMeetup } from "@/apis/coffee-meetups";
import { mockMeetupIds } from "@/apis/coffee-meetups/mock";
import { formatMeetupDateParts, isEnded, remainingSeats } from "./format";
import PurposeIcon from "./PurposeIcon";
import CoffeeSticker from "./CoffeeSticker";
import type { InvitationStyle } from "@/apis/coffee-meetups/invitation";
import InvitationVenue from "./InvitationVenue";
import variants from "./invitation-variants.module.css";
import styles from "./invitation.module.css";

export default function MeetupDetailCard({
  meetup,
  sample,
  draft = false,
  shareAction,
  actions,
  reportAction,
  design,
  children,
}: {
  meetup: CoffeeMeetup;
  sample?: boolean;
  draft?: boolean;
  shareAction?: React.ReactNode;
  actions?: React.ReactNode;
  reportAction?: React.ReactNode;
  design: InvitationStyle;
  children?: React.ReactNode;
}) {
  const t = useTranslations("coffeeMeetups");
  const locale = useLocale();
  const [failedImage, setFailedImage] = useState<string>();
  const description = meetup.description?.trim() ?? "";
  const sampleIndex = sample ? mockMeetupIds.indexOf(meetup.id) : -1;
  const cafeImage = meetup.imageUrl || meetup.cafe?.coverImage || meetup.cafe?.images?.[0];
  const photo = failedImage === cafeImage ? undefined : cafeImage;
  const illustration =
    !photo && meetup.place.kind === "external"
      ? "/quiz/wide/woman/3-lively-friends-table.webp"
      : undefined;
  const imageSrc = photo ?? illustration;
  const date = formatMeetupDateParts(meetup, locale === "en" ? "en-US" : "vi-VN");
  const hasTime =
    Number.isFinite(Date.parse(meetup.startsAt)) && Number.isFinite(Date.parse(meetup.endsAt));
  const Container = draft ? "div" : "main";
  const purpose = meetupPurposeLabel(meetup.purpose, t.raw("purposes") as string[]);
  const participants = [
    { id: meetup.organizerId, name: meetup.organizerName, label: t("fields.organizer") },
    ...(meetup.acceptedParticipants ?? meetup.requests
      .filter((request) => request.status === "accepted")
      .map((request) => ({ displayName: request.requesterName })))
      .map(({ displayName }, index) => ({ id: `guest-${index}`, name: displayName, label: "" })),
  ];
  const statusKey =
    meetup.status === "cancelled"
      ? "cancelled"
      : meetup.status === "completed" || (!draft && isEnded(meetup))
        ? "ended"
        : meetup.status === "full" || remainingSeats(meetup) === 0
          ? "full"
          : "available";
  return (
    <Container
      className={`${styles.page} ${draft ? "px-3 py-5 sm:px-7" : "min-h-[100svh] px-2 pt-20 pb-28 sm:px-8 sm:pt-28"}`}
      data-color={design.color}
    >
      <div className="@container relative isolate mx-auto max-w-[52rem]">
        {sampleIndex >= 0 && (
          <nav
            aria-label={t("invitation.sample")}
            className="mb-2 flex items-center justify-between gap-2 rounded-full border border-[var(--line)] bg-[var(--paper)] px-2 text-center text-xs font-bold text-[var(--accent-ink)]"
          >
            <Link
              aria-label={t("invitation.previous")}
              className="grid size-10 shrink-0 place-items-center rounded-full hover:bg-[var(--wash)]"
              href={`/coffee-meetups/${mockMeetupIds[(sampleIndex + mockMeetupIds.length - 1) % mockMeetupIds.length]}`}
            >
              <ChevronLeft size={18} aria-hidden="true" />
            </Link>
            <span>
              {sampleIndex + 1}/{mockMeetupIds.length} ·{" "}
              {t(`invitation.templates.${design.template}`)}
            </span>
            <Link
              aria-label={t("invitation.next")}
              className="grid size-10 shrink-0 place-items-center rounded-full hover:bg-[var(--wash)]"
              href={`/coffee-meetups/${mockMeetupIds[(sampleIndex + 1) % mockMeetupIds.length]}`}
            >
              <ChevronRight size={18} aria-hidden="true" />
            </Link>
          </nav>
        )}
        <article
          className={`${styles.card} ${styles.detailCard} ${variants.card}`}
          data-template={design.template}
        >
          <div className={styles.frame}>
            <div className={styles.layout}>
              <header className={styles.heading}>
                <div
                  className="mx-auto mb-1 flex w-fit items-center gap-1.5 text-[var(--accent-ink)] sm:gap-2"
                  aria-hidden="true"
                >
                  <Heart size={12} fill="currentColor" />
                  <CoffeeSticker className="w-7 sm:w-12" />
                  <Heart size={12} fill="currentColor" />
                </div>
                <p className="text-sm font-semibold text-[#8b5730] sm:text-base">
                  {t("invitation.from", { name: meetup.organizerName })}
                </p>
                <h1 className="font-lora mx-auto mt-1.5 max-w-xl text-[clamp(1.45rem,5vw,2.5rem)] leading-[1.13] font-semibold tracking-tight text-balance wrap-anywhere">
                  {meetup.title}
                </h1>
                {description && (
                  <p className="mx-auto mt-2 max-w-lg text-left text-sm leading-[1.45] wrap-anywhere whitespace-pre-wrap sm:[text-align:inherit] sm:leading-relaxed">
                    {description}
                  </p>
                )}
              </header>

              <div
                className={`${styles.details} min-w-0 space-y-1 border-y border-[var(--line)] py-2 text-sm sm:space-y-2 sm:py-3`}
              >
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 sm:flex-col sm:gap-2">
                  <div className="flex items-start gap-1.5 sm:gap-2.5">
                    <CalendarDays
                      size={18}
                      className="mt-0.5 shrink-0 text-[#98672d]"
                      aria-hidden="true"
                    />
                    <time dateTime={meetup.startsAt} className="font-bold capitalize">
                      {Number.isFinite(Date.parse(meetup.startsAt))
                        ? `${date.weekday}, ${date.day} ${date.month}`
                        : t("invitation.dateMissing")}
                    </time>
                  </div>
                  <div className="flex items-start gap-1.5 sm:gap-2.5">
                    <Clock3
                      size={18}
                      className="mt-0.5 shrink-0 text-[#98672d]"
                      aria-hidden="true"
                    />
                    <span className="font-bold">
                      {hasTime ? `${date.time} · ICT` : t("invitation.timeMissing")}
                    </span>
                  </div>
                </div>
                <div className="flex items-start gap-1.5 sm:gap-2.5">
                  <MapPin size={18} className="mt-0.5 shrink-0 text-[#98672d]" aria-hidden="true" />
                  <div className="min-w-0 flex-1 wrap-anywhere">
                    <InvitationVenue
                      key={meetup.cafe?.slug}
                      meetup={meetup}
                      draft={draft}
                      sample={sample}
                    />
                  </div>
                </div>
              </div>
              {imageSrc && (
                <figure
                  data-invitation-photo
                  data-invitation-illustration={illustration ? "" : undefined}
                  className={`${styles.photo} relative mx-auto w-[94%] max-w-88 rounded-md bg-white p-1.5 pb-3 shadow-[0_9px_20px_-12px_#765033] sm:w-full`}
                >
                  <span
                    aria-hidden="true"
                    className="absolute -top-1.5 left-1/2 z-10 h-4 w-12 -translate-x-1/2 rotate-6 bg-[var(--line)]/75"
                  />
                  <div className="relative aspect-video overflow-hidden rounded-sm">
                    <Image
                      src={imageSrc}
                      alt=""
                      fill
                      preload
                      sizes="(max-width: 639px) 85vw, 352px"
                      className="object-cover"
                      onError={photo ? () => setFailedImage(photo) : undefined}
                    />
                  </div>
                  {illustration && (
                    <figcaption className="absolute right-2 bottom-4 rounded-full bg-[var(--paper)] px-2 py-0.5 text-[11px] font-semibold text-[var(--accent-ink)]">
                      {t("invitation.illustration")}
                    </figcaption>
                  )}
                </figure>
              )}
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <div className="mr-auto flex flex-wrap items-center gap-2 text-xs font-semibold text-[var(--accent-ink)]">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--wash)] px-2.5 py-1.5">
                  <PurposeIcon name={meetup.purposeIcon} color={meetup.purposeColor} />
                  {purpose || t("fields.purpose")}
                </span>
                <span>
                  {statusKey === "available"
                    ? t("seatsLeft", { count: remainingSeats(meetup) })
                    : t(`status.${statusKey}`)}
                </span>
              </div>
              {shareAction}
              {actions}
            </div>

            {!draft && (
              <>
                <section className="mt-3 border-t border-[var(--line)] pt-3 sm:mt-4 sm:pt-4">
                  <h2 className="font-lora text-lg font-bold sm:text-xl">
                    {t("invitation.meetupInfo")}
                  </h2>
                  <div className="mt-2 sm:mt-3">
                    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 text-sm">
                      <h3 className="font-bold">{t("acceptedTitle")}</h3>
                      <p className="text-[var(--accent-ink)]">
                        {meetup.acceptedCount}/{meetup.maxParticipants} · {t("people")}
                      </p>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1.5 sm:mt-3 sm:gap-2">
                      {participants.map((person) => (
                        <div
                          key={person.id}
                          className="flex items-center gap-2 rounded-full border border-[#e7d9c4] py-1 pr-2 pl-1 sm:py-1.5 sm:pr-3 sm:pl-1.5"
                        >
                          <span className="grid size-6 shrink-0 place-items-center rounded-full bg-[#edddc5] text-xs font-bold text-[#704a26] sm:size-8 sm:text-sm">
                            {person.name.trim().charAt(0).toLocaleUpperCase()}
                          </span>
                          <span className="text-[13px] font-semibold wrap-anywhere sm:text-sm">
                            {person.name}
                            {person.label && (
                              <small className="ml-1 text-[#886b4d]">· {person.label}</small>
                            )}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  {meetup.contactInfo && (
                    <p className="mt-3 text-sm break-words whitespace-pre-wrap sm:mt-5">
                      <b>{t("fields.contactInfo")}:</b> {meetup.contactInfo}
                    </p>
                  )}
                  <div className="mt-3 flex items-start gap-2 rounded-xl bg-[#eaf2e8] p-2.5 text-[13px] leading-snug font-semibold text-[#356545] sm:mt-5 sm:p-3 sm:text-sm">
                    <ShieldCheck size={16} aria-hidden="true" className="shrink-0" />
                    {t("safety")}
                  </div>
                  {sample && (
                    <p className="mt-2 text-xs text-[var(--accent-ink)] sm:mt-3">
                      {t("demo.detail")}
                    </p>
                  )}

                  {reportAction}
                </section>

                {children && (
                  <div className="mt-3 border-t border-[var(--line)] pt-3 sm:mt-4 sm:pt-4">
                    {children}
                  </div>
                )}
              </>
            )}
          </div>
        </article>
      </div>
    </Container>
  );
}
