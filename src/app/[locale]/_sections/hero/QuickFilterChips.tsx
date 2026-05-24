import { cn } from "@/lib/utils";
import type { QuickFilter } from "./types";

type QuickFilterChipsProps = {
  filters: QuickFilter[];
  isVi: boolean;
  onFilter: (filter: QuickFilter) => void;
};

export function QuickFilterChips({ filters, isVi, onFilter }: QuickFilterChipsProps) {
  return (
    <div className="mt-6 flex w-full max-w-[22rem] flex-wrap justify-center gap-2 overflow-visible px-1 sm:max-w-3xl">
      {filters.map((filter) => (
        <button
          key={filter.label.en}
          type="button"
          onClick={() => onFilter(filter)}
          className={cn(
            "inline-flex max-w-full shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all hover:-translate-y-px hover:shadow-[0_8px_22px_rgba(44,26,14,0.1)]",
            filter.featured
              ? "border-[#bfe6cf] bg-[#eef9f0] text-[#26814a]"
              : "border-[#e0caa9] bg-[#fff8ee]/86 text-[#5f442c] backdrop-blur hover:border-[#c8842a] hover:bg-white hover:text-[#2c1a0e]",
          )}
        >
          <span className="text-base leading-none sm:text-[17px]" aria-hidden>
            {filter.emoji}
          </span>
          {filter.label[isVi ? "vi" : "en"]}
        </button>
      ))}
    </div>
  );
}
