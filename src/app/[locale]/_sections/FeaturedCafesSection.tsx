"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { MapPin, ArrowRight } from "lucide-react";
import Badge from "@/components/ui/Badge";
import { motion, useReducedMotion } from "framer-motion";
import { AUTH_STORAGE_KEYS } from "@/constants/auth-keys";
import { cn } from "@/lib/utils";
import { getCafeOpenStatus } from "@/lib/opening-hours";
import type { Cafe } from "@/types/cafe";
import { useRef, useState, useCallback } from "react";

interface FeaturedCafesSectionProps {
  cafes: Cafe[];
  copy: {
    weeklyFavourite: string;
    mustVisit: string;
    viewAll: string;
    viewAllMobile: string;
    openNow: string;
    closedNow: string;
  };
}

const RANK_CONFIG = [
  {
    rank: 1,
    label: "01",
    heightClass: "h-64 sm:h-80 lg:h-[360px]",
    order: "order-first sm:order-none",
  },
  { rank: 2, label: "02", heightClass: "h-56 sm:h-80 lg:h-[360px]", order: "sm:order-first" },
  { rank: 3, label: "03", heightClass: "h-52 sm:h-80 lg:h-[360px]", order: "" },
];

interface PodiumCardProps {
  cafe: Cafe;
  rank: number;
  label: string;
  heightClass: string;
  delay: number;
  openNowLabel: string;
  closedNowLabel: string;
}

