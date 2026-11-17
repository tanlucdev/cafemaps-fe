"use client";

import Image from "next/image";
import { Clock3, MapPin } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { cloudinaryImageUrl } from "@/lib/cloudinary-image";
import { coverObjectPosition } from "@/lib/cover-image";
import { formatViewedAt } from "@/lib/format-viewed-at";
import type { RecentlyViewedCafe } from "@/apis/recently-viewed";

export default function RecentlyViewedRail({
  items,
  locale,
}: {
  items: RecentlyViewedCafe[];
  locale: string;
}) {
  if (items.length === 0) return null;

  const copy =
    locale === "en"
      ? { title: "Recently viewed", all: "View all", viewed: "Recently viewed", type: "Cafe" }
      : { title: "Bạn vừa xem", all: "Xem tất cả", viewed: "Đã xem gần đây", type: "Quán" };

  return (
    <section
      aria-labelledby="recently-viewed-heading"
      className="mt-10 rounded-[28px] border border-[var(--border)] bg-[var(--surface)]/84 p-4 shadow-[var(--shadow-sm)] backdrop-blur-sm sm:p-5"
    >
      <div className="mb-3 flex items-center justify-between gap-4 px-1">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[var(--accent-light)] text-[var(--accent)]">
            <Clock3 size={16} strokeWidth={2.25} aria-hidden="true" />
          </span>
          <h2 id="recently-viewed-heading" className="truncate text-lg font-black sm:text-xl">
            {copy.title}
          </h2>
        </div>
        <Link
          href="/profile?tab=recently-viewed"
          className="shrink-0 rounded-full px-2.5 py-1.5 text-sm font-bold text-[var(--accent)] transition-colors outline-none hover:bg-[var(--accent-light)] focus-visible:ring-3 focus-visible:ring-[var(--ring)]/30"
          aria-label={copy.viewed}
        >
          {copy.all}
        </Link>
      </div>

      <div className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-3">
        {items.slice(0, 3).map(({ cafe, viewedAt }, index) => {
          const viewedAtLabel = viewedAt ? formatViewedAt(viewedAt, locale) : null;

          return (
            <Link
              key={cafe.id}
              href={`/cafe/${cafe.slug}`}
              className="group grid min-h-[92px] grid-cols-[76px_minmax(0,1fr)] gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)]/88 p-2 transition-all duration-200 outline-none hover:-translate-y-px hover:border-[var(--accent)]/45 hover:shadow-[var(--shadow-sm)] focus-visible:ring-3 focus-visible:ring-[var(--ring)]/30"
            >
              <div className="relative aspect-square self-stretch overflow-hidden rounded-xl bg-[var(--background-secondary)]">
                {cafe.coverImage ? (
                  <Image
                    src={cloudinaryImageUrl(cafe.coverImage, "thumb")}
                    alt=""
                    fill
                    sizes="76px"
                    priority={index === 0}
                    className="object-cover transition duration-300 group-hover:scale-105"
                    style={{ objectPosition: coverObjectPosition(cafe) }}
                  />
                ) : null}
              </div>
              <div className="min-w-0 self-center py-1 pr-1">
                <h3 className="truncate text-[15px] font-bold text-[var(--foreground)]">
                  {cafe.name}
                </h3>
                <p className="mt-1 flex items-center gap-1 truncate text-xs text-[var(--foreground-muted)]">
                  <MapPin
                    size={13}
                    className="shrink-0 text-[var(--foreground-muted)]"
                    aria-hidden="true"
                  />
                  <span className="truncate">{cafe.district || cafe.address || copy.type}</span>
                </p>
                {viewedAtLabel ? (
                  <p className="mt-1.5 flex items-center gap-1 text-[11px] font-semibold text-[var(--accent)]">
                    <Clock3 size={11} aria-hidden="true" />
                    {viewedAtLabel}
                  </p>
                ) : null}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
