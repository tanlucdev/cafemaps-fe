"use client";

import { motion } from "framer-motion";
import { CalendarPlus, ChevronLeft, Share2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { featureFlags } from "@/lib/feature-flags";

export default function CafeDetailActions({ cafeId, locale, reduceMotion, onBack, onShare }: {
  cafeId: string;
  locale: string;
  reduceMotion: boolean;
  onBack: () => void;
  onShare: () => void;
}) {
  const t = useTranslations("cafe");
  const tc = useTranslations("common");
  const meetupLabel = locale === "en" ? "Plan coffee here" : "Tạo kèo tại quán này";
  return (
    <>
        <motion.button
          onClick={onBack}
          whileHover={reduceMotion ? undefined : { y: -2, scale: 1.02 }}
          whileTap={reduceMotion ? undefined : { scale: 0.96 }}
          className="inline-flex min-h-11 shrink-0 cursor-pointer items-center gap-1.5 rounded-full border border-[var(--border)] bg-white/62 px-3 py-2 text-sm font-bold whitespace-nowrap text-[var(--foreground-muted)] shadow-[var(--shadow-sm)] backdrop-blur-md transition-all hover:-translate-y-px hover:border-[var(--accent)] hover:bg-[var(--accent-light)] hover:text-[var(--accent-hover)] focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] dark:bg-[var(--card)]/72"
        >
          <ChevronLeft size={16} className="shrink-0" aria-hidden="true" />
          {tc("back")}
        </motion.button>
        <div className="flex min-w-0 max-w-full flex-wrap items-center justify-end gap-2">
          {featureFlags.coffeeMeetupsEnabled && (
            <Link href={`/coffee-meetups/new?cafeId=${encodeURIComponent(cafeId)}`} aria-label={meetupLabel} className="inline-flex min-h-11 shrink-0 cursor-pointer items-center gap-1.5 rounded-full border border-[var(--border)] bg-white/62 px-3 py-2 text-sm font-bold whitespace-nowrap text-[var(--foreground-muted)] shadow-[var(--shadow-sm)] backdrop-blur-md transition-all hover:-translate-y-px hover:border-[var(--accent)] hover:bg-[var(--accent-light)] hover:text-[var(--accent-hover)] focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] dark:bg-[var(--card)]/72">
              <CalendarPlus size={16} className="shrink-0" aria-hidden="true" />
              <span className="sm:hidden">{locale === "en" ? "Plan coffee" : "Tạo kèo"}</span>
              <span className="hidden sm:inline">{meetupLabel}</span>
            </Link>
          )}
          <motion.button
            onClick={onShare}
            whileHover={reduceMotion ? undefined : { y: -2, scale: 1.02 }}
            whileTap={reduceMotion ? undefined : { scale: 0.96 }}
            className="inline-flex min-h-11 shrink-0 cursor-pointer items-center gap-1.5 rounded-full border border-[var(--border)] bg-white/62 px-3 py-2 text-sm font-bold whitespace-nowrap text-[var(--foreground-muted)] shadow-[var(--shadow-sm)] backdrop-blur-md transition-all hover:-translate-y-px hover:border-[var(--accent)] hover:bg-[var(--accent-light)] hover:text-[var(--accent-hover)] focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] dark:bg-[var(--card)]/72"
          >
            <Share2 size={16} className="shrink-0" aria-hidden="true" />
            {t("share")}
          </motion.button>
        </div>
    </>
  );
}
