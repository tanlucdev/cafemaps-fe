"use client";

import { useMemo } from "react";
// import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { MapPin, Star } from "lucide-react";
import SaveButton from "@/components/cafe/SaveButton";
// import CafePreviewPopup from "@/components/cafe/CafePreviewPopup";
import { formatCafeArea, getCafeTagTranslation, VIBE_TRANSLATION_KEYS } from "@/lib/cafe-labels";
import { formatCafeDistanceParts } from "@/lib/distance";
import { getCafeOpenStatus } from "@/lib/opening-hours";
import { formatCafeRating } from "@/lib/cafe-rating";
import { formatPrice, cn } from "@/lib/utils";
import type { Cafe } from "@/types/cafe";
import { useTranslations } from "next-intl";

interface CafeListProps {
  cafes: Cafe[];
  locale: string;
  animationType?: "slide" | "fade";
  variant?: "default" | "cinematic";
}

const VIBE_TAG_CLASSES: Record<string, string> = {
  quiet: "bg-[#E6EEF8] text-[#2A5278] dark:bg-[#12203A] dark:text-[#90B4D8]",
  lively: "bg-[#FEF2E6] text-[#B85C0A] dark:bg-[#3A2010] dark:text-[#F3A66A]",
  vintage: "bg-[#F5E8F3] text-[#893568] dark:bg-[#3A1630] dark:text-[#E09AC8]",
  modern: "bg-[#E6F2ED] text-[#1E6640] dark:bg-[#12321E] dark:text-[#7DC89E]",
  nature: "bg-[#E8F2E8] text-[#2B6E2B] dark:bg-[#142814] dark:text-[#90C890]",
  creative: "bg-[#FFF1E6] text-[#B84E0A] dark:bg-[#3A1E0A] dark:text-[#F3A66A]",
  romantic: "bg-[#FDEEF4] text-[#B4325E] dark:bg-[#3A1224] dark:text-[#E890B4]",
  minimalist: "bg-[#EEEAF8] text-[#5B4A8A] dark:bg-[#22183A] dark:text-[#B8A8E0]",
};

function ratingFor(cafe: Cafe, index: number) {
  return formatCafeRating(cafe, 4.5 + (index % 5) * 0.1);
}

