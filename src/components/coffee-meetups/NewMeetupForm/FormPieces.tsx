"use client";

import { CalendarPlus, Clock, LoaderCircle, Minus, Plus, UsersRound } from "lucide-react";
import { useTranslations } from "next-intl";
import { isMeetupGoogleMapsUrl, meetupPurposeLabel } from "@/apis/coffee-meetups/helpers";
import type { CreateMeetupPayload } from "@/apis/coffee-meetups";
import type { Cafe } from "@/types/cafe";
import PurposeIcon from "../PurposeIcon";
import type { InvitationStyle } from "@/apis/coffee-meetups/invitation";
import variants from "../invitation-variants.module.css";
import styles from "../invitation.module.css";

export const input =
  "h-11 w-full rounded-2xl border border-[var(--border)] bg-[#fffaf2] px-3 text-[16px] lg:text-sm font-bold text-[var(--foreground)] focus:!border-[#8f5a16] focus:!shadow-none focus:!ring-0 focus-visible:!border-[#8f5a16] focus-visible:!ring-0 focus-visible:!outline-none outline-none";

const quickTimes = [
  ["09:00", "11:00"],
  ["14:00", "16:00"],
  ["19:00", "21:00"],
];

export function ContactField({
  form,
  setForm,
}: {
  form: CreateMeetupPayload;
  setForm: (value: CreateMeetupPayload) => void;
}) {
  const t = useTranslations("coffeeMeetups");
  return (
    <label className="text-sm font-black sm:col-span-2">
      {t("fields.contactInfo")}
      <input
        className={`${input} mt-1.5`}
        value={form.contactInfo ?? ""}
        onChange={(event) => setForm({ ...form, contactInfo: event.target.value })}
        maxLength={200}
        placeholder={t("form.contactPlaceholder")}
        aria-describedby="meetup-contact-hint"
      />
      <span
        id="meetup-contact-hint"
        className="mt-1.5 block text-xs font-normal text-[var(--foreground-muted)]"
      >
        {t("form.contactHint")}
      </span>
    </label>
  );
}

export function TimeFields({
  form,
  setForm,
}: {
  form: CreateMeetupPayload;
  setForm: (value: CreateMeetupPayload) => void;
}) {
  const t = useTranslations("coffeeMeetups");
  return (
    <div className="grid gap-2 sm:col-span-2 sm:grid-cols-2">
      <label className="text-sm font-black">
        {t("fields.startTime")}
        <input
          className={`${input} mt-1.5`}
          type="time"
          value={form.startsAt}
          onChange={(e) => setForm({ ...form, startsAt: e.target.value })}
          required
        />
      </label>
      <label className="text-sm font-black">
        {t("fields.endTime")}
        <input
          className={`${input} mt-1.5`}
          type="time"
          value={form.endsAt}
          onChange={(e) => setForm({ ...form, endsAt: e.target.value })}
          required
        />
      </label>
      <div className="flex flex-wrap gap-2 sm:col-span-2" aria-label={t("form.quickTime")}>
        {quickTimes.map(([start, end]) => (
          <button
            key={start}
            type="button"
            onClick={() => setForm({ ...form, startsAt: start, endsAt: end })}
            className="inline-flex items-center gap-1 rounded-full border border-[var(--border)] bg-[#fffaf2] px-3 py-1.5 text-xs font-black"
          >
            <Clock size={14} />
            {start}-{end}
          </button>
        ))}
      </div>
    </div>
  );
}

