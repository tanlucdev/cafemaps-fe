"use client";

import { Popover } from "@base-ui/react/popover";
import { Check, X } from "lucide-react";
import { useTranslations } from "next-intl";
import PurposeIcon, { PURPOSE_COLORS, PURPOSE_ICONS } from "../PurposeIcon";

export default function PurposeAppearancePicker({ icon = "sparkles", color = PURPOSE_COLORS.brown, onChange }: {
  icon?: string;
  color?: string;
  onChange: (icon: string, color: string) => void;
}) {
  const t = useTranslations("coffeeMeetups");
  return (
    <Popover.Root>
      <Popover.Trigger type="button" aria-label={t("form.chooseAppearance")}
        className="flex size-11 shrink-0 items-center justify-center rounded-2xl border border-[var(--border)] bg-[#fffaf2] outline-none hover:border-[#8f5a16] focus-visible:border-[#8f5a16]">
        <PurposeIcon name={icon} color={color} />
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner side="bottom" align="start" sideOffset={8} collisionPadding={16} className="z-50">
          <Popover.Popup className="max-h-[min(26rem,var(--available-height))] w-[min(22rem,calc(100vw-2rem))] overflow-y-auto overscroll-contain rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-lg outline-none">
            <div className="mb-3 flex items-center justify-between gap-2">
              <Popover.Title className="font-bold">{t("form.chooseAppearance")}</Popover.Title>
              <Popover.Close type="button" aria-label={t("form.closeAppearance")}
                className="flex size-11 shrink-0 items-center justify-center rounded-xl hover:bg-[var(--accent-light)]">
                <X size={18} aria-hidden="true" />
              </Popover.Close>
            </div>
            <fieldset>
              <legend className="mb-2 text-sm font-bold">{t("form.chooseIcon")}</legend>
              <div className="grid grid-cols-5 gap-2">
                {Object.keys(PURPOSE_ICONS).map((name) => (
                  <button key={name} type="button" aria-label={t(`purposeIcons.${name}`)} title={t(`purposeIcons.${name}`)}
                    aria-pressed={icon === name} onClick={() => onChange(name, color)}
                    className={`flex h-11 items-center justify-center rounded-xl border ${icon === name ? "border-[var(--accent)] bg-[var(--accent-light)]" : "border-[var(--border)] hover:border-[var(--accent)]"}`}>
                    <PurposeIcon name={name} color={color} />
                  </button>
                ))}
              </div>
            </fieldset>
            <fieldset className="mt-4 border-t border-[var(--border)] pt-3">
              <legend className="px-1 text-sm font-bold">{t("form.chooseColor")}</legend>
              <div className="grid grid-cols-4 justify-items-center gap-2">
                {Object.entries(PURPOSE_COLORS).map(([name, value]) => (
                  <button key={name} type="button" aria-label={t(`purposeColors.${name}`)} title={t(`purposeColors.${name}`)}
                    aria-pressed={color === value} onClick={() => onChange(icon, value)}
                    className={`flex size-11 items-center justify-center rounded-xl border ${color === value ? "border-[var(--accent)] bg-[var(--accent-light)]" : "border-transparent hover:border-[var(--border)]"}`}>
                    <span style={{ backgroundColor: value }} className="flex size-7 items-center justify-center rounded-full">
                      {color === value && <Check size={16} className="text-white" aria-hidden="true" />}
                    </span>
                  </button>
                ))}
              </div>
            </fieldset>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}
