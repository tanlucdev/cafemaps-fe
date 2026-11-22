"use client";

import { useEffect, useRef, useState } from "react";
import { Check, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { AREAS } from "@/types/cafe";
import NearMeButton from "@/components/cafe/NearMeButton";
import {
  disableNearMe,
  invalidateNearMeRequest,
  startNearMeRequest,
} from "@/components/cafe/GuidedFilterBar/near-me-request";
import { DISTANCE_OPTIONS } from "@/components/cafe/constants/filter-constants";
import { FilterChipButton } from "@/components/cafe/GuidedFilterBar/FilterChipButton";
import MeetupDatePicker from "./MeetupDatePicker";
import MeetupFilterSelect from "./MeetupFilterSelect";

export type DiscoveryFilters = {
  purpose: string;
  date: string;
  area: string;
  available: boolean;
  nearMe?: boolean;
  lat?: number;
  lng?: number;
  radiusKm?: number;
  page?: number;
};

export default function MeetupFilters({
  filters,
  onChange,
  onReset,
  filtered,
}: {
  filters: DiscoveryFilters;
  onChange: (filters: DiscoveryFilters) => void;
  onReset: () => void;
  filtered: boolean;
}) {
  const t = useTranslations("coffeeMeetups");
  const tNearby = useTranslations("nearby");
  const [loading, setLoading] = useState(false);
  const [locationError, setLocationError] = useState("");
  const inFlightRef = useRef(false);
  const requestIdRef = useRef(0);
  const latest = useRef({ filters, onChange });
  useEffect(() => {
    latest.current = { filters, onChange };
  }, [filters, onChange]);
  useEffect(() => () => invalidateNearMeRequest({ inFlightRef, requestIdRef }), []);

  function toggleNearMe() {
    setLocationError("");
    const options = {
      geolocation: navigator.geolocation,
      getFilter: () => {
        const { nearMe, lat, lng, radiusKm } = latest.current.filters;
        return { nearMe, lat, lng, radiusKm };
      },
      onChange: ({ nearMe, lat, lng, radiusKm }: Pick<DiscoveryFilters, "nearMe" | "lat" | "lng" | "radiusKm">) => {
        latest.current.onChange({ ...latest.current.filters, nearMe, lat, lng, radiusKm });
      },
      setLoading,
      onNoSupport: () => setLocationError(tNearby("noSupport")),
      onLocationError: () => setLocationError(tNearby("locationError")),
      inFlightRef,
      requestIdRef,
    };
    if (filters.nearMe || inFlightRef.current) disableNearMe(options);
    else startNearMeRequest(options);
  }
  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="mt-2 grid grid-cols-2 items-end gap-3 rounded-[28px] border border-[var(--border)] bg-[var(--card)] p-3 shadow-[0_4px_20px_-12px_rgba(92,58,25,0.12)] sm:p-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto_auto]"
    >
      <div className="col-span-2 min-w-0 sm:col-span-1">
        <MeetupDatePicker
          value={filters.date}
          onChange={(date) => {
            onChange({ ...filters, date });
          }}
        />
      </div>
      <div className="col-span-2 min-w-0 sm:col-span-1">
        <MeetupFilterSelect
          label={t("fields.area")}
          placeholder={t("filters.allAreas")}
          value={filters.area}
          options={AREAS}
          onChange={(area) => {
            onChange({ ...filters, area });
          }}
          className="min-w-0"
        />
      </div>
      <label className="relative col-span-2 min-w-0 cursor-pointer sm:col-span-1">
        <input
          type="checkbox"
          checked={filters.available}
          onChange={(event) => {
            onChange({ ...filters, available: event.target.checked });
          }}
          className="peer sr-only"
        />
        <span className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full border border-[var(--border)] bg-[var(--background)] px-4 text-sm font-semibold whitespace-nowrap text-[var(--foreground-muted)] transition-colors peer-checked:border-[var(--accent)]/50 peer-checked:bg-[var(--accent-light)] peer-checked:text-[var(--accent-hover)] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#8f5a16] hover:bg-[var(--accent-light)]">
          <span
            aria-hidden="true"
            className={`flex size-5 items-center justify-center rounded-full border ${filters.available ? "border-[var(--accent)] bg-[var(--accent)] text-white" : "border-[var(--border)]"}`}
          >
            {filters.available && <Check size={13} />}
          </span>
          {t("filters.available")}
        </span>
      </label>
      <div className="contents [&>[role=alert]]:order-last [&>[role=alert]]:col-span-full [&>[role=alert]]:min-w-0 [&>[role=alert]]:rounded-2xl [&>[role=alert]]:bg-[#FCEDEA] [&>[role=alert]]:px-4 [&>[role=alert]]:py-3 [&>[role=alert]]:leading-5 [&>[role=alert]]:break-words [&>button]:col-span-2 [&>button]:h-12 [&>button]:w-full [&>button]:justify-center [&>button]:px-4 [&>button]:text-sm [&>button]:font-semibold [&>button]:shadow-none [&>button]:hover:translate-y-0 [&>button]:hover:scale-100 [&>button]:active:scale-100 sm:[&>button]:col-span-1">
        <NearMeButton nearMe={Boolean(filters.nearMe)} loading={loading} onClick={toggleNearMe} />
        {locationError && <span role="alert">{locationError}</span>}
      </div>
      {filtered && (
        <div className="col-span-full flex min-w-0 flex-wrap items-center gap-2 border-t border-[var(--border)] pt-3">
          {filters.nearMe &&
            DISTANCE_OPTIONS.map(({ km }) => (
              <FilterChipButton
                className="h-12 min-w-20 justify-center px-4 text-sm font-semibold shadow-none hover:translate-y-0 hover:scale-100 active:scale-100"
                key={km}
                type="button"
                active={filters.radiusKm === km}
                onClick={() => {
                  onChange({ ...filters, radiusKm: km });
                }}
              >
                {"< " + km + " km"}
              </FilterChipButton>
            ))}
          <button
            type="button"
            onClick={onReset}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-[var(--border)] bg-[var(--background)] px-4 text-sm font-semibold text-[var(--foreground-muted)] transition-colors hover:border-[var(--accent)]/50 hover:bg-[var(--accent-light)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8f5a16] sm:ml-auto"
          >
            <X size={14} aria-hidden="true" />
            {t("filters.reset")}
          </button>
        </div>
      )}
    </form>
  );
}
