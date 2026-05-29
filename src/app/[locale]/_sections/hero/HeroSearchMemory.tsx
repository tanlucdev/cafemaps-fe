"use client";

import { Coffee, Search } from "lucide-react";
import { useTranslations } from "next-intl";
import type { LastSearchState } from "@/lib/search-state";
import { getLastSearchLabel } from "./search-utils";

type HeroSearchMemoryProps = {
  lastSearch: LastSearchState | null;
  onResume: () => void;
  onClear: () => void;
};

export function HeroSearchMemory({
  lastSearch,
  onResume,
  onClear,
}: HeroSearchMemoryProps) {
  const t = useTranslations("hero");

  if (!lastSearch) {
    return (
      <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#d7b982] bg-[#fff8ee]/94 px-4 py-2 text-xs font-bold text-[#3f2816] shadow-[0_8px_22px_rgba(44,26,14,0.16)] backdrop-blur">
        <Coffee size={14} className="text-[#c8842a]" />
        <span>{t("badge")}</span>
      </div>
    );
  }

  return (
    <div className="mb-5 flex max-w-full items-center gap-2 rounded-full border border-[#e0caa9] bg-[#fff8ee]/88 px-3 py-2 text-left text-sm text-[#5f442c] shadow-[0_8px_24px_rgba(44,26,14,0.12)] backdrop-blur">
      <Search size={14} className="shrink-0 text-[#c8842a]" />
      <span className="hidden sm:inline">{t("resumePrefix")}</span>
      <span className="max-w-[160px] truncate font-semibold text-[#2c1a0e] sm:max-w-[280px]">
        {getLastSearchLabel(lastSearch, {
          openNow: t("lastSearch.openNow"),
          nearMe: t("lastSearch.nearMe"),
          fallback: t("lastSearch.fallback"),
        })}
      </span>
      <button
        type="button"
        onClick={onResume}
        className="cursor-pointer rounded-full bg-[#c8842a] px-3 py-1 text-xs font-semibold text-white transition-colors hover:bg-[#a86d1e]"
      >
        {t("resumeView")}
      </button>
      <button
        type="button"
        onClick={onClear}
        className="grid h-6 w-6 cursor-pointer place-items-center rounded-full text-[#8c6d4f] transition-colors hover:bg-[#f5edd8] hover:text-[#2c1a0e]"
        aria-label={t("close")}
      >
        ×
      </button>
    </div>
  );
}