function CafeListRow({
  cafe,
  locale,
  index,
  animationType,
  variant,
}: {
  cafe: Cafe;
  locale: string;
  index: number;
  animationType: "slide" | "fade";
  variant: "default" | "cinematic";
}) {
  // Hover preview disabled per request. Keep the old code here for easy rollback.
  // const articleRef = useRef<HTMLElement>(null);
  // const imageRef = useRef<HTMLDivElement>(null);
  // const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // const [popupVisible, setPopupVisible] = useState(false);
  // const [anchorRect, setAnchorRect] = useState<DOMRect | null>(null);
  // const [hovered, setHovered] = useState(false);

  const t = useTranslations("search");
  const tFilters = useTranslations("filters");
  const reduceMotion = useReducedMotion();
  const isCinematic = variant === "cinematic";

  // function handleMouseEnter() {
  //   setHovered(true);
  //   hoverTimer.current = setTimeout(() => {
  //     const target = imageRef.current ?? articleRef.current;
  //     if (target) {
  //       setAnchorRect(target.getBoundingClientRect());
  //       setPopupVisible(true);
  //     }
  //   }, 150);
  // }
  //
  // function handleMouseLeave() {
  //   setHovered(false);
  //   if (hoverTimer.current) clearTimeout(hoverTimer.current);
  //   setPopupVisible(false);
  // }

  const price = formatPrice(cafe.priceMin, cafe.priceMax, locale);
  const district = formatCafeArea(cafe.district, locale);
  const locationText = [district, ...formatCafeDistanceParts(cafe, locale)]
    .filter(Boolean)
    .join(" • ");
  const openStatus = useMemo(
    () => getCafeOpenStatus(cafe.openingTime, cafe.closingTime),
    [cafe.openingTime, cafe.closingTime],
  );
  const tags = cafe.vibes.length > 0 ? cafe.vibes.slice(0, 3) : cafe.purposes.slice(0, 3);
  const rating = ratingFor(cafe, index);
  const isSlide = animationType === "slide";
  const revealInitial = isSlide
    ? { opacity: 0, y: reduceMotion ? 0 : 20, scale: reduceMotion ? 1 : 0.98 }
    : { opacity: 0, y: 0, scale: 1 };
  const revealTransition = {
    duration: reduceMotion ? 0 : isSlide ? 0.32 : 0.28,
    delay: reduceMotion ? 0 : Math.min(index % 8, 7) * 0.06,
    ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
  };

  return (
    <motion.article
      // ref={articleRef}
      // onMouseEnter={handleMouseEnter}
      // onMouseLeave={handleMouseLeave}
      initial={revealInitial}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.18, margin: "0px 0px -6% 0px" }}
      transition={revealTransition}
      whileHover={isCinematic && !reduceMotion ? { y: -3, scale: 1.005 } : undefined}
      className={cn(
        "group relative flex min-h-[140px] overflow-hidden rounded-2xl transition-colors duration-300",
        isCinematic
          ? "border border-[#ffe3b7]/12 bg-[#1b0f08]/66 shadow-[0_18px_52px_rgba(0,0,0,0.28)] backdrop-blur-md hover:border-[#ffe3b7]/28 hover:shadow-[0_22px_64px_rgba(245,166,58,0.16)]"
          : "bg-white shadow-[0_1px_3px_rgba(40,22,4,0.06)] dark:bg-[#1C1210] dark:shadow-[0_1px_3px_rgba(0,0,0,0.2)]",
      )}
    >
      <Link
        href={`/cafe/${cafe.slug}`}
        className="flex min-w-0 flex-1 outline-none focus-visible:ring-2 focus-visible:ring-[#ffe3b7]"
      >
        {/* Image */}
        {/* ref={imageRef} */}
        <div
          className={cn(
            "relative w-32 shrink-0 overflow-hidden sm:w-44",
            isCinematic ? "bg-[#2C1A0E]" : "bg-[#E5D9CB] dark:bg-[#2C1A0E]",
          )}
        >
          {cafe.coverImage ? (
            <Image
              src={cafe.coverImage}
              alt={cafe.name}
              fill
              sizes="(max-width: 640px) 128px, 176px"
              className={cn(
                "object-cover",
                isCinematic && "transition-transform duration-500 group-hover:scale-[1.04]",
              )}
              // className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
            />
          ) : (
            <div
              className={cn(
                "absolute inset-0",
                isCinematic
                  ? "bg-[radial-gradient(circle_at_28%_18%,rgba(255,232,186,0.28),transparent_34%),linear-gradient(135deg,#2c1a0e_0%,#402313_46%,#15100a_100%)]"
                  : "bg-linear-to-br from-[#FFEADF] via-[#F7DFC6] to-[#DDE9D8] dark:from-[#2C1A0E] dark:via-[#33231B] dark:to-[#1D2D20]",
              )}
            />
          )}

          {cafe.oneLiner && (
            <div
              className="pointer-events-none absolute inset-0 flex items-end p-2.5 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
              style={{
                background:
                  "linear-gradient(to top, rgba(10,5,1,0.88) 0%, rgba(10,5,1,0.20) 55%, transparent 80%)",
              }}
            >
              <p className="translate-y-1 text-[11px] leading-normal text-white/92 italic transition-transform duration-250 group-hover:translate-y-0">
                &ldquo;{cafe.oneLiner}&rdquo;
              </p>
            </div>
          )}

          {/* Price on image */}
          {price && (
            <span className="absolute top-2 left-2 z-10 rounded-full bg-[rgba(18,10,2,0.68)] px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-md">
              {price}
            </span>
          )}

          {/* Old state-driven hover description kept for rollback.
            {cafe.oneLiner && (
              <div
                className="pointer-events-none absolute inset-0 flex items-end p-2.5 transition-opacity duration-200"
                style={{
                  background:
                    "linear-gradient(to top, rgba(10,5,1,0.88) 0%, rgba(10,5,1,0.20) 55%, transparent 80%)",
                  opacity: hovered ? 1 : 0,
                }}
              >
                <p
                  className="text-[11px] leading-normal text-white/92 italic transition-transform duration-250"
                  style={{ transform: hovered ? "translateY(0)" : "translateY(5px)" }}
                >
                  &ldquo;{cafe.oneLiner}&rdquo;
                </p>
              </div>
            )} */}
        </div>

        {/* Content */}
        <div className="flex min-w-0 flex-1 flex-col justify-between gap-2 p-4 pr-12">
          <div>
            {/* Name + rating row */}
            <div className="mb-1.5 flex items-start justify-between gap-2">
              <h3
                className={cn(
                  "line-clamp-1 text-[15px] font-bold",
                  isCinematic ? "text-[#fff7e8]" : "text-[#1C1209] dark:text-[#FFE3D3]",
                )}
              >
                {/* className="line-clamp-1 text-[15px] font-bold text-[#1C1209] transition-colors group-hover:text-[#C9870C] dark:text-[#FFE3D3] dark:group-hover:text-[#F0A830]" */}
                {cafe.name}
              </h3>
              <span
                className={cn(
                  "inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold",
                  isCinematic
                    ? "border border-[#ffe3b7]/18 bg-[#fff1d6]/12 text-[#ffd58a]"
                    : "bg-[#FBF0DC] text-[#C9870C]",
                )}
              >
                <Star size={11} className="fill-[#F0A830] text-[#F0A830]" />
                {rating}
              </span>
            </div>

            {/* Location */}
            {locationText && (
              <p
                className={cn(
                  "mb-2 flex min-w-0 items-center gap-1 text-xs",
                  isCinematic ? "text-[#fff0d4]/62" : "text-[#9B8B73]",
                )}
              >
                <MapPin size={12} className="shrink-0 text-[#C9870C]" />
                <span className="truncate">{locationText}</span>
              </p>
            )}

            {/* Description — 2 lines */}
            {cafe.oneLiner && (
              <p
                className={cn(
                  "line-clamp-2 text-xs leading-relaxed",
                  isCinematic ? "text-[#fff0d4]/72" : "text-[#5C4A2F] dark:text-[#B8A693]",
                )}
              >
                {cafe.oneLiner}
              </p>
            )}
          </div>

          {/* Tags + open status */}
          <div className="flex flex-wrap items-center gap-1.5">
            {tags.map((tag) => {
              const translation = getCafeTagTranslation(tag);
              const classKey = VIBE_TRANSLATION_KEYS[tag] ?? tag;
              const label = translation
                ? tFilters(
                    `${translation.group}.${translation.key}` as Parameters<typeof tFilters>[0],
                  )
                : tag;

              return (
                <span
                  key={tag}
                  className={cn(
                    "rounded-full px-2 py-0.5 text-[10px] font-medium",
                    isCinematic
                      ? "border border-[#ffe3b7]/12 bg-[#fff1d6]/9 text-[#fff0d4]/78"
                      : (VIBE_TAG_CLASSES[classKey] ??
                          "bg-[#EDE5DB] text-[#6B5B3E] dark:bg-[#2A211B] dark:text-[#D9C4B2]"),
                  )}
                >
                  {label}
                </span>
              );
            })}
            {openStatus !== null && (
              <span
                className={cn(
                  "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold",
                  openStatus
                    ? "bg-[var(--status-open-background)] text-[var(--status-open-foreground)]"
                    : "bg-[var(--status-closed-background)] text-[var(--status-closed-foreground)]",
                )}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-current" />
                {openStatus ? t("openNow") : t("closed")}
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Save button */}
      <SaveButton
        cafeId={cafe.id}
        locale={locale}
        className={cn(
          "absolute top-3 right-3 z-10 h-8 w-8 rounded-full border shadow-sm transition-all",
          isCinematic
            ? "border-[#ffe3b7]/24 bg-[#170c06]/48 text-[#fff0d4] backdrop-blur-md hover:bg-[#fff1d6]/12"
            : "border-[#E0D3C0] bg-white text-[#875200] hover:bg-[#FBF0DC] dark:border-[#3A2A20] dark:bg-[#1C1210] dark:text-[#E0A14B]",
        )}
      />

      {/* Hover preview popup disabled per request.
      {anchorRect && (
        <CafePreviewPopup
          cafe={cafe}
          anchorRect={anchorRect}
          locale={locale}
          visible={popupVisible}
        />
      )} */}
    </motion.article>
  );
}

export default function CafeList({
  cafes,
  locale,
  animationType = "slide",
  variant = "default",
}: CafeListProps) {
  const t = useTranslations("search");

  if (cafes.length === 0) {
    return (
      <div className="py-16 text-center text-sm text-[#847465] dark:text-[#A08070]">
        {t("noResults")}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {cafes.map((cafe, index) => (
        <CafeListRow
          key={cafe.id}
          cafe={cafe}
          locale={locale}
          index={index}
          animationType={animationType}
          variant={variant}
        />
      ))}
    </div>
  );
}
