"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Loader2, Navigation } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CafeFilter } from "@/types/cafe";

interface NearMeButtonProps {
  filter: CafeFilter;
  onChange: (filter: CafeFilter) => void;
}

export default function NearMeButton({ filter, onChange }: NearMeButtonProps) {
  const tHero = useTranslations("hero");
  const tNearby = useTranslations("nearby");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  function handleClick() {
    if (filter.nearMe) {
      onChange({ ...filter, nearMe: false, lat: undefined, lng: undefined, radiusKm: undefined });
      return;
    }
    if (!navigator.geolocation) return;
    setLoading(true);
    setError(false);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLoading(false);
        onChange({
          ...filter,
          nearMe: true,
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          radiusKm: filter.radiusKm ?? 2,
        });
      },
      () => {
        setLoading(false);
        setError(true);
        setTimeout(() => setError(false), 3000);
      },
      { timeout: 10000, maximumAge: 60000 },
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      title={error ? tNearby("locationError") : undefined}
      className={cn(
        "inline-flex flex-none cursor-pointer items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-[13px] font-bold whitespace-nowrap shadow-[var(--shadow-sm)] backdrop-blur-md transition-all duration-150 hover:-translate-y-px hover:scale-[1.02] focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] active:scale-95",
        filter.nearMe
          ? "border-[var(--accent)] bg-[var(--accent-light)] text-[var(--accent)] shadow-[0_10px_24px_rgba(200,132,42,0.14)]"
          : error
            ? "border-red-300 text-red-500"
            : "border-[var(--border)] bg-white/62 text-[var(--foreground-muted)] hover:border-[var(--accent)] hover:bg-[var(--accent-light)] hover:text-[var(--accent)] dark:bg-[var(--card)]",
        loading && "cursor-not-allowed opacity-60",
      )}
    >
      {loading ? <Loader2 size={12} className="animate-spin" /> : <Navigation size={12} />}
      {tHero("quickFilters.nearMe")}
    </button>
  );
}
