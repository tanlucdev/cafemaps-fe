"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Loader2, Navigation } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { CafeFilter } from "@/types/cafe";

interface NearMeButtonProps {
  filter: CafeFilter;
  onChange: (filter: CafeFilter) => void;
  className?: string;
}
export default function NearMeButton({ filter, onChange, className }: NearMeButtonProps) {
  const tHero = useTranslations("hero");
  const tNearby = useTranslations("nearby");
  const [loading, setLoading] = useState(false);

  function handleClick() {
    if (filter.nearMe) {
      onChange({ ...filter, nearMe: false, lat: undefined, lng: undefined, radiusKm: undefined });
      return;
    }
    if (!navigator.geolocation) {
      toast.error(tNearby("noSupport"));
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        try {
          onChange({
            ...filter,
            nearMe: true,
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            radiusKm: filter.radiusKm ?? 2,
          });
        } finally {
          setLoading(false);
        }
      },
      () => {
        try {
          toast.error(tNearby("locationError"));
        } finally {
          setLoading(false);
        }
      },
      { timeout: 10000, maximumAge: 60000 },
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      aria-pressed={Boolean(filter.nearMe)}
      className={cn(
        "inline-flex flex-none cursor-pointer items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-[13px] font-bold whitespace-nowrap shadow-[var(--shadow-sm)] backdrop-blur-md transition-all duration-150 hover:-translate-y-px hover:scale-[1.02] focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] active:scale-95",
        filter.nearMe
          ? "border-[var(--accent)] bg-[var(--accent-light)] text-[var(--accent)] shadow-[0_10px_24px_rgba(200,132,42,0.14)]"
          : "border-[var(--border)] bg-white/62 text-[var(--foreground-muted)] hover:border-[var(--accent)] hover:bg-[var(--accent-light)] hover:text-[var(--accent)] dark:bg-[var(--card)]",
        loading && "cursor-not-allowed opacity-60",
        className,
      )}
    >
      {loading ? <Loader2 size={12} className="animate-spin" /> : <Navigation size={12} />}
      <span className="truncate">{tHero("quickFilters.nearMe")}</span>
    </button>
  );
}
