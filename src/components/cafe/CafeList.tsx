"use client";

import { useRef, useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, Star } from "lucide-react";
import SaveButton from "@/components/cafe/SaveButton";
import CafePreviewPopup from "@/components/cafe/CafePreviewPopup";
import { formatPrice, cn } from "@/lib/utils";
import type { Cafe } from "@/types/cafe";
import { useTranslations } from "next-intl";

interface CafeListProps {
  cafes: Cafe[];
  locale: string;
  animationType?: "slide" | "fade";
}

const VIBE_TAG_CLASSES: Record<string, string> = {
  "yên tĩnh":   "bg-[#E6EEF8] text-[#2A5278] dark:bg-[#12203A] dark:text-[#90B4D8]",
  "nhộn nhịp":  "bg-[#FEF2E6] text-[#B85C0A] dark:bg-[#3A2010] dark:text-[#F3A66A]",
  vintage:       "bg-[#F5E8F3] text-[#893568] dark:bg-[#3A1630] dark:text-[#E09AC8]",
  "hiện đại":   "bg-[#E6F2ED] text-[#1E6640] dark:bg-[#12321E] dark:text-[#7DC89E]",
  "thiên nhiên": "bg-[#E8F2E8] text-[#2B6E2B] dark:bg-[#142814] dark:text-[#90C890]",
  "sáng tạo":   "bg-[#FFF1E6] text-[#B84E0A] dark:bg-[#3A1E0A] dark:text-[#F3A66A]",
  "lãng mạn":   "bg-[#FDEEF4] text-[#B4325E] dark:bg-[#3A1224] dark:text-[#E890B4]",
  minimalist:    "bg-[#EEEAF8] text-[#5B4A8A] dark:bg-[#22183A] dark:text-[#B8A8E0]",
};

function isOpenNow(openingTime?: string | null, closingTime?: string | null): boolean {
  if (!openingTime || !closingTime) return false;
  const now = new Date();
  const [oh, om] = openingTime.split(":").map(Number);
  const [ch, cm] = closingTime.split(":").map(Number);
  const nowMins = now.getHours() * 60 + now.getMinutes();
  const openMins = oh * 60 + om;
  const closeMins = ch * 60 + cm;
  if (closeMins < openMins) return nowMins >= openMins || nowMins < closeMins;
  return nowMins >= openMins && nowMins < closeMins;
}

function ratingFor(index: number) {
  return (4.5 + (index % 5) * 0.1).toFixed(1);
}

