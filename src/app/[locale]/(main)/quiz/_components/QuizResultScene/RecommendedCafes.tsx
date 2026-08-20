"use client";

import Image from "next/image";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowRight, Coffee, Sparkles } from "lucide-react";
import { getQuizMatchCafes } from "@/apis/cafes";
import { Link } from "@/i18n/navigation";
import { formatCafeArea } from "@/lib/cafe-labels";
import { rankCafesForQuiz } from "@/lib/quiz/scoring";
import { formatPrice } from "@/lib/utils";
import type { Cafe } from "@/types/cafe";
import type { QuizMessages } from "@/lib/quiz";
import type { QuizOption, QuizResult } from "@/types/quiz";
import type { ResultLabels } from ".";

export default function RecommendedCafes({
  result,
  labels,
  locale,
  answers,
  messages,
  reduceMotion,
}: {
  result: QuizResult;
  labels: ResultLabels;
  locale: string;
  answers: QuizOption[];
  messages: QuizMessages;
  reduceMotion: boolean;
}) {
  const cafesQuery = useQuery({
    queryKey: ["quiz-match-cafes", locale],
    queryFn: ({ signal }) => getQuizMatchCafes({ limit: 36 }, locale, { signal }),
    staleTime: 30_000,
  });
  const cafes = useMemo(
    () =>
      cafesQuery.data
        ? rankCafesForQuiz(result.profile, cafesQuery.data, messages, answers)
        : result.cafes,
    [answers, cafesQuery.data, messages, result.cafes, result.profile],
  );

  return (
    <section className="mt-6 sm:mt-8">
      <div className="mb-3 flex items-center gap-2 text-sm font-bold text-[var(--foreground)] sm:mb-4">
        <Coffee className="size-4 text-[var(--accent)]" />
        {labels.recommendedCafes}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cafes.map((cafe, index) => (
          <CafeRecommendationCard
            key={cafe.id}
            cafe={cafe}
            index={index}
            locale={locale}
            labels={labels}
            reduceMotion={reduceMotion}
          />
        ))}
        {cafesQuery.isLoading ? <CafeRecommendationSkeleton /> : null}
      </div>
      {!cafesQuery.isLoading && !cafes.length ? (
        <div className="rounded-[8px] border border-dashed border-[#dfbf8f] bg-white/60 p-4 text-sm font-semibold text-[var(--foreground-muted)] dark:bg-white/5">
          {locale === "vi" ? "Chưa có quán phù hợp để gợi ý." : "No matching cafes to recommend yet."}
        </div>
      ) : null}
    </section>
  );
}

function CafeRecommendationSkeleton() {
  return Array.from({ length: 3 }).map((_, index) => (
    <div
      key={index}
      className="h-[21rem] animate-pulse rounded-[8px] border border-[#e3ca9f] bg-white/60 dark:bg-white/5"
    />
  ));
}

function CafeRecommendationCard({
  cafe,
  index,
  locale,
  labels,
  reduceMotion,
}: {
  cafe: Cafe & { matchReason: string };
  index: number;
  locale: string;
  labels: ResultLabels;
  reduceMotion: boolean;
}) {
  return (
    <motion.article
      className="relative overflow-hidden rounded-[8px] border border-[#e3ca9f] bg-white/75 shadow-[0_12px_30px_rgba(88,55,24,0.08)] dark:bg-white/5"
      initial={reduceMotion ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: reduceMotion ? 0 : index * 0.08 }}
    >
      <div className="relative aspect-[4/3] bg-[var(--background-secondary)]">
        {cafe.coverImage || cafe.images[0] ? (
          <Image
            src={cafe.coverImage ?? cafe.images[0]}
            alt={cafe.name}
            fill
            sizes="(min-width: 1024px) 360px, 50vw"
            className="object-cover"
          />
        ) : null}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="line-clamp-1 text-base font-extrabold text-[var(--foreground)]">
              {cafe.name}
            </h2>
            <p className="mt-1 text-xs text-[var(--foreground-muted)]">
              {[
                formatCafeArea(cafe.district, locale),
                formatPrice(cafe.priceMin, cafe.priceMax, locale),
              ]
                .filter(Boolean)
                .join(" • ")}
            </p>
          </div>
          <Sparkles className="mt-1 size-4 shrink-0 text-[#c8842a]" />
        </div>
        <p className="mt-3 min-h-10 text-sm leading-5 text-[var(--foreground-muted)]">
          {cafe.matchReason}
        </p>
        <Link
          href={`/cafe/${cafe.slug}`}
          className="mt-4 inline-flex h-9 items-center gap-2 rounded-full bg-[#2c1a0e] px-4 text-xs font-bold text-[#fff7ea]"
        >
          {labels.viewCafe}
          <ArrowRight className="size-3.5" />
        </Link>
      </div>
    </motion.article>
  );
}
