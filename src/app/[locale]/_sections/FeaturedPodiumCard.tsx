"use client";

import Image from "next/image";
import { MapPin } from "lucide-react";
import Badge from "@/components/ui/Badge";
import { motion } from "framer-motion";
import IntentPrefetchLink from "@/components/cafe/IntentPrefetchLink";
import { AUTH_STORAGE_KEYS } from "@/constants/auth-keys";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { coverObjectPosition } from "@/lib/cover-image";
import { cn } from "@/lib/utils";
import { getCafeOpenStatus } from "@/lib/opening-hours";
import type { Cafe } from "@/types/cafe";
import FeaturedVoteButton from "./FeaturedVoteButton";

interface FeaturedPodiumCardProps {
  cafe: Cafe;
  initialVoted?: boolean;
  rank: number;
  label: string;
  heightClass: string;
  delay: number;
  openNowLabel: string;
  closedNowLabel: string;
  voteLabel: string;
  votedLabel: string;
  voteCountLabel: string;
}

export default function FeaturedPodiumCard({
  cafe,
  initialVoted,
  rank,
  label,
  heightClass,
  delay,
  openNowLabel,
  closedNowLabel,
  voteLabel,
  votedLabel,
  voteCountLabel,
}: FeaturedPodiumCardProps) {
  const reduceMotion = usePrefersReducedMotion();
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
      <IntentPrefetchLink href={`/cafe/${cafe.slug}`} className="block" onClick={saveReturnUrl}>
        <div className={cn("relative overflow-hidden bg-(--background-secondary)", heightClass)}>
          {cafe.coverImage ? (
            <Image
              src={cafe.coverImage}
              alt={cafe.name}
              fill
              sizes="(max-width: 640px) 256px, 33vw"
              className="object-cover transition-transform duration-700 group-hover:scale-[1.045]"
              style={{ objectPosition: coverObjectPosition(cafe) }}
              loading={rank === 1 ? "eager" : "lazy"}
              fetchPriority={rank === 1 ? "high" : undefined}
            />
          ) : (
            <div className="from-accent absolute inset-0 bg-linear-to-br to-(--accent-hover)" />
          )}
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
          <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(25,12,3,0.84)_0%,rgba(45,24,7,0.28)_48%,rgba(255,209,139,0.08)_100%)]" />
          <div className="pointer-events-none absolute right-5 bottom-24 h-16 w-24 rotate-[-14deg] rounded-[50%] border-t border-dashed border-[#ffe3b7]/28" />
          <div className="absolute right-0 bottom-0 left-0 z-20 p-3 pr-28 sm:p-4 sm:pr-28">
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
      </IntentPrefetchLink>
      <FeaturedVoteButton
        cafeId={cafe.id}
        initialCount={cafe.weeklyVoteCount ?? 0}
        initialVoted={initialVoted}
        voteLabel={voteLabel}
        votedLabel={votedLabel}
        countLabel={voteCountLabel}
      />
    </motion.article>
  );
}
