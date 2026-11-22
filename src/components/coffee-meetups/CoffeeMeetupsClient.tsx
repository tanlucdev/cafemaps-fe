"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowUpRight, SlidersHorizontal, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { getCoffeeMeetups, normalizeMeetupPurpose, type CoffeeMeetup } from "@/apis/coffee-meetups";
import { trackEvent } from "@/lib/analytics";
import MeetupCard from "./MeetupCard";
import { isCalendarDate } from "./format";
import MeetupHero from "./MeetupHero";
import MeetupFilters, { type DiscoveryFilters } from "./MeetupFilters";
import MeetupListState from "./MeetupListState";
import MeetupPurposeFilters from "./MeetupPurposeFilters";

export default function CoffeeMeetupsClient({
  initialFilters,
}: {
  initialFilters: DiscoveryFilters;
}) {
  const router = useRouter();
  const t = useTranslations("coffeeMeetups");
  const [filters, setFilters] = useState({
    ...initialFilters,
    date: isCalendarDate(initialFilters.date) ? initialFilters.date : "",
    purpose: normalizeMeetupPurpose(initialFilters.purpose),
  });
  const [page, setPage] = useState(initialFilters.page ?? 1);
  const [hasMore, setHasMore] = useState(false);
  const [meetups, setMeetups] = useState<CoffeeMeetup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const skipUrlSync = useRef(true);
  const query = useMemo(() => {
    const params = new URLSearchParams();
    if (filters.purpose) params.set("purpose", filters.purpose);
    if (filters.date) params.set("date", filters.date);
    if (filters.area) params.set("area", filters.area);
    if (filters.available) params.set("available", "1");
    if (filters.nearMe) {
      params.set("nearMe", "true");
      if (filters.lat != null) params.set("lat", String(filters.lat));
      if (filters.lng != null) params.set("lng", String(filters.lng));
      params.set("radiusKm", String(filters.radiusKm ?? 2));
    }
    if (page > 1) params.set("page", String(page));
    return params.toString();
  }, [filters, page]);

  useEffect(() => {
    setFilters({
      ...initialFilters,
      date: isCalendarDate(initialFilters.date) ? initialFilters.date : "",
      purpose: normalizeMeetupPurpose(initialFilters.purpose),
    });
    setPage(initialFilters.page ?? 1);
  }, [initialFilters]);

  useEffect(() => {
    if (skipUrlSync.current) {
      skipUrlSync.current = false;
      return;
    }
    router.push(query ? `/coffee-meetups?${query}` : "/coffee-meetups", { scroll: false });
  }, [query, router]);

  useEffect(() => {
    let active = true;
    setMeetups([]);
    setLoading(true);
    setError("");
    trackEvent("coffee_meetups_list_view", {
      purpose: filters.purpose || "all",
      area: filters.area || "all",
      available: filters.available,
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
      page,
    })
      .then((result) => {
        if (active) {
          setMeetups(result.data);
          setHasMore(result.meta.page < result.meta.totalPages);
        }
      })
      .catch((err) => active && setError(err instanceof Error ? err.message : t("errors.load")))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [filters, page, t]);

  const filtered = Boolean(
    filters.purpose || filters.date || filters.area || filters.available || filters.nearMe,
  );
  function resetFilters() {
    setPage(1);
    setFilters({ purpose: "", date: "", area: "", available: false });
  }

  return (
    <main className="min-h-[100svh] bg-[var(--background)] px-4 pt-[88px] pb-28 sm:px-6 sm:pt-24 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <MeetupHero />
        <section aria-labelledby="meetup-discover-title" className="mt-10 sm:mt-12">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold tracking-[0.18em] text-[var(--foreground-muted)] uppercase">
                {t("discover.eyebrow")}
              </p>
              <h2
                id="meetup-discover-title"
                className="font-lora mt-2 text-2xl text-[var(--foreground)] sm:text-3xl"
              >
                {t("discover.title")}
              </h2>
            </div>
            <Link
              href="/coffee-meetups/mine"
              className="inline-flex shrink-0 items-center gap-1.5 pb-1 text-xs font-bold text-[var(--foreground-muted)] hover:text-[var(--accent-hover)] sm:text-sm"
            >
              {t("mine.title")}
              <ArrowUpRight size={15} aria-hidden="true" />
            </Link>
          </div>
          <MeetupPurposeFilters
            value={filters.purpose}
            onChange={(purpose) => {
              setPage(1);
              setFilters((current) => ({ ...current, purpose }));
            }}
          />
          <MeetupFilters
            filters={filters}
            filtered={filtered}
            onReset={resetFilters}
            onChange={(next) => {
              setPage(1);
              setFilters(next);
            }}
          />
        </section>
        {process.env.NEXT_PUBLIC_MOCK_COFFEE_MEETUPS === "1" && (
          <p className="mt-6 flex items-center gap-2 rounded-2xl border border-dashed border-[var(--accent)]/35 bg-[var(--accent-light)]/60 px-4 py-3 text-xs leading-5 text-[var(--accent-hover)]">
            <Sparkles size={16} aria-hidden="true" className="shrink-0" />
            {t("demo.notice")}
          </p>
        )}
        <div className="mt-7 mb-4 flex items-center gap-2 text-xs font-medium text-[var(--foreground-muted)]">
          <SlidersHorizontal size={14} aria-hidden="true" />
          {t("discover.results")}
          <span className="ml-2 h-px flex-1 bg-[var(--border)]" />
        </div>
        {error && (
          <p
            role="alert"
            className="rounded-2xl border border-[#e9a7a0]/40 bg-[#FCEDEA] p-4 text-sm font-bold text-[#C0392B]"
          >
            {error}
          </p>
        )}
        {!error && (loading || meetups.length === 0) && (
          <MeetupListState loading={loading} filtered={filtered} onReset={resetFilters} />
        )}
        <section
          aria-label={t("discover.results")}
          className="grid gap-5 md:grid-cols-2 xl:grid-cols-3"
        >
          {meetups.map((meetup) => (
            <MeetupCard key={meetup.id} meetup={meetup} />
          ))}
        </section>
        {!loading && !error && (page > 1 || hasMore) && (
          <nav
            aria-label={t("pagination.label")}
            className="mt-5 flex items-center justify-center gap-4"
          >
            <button
              type="button"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="rounded-full border border-[var(--border)] px-4 py-2 font-bold disabled:opacity-40"
            >
              {t("pagination.previous")}
            </button>
            <span>{t("pagination.page", { page })}</span>
            <button
              type="button"
              disabled={!hasMore}
              onClick={() => setPage(page + 1)}
              className="rounded-full border border-[var(--border)] px-4 py-2 font-bold disabled:opacity-40"
            >
              {t("pagination.next")}
            </button>
          </nav>
        )}
      </div>
    </main>
  );
}
