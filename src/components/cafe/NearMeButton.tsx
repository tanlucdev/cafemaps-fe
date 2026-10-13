"use client";

import { useTranslations } from "next-intl";
import { Loader2, Navigation } from "lucide-react";
import { cn } from "@/lib/utils";

interface NearMeButtonProps {
  nearMe: boolean;
  loading: boolean;
  onClick: () => void;
  className?: string;
}
export default function NearMeButton({ nearMe, loading, onClick, className }: NearMeButtonProps) {
  const tHero = useTranslations("hero");

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={nearMe}
      aria-busy={loading}
      className={cn(
        "inline-flex flex-none cursor-pointer items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-[13px] font-bold whitespace-nowrap shadow-[var(--shadow-sm)] backdrop-blur-md transition-all duration-150 hover:-translate-y-px hover:scale-[1.02] focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] active:scale-95",
        nearMe
          ? "border-[var(--accent)] bg-[var(--accent-light)] text-[var(--accent)] shadow-[0_10px_24px_rgba(200,132,42,0.14)]"
          : "border-[var(--border)] bg-white/62 text-[var(--foreground-muted)] hover:border-[var(--accent)] hover:bg-[var(--accent-light)] hover:text-[var(--accent)] dark:bg-[var(--card)]",
        loading && "opacity-60",
        className,
      )}
    >
      {loading ? <Loader2 size={12} className="animate-spin" /> : <Navigation size={12} />}
      <span className="truncate">{tHero("quickFilters.nearMe")}</span>
    </button>
  );
}
