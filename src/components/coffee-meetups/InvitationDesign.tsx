"use client";

import { Check, Palette } from "lucide-react";
import { useTranslations } from "next-intl";
import { invitationTemplates, invitationColors, type InvitationStyle } from "@/apis/coffee-meetups/invitation";
import styles from "./invitation.module.css";
import variants from "./invitation-variants.module.css";

export default function InvitationDesign({
  template,
  color,
  onChange,
}: InvitationStyle & {
  onChange: (design: InvitationStyle) => void;
}) {
  const t = useTranslations("coffeeMeetups.invitation");
  return (
    <details className="rounded-2xl border border-[var(--border)] bg-[var(--card)] px-3 sm:px-4">
      <summary className="flex min-h-11 cursor-pointer list-none items-center justify-center gap-2 rounded-lg text-sm font-bold text-[var(--foreground)] focus-visible:outline-2 focus-visible:outline-[var(--accent)] [&::-webkit-details-marker]:hidden">
        <Palette size={16} aria-hidden="true" />
        {t("design")}
        <span className="font-medium text-[var(--foreground-muted)]">
          · {t(`templates.${template}`)}
        </span>
      </summary>
      <div className="space-y-3 pb-4">
        <fieldset className="min-w-0">
          <legend className="mb-2 text-xs font-bold">{t("template")}</legend>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
            {invitationTemplates.map((item) => (
              <button
                key={item}
                type="button"
                aria-pressed={item === template}
                onClick={() => onChange({ template: item, color })}
                className="min-w-0 rounded-xl border border-[var(--border)] p-1.5 text-xs font-semibold wrap-anywhere hover:border-[var(--accent)] focus-visible:outline-2 focus-visible:outline-[var(--accent)] aria-pressed:border-[var(--accent)] aria-pressed:bg-[var(--accent-light)] aria-pressed:text-[#56371c]"
              >
                <span
                  className={`${styles.thumbnail} ${variants.card}`}
                  data-template={item}
                  data-color={color}
                  aria-hidden="true"
                >
                  <i />
                  <b />
                </span>
                {t(`templates.${item}`)}
              </button>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend className="mb-1 text-xs font-bold">{t("color")}</legend>
          <div className="flex flex-wrap gap-0.5">
            {invitationColors.map((item) => (
              <button
                key={item}
                type="button"
                aria-label={t(`colors.${item}`)}
                title={t(`colors.${item}`)}
                aria-pressed={item === color}
                onClick={() => onChange({ template, color: item })}
                data-color={item}
                className={styles.swatch}
              >
                <span>{item === color && <Check size={16} aria-hidden="true" />}</span>
              </button>
            ))}
          </div>
        </fieldset>
      </div>
    </details>
  );
}
