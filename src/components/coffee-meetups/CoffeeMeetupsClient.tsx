"use client";

import { useEffect, useMemo, useState } from "react";
import { Coffee, Loader2, Navigation, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { getCoffeeMeetups, type CoffeeMeetup } from "@/apis/coffee-meetups";
import { AREAS } from "@/types/cafe";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import MeetupCard from "./MeetupCard";
import MeetupFilterSelect from "./MeetupFilterSelect";

type Filters = { purpose: string; date: string; area: string; available: boolean; nearMe?: boolean; lat?: number; lng?: number; radiusKm?: number };

const DISTANCE_OPTIONS = [2, 5, 10];

export default function CoffeeMeetupsClient({ initialFilters }: { initialFilters: Filters }) {
  const router = useRouter();
  const t = useTranslations("coffeeMeetups");
  const tHero = useTranslations("hero");
  const tNearby = useTranslations("nearby");
  const purposes = t.raw("purposes") as string[];
  const [filters, setFilters] = useState(() =>
    initialFilters.nearMe
      ? { ...initialFilters, radiusKm: initialFilters.radiusKm ?? 2 }
      : { ...initialFilters, lat: undefined, lng: undefined, radiusKm: undefined },
  );
  const [meetups, setMeetups] = useState<CoffeeMeetup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState(false);

  const query = useMemo(() => {
    const params = new URLSearchParams();
    if (filters.purpose) params.set("purpose", filters.purpose);
    if (filters.date) params.set("date", filters.date);
    if (filters.area) params.set("area", filters.area);
    if (filters.available) params.set("available", "1");
    if (filters.nearMe) {
      params.set("nearMe", "true");
      if (filters.lat !== undefined) params.set("lat", String(filters.lat));
      if (filters.lng !== undefined) params.set("lng", String(filters.lng));
      if (filters.radiusKm !== undefined) params.set("radiusKm", String(filters.radiusKm));
    }
    return params.toString();
  }, [filters]);

  useEffect(() => {
    router.replace(query ? `/coffee-meetups?${query}` : "/coffee-meetups", { scroll: false });
  }, [query, router]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    trackEvent("coffee_meetups_list_view", {
      purpose: filters.purpose || "all",
      area: filters.area || "all",
      available: filters.available,
      nearMe: filters.nearMe ?? false,
      radiusKm: filters.radiusKm ?? 0,
    });
    getCoffeeMeetups({
      purpose: filters.purpose,
      date: filters.date,
      area: filters.area,
      availableOnly: filters.available,
      nearMe: filters.nearMe,
      lat: filters.lat,
      lng: filters.lng,
      radiusKm: filters.radiusKm,
    })
      .then((data) => active && setMeetups(data))
      .catch((err) => active && setError(err instanceof Error ? err.message : t("errors.load")))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [filters, t]);

  function toggleNearMe() {
    if (filters.nearMe) {
      setFilters((current) => ({
        ...current,
        nearMe: false,
        lat: undefined,
        lng: undefined,
        radiusKm: undefined,
      }));
      return;
    }
    if (!navigator.geolocation) {
      showLocationError();
      return;
    }
    setLocationLoading(true);
    setLocationError(false);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocationLoading(false);
        setFilters((current) => ({
          ...current,
          nearMe: true,
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          radiusKm: current.radiusKm ?? 2,
        }));
      },
      () => {
        setLocationLoading(false);
        showLocationError();
      },
      { timeout: 10000, maximumAge: 60000 },
    );
  }

  function showLocationError() {
    setLocationError(true);
    window.setTimeout(() => setLocationError(false), 3000);
  }

  return (
    <main className="min-h-[100svh] bg-[var(--background)] px-3 pt-[88px] pb-28 sm:px-6 sm:pt-24 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <section className="flex flex-col gap-4 rounded-[28px] border border-[var(--border)] bg-[var(--card)]/78 p-4 shadow-[var(--shadow-sm)] sm:p-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-black tracking-[0.08em] text-[var(--accent)] uppercase">{t("brand")}</p>
            <h1 className="mt-1 text-3xl font-black text-[var(--foreground)]">{t("title")}</h1>
            <p className="mt-2 max-w-2xl text-sm text-[var(--foreground-muted)]">{t("intro")}</p>
          </div>
          <Link
            href="/coffee-meetups/new"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-5 text-sm font-black text-[var(--accent-foreground)] hover:bg-[var(--accent-hover)]"
          >
            <Plus size={16} /> {t("actions.create")}
          </Link>
        </section>

        <form className="mt-4 flex flex-wrap items-end gap-2 rounded-[24px] border border-[var(--border)] bg-[var(--card)]/92 p-3 shadow-[var(--shadow-sm)] backdrop-blur-md lg:sticky lg:top-[76px] lg:z-20">
          <MeetupFilterSelect
            label={t("fields.purpose")}
            placeholder={t("filters.allPurposes")}
            value={filters.purpose}
            options={purposes}
            onChange={(purpose) => setFilters((f) => ({ ...f, purpose }))}
            className="min-w-[150px] sm:min-w-[180px]"
          />
          <label className="grid min-w-[140px] flex-1 gap-1 sm:min-w-[160px]">
            <span className="px-1 text-[11px] font-black text-[var(--accent)] uppercase">{t("fields.date")}</span>
            <input
              aria-label={t("fields.date")}
              type="date"
              value={filters.date}
              onChange={(e) => setFilters((f) => ({ ...f, date: e.target.value }))}
              className="h-11 rounded-2xl border border-[var(--border)] bg-[var(--card)]/72 px-3 text-[16px] lg:text-sm font-bold focus:!border-[#8f5a16] focus:!shadow-none focus:!ring-0 focus-visible:!border-[#8f5a16] focus-visible:!ring-0 focus-visible:!outline-none outline-none"
            />
          </label>
          <MeetupFilterSelect
            label={t("fields.area")}
            placeholder={t("filters.allAreas")}
            value={filters.area}
            options={AREAS}
            onChange={(area) => setFilters((f) => ({ ...f, area }))}
            className="min-w-[140px] sm:min-w-[160px]"
          />
          <label className="inline-flex h-11 min-w-fit cursor-pointer items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--card)]/72 px-4 text-sm font-bold whitespace-nowrap text-[var(--foreground-muted)] hover:border-[var(--accent)] hover:bg-[var(--accent-light)] hover:text-[var(--accent)]">
            <input
              type="checkbox"
              checked={filters.available}
              onChange={(e) => setFilters((f) => ({ ...f, available: e.target.checked }))}
              className="size-4 accent-[var(--accent)]"
            />
            {t("filters.available")}
          </label>
          <button
            type="button"
            onClick={toggleNearMe}
            disabled={locationLoading}
            title={locationError ? tNearby("locationError") : undefined}
            className={cn(
              "inline-flex h-11 min-w-fit cursor-pointer items-center justify-center gap-2 rounded-full border px-4 text-sm font-black whitespace-nowrap shadow-[var(--shadow-sm)] transition hover:-translate-y-px focus-visible:ring-3 focus-visible:ring-[var(--ring)]/30 focus-visible:outline-none active:scale-95",
              filters.nearMe
                ? "border-[var(--accent)] bg-[var(--accent-light)] text-[var(--accent)]"
                : locationError
                  ? "border-red-300 bg-[var(--card)]/72 text-red-500"
                  : "border-[var(--border)] bg-[var(--card)]/72 text-[var(--foreground-muted)] hover:border-[var(--accent)] hover:bg-[var(--accent-light)] hover:text-[var(--accent)]",
              locationLoading && "cursor-not-allowed opacity-60",
            )}
          >
            {locationLoading ? (
              <Loader2 size={15} className="animate-spin" aria-hidden="true" />
            ) : (
              <Navigation size={15} aria-hidden="true" />
            )}
            {tHero("quickFilters.nearMe")}
          </button>
          {filters.nearMe &&
            DISTANCE_OPTIONS.map((km) => (
              <button
                key={km}
                type="button"
                onClick={() => setFilters((current) => ({ ...current, radiusKm: km }))}
                className={cn(
                  "inline-flex h-9 items-center rounded-full border px-3.5 text-[13px] font-bold whitespace-nowrap transition focus-visible:ring-3 focus-visible:ring-[var(--ring)]/30 focus-visible:outline-none",
                  filters.radiusKm === km
                    ? "border-[var(--accent)] bg-[var(--accent-light)] text-[var(--accent)]"
                    : "border-[var(--border)] bg-[var(--card)]/72 text-[var(--foreground-muted)] hover:border-[var(--accent)] hover:bg-[var(--accent-light)] hover:text-[var(--accent)]",
                )}
              >
                {"< " + km + "km"}
              </button>
            ))}
        </form>

        {loading && <MeetupListSkeleton label={t("loading")} />}
        {error && (
          <p
            role="alert"
            className="mt-6 rounded-2xl border border-[#e9a7a0]/40 bg-[#FCEDEA] p-4 text-sm font-bold text-[#C0392B]"
          >
            {error}
          </p>
        )}
        {!loading && !error && meetups.length === 0 && (
          <div className="mt-6 rounded-[24px] border border-dashed border-[var(--border)] bg-[var(--card)] p-8 text-center">
            <Coffee className="mx-auto size-9 text-[var(--accent)]/70" aria-hidden="true" />
            <p className="mt-3 text-sm font-bold text-[var(--foreground-muted)]">{t("emptyList")}</p>
            <Link
              href="/coffee-meetups/new"
              className="mt-4 inline-flex h-10 items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-4 text-sm font-black text-[var(--accent-foreground)] hover:bg-[var(--accent-hover)] focus-visible:ring-3 focus-visible:ring-[var(--ring)]/30 focus-visible:outline-none"
            >
              <Plus size={15} aria-hidden="true" />
              {t("actions.create")}
            </Link>
          </div>
        )}
        <section className="mt-5 grid gap-3">
          {meetups.map((meetup) => (
            <MeetupCard key={meetup.id} meetup={meetup} />
          ))}
        </section>
      </div>
    </main>
  );
}

