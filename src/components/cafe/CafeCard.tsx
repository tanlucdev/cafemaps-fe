"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { motion } from "framer-motion";
import { MapPin, Star } from "lucide-react";
import { useTranslations } from "next-intl";
import SaveButton from "@/components/cafe/SaveButton";
import CafePreviewPopup from "@/components/cafe/CafePreviewPopup";
import { AUTH_STORAGE_KEYS } from "@/constants/auth-keys";
import { formatCafeArea, getCafeTagTranslation, VIBE_TRANSLATION_KEYS } from "@/lib/cafe-labels";
import { formatCafeDistanceParts } from "@/lib/distance";
import { cn, formatPrice } from "@/lib/utils";
import type { Cafe } from "@/types/cafe";

interface CafeCardProps {
  cafe: Cafe;
  locale: string;
  index?: number;
  animationType?: "slide" | "fade";
  initialSaved?: boolean;
  onSavedChange?: (saved: boolean) => void;
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

function isOpenNow(openingTime?: string | null, closingTime?: string | null): boolean {
  if (!openingTime || !closingTime) return true;
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

export default function CafeCard({
  cafe,
  locale,
  index = 0,
  animationType = "fade",
  initialSaved = false,
  onSavedChange,
}: CafeCardProps) {
  const tCafe = useTranslations("cafe");
  const tFilters = useTranslations("filters");
  const isSlide = animationType === "slide";
  const articleRef = useRef<HTMLElement>(null);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [popupVisible, setPopupVisible] = useState(false);
  const [anchorRect, setAnchorRect] = useState<DOMRect | null>(null);
  const [hovered, setHovered] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    setIsDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  function handleMouseEnter() {
    if (!isDesktop) return;
    setHovered(true);
    hoverTimer.current = setTimeout(() => {
      if (articleRef.current) {
        setAnchorRect(articleRef.current.getBoundingClientRect());
        setPopupVisible(true);
      }
    }, 150);
  }

  function handleMouseLeave() {
    if (!isDesktop) return;
    setHovered(false);
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    setPopupVisible(false);
  }

  function saveReturnUrl() {
    if (typeof window !== "undefined") {
      sessionStorage.setItem(AUTH_STORAGE_KEYS.returnUrl, window.location.href);
    }
  }

  const href = `/cafe/${cafe.slug}`;
  const price = formatPrice(cafe.priceMin, cafe.priceMax);
  const openNow = isOpenNow(cafe.openingTime, cafe.closingTime);
  const district = formatCafeArea(cafe.district, locale);
  const locationText = [district, ...formatCafeDistanceParts(cafe, locale)]
    .filter(Boolean)
    .join(" • ");
  const tags = cafe.vibes.length > 0 ? cafe.vibes.slice(0, 3) : cafe.purposes.slice(0, 3);
  const rating = ratingFor(index);

  return (
    <>
      <motion.article
        ref={articleRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...(isSlide
          ? {
              initial: { opacity: 0, y: 10 },
              animate: { opacity: 1, y: 0 },
              transition: {
                duration: 0.25,
                delay: Math.min(index, 2) * 0.05,
                ease: [0.33, 1, 0.68, 1],
              },
            }
          : {})}
        className={cn(
          "group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-[0_1px_3px_rgba(40,22,4,0.06)] transition-all duration-300",
          "hover:-translate-y-1 hover:shadow-[0_6px_24px_rgba(40,22,4,0.12)]",
          "dark:bg-[#1C1210] dark:shadow-[0_1px_3px_rgba(0,0,0,0.2)]",
        )}
      >
        <Link href={href} className="block" onClick={saveReturnUrl}>
          {/* Image area — image-forward, 65% of card height */}
          <div className="relative h-52 overflow-hidden bg-[#E5D9CB] md:h-56 dark:bg-[#2C1A0E]">
            {cafe.coverImage ? (
              <Image
                src={cafe.coverImage}
                alt={cafe.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.06]"
              />
            ) : (
              <div className="absolute inset-0 bg-linear-to-br from-[#FFEADF] via-[#F7DFC6] to-[#DDE9D8] dark:from-[#2C1A0E] dark:via-[#33231B] dark:to-[#1D2D20]" />
            )}

            {/* Gradient overlay for bottom info */}
            <div
              className="pointer-events-none absolute inset-0 bg-linear-to-t from-[rgba(15,8,2,0.55)] via-[rgba(15,8,2,0.1)] to-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(to top, rgba(15,8,2,0.55) 0%, rgba(15,8,2,0.1) 42%, transparent 65%)",
              }}
            />

            {/* Hover: description slides up from image bottom */}
            {cafe.oneLiner && (
              <div
                className="pointer-events-none absolute inset-0 flex items-end p-3.5 transition-opacity duration-200"
                style={{
                  background:
                    "linear-gradient(to top, rgba(10,5,1,0.80) 0%, rgba(10,5,1,0.12) 52%, transparent 72%)",
                  opacity: hovered ? 1 : 0,
                }}
              >
                <p
                  className="text-[12.5px] leading-[1.55] text-white/90 italic transition-transform duration-250"
                  style={{ transform: hovered ? "translateY(0)" : "translateY(6px)" }}
                >
                  &ldquo;{cafe.oneLiner}&rdquo;
                </p>
              </div>
            )}

            {/* Price — top left */}
            {price && (
              <span className="absolute top-2.5 left-2.5 rounded-full bg-[rgba(18,10,2,0.68)] px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur-md">
                {price}
              </span>
            )}
          </div>
        </Link>

        {/* Save button — top right, overlaid on image */}
        <SaveButton
          cafeId={cafe.id}
          locale={locale}
          initialSaved={initialSaved}
          onSavedChange={onSavedChange}
          className="absolute top-2.5 right-2.5 z-10 h-8 w-8 rounded-full border border-white/30 shadow-sm backdrop-blur-md transition-transform hover:scale-110 dark:border-white/10"
        />

        {/* Text content */}
        <Link href={href} className="block flex-1" onClick={saveReturnUrl}>
          <div className="flex flex-col gap-2 p-4">
            {/* Name + rating */}
            <div className="flex items-start justify-between gap-2">
              <h3 className="line-clamp-1 text-[14px] leading-snug font-bold text-[#1C1209] transition-colors group-hover:text-[#C9870C] dark:text-[#FFE3D3] dark:group-hover:text-[#F0A830]">
                {cafe.name}
              </h3>
              <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[#FBF0DC] px-2.5 py-0.5 text-[11px] font-bold text-[#C9870C] dark:bg-[#2C1A08] dark:text-[#F0A830]">
                <Star size={11} className="fill-[#F0A830] text-[#F0A830]" />
                {rating}
              </span>
            </div>

            {/* Open status + location */}
            <div className="flex min-w-0 items-center gap-1.5 text-xs">
              <span
                className={cn(
                  "inline-flex shrink-0 items-center gap-1 font-semibold",
                  openNow ? "text-[#1EA055]" : "text-[#9B8B73]",
                )}
              >
                <span className="relative flex h-1.5 w-1.5">
                  {openNow && (
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#1EA055] opacity-75" />
                  )}
                  <span
                    className={cn(
                      "relative inline-flex h-1.5 w-1.5 rounded-full",
                      openNow ? "bg-[#1EA055]" : "bg-[#9B8B73]",
                    )}
                  />
                </span>
                {openNow ? tCafe("openNow") : tCafe("closedNow")}
              </span>
              {locationText && (
                <>
                  <span className="text-[#C9C0B3]">·</span>
                  <span className="flex min-w-0 items-center gap-0.5 text-[#9B8B73]">
                    <MapPin size={11} className="shrink-0 text-[#C9870C]" />
                    <span className="truncate">{locationText}</span>
                  </span>
                </>
              )}
            </div>

            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
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
                        "rounded-full px-2.5 py-0.5 text-[11px] font-medium",
                        VIBE_TAG_CLASSES[classKey] ??
                          "bg-[#EDE5DB] text-[#6B5B3E] dark:bg-[#2A211B] dark:text-[#D9C4B2]",
                      )}
                    >
                      {label}
                    </span>
                  );
                })}
              </div>
            )}
          </div>
        </Link>
      </motion.article>

      {isDesktop && anchorRect && (
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
