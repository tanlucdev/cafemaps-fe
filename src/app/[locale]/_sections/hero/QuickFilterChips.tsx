"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { QuickFilter } from "./types";

const MAIN_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

type QuickFilterChipsProps = {
  filters: QuickFilter[];
  getLabel: (key: string) => string;
  onFilter: (filter: QuickFilter) => void;
};

export function QuickFilterChips({ filters, getLabel, onFilter }: QuickFilterChipsProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-12%" }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.085, delayChildren: 0.72 } } }}
      className="mt-4 flex w-full max-w-full flex-wrap justify-center gap-2 overflow-visible px-0 sm:max-w-3xl sm:justify-start"
    >
      {filters.map((filter) => (
        <motion.button
          key={filter.labelKey}
          type="button"
          onClick={() => onFilter(filter)}
          variants={{
            hidden: { opacity: 0, y: reduceMotion ? 0 : 12, scale: reduceMotion ? 1 : 0.96 },
            show: { opacity: 1, y: 0, scale: 1 },
          }}
          transition={{ duration: 0.58, ease: MAIN_EASE }}
          whileHover={reduceMotion ? undefined : { y: -2, scale: 1.03 }}
          whileTap={reduceMotion ? undefined : { scale: 0.98 }}
          className={cn(
            "inline-flex max-w-full shrink-0 cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold shadow-[0_10px_24px_rgba(0,0,0,0.12),0_8px_22px_rgba(245,166,58,0.07)] outline-none backdrop-blur-md transition-colors focus-visible:ring-2 focus-visible:ring-[#ffe3b7] focus-visible:ring-offset-2 focus-visible:ring-offset-[#160b05] sm:gap-2 sm:px-3.5 sm:text-sm",
            filter.featured
              ? "border-[#ffe3b7]/34 bg-[#fff1d6]/20 text-[#fff5e6] hover:border-[#ffe3b7]/56 hover:bg-[#fff1d6]/28 hover:shadow-[0_14px_34px_rgba(245,190,104,0.18)]"
              : "border-[#ffe3b7]/24 bg-[#3a2112]/36 text-[#fff0d4]/88 hover:border-[#ffe3b7]/46 hover:bg-[#4a2a16]/44 hover:text-[#fff7e8]",
          )}
        >
          <span className="text-base leading-none sm:text-[17px]" aria-hidden>
            {filter.emoji}
          </span>
          {getLabel(filter.labelKey)}
        </motion.button>
      ))}
    </motion.div>
  );
}
