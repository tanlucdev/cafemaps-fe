"use client";

import { useState } from "react";
import { Loader2, Navigation } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CafeFilter } from "@/types/cafe";

interface NearMeButtonProps {
  filter: CafeFilter;
  onChange: (filter: CafeFilter) => void;
}

export default function NearMeButton({ filter, onChange }: NearMeButtonProps) {
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
      title={error ? "Không thể lấy vị trí. Vui lòng kiểm tra quyền truy cập." : undefined}
      className={cn(
        "inline-flex flex-none cursor-pointer items-center gap-1.5 rounded-full border px-3 py-2 text-xs font-medium whitespace-nowrap transition-all duration-150 active:scale-95",
        filter.nearMe
          ? "border-accent text-accent bg-[rgba(201,135,12,0.13)]"
          : error
            ? "border-red-300 text-red-500"
            : "border-border hover:border-accent hover:text-accent bg-white text-(--foreground-muted) dark:bg-[#1C1210]",
        loading && "cursor-not-allowed opacity-60",
      )}
    >
      {loading ? <Loader2 size={12} className="animate-spin" /> : <Navigation size={12} />}
      Gần tôi
    </button>
  );
}