function CafeListRow({
  cafe,
  locale,
  index,
  animationType,
}: {
  cafe: Cafe;
  locale: string;
  index: number;
  animationType: "slide" | "fade";
}) {
  const articleRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [popupVisible, setPopupVisible] = useState(false);
  const [anchorRect, setAnchorRect] = useState<DOMRect | null>(null);
  const t = useTranslations("search");

  function handleMouseEnter() {
    hoverTimer.current = setTimeout(() => {
      const target = imageRef.current ?? articleRef.current;
      if (target) {
        setAnchorRect(target.getBoundingClientRect());
        setPopupVisible(true);
      }
    }, 150);
  }

  function handleMouseLeave() {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    setPopupVisible(false);
  }

  const price = formatPrice(cafe.priceMin, cafe.priceMax);
  const district = cafe.district || "";
  const distance =
    cafe.distanceKm != null
      ? cafe.distanceKm < 1
        ? `${Math.round(cafe.distanceKm * 1000)}m`
        : `${cafe.distanceKm.toFixed(1)}km`
      : "";
  const locationText = [district, distance].filter(Boolean).join(" • ");
  const openNow = useMemo(
    () => isOpenNow(cafe.openingTime, cafe.closingTime),
    [cafe.openingTime, cafe.closingTime],
  );
  const tags = cafe.vibes.length > 0 ? cafe.vibes.slice(0, 3) : cafe.purposes.slice(0, 3);
  const rating = ratingFor(index);

  return (
    <>
      <motion.article
        ref={articleRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        initial={animationType === "slide" ? { opacity: 0, y: 10 } : { opacity: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.22,
          delay: animationType === "slide" ? (index % 8) * 0.035 : 0,
          ease: [0.33, 1, 0.68, 1],
        }}
        className={cn(
          "group relative flex min-h-[140px] overflow-hidden rounded-2xl bg-white shadow-[0_1px_3px_rgba(40,22,4,0.06)] transition-all duration-300",
          "hover:-translate-y-0.5 hover:shadow-[0_6px_24px_rgba(40,22,4,0.12)]",
          "dark:bg-[#1C1210] dark:shadow-[0_1px_3px_rgba(0,0,0,0.2)]",
        )}
      >
        <Link href={`/${locale}/cafe/${cafe.slug}`} className="flex flex-1 min-w-0">
          {/* Image */}
          <div
            ref={imageRef}
            className="relative w-32 shrink-0 overflow-hidden bg-[#E5D9CB] sm:w-44 dark:bg-[#2C1A0E]"
          >
            {cafe.coverImage ? (
              <Image
                src={cafe.coverImage}
                alt={cafe.name}
                fill
                sizes="(max-width: 640px) 128px, 176px"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
              />
            ) : (
              <div className="absolute inset-0 bg-linear-to-br from-[#FFEADF] via-[#F7DFC6] to-[#DDE9D8] dark:from-[#2C1A0E] dark:via-[#33231B] dark:to-[#1D2D20]" />
            )}
            {/* Price on image */}
            {price && (
              <span className="absolute top-2 left-2 rounded-full bg-[rgba(18,10,2,0.68)] px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-md">
                {price}
              </span>
            )}
          </div>

          {/* Content */}
          <div className="flex min-w-0 flex-1 flex-col justify-between gap-2 p-4 pr-12">
            <div>
              {/* Name + rating row */}
              <div className="mb-1.5 flex items-start justify-between gap-2">
                <h3 className="line-clamp-1 text-[15px] font-bold text-[#1C1209] transition-colors group-hover:text-[#C9870C] dark:text-[#FFE3D3] dark:group-hover:text-[#F0A830]">
                  {cafe.name}
                </h3>
                <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[#FBF0DC] px-2 py-0.5 text-[11px] font-bold text-[#C9870C]">
                  <Star size={11} className="fill-[#F0A830] text-[#F0A830]" />
                  {rating}
                </span>
              </div>

              {/* Location */}
              {locationText && (
                <p className="mb-2 flex min-w-0 items-center gap-1 text-xs text-[#9B8B73]">
                  <MapPin size={12} className="shrink-0 text-[#C9870C]" />
                  <span className="truncate">{locationText}</span>
                </p>
              )}

              {/* Description — 2 lines */}
              {cafe.oneLiner && (
                <p className="line-clamp-2 text-xs leading-relaxed text-[#5C4A2F] dark:text-[#B8A693]">
                  {cafe.oneLiner}
                </p>
              )}
            </div>

            {/* Tags + open status */}
            <div className="flex flex-wrap items-center gap-1.5">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className={cn(
                    "rounded-full px-2 py-0.5 text-[10px] font-medium",
                    VIBE_TAG_CLASSES[tag] ??
                      "bg-[#EDE5DB] text-[#6B5B3E] dark:bg-[#2A211B] dark:text-[#D9C4B2]",
                  )}
                >
                  {tag}
                </span>
              ))}
              {(cafe.openingTime || cafe.closingTime) && (
                <span
                  className={cn(
                    "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold",
                    openNow
                      ? "bg-[#E6F5EE] text-[#166638] dark:bg-[#1D3520] dark:text-[#7DC89E]"
                      : "bg-[#F6E6E1] text-[#8A3C2F] dark:bg-[#3A211E] dark:text-[#E5A092]",
                  )}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                  {openNow ? t("openNow") : t("closed")}
                </span>
              )}
            </div>
          </div>
        </Link>

        {/* Save button */}
        <SaveButton
          cafeId={cafe.id}
          locale={locale}
          className="absolute top-3 right-3 z-10 h-8 w-8 rounded-full border border-[#E0D3C0] bg-white text-[#875200] shadow-sm transition-all hover:bg-[#FBF0DC] dark:border-[#3A2A20] dark:bg-[#1C1210] dark:text-[#E0A14B]"
        />
      </motion.article>

      {anchorRect && (
        <CafePreviewPopup
          cafe={cafe}
          anchorRect={anchorRect}
          locale={locale}
          visible={popupVisible}
        />
      )}
    </>
  );
}

export default function CafeList({ cafes, locale, animationType = "slide" }: CafeListProps) {
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
        />
      ))}
    </div>
  );
}
