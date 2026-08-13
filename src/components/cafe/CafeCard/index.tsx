"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { MapPin, Star } from "lucide-react";
import { useTranslations } from "next-intl";
import IntentPrefetchLink from "@/components/cafe/IntentPrefetchLink";
import SaveButton from "@/components/cafe/SaveButton";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { AUTH_STORAGE_KEYS } from "@/constants/auth-keys";
import { formatCafeArea, getCafeTagTranslation, VIBE_TRANSLATION_KEYS } from "@/lib/cafe-labels";
import { formatCafeDistanceParts } from "@/lib/distance";
import { getCafeOpenStatus } from "@/lib/opening-hours";
import { cn, formatPrice } from "@/lib/utils";
import { ratingFor, VIBE_TAG_CLASSES, type CafeCardProps } from "@/components/cafe/shared";

export default function CafeCard({
  cafe,
  locale,
  index = 0,
  animationType = "fade",
  variant = "default",
  imageEager = false,
  initialSaved = false,
  onSavedChange,
}: CafeCardProps) {
  const tCafe = useTranslations("cafe");
  const tFilters = useTranslations("filters");
  const isSlide = animationType === "slide";
  const reduceMotion = usePrefersReducedMotion();
  const isCinematic = variant === "cinematic";

  function saveReturnUrl() {
    if (typeof window !== "undefined") {
      sessionStorage.setItem(AUTH_STORAGE_KEYS.returnUrl, window.location.href);
    }
  }

  const href = `/cafe/${cafe.slug}`;
  const price = formatPrice(cafe.priceMin, cafe.priceMax, locale);
  const openStatus = getCafeOpenStatus(cafe.openingTime, cafe.closingTime);
  const district = formatCafeArea(cafe.district, locale);
  const locationText = [district, ...formatCafeDistanceParts(cafe, locale)]
    .filter(Boolean)
    .join(" • ");
  const tags = cafe.vibes.length > 0 ? cafe.vibes.slice(0, 3) : cafe.purposes.slice(0, 3);
  const rating = ratingFor(cafe, index);
  const revealInitial = isSlide
    ? { opacity: 0, y: reduceMotion ? 0 : 20, scale: reduceMotion ? 1 : 0.98 }
    : { opacity: 0, y: 0, scale: 1 };
  const revealTransition = {
    duration: reduceMotion ? 0 : isSlide ? 0.34 : 0.28,
    delay: reduceMotion ? 0 : Math.min(index % 8, 7) * 0.06,
    ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
  };

  return (
    <motion.article
      layout
      layoutId={`featured-cafe-${cafe.id}`}
      initial={revealInitial}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.18, margin: "0px 0px -6% 0px" }}
      transition={{
        ...revealTransition,
        layout: { type: "spring", stiffness: 260, damping: 28, mass: 0.8 },
      }}
      whileHover={isCinematic && !reduceMotion ? { y: -4, scale: 1.01 } : undefined}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl transition-colors duration-300",
        isCinematic
          ? "border border-[#ffe3b7]/12 bg-[#1b0f08]/66 shadow-[0_18px_52px_rgba(0,0,0,0.28)] backdrop-blur-md hover:border-[#ffe3b7]/28 hover:shadow-[0_22px_64px_rgba(245,166,58,0.16)]"
          : "bg-white shadow-[0_1px_3px_rgba(40,22,4,0.06)] dark:bg-[#1C1210] dark:shadow-[0_1px_3px_rgba(0,0,0,0.2)]",
      )}
    >
      <IntentPrefetchLink
        href={href}
        className="block outline-none focus-visible:ring-2 focus-visible:ring-[#ffe3b7]"
        onClick={saveReturnUrl}
      >
        {/* Image area — image-forward, 65% of card height */}
        <div
          className={cn(
            "relative h-52 overflow-hidden md:h-56",
            isCinematic ? "bg-[#2C1A0E]" : "bg-[#E5D9CB] dark:bg-[#2C1A0E]",
          )}
        >
          {cafe.coverImage ? (
            <Image
              src={cafe.coverImage}
              alt={cafe.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className={cn(
                "object-cover",
                isCinematic && "transition-transform duration-500 group-hover:scale-[1.04]",
              )}
              quality={90}
              loading={imageEager ? "eager" : "lazy"}
              fetchPriority={imageEager ? "high" : undefined}
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

          {/* Gradient overlay for bottom info */}
          <div
            className="pointer-events-none absolute inset-0 bg-linear-to-t from-[rgba(15,8,2,0.55)] via-[rgba(15,8,2,0.1)] to-transparent"
            style={{
              backgroundImage:
                "linear-gradient(to top, rgba(15,8,2,0.55) 0%, rgba(15,8,2,0.1) 42%, transparent 65%)",
            }}
          />

          {cafe.oneLiner && (
            <div
              className="pointer-events-none absolute inset-0 flex items-end p-3.5 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
              style={{
                background:
                  "linear-gradient(to top, rgba(10,5,1,0.80) 0%, rgba(10,5,1,0.12) 52%, transparent 72%)",
              }}
            >
              <p className="translate-y-1.5 text-[12.5px] leading-[1.55] text-white/90 italic transition-transform duration-250 group-hover:translate-y-0">
                &ldquo;{cafe.oneLiner}&rdquo;
              </p>
            </div>
          )}

          {/* Price — top left */}
          {price && (
            <span className="absolute top-2.5 left-2.5 z-10 rounded-full bg-[rgba(18,10,2,0.68)] px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur-md">
              {price}
            </span>
          )}

          {/* Old state-driven hover description kept for rollback.
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
          )} */}
        </div>
      </IntentPrefetchLink>

      {/* Save button — top right, overlaid on image */}
      <SaveButton
        cafeId={cafe.id}
        locale={locale}
        initialSaved={initialSaved}
        onSavedChange={onSavedChange}
        className={cn(
          "absolute top-2.5 right-2.5 z-10 h-8 w-8 rounded-full border shadow-sm backdrop-blur-md transition-transform hover:scale-110",
          isCinematic
            ? "border-[#ffe3b7]/24 bg-[#170c06]/48 text-[#fff0d4]"
            : "border-white/30 dark:border-white/10",
        )}
      />

      {/* Text content */}
      <IntentPrefetchLink
        href={href}
        className="block flex-1 outline-none focus-visible:ring-2 focus-visible:ring-[#ffe3b7]"
        onClick={saveReturnUrl}
      >
        <div className="flex flex-col gap-2 p-4">
          {/* Name + rating */}
          <div className="flex items-start justify-between gap-2">
            <h3
              className={cn(
                "line-clamp-1 text-[14px] leading-snug font-bold",
                isCinematic ? "text-[#fff7e8]" : "text-[#1C1209] dark:text-[#FFE3D3]",
              )}
            >
              {cafe.name}
            </h3>
            <span
              className={cn(
                "inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold",
                isCinematic
                  ? "border border-[#ffe3b7]/18 bg-[#fff1d6]/12 text-[#ffd58a]"
                  : "bg-[#FBF0DC] text-[#C9870C] dark:bg-[#2C1A08] dark:text-[#F0A830]",
              )}
            >
              <Star size={11} className="fill-[#F0A830] text-[#F0A830]" />
              {rating}
            </span>
          </div>

          {/* Open status + location */}
          <div className="flex min-w-0 items-center gap-1.5 text-xs">
            {openStatus !== null && (
              <span
                className={cn(
                  "inline-flex shrink-0 items-center gap-1 font-semibold",
                  openStatus ? "text-[var(--status-open)]" : "text-[var(--status-closed)]",
                )}
              >
                <span className="relative flex h-1.5 w-1.5">
                  {openStatus && (
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--status-open)] opacity-75" />
                  )}
                  <span
                    className={cn(
                      "relative inline-flex h-1.5 w-1.5 rounded-full",
                      openStatus ? "bg-[var(--status-open)]" : "bg-[var(--status-closed)]",
                    )}
                  />
                </span>
                {openStatus ? tCafe("openNow") : tCafe("closedNow")}
              </span>
            )}
            {locationText && (
              <>
                {openStatus !== null && (
                  <span className={isCinematic ? "text-[#fff0d4]/26" : "text-[#C9C0B3]"}>·</span>
                )}
                <span
                  className={cn(
                    "flex min-w-0 items-center gap-0.5",
                    isCinematic ? "text-[#fff0d4]/62" : "text-[#9B8B73]",
                  )}
                >
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
            </div>
          )}
        </div>
      </IntentPrefetchLink>

      {/* Hover preview popup disabled per request.
      {isDesktop && anchorRect && (
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
