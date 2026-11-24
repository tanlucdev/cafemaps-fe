"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { MEETUP_PURPOSES, type CreateMeetupPayload } from "@/apis/coffee-meetups";
import PurposeIcon, { PURPOSE_COLORS } from "../PurposeIcon";
import PurposeAppearancePicker from "./PurposeAppearancePicker";
import { input } from "./FormPieces";

const defaultIcons = ["book", "work", "language", "book", "friends", "chat", "sparkles"];

export default function PurposeChips({
  purposes,
  form,
  setForm,
  onPurposeSelect,
}: {
  purposes: string[];
  form: CreateMeetupPayload;
  setForm: (value: CreateMeetupPayload) => void;
  onPurposeSelect: () => void;
}) {
  const t = useTranslations("coffeeMeetups");
  const [other, setOther] = useState(false);
  const custom =
    other ||
    Boolean(
      form.purpose && !MEETUP_PURPOSES.includes(form.purpose as (typeof MEETUP_PURPOSES)[number]),
    );

  function change(
    purpose: string,
    purposeIcon: string,
    purposeColor = form.purposeColor ?? PURPOSE_COLORS.brown,
  ) {
    setForm({
      ...form,
      purpose,
      purposeIcon,
      purposeColor,
      place: form.place,
    });
  }

  return (
    <div className="mt-1.5 grid gap-3">
      <div className="grid gap-2 sm:grid-cols-4">
        {purposes.map((purpose, index) => {
          const isOther = index === purposes.length - 1;
          const selected = isOther ? custom : !custom && form.purpose === MEETUP_PURPOSES[index];
          return (
            <button
              key={purpose}
              type="button"
              aria-pressed={selected}
              onClick={() => {
                if (selected) {
                  if (!isOther) onPurposeSelect();
                  return;
                }
                setOther(isOther);
                change(
                  isOther ? "" : MEETUP_PURPOSES[index],
                  defaultIcons[index] ?? "sparkles",
                  PURPOSE_COLORS.brown,
                );
                if (!isOther) onPurposeSelect();
              }}
              className={`rounded-2xl border px-3 py-2 text-left text-sm font-black ${selected ? "border-[var(--accent)] bg-[var(--accent-light)] text-[#875200]" : "border-[var(--border)] bg-[#fffaf2]"}`}
            >
              <PurposeIcon
                name={isOther && custom ? form.purposeIcon : defaultIcons[index]}
                color={isOther && custom ? form.purposeColor : undefined}
                className="mr-2 inline"
              />
              {purpose}
            </button>
          );
        })}
      </div>
      {custom && (
        <div className="grid gap-4 rounded-2xl border border-[var(--border)] bg-[#fffaf2]/60 p-4">
          <label htmlFor="meetup-custom-purpose" className="text-sm font-bold">
            {t("form.customPurpose")}
          </label>
          <div className="flex items-center gap-2">
            <PurposeAppearancePicker
              icon={form.purposeIcon}
              color={form.purposeColor}
              onChange={(icon, color) => change(form.purpose, icon, color)}
            />
            <input
              id="meetup-custom-purpose"
              className={`${input} min-w-0 flex-1`}
              value={form.purpose}
              onChange={(event) => {
                setOther(true);
                change(event.target.value, form.purposeIcon ?? "sparkles");
              }}
              placeholder={t("form.customPurposePlaceholder")}
              minLength={2}
              maxLength={80}
              required
            />
          </div>
        </div>
      )}
    </div>
  );
}