function PodiumCard({
  cafe,
  rank,
  label,
  heightClass,
  delay,
  openNowLabel,
  closedNowLabel,
}: PodiumCardProps) {
  const reduceMotion = useReducedMotion();
  const openStatus = getCafeOpenStatus(cafe.openingTime, cafe.closingTime);

  function saveReturnUrl() {
    if (typeof window !== "undefined") {
      sessionStorage.setItem(AUTH_STORAGE_KEYS.returnUrl, window.location.href);
    }
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={reduceMotion ? undefined : { y: -5 }}
      viewport={{ once: true }}
      transition={{
        duration: reduceMotion ? 0 : 0.42,
        delay: reduceMotion ? 0 : delay,
        ease: [0.33, 1, 0.68, 1],
      }}
      className={cn(
        "group relative w-[72vw] max-w-[280px] flex-none overflow-hidden rounded-[24px] bg-[#2c1a0e] shadow-[0_18px_48px_rgba(70,42,17,0.16)] ring-1 ring-white/45 transition-shadow duration-300 sm:w-full sm:max-w-none dark:ring-white/10",
        rank === 1
          ? "border border-[#d99d45]/70 hover:shadow-[0_24px_64px_rgba(200,132,42,0.24)]"
          : "border border-[#ead8bf]/75 hover:shadow-[0_22px_58px_rgba(92,58,25,0.18)]",
      )}
    >
      <div className="pointer-events-none absolute inset-0 z-10 rounded-[24px] bg-[radial-gradient(circle_at_24%_8%,rgba(255,229,178,0.16),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.06),transparent_42%)] opacity-90" />
      <Link href={`/cafe/${cafe.slug}`} className="block" onClick={saveReturnUrl}>
        {/* Image */}
        <div className={cn("relative overflow-hidden bg-(--background-secondary)", heightClass)}>
          {cafe.coverImage ? (
            <Image
              src={cafe.coverImage}
              alt={cafe.name}
              fill
              sizes="(max-width: 640px) 256px, 33vw"
              className="object-cover transition-transform duration-700 group-hover:scale-[1.045]"
              priority={rank === 1}
            />
          ) : (
            <div className="from-accent absolute inset-0 bg-linear-to-br to-(--accent-hover)" />
          )}

          {/* Rank badge */}
          <span
            className={cn(
              "absolute top-3 left-3 z-20 flex h-8 w-8 items-center justify-center rounded-full border border-white/30 text-xs font-black shadow-[0_8px_22px_rgba(20,10,2,0.18)] backdrop-blur-md",
              rank === 1
                ? "bg-[#ffd891]/92 text-[#5b3512]"
                : rank === 2
                  ? "bg-[#fff0d4]/88 text-[#65411f]"
                  : "bg-[#b8752c]/88 text-[#fff3dc]",
            )}
          >
            {label}
          </span>

          {/* Open/Closed badge */}
          {openStatus !== null && (
            <span
              className={cn(
                "absolute top-3 right-3 z-20 flex items-center gap-1 rounded-full border border-white/20 px-2 py-0.5 text-[10px] font-bold shadow-[0_8px_20px_rgba(20,10,2,0.16)] backdrop-blur-md",
                openStatus ? "bg-[#1ea055]/86 text-white" : "bg-[#1b0f08]/62 text-white/80",
              )}
            >
              <span
                className={cn("h-1.5 w-1.5 rounded-full", openStatus ? "bg-white" : "bg-white/60")}
              />
              {openStatus ? openNowLabel : closedNowLabel}
            </span>
          )}

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(25,12,3,0.84)_0%,rgba(45,24,7,0.28)_48%,rgba(255,209,139,0.08)_100%)]" />
          <div className="pointer-events-none absolute right-5 bottom-24 h-16 w-24 rotate-[-14deg] rounded-[50%] border-t border-dashed border-[#ffe3b7]/28" />

          {/* Info overlay at bottom */}
          <div className="absolute right-0 bottom-0 left-0 z-20 p-3 sm:p-4">
            <div className="flex items-end justify-between gap-2">
              <div className="min-w-0">
                <h3
                  className={cn(
                    "font-display line-clamp-1 leading-snug font-bold text-white",
                    rank === 1 ? "text-base sm:text-lg" : "text-sm sm:text-base",
                  )}
                >
                  {cafe.name}
                </h3>
                <p className="mt-0.5 flex items-center gap-1 text-xs text-white/76">
                  <MapPin size={10} className="shrink-0 text-[#ffd891]" />
                  <span className="truncate">{cafe.district}</span>
                </p>
              </div>
            </div>

            {/* Tagline from oneLiner */}
            {cafe.oneLiner && (
              <p className="mt-1 line-clamp-1 text-[10.5px] text-white/68 italic">
                {cafe.oneLiner}
              </p>
            )}

            {cafe.vibes.length > 0 && (
              <div className="mt-1.5 flex flex-wrap gap-1">
                {cafe.vibes.slice(0, 2).map((v) => (
                  <Badge
                    key={v}
                    label={v}
                    variant="vibe"
                    className="border border-white/18 bg-[#fff1d6]/18 px-2 py-0.5 text-[10px] text-[#fff1d6] opacity-100 backdrop-blur-md"
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

export default function FeaturedCafesSection({ cafes, copy }: FeaturedCafesSectionProps) {
  const featured = cafes.slice(0, 3);
  const [activeDot, setActiveDot] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.scrollWidth / featured.length;
    const idx = Math.min(Math.round(el.scrollLeft / cardWidth), featured.length - 1);
    setActiveDot(idx);
  }, [featured.length]);

  if (featured.length === 0) return null;

  // Mobile: show in ranking order (01 → 02 → 03)
  const mobileOrder = featured;

  // Desktop podium: rank 2 left, rank 1 center, rank 3 right
  const podiumOrder =
    featured.length >= 3
      ? [featured[1], featured[0], featured[2]]
      : featured.length === 2
        ? [featured[1], featured[0]]
        : [featured[0]];

  return (
    <section className="relative isolate overflow-hidden px-4 py-12 sm:px-6 sm:py-14 lg:px-8">
      <div className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(circle_at_16%_20%,rgba(200,132,42,0.14),transparent_30%),radial-gradient(circle_at_84%_8%,rgba(255,216,145,0.20),transparent_26%),linear-gradient(180deg,#fffaf2_0%,#f7ecd8_58%,#fdf6ec_100%)]" />
      <div className="pointer-events-none absolute inset-0 -z-10 [background-image:url('data:image/svg+xml,%3Csvg_viewBox=%220_0_160_160%22_xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter_id=%22n%22%3E%3CfeTurbulence_type=%22fractalNoise%22_baseFrequency=%220.72%22_numOctaves=%223%22_stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect_width=%22100%25%22_height=%22100%25%22_filter=%22url(%23n)%22_opacity=%220.32%22/%3E%3C/svg%3E')] opacity-[0.045] mix-blend-multiply" />
      <div className="pointer-events-none absolute top-10 right-[8%] -z-10 hidden h-28 w-44 rotate-[-10deg] rounded-[50%] border-t border-dashed border-[#c8842a]/18 lg:block" />
      <div className="mx-auto max-w-7xl">
        {/* Section header */}
        <div className="mb-6 flex items-end justify-between gap-4 sm:mb-7">
          <div>
            <p className="mb-2 inline-flex items-center gap-2 rounded-full border border-[#e3c79b]/70 bg-white/46 px-3 py-1.5 text-xs font-black tracking-[0.13em] text-[#9b6424] uppercase shadow-[0_8px_22px_rgba(120,72,25,0.07)] backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-[#c8842a] shadow-[0_0_14px_rgba(200,132,42,0.55)]" />
              {copy.weeklyFavourite}
            </p>
            <h2 className="font-lora text-2xl leading-tight font-bold tracking-tight text-[#2c1a0e] sm:text-4xl dark:text-[var(--foreground)]">
              {copy.mustVisit}
            </h2>
          </div>
          <Link
            href="/search"
            className="hidden min-h-10 items-center gap-1.5 rounded-full border border-[#e0c49b]/78 bg-white/56 px-4 text-sm font-black text-[#8a551d] shadow-[0_10px_24px_rgba(91,58,29,0.08)] backdrop-blur-md transition hover:-translate-y-0.5 hover:border-[#c8842a]/70 hover:text-[#a86d1e] focus-visible:ring-2 focus-visible:ring-[#c8842a] focus-visible:ring-offset-2 focus-visible:ring-offset-[#fffaf2] focus-visible:outline-none sm:flex"
          >
            {copy.viewAll}
            <ArrowRight size={15} />
          </Link>
        </div>

        {/* Mobile: horizontal scroll — Desktop: 3-column podium */}
        <div className="-mx-4 px-4 sm:hidden">
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="scrollbar-hide flex snap-x snap-mandatory gap-3 overflow-x-auto pb-3"
          >
            {mobileOrder.map((cafe) => {
              const originalRank = featured.indexOf(cafe) + 1;
              const config = RANK_CONFIG.find((c) => c.rank === originalRank) ?? RANK_CONFIG[0];
              return (
                <div key={cafe.id} className="snap-start">
                  <PodiumCard
                    cafe={cafe}
                    rank={originalRank}
                    label={config.label}
                    heightClass={config.heightClass}
                    delay={0}
                    openNowLabel={copy.openNow}
                    closedNowLabel={copy.closedNow}
                  />
                </div>
              );
            })}
            {/* Spacer so last card doesn't stick to edge */}
            <div className="w-4 flex-none" aria-hidden />
          </div>

          {/* Dot pagination indicator */}
          {featured.length > 1 && (
            <div className="mt-2 flex justify-center gap-1.5">
              {featured.map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "rounded-full transition-all duration-300",
                    i === activeDot ? "bg-accent h-1.5 w-4" : "h-1.5 w-1.5 bg-[#d8bd99]",
                  )}
                />
              ))}
            </div>
          )}
        </div>

        {/* Desktop podium grid */}
        <div className="hidden gap-4 sm:grid sm:grid-cols-3 sm:items-end lg:items-start lg:gap-5">
          {podiumOrder.map((cafe, displayIdx) => {
            const originalRank = featured.indexOf(cafe) + 1;
            const config = RANK_CONFIG.find((c) => c.rank === originalRank) ?? RANK_CONFIG[0];
            return (
              <div key={cafe.id} className={config.order}>
                <PodiumCard
                  cafe={cafe}
                  rank={originalRank}
                  label={config.label}
                  heightClass={config.heightClass}
                  delay={displayIdx * 0.08}
                  openNowLabel={copy.openNow}
                  closedNowLabel={copy.closedNow}
                />
              </div>
            );
          })}
        </div>

        {/* Mobile explore link */}
        <div className="mt-5 text-center sm:hidden">
          <Link
            href="/search"
            className="inline-flex min-h-10 items-center gap-1.5 rounded-full border border-[#e0c49b]/78 bg-white/56 px-4 text-sm font-black text-[#8a551d] shadow-[0_10px_24px_rgba(91,58,29,0.08)] backdrop-blur-md transition hover:border-[#c8842a]/70 hover:text-[#a86d1e] focus-visible:ring-2 focus-visible:ring-[#c8842a] focus-visible:ring-offset-2 focus-visible:ring-offset-[#fffaf2] focus-visible:outline-none"
          >
            {copy.viewAllMobile}
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  );
}
