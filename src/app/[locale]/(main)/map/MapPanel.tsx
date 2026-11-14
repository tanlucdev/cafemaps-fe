"use client";

import Image from "next/image";
import { Check, Coffee, ExternalLink, MapPinned } from "lucide-react";
import { useTranslations } from "next-intl";
import type { Cafe } from "@/types/cafe";
import { coverObjectPosition } from "@/lib/cover-image";
import { cloudinaryImageUrl } from "@/lib/cloudinary-image";
import { cn } from "@/lib/utils";

export function MapPanel({
  cafes,
  visitedIds,
  selectedId,
  busyId,
  t,
  onSelect,
  onToggle,
  compact,
}: {
  cafes: Cafe[];
  visitedIds: Set<string>;
  selectedId?: string;
  busyId: string | null;
  t: ReturnType<typeof useTranslations>;
  onSelect: (id: string) => void;
  onToggle: (cafe: Cafe) => void;
  compact?: boolean;
}) {
  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-black tracking-[0.12em] text-[var(--accent)] uppercase">
            {t("eyebrow")}
          </p>
          <h1 className="text-xl font-black text-[var(--foreground)]">
            {t("visitedTitle", { count: visitedIds.size })}
          </h1>
        </div>
        <div className="rounded-full bg-[var(--accent-light)] px-3 py-1 text-xs font-black text-[var(--accent)]">
          {cafes.length}
        </div>
      </div>
      {cafes.length === 0 && (
        <div className="grid min-h-[220px] place-items-center rounded-2xl border border-dashed border-[var(--border)] bg-[var(--card)] px-5 py-8 text-center">
          <div>
            <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-2xl bg-[var(--accent-light)] text-[var(--accent)]">
              <MapPinned size={22} />
            </div>
            <p className="font-black text-[var(--foreground)]">{t("emptyTitle")}</p>
            <p className="mt-1 text-sm leading-6 text-[var(--foreground-muted)]">{t("emptySubtitle")}</p>
          </div>
        </div>
      )}
      <div
        className={cn(
          "grid gap-2",
          compact && "auto-cols-[82%] grid-flow-col overflow-x-auto pb-1",
        )}
      >
        {cafes.map((cafe, index) => {
          const visited = visitedIds.has(cafe.id);
          return (
            <div
              key={cafe.id}
              onClick={() => onSelect(cafe.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") onSelect(cafe.id);
              }}
              className={cn(
                "flex min-h-[92px] w-full cursor-pointer gap-3 rounded-2xl border bg-[var(--card)] p-2 text-left shadow-[var(--shadow-sm)] transition",
                selectedId === cafe.id ? "border-[var(--accent)]" : "border-[var(--border)]",
              )}
            >
              <div className="flex h-[76px] w-[76px] shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[var(--background-secondary)]">
                {cafe.coverImage || cafe.images[0] ? (
                  <Image
                    src={cloudinaryImageUrl(cafe.coverImage ?? cafe.images[0], "thumb")}
                    alt=""
                    width={76}
                    height={76}
                    sizes="76px"
                    priority={index === 0}
                    className="h-full w-full object-cover"
                    style={{ objectPosition: coverObjectPosition(cafe) }}
                  />
                ) : (
                  <Coffee size={22} className="text-[var(--accent)]" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-black text-[var(--foreground)]">{cafe.name}</p>
                <p className="mt-1 truncate text-xs font-semibold text-[var(--foreground-muted)]">
                  {cafe.district ?? t("unknownDistrict")}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <span
                    className={cn(
                      "inline-flex h-7 items-center gap-1 rounded-full px-2 text-xs font-black",
                      visited
                        ? "bg-[var(--accent-light)] text-[var(--accent)]"
                        : "bg-[var(--background-secondary)] text-[var(--foreground-muted)]",
                    )}
                  >
                    {visited ? <Check size={13} /> : <MapPinned size={13} />}
                    {visited ? t("visited") : t("unvisited")}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggle(cafe);
                    }}
                    className="inline-flex h-7 cursor-pointer items-center rounded-full bg-[var(--accent)] px-2 text-xs font-black text-[var(--accent-foreground)]"
                  >
                    {busyId === cafe.id ? "..." : visited ? t("unmark") : t("mark")}
                  </button>
                  <a
                    onClick={(e) => e.stopPropagation()}
                    href={`./cafe/${cafe.slug}`}
                    className="ml-auto inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border border-[var(--border)] text-[var(--accent)]"
                  >
                    <ExternalLink size={13} />
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
