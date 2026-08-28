"use client";

import { Eye } from "lucide-react";
import { useEffect, useState } from "react";
import { CAFE_VIEW_COUNT_OVERRIDE_EVENT, getCafeViewCountOverride } from "@/apis/cafes/view-count-overrides";
import { cn } from "@/lib/utils";

interface CafeStatsBadgeProps {
  cafeId?: string;
  viewCount?: number | null;
  locale: string;
  variant?: "default" | "cinematic" | "detail";
}

export default function CafeStatsBadge({
  cafeId,
  viewCount,
  locale,
  variant = "default",
}: CafeStatsBadgeProps) {
  const [count, setCount] = useState(viewCount ?? 0);
  const label = locale.toLowerCase().startsWith("en") ? "views" : "lượt xem";

  useEffect(() => {
    if (!cafeId) {
      setCount(viewCount ?? 0);
      return;
    }
    const update = () => setCount(getCafeViewCountOverride(cafeId) ?? viewCount ?? 0);
    window.addEventListener(CAFE_VIEW_COUNT_OVERRIDE_EVENT, update);
    window.addEventListener("storage", update);
    update();
    return () => {
      window.removeEventListener(CAFE_VIEW_COUNT_OVERRIDE_EVENT, update);
      window.removeEventListener("storage", update);
    };
  }, [cafeId, viewCount]);

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1 rounded-full font-bold tabular-nums",
        variant === "detail"
          ? "border border-[#ead7bd]/42 bg-[#fff6e8]/36 px-2.5 py-1 text-[11.5px] text-[#7a6043] shadow-none dark:border-[#ffe3b7]/10 dark:bg-[#fff1d6]/6 dark:text-[#d9c4b2]/86"
          : "px-2 py-0.5 text-[11px]",
        variant === "cinematic"
          ? "border border-[#ffe3b7]/18 bg-[#fff1d6]/12 text-[#fff0d4]/78"
          : variant === "default" && "bg-[#F3E7D5] text-[#7A6043] dark:bg-[#2A211B] dark:text-[#D9C4B2]",
      )}
    >
      <Eye size={variant === "detail" ? 13 : 11} />
      {new Intl.NumberFormat(locale, { notation: count >= 10000 ? "compact" : "standard" }).format(
        count,
      )}{" "}
      {label}
    </span>
  );
}
