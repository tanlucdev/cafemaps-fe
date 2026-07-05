"use client";

import { cn } from "@/lib/utils";
import type { QuickFilter } from "./types";

type QuickFilterChipsProps = {
  filters: QuickFilter[];
  getLabel: (key: string) => string;
  onFilter: (filter: QuickFilter) => void;
};

export function QuickFilterChips({ filters, getLabel, onFilter }: QuickFilterChipsProps) {
  return (
    <div className="mt-4 flex w-full max-w-full flex-wrap justify-start gap-2 overflow-visible px-0 md:max-w-5xl lg:flex-nowrap">
      {filters.map((filter) => (
        <button
          key={filter.labelKey}
          type="button"
          onClick={() => onFilter(filter)}
          className={cn(
            "inline-flex max-w-full shrink-0 cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold shadow-[0_10px_24px_rgba(0,0,0,0.12),0_8px_22px_rgba(245,166,58,0.07)] backdrop-blur-md transition-[background-color,border-color,color,box-shadow,transform] duration-200 outline-none hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-[#ffe3b7] focus-visible:ring-offset-2 focus-visible:ring-offset-[#160b05] active:translate-y-0 motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:gap-2 sm:px-3.5 sm:text-sm",
            filter.featured
              ? "border-[#ffe3b7]/34 bg-[#fff1d6]/20 text-[#fff5e6] hover:border-[#ffe3b7]/56 hover:bg-[#fff1d6]/28 hover:shadow-[0_14px_34px_rgba(245,190,104,0.18)]"
              : "border-[#ffe3b7]/24 bg-[#3a2112]/36 text-[#fff0d4]/88 hover:border-[#ffe3b7]/46 hover:bg-[#4a2a16]/44 hover:text-[#fff7e8]",
          )}
        >
          <span className="text-base leading-none sm:text-[17px]" aria-hidden>
            {filter.emoji}
          </span>
          {getLabel(filter.labelKey)}
        </button>
      ))}
    </div>
  );
}