function MeetupListSkeleton({ label }: { label: string }) {
  return (
    <section className="mt-5 grid gap-3" aria-label={label}>
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="grid animate-pulse overflow-hidden rounded-[24px] border border-[var(--border)] bg-[var(--card)]/70 sm:grid-cols-[152px_minmax(0,1fr)] lg:grid-cols-[152px_118px_minmax(0,1fr)_164px]"
        >
          <div className="min-h-[150px] bg-[#ead8bd]" />
          <div className="hidden border-r border-[var(--border)]/60 p-5 lg:block">
            <div className="mx-auto h-3 w-12 rounded-full bg-[#e3c9a4]" />
            <div className="mx-auto mt-3 h-10 w-12 rounded-xl bg-[#e3c9a4]" />
            <div className="mx-auto mt-4 h-3 w-16 rounded-full bg-[#e3c9a4]" />
          </div>
          <div className="p-5">
            <div className="flex gap-2">
              <div className="h-6 w-20 rounded-full bg-[#e3c9a4]" />
              <div className="h-6 w-16 rounded-full bg-[#e3c9a4]" />
            </div>
            <div className="mt-4 h-5 w-2/3 rounded-full bg-[#e3c9a4]" />
            <div className="mt-4 grid gap-2">
              <div className="h-4 w-4/5 rounded-full bg-[#ead8bd]" />
              <div className="h-4 w-3/5 rounded-full bg-[#ead8bd]" />
            </div>
          </div>
          <div className="px-5 pb-5 lg:flex lg:items-center lg:p-5">
            <div className="h-11 w-full rounded-full bg-[#e3c9a4]" />
          </div>
        </div>
      ))}
    </section>
  );
}