export function ParticipantStepper({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) {
  const t = useTranslations("coffeeMeetups");
  return (
    <div className="mt-1.5 flex h-11 items-center justify-between rounded-2xl border border-[var(--border)] bg-[#fffaf2] px-2">
      <button
        type="button"
        aria-label={t("form.decreaseParticipants")}
        onClick={() => onChange(Math.max(2, value - 1))}
        className="rounded-full p-2 hover:bg-white"
      >
        <Minus size={16} />
      </button>
      <span>{value}</span>
      <button
        type="button"
        aria-label={t("form.increaseParticipants")}
        onClick={() => onChange(Math.min(10, value + 1))}
        className="rounded-full p-2 hover:bg-white"
      >
        <Plus size={16} />
      </button>
    </div>
  );
}

export function Preview({
  form,
  design,
  selectedCafe,
}: {
  form: CreateMeetupPayload;
  selectedCafe?: Pick<Cafe, "id" | "name" | "district">;
  design: InvitationStyle;
}) {
  const t = useTranslations("coffeeMeetups");
  const place = form.place.kind === "external" ? form.place.name : selectedCafe?.name;
  const placeMeta =
    form.place.kind === "external" ? form.place.googleMapsUrl : selectedCafe?.district || "TP.HCM";
  return (
    <aside className={`${styles.page} relative isolate rounded-[28px]`} data-color={design.color}>
      <div className={`${styles.card} ${variants.card}`} data-template={design.template}>
      <div className={styles.frame}>
      <p className="text-xs font-black text-[var(--accent-ink)]">
        {t("form.preview")} · {t(`invitation.templates.${design.template}`)}
      </p>
      <h2 className={`${styles.heading} font-lora mt-2 text-xl font-black wrap-anywhere`}>
        {form.title || t("form.untitled")}
      </h2>
      <div className={`${styles.details} mt-4 grid gap-3 text-sm font-bold`}>
        <p>
          <PurposeIcon
            name={form.purposeIcon}
            color={form.purposeColor}
            className="mr-1.5 inline"
          />
          {meetupPurposeLabel(form.purpose, t.raw("purposes") as string[])}
        </p>
        <p>
          {place || t("invitation.placeMissing")} ·{" "}
          {form.place.kind === "external" ? (
            <a
              className="break-all text-[var(--accent-hover)] underline"
              href={form.place.googleMapsUrl}
              target="_blank"
              rel="noreferrer"
            >
              {placeMeta}
            </a>
          ) : (
            placeMeta
          )}
        </p>
        <p>
          {form.date} · {form.startsAt}-{form.endsAt}
        </p>
        <p className="flex items-center gap-2">
          <UsersRound size={16} />
          {form.maxParticipants}
        </p>
      </div>
      {form.description && (
        <p className="mt-4 text-sm leading-6 font-semibold wrap-anywhere whitespace-pre-wrap text-[var(--ink)]">
          {form.description}
        </p>
      )}
      </div>
      </div>
    </aside>
  );
}

export function SubmitButton({
  submitting,
  edit,
  sticky = false,
}: {
  submitting: boolean;
  edit: boolean;
  sticky?: boolean;
}) {
  const t = useTranslations("coffeeMeetups");
  return (
    <button
      disabled={submitting}
      className={`${sticky ? "w-full" : "mt-5 hidden sm:inline-flex"} h-12 items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-5 text-sm font-black text-white hover:bg-[var(--accent-hover)] disabled:opacity-60 sm:w-auto`}
    >
      {submitting ? (
        <LoaderCircle className="animate-spin" size={16} />
      ) : (
        <CalendarPlus size={16} />
      )}
      {edit ? t("actions.save") : t("actions.create")}
    </button>
  );
}

export function ExternalPlaceFields({
  place,
  onChange,
}: {
  place: Extract<CreateMeetupPayload["place"], { kind: "external" }>;
  onChange: (place: Extract<CreateMeetupPayload["place"], { kind: "external" }>) => void;
}) {
  const t = useTranslations("coffeeMeetups.form");
  const invalidMap = Boolean(place.googleMapsUrl) && !isMeetupGoogleMapsUrl(place.googleMapsUrl);
  return (
    <div className="grid gap-4 rounded-2xl border border-[var(--border)] bg-[var(--accent-light)]/60 p-4 sm:col-span-2 sm:grid-cols-2">
      <label className="text-sm font-bold">
        {t("externalName")}
        <input
          className={`${input} mt-1.5`}
          value={place.name}
          maxLength={160}
          onChange={(event) => onChange({ ...place, name: event.target.value })}
          required
        />
      </label>
      <label className="text-sm font-bold">
        {t("googleMaps")}
        <input
          className={`${input} mt-1.5`}
          type="url"
          value={place.googleMapsUrl}
          maxLength={2048}
          onChange={(event) => onChange({ ...place, googleMapsUrl: event.target.value })}
          placeholder="https://maps.app.goo.gl/..."
          aria-invalid={invalidMap}
          aria-describedby={invalidMap ? "meetup-map-error" : undefined}
          required
        />
        {invalidMap && (
          <span id="meetup-map-error" role="alert" className="mt-1.5 block text-xs text-red-700">
            {t("invalidGoogleMaps")}
          </span>
        )}
      </label>
    </div>
  );
}
