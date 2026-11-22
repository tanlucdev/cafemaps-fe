import Image from "next/image";
import { Check, MapPin } from "lucide-react";
import { useTranslations } from "next-intl";
import { getCafeOpenStatus } from "@/lib/opening-hours";
import type { Cafe } from "@/types/cafe";
import CafeQuickPreview from "./CafeQuickPreview";

export default function CafeOption({
  cafe,
  selected,
  nearMe,
  onSelect,
}: {
  cafe: Cafe;
  selected: boolean;
  nearMe?: boolean;
  onSelect: (cafe: Cafe) => void;
}) {
  const t = useTranslations("coffeeMeetups.form");
  const image = cafe.coverImage ?? cafe.images[0];
  const open = getCafeOpenStatus(cafe.openingTime, cafe.closingTime);
  return (
    <article
      className={`flex h-full flex-col overflow-hidden rounded-2xl border bg-[var(--card)] ${selected ? "border-[var(--accent)]" : "border-[var(--border)]"}`}
    >
      <button
        type="button"
        aria-pressed={selected}
        onClick={() => onSelect(cafe)}
        className="group flex w-full flex-1 flex-col text-left transition-colors hover:bg-[var(--accent-light)] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--accent)]"
      >
        <span className="relative block h-36 w-full overflow-hidden bg-[var(--background-secondary)]">
          {image ? (
            <Image
              src={image}
              alt=""
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 300px"
              className="object-cover motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover:scale-[1.03]"
            />
          ) : (
            <MapPin
              size={28}
              aria-hidden="true"
              className="absolute top-1/2 left-1/2 -translate-1/2 text-[var(--foreground-muted)]"
            />
          )}
          {selected && (
            <span className="absolute top-2 right-2 flex size-7 items-center justify-center rounded-full bg-[var(--accent)] text-white">
              <Check size={16} aria-hidden="true" />
              <span className="sr-only">{t("selectedCafe")}</span>
            </span>
          )}
          {nearMe && cafe.distanceKm != null && (
            <span className="absolute bottom-2 left-2 rounded-full bg-[var(--card)] px-2.5 py-1 text-[11px] font-semibold text-[var(--foreground)]">
              {cafe.distanceKm.toFixed(1)} km
            </span>
          )}
        </span>
        <span className="flex flex-1 flex-col gap-2 p-3.5">
          <span className="line-clamp-2 text-sm font-bold text-[var(--foreground)]">
            {cafe.name}
          </span>
          <span className="line-clamp-2 text-xs leading-5 text-[var(--foreground-muted)]">
            {[cafe.district, cafe.address].filter(Boolean).join(" · ")}
          </span>
          <span className="mt-auto flex flex-wrap gap-1 pt-1">
            {open !== null && (
              <span
                className={`rounded-full px-2 py-1 text-[10px] font-semibold ${open ? "bg-[var(--status-open-background)] text-[var(--status-open-foreground)]" : "bg-[var(--status-closed-background)] text-[var(--status-closed-foreground)]"}`}
              >
                {t(open ? "open" : "closed")}
              </span>
            )}
            {cafe.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-[var(--accent-light)] px-2 py-1 text-[10px] text-[var(--foreground-muted)]"
              >
                {tag}
              </span>
            ))}
          </span>
        </span>
      </button>
      <CafeQuickPreview cafe={cafe} onSelect={onSelect} />
    </article>
  );
}
