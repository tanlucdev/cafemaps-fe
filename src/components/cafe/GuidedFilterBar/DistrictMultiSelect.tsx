"use client";

import { Popover } from "@base-ui/react/popover";
import { Checkbox } from "@base-ui/react/checkbox";
import { Check, ChevronDown, MapPin } from "lucide-react";
import { useTranslations } from "next-intl";
import { AREAS, type CafeFilter as Filter } from "@/types/cafe";
import { normalizeDistricts } from "@/lib/district-filter";
import { cn } from "@/lib/utils";

interface DistrictMultiSelectProps {
  districts?: string[];
  filter: Filter;
  onChange: (filter: Filter) => void;
  className?: string;
}

export function DistrictMultiSelect({ districts, filter, onChange, className }: DistrictMultiSelectProps) {
  const t = useTranslations("guidedFilter");
  const tf = useTranslations("filters");
  const options = normalizeDistricts(districts, AREAS) ?? [...AREAS];
  const selected = normalizeDistricts(filter.districts, AREAS) ?? [];

  function setDistricts(next: string[]) {
    onChange({ ...filter, districts: normalizeDistricts(next, AREAS) });
  }

  return (
    <Popover.Root>
      <Popover.Trigger
        aria-label={tf("district")}
        className={cn(
          "group inline-flex h-9 min-w-[156px] flex-none cursor-pointer items-center gap-2 rounded-full border p-1 pr-2 text-[13px] font-bold shadow-[var(--shadow-sm)] backdrop-blur-md transition-all duration-150 hover:-translate-y-px hover:scale-[1.02] focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] active:scale-95",
          selected.length
            ? "border-[var(--accent)] bg-[var(--accent-light)] text-[var(--accent)]"
            : "border-[var(--border)] bg-white/62 text-[var(--foreground-muted)] dark:bg-[var(--card)]",
          className,
        )}
      >
        <span
          className={cn(
            "flex size-7 items-center justify-center rounded-full transition-colors",
            selected.length
              ? "bg-white/80 text-[var(--accent)]"
              : "bg-[var(--accent-light)] text-[var(--accent)] group-hover:bg-white",
          )}
        >
          <MapPin size={14} strokeWidth={2.5} />
        </span>
        <span className="flex-1 truncate text-left">
          {selected.length ? t("districtCount", { count: selected.length }) : t("allDistricts")}
        </span>
        <ChevronDown size={14} className="transition-transform group-aria-expanded:rotate-180" />
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner align="start" side="bottom" sideOffset={6} className="z-50">
          <Popover.Popup className="w-60 rounded-2xl border border-[var(--border)] bg-[#fffaf3] p-2 shadow-[0_18px_44px_rgba(69,42,15,0.16)] outline-none dark:bg-[var(--card)]">
            <div className="flex items-center justify-between px-2.5 pt-1.5 pb-2">
              <span className="text-xs font-extrabold tracking-wide text-[var(--foreground-muted)] uppercase">
                {tf("district")}
              </span>
              {selected.length > 0 && (
                <span className="rounded-full bg-[var(--accent-light)] px-2 py-0.5 text-[10px] font-extrabold text-[var(--accent)]">
                  {selected.length}
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={() => setDistricts([])}
              className={cn(
                "flex w-full cursor-pointer items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm font-bold transition-colors focus-visible:outline-none",
                selected.length
                  ? "text-[var(--accent)] hover:bg-[var(--accent-light)] focus-visible:bg-[var(--accent-light)]"
                  : "bg-[var(--accent-light)] text-[var(--accent)]",
              )}
            >
              <span className="flex size-4 items-center justify-center">
                {selected.length === 0 && <Check size={14} strokeWidth={3} />}
              </span>
              {t("allDistricts")}
            </button>
            <div className="mt-1 max-h-60 overflow-y-auto">
              {options.map((district) => {
                const checked = selected.includes(district);
                return (
                  <label
                    key={district}
                    className={cn(
                      "flex cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors hover:bg-[var(--accent-light)] focus-within:bg-[var(--accent-light)]",
                      checked && "text-[var(--accent)]",
                    )}
                  >
                    <Checkbox.Root
                      aria-label={district}
                      checked={checked}
                      onCheckedChange={() =>
                        setDistricts(
                          checked ? selected.filter((item) => item !== district) : [...selected, district],
                        )
                      }
                      className="grid size-5 shrink-0 place-items-center rounded-md border border-[#b9a993] bg-white text-white shadow-[inset_0_1px_1px_rgba(69,42,15,0.08)] transition-all hover:border-[var(--accent)] focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 data-checked:border-[var(--accent)] data-checked:bg-[var(--accent)]"
                    >
                      <Checkbox.Indicator>
                        <Check size={13} strokeWidth={3} />
                      </Checkbox.Indicator>
                    </Checkbox.Root>
                    {district}
                  </label>
                );
              })}
            </div>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}
