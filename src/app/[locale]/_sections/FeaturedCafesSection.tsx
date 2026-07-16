"use client";

import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Cafe } from "@/types/cafe";
import { useRef, useState, useCallback } from "react";
import FeaturedPodiumCard from "./FeaturedPodiumCard";
import { useCafeVotes } from "./useCafeVotes";

interface FeaturedCafesSectionProps {
  cafes: Cafe[];
  copy: {
    weeklyFavourite: string;
    mustVisit: string;
    viewAll: string;
    viewAllMobile: string;
    openNow: string;
    closedNow: string;
    vote: string;
    voted: string;
    voteCount: string;
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

export default function FeaturedCafesSection({ cafes, copy }: FeaturedCafesSectionProps) {
  const featured = cafes.slice(0, 3);
  const [activeDot, setActiveDot] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const votedCafeIds = useCafeVotes(featured.length > 0);

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
                  <FeaturedPodiumCard
                    cafe={cafe}
                    initialVoted={votedCafeIds.has(cafe.id) || cafe.hasUserVote}
                    rank={originalRank}
                    label={config.label}
                    heightClass={config.heightClass}
                    delay={0}
                    openNowLabel={copy.openNow}
                    closedNowLabel={copy.closedNow}
                    voteLabel={copy.vote}
                    votedLabel={copy.voted}
                    voteCountLabel={copy.voteCount}
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
                <FeaturedPodiumCard
                  cafe={cafe}
                  initialVoted={votedCafeIds.has(cafe.id) || cafe.hasUserVote}
                  rank={originalRank}
                  label={config.label}
                  heightClass={config.heightClass}
                  delay={displayIdx * 0.08}
                  openNowLabel={copy.openNow}
                  closedNowLabel={copy.closedNow}
                  voteLabel={copy.vote}
                  votedLabel={copy.voted}
                  voteCountLabel={copy.voteCount}
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
