"use client";

import { CalendarPlus, Clock, LoaderCircle, Minus, Plus, UsersRound } from "lucide-react";
import { useTranslations } from "next-intl";
import { buildGoogleMapsSearchUrl } from "@/apis/coffee-meetups/helpers";
import type { CreateMeetupPayload } from "@/apis/coffee-meetups";
import type { Cafe } from "@/types/cafe";
import PurposeIcon from "../PurposeIcon";

export const input =
  "h-11 w-full rounded-2xl border border-[var(--border)] bg-[#fffaf2] px-3 text-[16px] lg:text-sm font-bold text-[var(--foreground)] focus:!border-[#8f5a16] focus:!shadow-none focus:!ring-0 focus-visible:!border-[#8f5a16] focus-visible:!ring-0 focus-visible:!outline-none outline-none";

const quickTimes = [
  ["09:00", "11:00"],
  ["14:00", "16:00"],
  ["19:00", "21:00"],
];

export function ContactField({ form, setForm }: {
  form: CreateMeetupPayload;
  setForm: (value: CreateMeetupPayload) => void;
}) {
  const t = useTranslations("coffeeMeetups");
  return (
    <label className="text-sm font-black sm:col-span-2">
      {t("fields.contactInfo")}
      <input className={`${input} mt-1.5`} value={form.contactInfo ?? ""}
        onChange={(event) => setForm({ ...form, contactInfo: event.target.value })}
        maxLength={200} placeholder={t("form.contactPlaceholder")}
        aria-describedby="meetup-contact-hint" />
      <span id="meetup-contact-hint" className="mt-1.5 block text-xs font-normal text-[var(--foreground-muted)]">
        {t("form.contactHint")}
      </span>
    </label>
  );
}

export function ExternalPlaceFields({
  external,
  setExternal,
}: {
  external: { name: string; url: string; district: string };
  setExternal: (value: { name: string; url: string; district: string }) => void;
}) {
  const t = useTranslations("coffeeMeetups");
  const mapsUrl = external.name ? buildGoogleMapsSearchUrl(external.name, external.district) : "";
  return (
    <div className="grid gap-4 sm:col-span-2 sm:grid-cols-2">
      <label className="text-sm font-black sm:col-span-2">
        {t("form.externalName")}
        <input
          className={`${input} mt-1.5`}
          value={external.name}
          onChange={(e) => setExternal({ ...external, name: e.target.value })}
        />
      </label>
      <label className="text-sm font-black">
        {t("form.externalDistrict")}
        <input
          className={`${input} mt-1.5`}
          value={external.district}
          onChange={(e) => setExternal({ ...external, district: e.target.value })}
        />
      </label>
      <label className="text-sm font-black">
        {t("form.externalUrl")}
        <input
          className={`${input} mt-1.5`}
          value={external.url}
          onChange={(e) => setExternal({ ...external, url: e.target.value })}
        />
      </label>
      {mapsUrl && (
        <a
          className="text-sm font-black text-[var(--accent)] underline sm:col-span-2"
          href={mapsUrl}
          target="_blank"
          rel="noreferrer"
        >
          {t("form.mapsSuggestion")}
        </a>
      )}
    </div>
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
  return (
    <div className="mt-1.5 flex h-11 items-center justify-between rounded-2xl border border-[var(--border)] bg-[#fffaf2] px-2">
      <button
        type="button"
        aria-label="Giảm số người"
        onClick={() => onChange(Math.max(2, value - 1))}
        className="rounded-full p-2 hover:bg-white"
      >
        <Minus size={16} />
      </button>
      <span>{value}</span>
      <button
        type="button"
        aria-label="Tăng số người"
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
  selectedCafe,
  external,
  placeMode,
}: {
  form: CreateMeetupPayload;
  selectedCafe?: Cafe;
  external: { name: string; district: string };
  placeMode: "cafe" | "external";
}) {
  const t = useTranslations("coffeeMeetups");
  const place = placeMode === "external" ? external.name : selectedCafe?.name;
  return (
    <aside className="h-fit rounded-[28px] border border-[var(--border)] bg-[#fffaf2]/88 p-4 shadow-[var(--shadow-sm)] lg:sticky lg:top-24">
      <p className="text-xs font-black tracking-[0.08em] text-[var(--accent)] uppercase">
        {t("form.preview")}
      </p>
      <h2 className="mt-2 text-xl font-black text-[var(--foreground)]">
        {form.title || t("form.untitled")}
      </h2>
      <div className="mt-4 grid gap-3 text-sm font-bold text-[var(--foreground-muted)]">
        <p><PurposeIcon name={form.purposeIcon} color={form.purposeColor} className="mr-1.5 inline" />{form.purpose}</p>
        <p>
          {place || t("form.selectCafe")} ·{" "}
          {placeMode === "external"
            ? external.district || "TP.HCM"
            : selectedCafe?.district || "TP.HCM"}
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
        <p className="mt-4 text-sm leading-6 font-semibold text-[var(--foreground)]">
          {form.description}
        </p>
      )}
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
