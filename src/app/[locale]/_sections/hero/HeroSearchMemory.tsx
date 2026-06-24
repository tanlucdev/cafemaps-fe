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

export function HeroSearchMemory({ lastSearch, onResume, onClear }: HeroSearchMemoryProps) {
  const t = useTranslations("hero");

  if (!lastSearch) {
    return (
      <div className="mt-2 mb-3 inline-flex items-center gap-2 rounded-full border border-[#ffe3b7]/28 bg-[#3a2112]/42 px-4 py-2 text-xs font-bold text-[#fff0d4] shadow-[0_8px_20px_rgba(0,0,0,0.12),0_6px_18px_rgba(245,166,58,0.07)] backdrop-blur-md">
        <Coffee size={14} className="text-[#ffd18c]" />
        <span>{t("badge")}</span>
      </div>
    );
  }

  return (
    <div className="mb-3 flex max-w-full items-center gap-2 rounded-full border border-[#ffe3b7]/28 bg-[#3a2112]/48 px-3 py-2 text-left text-sm text-[#fff0d4]/78 shadow-[0_8px_22px_rgba(0,0,0,0.12),0_6px_18px_rgba(245,166,58,0.07)] backdrop-blur-md">
      <Search size={14} className="shrink-0 text-[#ffd18c]" />
      <span className="hidden sm:inline">{t("resumePrefix")}</span>
      <span className="max-w-[160px] truncate font-semibold text-[#fff7e8] sm:max-w-[280px]">
        {getLastSearchLabel(lastSearch, {
          openNow: t("lastSearch.openNow"),
          nearMe: t("lastSearch.nearMe"),
          fallback: t("lastSearch.fallback"),
        })}
      </span>
      <button
        type="button"
        onClick={onResume}
        className="cursor-pointer rounded-full bg-[#fff0d2] px-3 py-1 text-xs font-bold text-[#201006] transition-colors hover:bg-[#fff7e8]"
      >
        {t("resumeView")}
      </button>
      <button
        type="button"
        onClick={onClear}
        className="grid h-6 w-6 cursor-pointer place-items-center rounded-full text-[#fff0d4]/62 transition-colors hover:bg-white/10 hover:text-[#fff7e8]"
        aria-label={t("close")}
      >
        ×
      </button>
    </div>
  );
}
