"use client";

import { useId, useRef, useState } from "react";
import { Popover } from "@base-ui/react/popover";
import { CalendarDays, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { calendarDays, isCalendarDate, meetupToday, shiftCalendarDate } from "./format";

export default function MeetupDatePicker({
  value: inputValue,
  onChange,
  min,
}: {
  value: string;
  onChange: (date: string) => void;
  min?: string;
}) {
  const t = useTranslations("coffeeMeetups.calendar");
  const value = isCalendarDate(inputValue) ? inputValue : "";
  const locale = useLocale();
  const id = useId();
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(value || min || meetupToday());
  const dayRef = useRef<HTMLButtonElement>(null);
  const today = meetupToday();
  const days = calendarDays(focused);
  const dateLabel = (date: string, options: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat(locale, { ...options, timeZone: "UTC" }).format(
      new Date(`${date}T12:00:00Z`),
    );
  function choose(date: string) {
    onChange(date);
    setOpen(false);
  }
  return (
    <div className="grid min-w-0 gap-1.5">
      <span
        id={`${id}-label`}
        className="px-1 text-xs font-semibold text-[var(--foreground-muted)]"
      >
        {t("label")}
      </span>
      <Popover.Root
        open={open}
        onOpenChange={(next) => {
          if (next) setFocused(value || min || today);
          setOpen(next);
        }}
      >
        <Popover.Trigger
          aria-labelledby={`${id}-label ${id}-value`}
          className="flex h-12 w-full min-w-0 items-center gap-2.5 rounded-full border border-[var(--border)] bg-[var(--background)] px-4 text-left text-[16px] font-medium text-[var(--foreground)] transition-colors outline-none hover:border-[#8f5a16]/50 focus:!border-[#8f5a16] focus:!shadow-none focus:!ring-0 lg:text-sm"
        >
          <CalendarDays
            size={18}
            aria-hidden="true"
            className="shrink-0 text-[var(--accent-hover)]"
          />
          <span id={`${id}-value`} className="min-w-0 flex-1 truncate">
            {value
              ? dateLabel(value, { day: "2-digit", month: "2-digit", year: "numeric" })
              : t("anyDay")}
          </span>
          <ChevronDown
            size={15}
            aria-hidden="true"
            className="shrink-0 text-[var(--foreground-muted)]"
          />
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Positioner
            side="bottom"
            align="start"
            sideOffset={10}
            className="z-[70] max-w-[calc(100vw-1.5rem)]"
          >
            <Popover.Popup
              initialFocus={dayRef}
              className="max-h-[var(--available-height)] w-80 max-w-full overflow-y-auto overscroll-contain rounded-[28px] border border-[var(--border)] bg-[var(--card)] p-4 text-[var(--foreground)] shadow-xl outline-none"
            >
              <header className="mb-4 flex items-center justify-between gap-2">
                <button
                  type="button"
                  aria-label={t("previousMonth")}
                  onClick={() => setFocused(shiftCalendarDate(focused, 0, -1))}
                  className="flex size-10 items-center justify-center rounded-full hover:bg-[var(--accent-light)] focus-visible:outline-2 focus-visible:outline-[#8f5a16]"
                >
                  <ChevronLeft size={18} />
                </button>
                <Popover.Title
                  id={`${id}-month`}
                  aria-live="polite"
                  className="font-lora text-base capitalize"
                >
                  {dateLabel(focused, { month: "long", year: "numeric" })}
                </Popover.Title>
                <button
                  type="button"
                  aria-label={t("nextMonth")}
                  onClick={() => setFocused(shiftCalendarDate(focused, 0, 1))}
                  className="flex size-10 items-center justify-center rounded-full hover:bg-[var(--accent-light)] focus-visible:outline-2 focus-visible:outline-[#8f5a16]"
                >
                  <ChevronRight size={18} />
                </button>
              </header>
              <div role="grid" aria-labelledby={`${id}-month`}>
                <div role="row" className="mb-2 grid grid-cols-7">
                  {days.slice(0, 7).map((day) => (
                    <span
                      key={day}
                      role="columnheader"
                      className="text-center text-[11px] font-semibold text-[var(--foreground-muted)]"
                    >
                      {dateLabel(day, { weekday: "short" })}
                    </span>
                  ))}
                </div>
                {Array.from({ length: 6 }, (_, week) => (
                  <div key={week} role="row" className="grid grid-cols-7 gap-y-1">
                    {days.slice(week * 7, week * 7 + 7).map((day) => (
                      <div key={day} role="gridcell" aria-selected={value === day}>
                        <button
                          type="button"
                          ref={focused === day ? dayRef : undefined}
                          tabIndex={focused === day ? 0 : -1}
                          aria-label={dateLabel(day, { dateStyle: "full" })}
                          aria-current={day === today ? "date" : undefined}
                          aria-disabled={Boolean(min && day < min)}
                          onClick={() => {
                            if (!min || day >= min) choose(day);
                          }}
                          onKeyDown={(event) => {
                            const weekday = (new Date(`${day}T12:00:00Z`).getUTCDay() + 6) % 7;
                            const offsets: Record<string, number> = {
                              ArrowLeft: -1,
                              ArrowRight: 1,
                              ArrowUp: -7,
                              ArrowDown: 7,
                              Home: -weekday,
                              End: 6 - weekday,
                            };
                            if (
                              !(event.key in offsets) &&
                              !["PageUp", "PageDown"].includes(event.key)
                            )
                              return;
                            event.preventDefault();
                            const next = shiftCalendarDate(
                              day,
                              offsets[event.key] ?? 0,
                              event.key === "PageUp" ? -1 : event.key === "PageDown" ? 1 : 0,
                            );
                            setFocused(next);
                            requestAnimationFrame(() => dayRef.current?.focus());
                          }}
                          className={`relative flex aspect-square w-full items-center justify-center rounded-full text-sm transition-colors outline-none focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#8f5a16] aria-disabled:opacity-30 ${value === day ? "bg-[var(--accent)] font-bold text-white" : `${day.slice(0, 7) !== focused.slice(0, 7) ? "text-[var(--foreground-muted)]/50" : "text-[var(--foreground)]"} hover:bg-[var(--accent-light)]`} ${day === today && value !== day ? "font-bold underline decoration-[var(--accent)] underline-offset-4" : ""}`}
                        >
                          {Number(day.slice(-2))}
                        </button>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
              <footer className="mt-4 flex flex-wrap gap-2 border-t border-[var(--border)] pt-3">
                {[today, shiftCalendarDate(today, 1)].map((day, index) => (
                  <button
                    key={day}
                    type="button"
                    disabled={Boolean(min && day < min)}
                    onClick={() => choose(day)}
                    className="min-h-10 rounded-full bg-[var(--accent-light)] px-3 text-xs font-semibold text-[var(--accent-hover)] disabled:opacity-30"
                  >
                    {t(index === 0 ? "today" : "tomorrow")}
                  </button>
                ))}
                {!min && (
                  <button
                    type="button"
                    onClick={() => choose("")}
                    className="ml-auto min-h-10 px-2 text-xs font-semibold text-[var(--foreground-muted)]"
                  >
                    {t("clear")}
                  </button>
                )}
                <Popover.Close className="sr-only">{t("close")}</Popover.Close>
              </footer>
            </Popover.Popup>
          </Popover.Positioner>
        </Popover.Portal>
      </Popover.Root>
    </div>
  );
}
