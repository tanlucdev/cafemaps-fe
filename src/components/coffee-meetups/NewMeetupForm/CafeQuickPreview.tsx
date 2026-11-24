import { useRef } from "react";
import Image from "next/image";
import { Dialog } from "@base-ui/react/dialog";
import { ArrowUpRight, Check, ChevronDown, Eye, MapPin, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { EN_VIBE_VALUES } from "@/apis/cafes/filter-normalization";
import { getAmenityLabel, getParkingLocation } from "@/app/[locale]/(main)/cafe/[slug]/_components/CafeDetailInfo/helpers";
import { Link } from "@/i18n/navigation";
import { formatPrice } from "@/lib/utils";
import { formatOpeningTime } from "@/lib/opening-hours";
import type { Cafe } from "@/types/cafe";

export default function CafeQuickPreview({
  cafe,
  onSelect,
}: {
  cafe: Cafe;
  onSelect: (cafe: Cafe) => void;
}) {
  const t = useTranslations("coffeeMeetups.form");
  const info = useTranslations("cafe");
  const vibeT = useTranslations("filters.vibes");
  const locale = useLocale();
  const titleRef = useRef<HTMLHeadingElement>(null);
  const images = [
    ...new Set([cafe.coverImage, ...cafe.images].filter((src): src is string => Boolean(src))),
  ];
  const price = formatPrice(cafe.priceMin, cafe.priceMax, locale);
  const opens = formatOpeningTime(cafe.openingTime);
  const closes = formatOpeningTime(cafe.closingTime);
  const hours = opens && closes ? (opens === closes ? "24/7" : `${opens} – ${closes}`) : null;
  const description = cafe.description?.trim();
  const parking = getParkingLocation(cafe, locale);
  const menuImages = [...new Set(cafe.menuImages?.length ? cafe.menuImages : cafe.menuImage ? [cafe.menuImage] : [])];
  const tagGroups = [
    {
      label: info("detail.vibe"),
      tags: cafe.vibes.map((vibe) => {
        const key = vibe.trim().toLowerCase();
        const label = EN_VIBE_VALUES[key] ?? key;
        return vibeT.has(label) ? vibeT(label) : vibe.trim();
      }),
    },
    {
      label: info("amenities"),
      tags: cafe.amenities.map((amenity) => getAmenityLabel(amenity.trim(), locale)),
    },
  ];
  return (
    <Dialog.Root>
      <Dialog.Trigger
        aria-label={t("previewCafe", { name: cafe.name })}
        className="mx-3.5 mb-3.5 flex min-h-10 items-center justify-center gap-2 rounded-xl border border-[var(--border)] text-xs font-semibold text-[var(--accent-hover)] transition-colors hover:bg-[var(--accent-light)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
      >
        <Eye size={15} aria-hidden="true" />
        {t("quickPreview")}
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop forceRender className="fixed inset-0 z-[90] bg-black/15" />
        <Dialog.Popup
          initialFocus={titleRef}
          className="fixed top-1/2 left-1/2 z-[90] flex max-h-[90svh] w-[calc(100%-1.5rem)] max-w-2xl -translate-1/2 flex-col overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] shadow-2xl outline-none"
        >
          <header className="flex shrink-0 items-center justify-between gap-3 border-b border-[var(--border)] px-5 py-3 sm:py-4">
            <div className="min-w-0">
              <p className="mb-1 text-xs font-semibold text-[var(--accent-hover)]">
                {t("quickPreview")}
              </p>
              <Dialog.Title ref={titleRef} tabIndex={-1} className="line-clamp-2 font-lora text-xl wrap-anywhere outline-none">
                {cafe.name}
              </Dialog.Title>
            </div>
            <Dialog.Close
              aria-label={t("closePicker")}
              className="flex size-10 shrink-0 items-center justify-center rounded-full border border-[var(--border)] hover:bg-[var(--accent-light)]"
            >
              <X size={18} aria-hidden="true" />
            </Dialog.Close>
          </header>
          <div
            role="region"
            aria-label={t("previewContent")}
            tabIndex={0}
            className="min-h-0 overflow-y-auto overscroll-contain focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[var(--accent)]"
          >
            {images.length > 0 && (
              <div
                className="flex snap-x snap-mandatory gap-2 overflow-x-auto p-3"
                role="region"
                aria-label={t("previewCafe", { name: cafe.name })}
                tabIndex={0}
              >
                {images.map((src, index) => (
                  <div
                    key={src}
                    className={`relative h-56 shrink-0 snap-center overflow-hidden rounded-2xl sm:h-72 ${images.length > 1 ? "w-[88%]" : "w-full"}`}
                  >
                    <Image
                      src={src}
                      alt={`${cafe.name} · ${index + 1}`}
                      fill
                      sizes="(max-width: 640px) 90vw, 620px"
                      className="object-cover"
                    />
                    {images.length > 1 && (
                      <span className="absolute right-3 bottom-3 rounded-full bg-black/50 px-2.5 py-1 text-xs text-white">
                        {index + 1}/{images.length}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
            <div className="space-y-5 px-5 py-4 wrap-anywhere">
              <Dialog.Description className="flex items-start gap-2 text-sm leading-6 text-[var(--foreground-muted)]">
                <MapPin
                  size={16}
                  aria-hidden="true"
                  className="mt-1 shrink-0 text-[var(--accent)]"
                />
                {[cafe.address, cafe.district].filter(Boolean).join(" · ") || cafe.name}
              </Dialog.Description>
              {cafe.oneLiner && <p className="text-sm leading-6">{cafe.oneLiner}</p>}
              <dl className="flex flex-wrap gap-x-8 gap-y-3 text-sm">
                <div>
                  <dt className="mb-1 text-xs text-[var(--foreground-muted)]">
                    {t("previewHours")}
                  </dt>
                  <dd className="font-semibold">{hours ?? t("unknownHours")}</dd>
                </div>
                {price && (
                  <div>
                    <dt className="mb-1 text-xs text-[var(--foreground-muted)]">
                      {t("previewPrice")}
                    </dt>
                    <dd className="font-semibold">{price}</dd>
                  </div>
                )}
              </dl>
              {description && description !== cafe.oneLiner?.trim() && (
                <section className="space-y-2 border-t border-[var(--border)] pt-4">
                  <h3 className="font-lora text-base font-semibold">{info("about")}</h3>
                  <p className="text-sm leading-6 whitespace-pre-line">{description}</p>
                </section>
              )}
              {tagGroups.map(({ label, tags }) => {
                const uniqueTags = [...new Set(tags.filter(Boolean))];
                return uniqueTags.length > 0 && (
                  <section key={label} className="space-y-2">
                    <h3 className="font-lora text-base font-semibold">{label}</h3>
                    <ul className="flex flex-wrap gap-2">
                      {uniqueTags.map((tag) => (
                        <li key={tag} className="rounded-full bg-[var(--accent-light)] px-3 py-1.5 text-xs font-medium text-[var(--accent-hover)]">
                          {tag}
                        </li>
                      ))}
                    </ul>
                  </section>
                );
              })}
              {(cafe.signatureDrink || parking) && (
                <dl className="space-y-3 rounded-2xl border border-[var(--border)] p-4 text-sm">
                  {cafe.signatureDrink && (
                    <div>
                      <dt className="font-semibold">{info("signatureDrink")}</dt>
                      <dd className="mt-1 text-[var(--foreground-muted)]">{cafe.signatureDrink}</dd>
                    </div>
                  )}
                  {parking && (
                    <div>
                      <dt className="font-semibold">{info("detail.parking")}</dt>
                      <dd className="mt-1 text-[var(--foreground-muted)]">{parking}</dd>
                    </div>
                  )}
                </dl>
              )}
              {menuImages.length > 0 && (
                <details className="group rounded-2xl border border-[var(--border)]">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 rounded-2xl px-4 py-3 text-sm font-semibold outline-offset-2 hover:bg-[var(--accent-light)] [&::-webkit-details-marker]:hidden">
                    {t("previewMenu")}
                    <ChevronDown size={16} aria-hidden="true" className="group-open:rotate-180" />
                  </summary>
                  <div className="space-y-3 px-3 pb-3">
                    {menuImages.map((src, index) => (
                      <Image
                        key={src}
                        src={src}
                        alt={t("previewMenuPage", { page: index + 1 })}
                        width={900}
                        height={1200}
                        unoptimized
                        className="h-auto w-full rounded-xl"
                      />
                    ))}
                  </div>
                </details>
              )}
            </div>
          </div>
          <footer className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-t border-[var(--border)] p-4 sm:px-5">
            <Link
              href={`/cafe/${cafe.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-11 items-center gap-1 text-sm font-semibold text-[var(--accent-hover)] underline-offset-4 hover:underline"
            >
              {t("cafeDetails")}
              <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
            <Dialog.Close
              onClick={() => onSelect(cafe)}
              className="flex min-h-11 items-center gap-2 rounded-full bg-[var(--accent)] px-5 text-sm font-bold text-white hover:bg-[var(--accent-hover)]"
            >
              <Check size={16} aria-hidden="true" />
              {t("chooseCafe")}
            </Dialog.Close>
          </footer>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
