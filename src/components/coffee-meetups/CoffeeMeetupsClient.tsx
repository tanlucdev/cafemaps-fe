"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, RotateCw } from "lucide-react";
import { Link, useRouter } from "@/i18n/navigation";
import { getCoffeeMeetups, MEETUP_PURPOSES, type CoffeeMeetup } from "@/apis/coffee-meetups";
import { AREAS } from "@/types/cafe";
import { trackEvent } from "@/lib/analytics";
import MeetupCard from "./MeetupCard";

type Filters = { purpose: string; date: string; area: string; available: boolean };

export default function CoffeeMeetupsClient({ initialFilters }: { initialFilters: Filters }) {
  const router = useRouter();
  const [filters, setFilters] = useState(initialFilters);
  const [meetups, setMeetups] = useState<CoffeeMeetup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const query = useMemo(() => {
    const params = new URLSearchParams();
    if (filters.purpose) params.set("purpose", filters.purpose);
    if (filters.date) params.set("date", filters.date);
    if (filters.area) params.set("area", filters.area);
    if (filters.available) params.set("available", "1");
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
    });
    getCoffeeMeetups({
      purpose: filters.purpose,
      date: filters.date,
      area: filters.area,
      availableOnly: filters.available,
    })
      .then((data) => active && setMeetups(data))
      .catch(
        (err) => active && setError(err instanceof Error ? err.message : "Không tải được kèo."),
      )
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [filters]);

  return (
    <main className="min-h-[100svh] bg-[var(--background)] px-3 pt-[88px] pb-28 sm:px-6 sm:pt-24 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <section className="flex flex-col gap-4 rounded-[28px] border border-[var(--border)] bg-[#fffaf2]/78 p-4 shadow-[var(--shadow-sm)] sm:p-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-black tracking-[0.08em] text-[#875200] uppercase">
              Cafe Maps
            </p>
            <h1 className="mt-1 text-3xl font-black text-[var(--foreground)]">Kèo cà phê</h1>
            <p className="mt-2 max-w-2xl text-sm text-[var(--foreground-muted)]">
              Tạo hoặc tham gia một buổi học, làm việc hay trò chuyện tại một quán có sẵn.
            </p>
          </div>
          <Link
            href="/coffee-meetups/new"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-5 text-sm font-black text-white hover:bg-[var(--accent-hover)]"
          >
            <Plus size={16} /> Tạo kèo
          </Link>
        </section>

        <form className="mt-4 grid gap-2 rounded-[24px] border border-[var(--border)] bg-[var(--card)] p-3 sm:grid-cols-2 lg:grid-cols-4">
          <select
            aria-label="Mục đích"
            value={filters.purpose}
            onChange={(e) => setFilters((f) => ({ ...f, purpose: e.target.value }))}
            className="h-11 rounded-2xl border border-[var(--border)] bg-[#fffaf2] px-3 text-sm font-bold"
          >
            <option value="">Mọi mục đích</option>
            {MEETUP_PURPOSES.map((purpose) => (
              <option key={purpose}>{purpose}</option>
            ))}
          </select>
          <input
            aria-label="Ngày"
            type="date"
            value={filters.date}
            onChange={(e) => setFilters((f) => ({ ...f, date: e.target.value }))}
            className="h-11 rounded-2xl border border-[var(--border)] bg-[#fffaf2] px-3 text-sm font-bold"
          />
          <select
            aria-label="Khu vực"
            value={filters.area}
            onChange={(e) => setFilters((f) => ({ ...f, area: e.target.value }))}
            className="h-11 rounded-2xl border border-[var(--border)] bg-[#fffaf2] px-3 text-sm font-bold"
          >
            <option value="">Mọi khu vực</option>
            {AREAS.map((area) => (
              <option key={area}>{area}</option>
            ))}
          </select>
          <label className="flex h-11 items-center gap-2 rounded-2xl border border-[var(--border)] bg-[#fffaf2] px-3 text-sm font-bold">
            <input
              type="checkbox"
              checked={filters.available}
              onChange={(e) => setFilters((f) => ({ ...f, available: e.target.checked }))}
            />
            Chỉ còn chỗ
          </label>
        </form>

        {loading && (
          <p className="mt-10 flex items-center gap-2 text-sm font-bold">
            <RotateCw className="animate-spin" size={16} /> Đang tải kèo...
          </p>
        )}
        {error && (
          <p
            role="alert"
            className="mt-6 rounded-2xl border border-[#e9a7a0]/40 bg-[#FCEDEA] p-4 text-sm font-bold text-[#C0392B]"
          >
            {error}
          </p>
        )}
        {!loading && !error && meetups.length === 0 && (
          <p className="mt-10 rounded-[24px] border border-dashed border-[var(--border)] bg-[#fffaf2] p-8 text-center text-sm font-bold text-[var(--foreground-muted)]">
            Chưa có kèo phù hợp.
          </p>
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
