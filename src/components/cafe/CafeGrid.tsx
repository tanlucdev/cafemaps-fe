"use client";

import CafeCard from "./CafeCard";
import { CafeCardSkeleton } from "@/components/ui/Skeleton";
import type { Cafe } from "@/types/cafe";
import { useTranslations } from "next-intl";

interface CafeGridProps {
  cafes: Cafe[];
  locale: string;
  loading?: boolean;
  animationType?: "slide" | "fade";
  desktopColumns?: "two" | "three";
  variant?: "default" | "cinematic";
  eagerFirstImage?: boolean;
  mobileCompact?: boolean;
}

export default function CafeGrid({
  cafes,
  locale,
  loading = false,
  animationType = "slide",
  desktopColumns = "three",
  variant = "default",
  eagerFirstImage = false,
  mobileCompact = false,
}: CafeGridProps) {
  const t = useTranslations("search");

  if (loading) {
    return (
      <div className={mobileCompact ? "grid grid-cols-2 gap-2 md:grid-cols-2 md:gap-6 xl:grid-cols-3" : "grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3"}>
        {Array.from({ length: 8 }).map((_, i) => (
          <CafeCardSkeleton key={i} mobileCompact={mobileCompact} />
        ))}
      </div>
    );
  }

  if (cafes.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="mb-3 text-4xl">☕</p>
        <p className="text-sm text-[var(--foreground-muted)]">{t("noResults")}</p>
      </div>
    );
  }

  return (
    <div
      className={[
        mobileCompact
          ? "grid w-full grid-cols-2 gap-2 md:grid-cols-2 md:gap-6 lg:gap-8"
          : "grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8",
        desktopColumns === "two" ? "xl:grid-cols-2" : "xl:grid-cols-3",
      ].join(" ")}
    >
      {cafes.map((cafe, i) => (
        <CafeCard
          key={cafe.id}
          cafe={cafe}
          locale={locale}
          index={i}
          animationType={animationType}
          variant={variant}
          imageEager={eagerFirstImage && i === 0}
          mobileCompact={mobileCompact}
        />
      ))}
    </div>
  );
}
