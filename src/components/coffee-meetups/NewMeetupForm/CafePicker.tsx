"use client";

import Image from "next/image";
import { MapPin, Search } from "lucide-react";
import type { KeyboardEvent } from "react";
import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { EN_VIBE_VALUES } from "@/apis/cafes/filter-normalization";
import { VIBES } from "@/types/cafe";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getCafeOpenStatus } from "@/lib/opening-hours";
import { useNearMe } from "@/components/cafe/hooks/useNearMe";
import NearMeButton from "@/components/cafe/NearMeButton";
import { FilterChipButton } from "@/components/cafe/GuidedFilterBar/FilterChipButton";
import { DISTANCE_OPTIONS } from "@/components/cafe/constants/filter-constants";
import type { Cafe, CafeFilter } from "@/types/cafe";

type Props = {
  cafes: Cafe[];
  value: string;
  query: string;
  loading: boolean;
  ready: boolean;
  vibe: string;
  nearby: CafeFilter;
  onNearby: (filter: CafeFilter) => void;
  onVibe: (value: string) => void;
  onQuery: (value: string) => void;
  onSelect: (cafe: Cafe) => void;
  labels: {
    cafe: string;
    search: string;
    empty: string;
    loading: string;
    open: string;
    closed: string;
  };
};

export default function CafePicker({
  cafes,
  value,
  query,
  loading,
  ready,
  vibe,
  nearby,
  onNearby,
  onVibe,
  onQuery,
  onSelect,
  labels,
}: Props) {
  const { nearMeLoading, onNearMe } = useNearMe(nearby, onNearby);
  const t = useTranslations("coffeeMeetups.form");
  const tFilters = useTranslations("filters");
  const [activeIndex, setActiveIndex] = useState(0);
  const selected = useMemo(() => cafes.find((cafe) => cafe.id === value), [cafes, value]);

  function choose(cafe: Cafe) {
    onSelect(cafe);
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (!ready || loading || !cafes.length) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => Math.min(index + 1, cafes.length - 1));
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => Math.max(index - 1, 0));
    }
    if (event.key === "Enter") {
      event.preventDefault();
      choose(cafes[Math.min(activeIndex, cafes.length - 1)]);
    }
  }

  return (
    <div className="sm:col-span-2">
      <div className="mb-4 grid gap-1 text-sm font-black">
        <label htmlFor="meetup-cafe-vibe">{t("vibe")}</label>
        <Select value={vibe} onValueChange={(value) => onVibe(value ?? "")}>
          <SelectTrigger id="meetup-cafe-vibe"
            className="w-full rounded-2xl border border-[var(--border)] bg-[#fffaf2] px-3 text-[16px] outline-none focus:!border-[#8f5a16] focus:!shadow-none focus:!ring-0 focus-visible:!border-[#8f5a16] focus-visible:!ring-0 focus-visible:!outline-none data-[size=default]:h-11 lg:text-sm">
            <SelectValue placeholder={t("allVibes")} />
          </SelectTrigger>
          <SelectContent side="bottom" align="start" sideOffset={8} alignItemWithTrigger={false}
            className="max-h-[min(16rem,var(--available-height))] rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-lg [--accent-foreground:var(--foreground)] [scrollbar-width:thin]">
            <SelectItem className="min-h-11 cursor-pointer rounded-xl data-highlighted:bg-[var(--accent-light)] data-selected:bg-[var(--accent-light)] data-selected:font-bold data-selected:text-[var(--accent)]" value="">{t("allVibes")}</SelectItem>
            {VIBES.map((value) => (
              <SelectItem key={value} value={EN_VIBE_VALUES[value]}
                className="min-h-11 cursor-pointer rounded-xl data-highlighted:bg-[var(--accent-light)] data-selected:bg-[var(--accent-light)] data-selected:font-bold data-selected:text-[var(--accent)]">
                {tFilters(`vibes.${EN_VIBE_VALUES[value]}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <NearMeButton nearMe={Boolean(nearby.nearMe)} loading={nearMeLoading} onClick={onNearMe} />
        {nearby.nearMe && DISTANCE_OPTIONS.map(({ km }) => (
          <FilterChipButton key={km} type="button" active={nearby.radiusKm === km}
            onClick={() => onNearby({ ...nearby, radiusKm: km })}>
            {"< " + km + "km"}
          </FilterChipButton>
        ))}
      </div>
      <label className="text-sm font-black" htmlFor="meetup-cafe-search">
        {labels.cafe}
      </label>
      <div className="relative mt-1.5">
        <Search className="pointer-events-none absolute top-3.5 left-3 text-[#9b7a58]" size={16} />
        <input
          id="meetup-cafe-search"
          role="combobox"
          aria-controls="meetup-cafe-results"
          aria-expanded={ready}
          aria-autocomplete="list"
          className="h-11 w-full rounded-2xl border border-[var(--border)] bg-[#fffaf2] pr-3 pl-9 text-[16px] lg:text-sm font-bold text-[var(--foreground)] focus:!border-[#8f5a16] focus:!shadow-none focus:!ring-0 focus-visible:!border-[#8f5a16] focus-visible:!ring-0 focus-visible:!outline-none outline-none"
          placeholder={labels.search}
          value={query}
          disabled={!ready}
          onChange={(event) => {
            setActiveIndex(0);
            onQuery(event.target.value);
          }}
          onKeyDown={onKeyDown}
        />
      </div>
      <div
        id="meetup-cafe-results"
        role="listbox"
        className="mt-2 grid max-h-72 gap-2 overflow-y-auto rounded-2xl border border-[var(--border)] bg-[#fffaf2] p-2"
      >
        {loading && <p className="px-2 py-3 text-sm font-bold text-[#8c6d4f]">{labels.loading}</p>}
        {!ready && <p className="px-2 py-3 text-sm font-bold text-[#8c6d4f]">{t("chooseFilters")}</p>}
        {ready && !loading && cafes.length === 0 && (
          <p className="px-2 py-3 text-sm font-bold text-[#8c6d4f]">{labels.empty}</p>
        )}
        {ready && !loading && cafes.map((cafe, index) => {
          const image = cafe.coverImage ?? cafe.images[0];
          const open = getCafeOpenStatus(cafe.openingTime, cafe.closingTime);
          const isSelected = cafe.id === selected?.id;
          return (
            <button
              key={cafe.id}
              type="button"
              role="option"
              aria-selected={isSelected}
              onClick={() => choose(cafe)}
              onMouseEnter={() => setActiveIndex(index)}
              className={`grid grid-cols-[56px_1fr] gap-3 rounded-xl p-2 text-left focus:ring-3 focus:ring-[var(--ring)]/30 focus:outline-none ${
                isSelected || activeIndex === index
                  ? "bg-white shadow-[var(--shadow-sm)]"
                  : "hover:bg-white/70"
              }`}
            >
              <span className="relative h-14 w-14 overflow-hidden rounded-xl bg-[#eadfce]">
                {image ? (
                  <Image src={image} alt="" fill sizes="56px" className="object-cover" />
                ) : (
                  <MapPin className="m-4 text-[var(--accent)]" size={22} />
                )}
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-black text-[var(--foreground)]">
                  {cafe.name}
                </span>
                <span className="mt-1 block truncate text-xs font-bold text-[#8c6d4f]">
                  {cafe.distanceKm != null && nearby.nearMe && `${cafe.distanceKm.toFixed(1)} km · `}
                  {cafe.district || "TP.HCM"} · {cafe.address || "Cafe Maps"}
                </span>
                <span className="mt-2 flex flex-wrap gap-1">
                  {open !== null && (
                    <span className="rounded-full bg-[#e6f5ee] px-2 py-0.5 text-[11px] font-black text-[#166638]">
                      {open ? labels.open : labels.closed}
                    </span>
                  )}
                  {cafe.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-[var(--accent-light)] px-2 py-0.5 text-[11px] font-black text-[var(--accent)]"
                    >
                      {tag}
                    </span>
                  ))}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
