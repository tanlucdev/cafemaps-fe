import type { ReactNode } from "react";
import type { useTranslations } from "next-intl";
import { MapPin } from "lucide-react";
import IntentPrefetchLink from "@/components/cafe/IntentPrefetchLink";
import CafeStatsBadge from "@/components/cafe/CafeStatsBadge";
import { getCafeTagTranslation, VIBE_TRANSLATION_KEYS } from "@/lib/cafe-labels";
import { VIBE_TAG_CLASSES } from "@/components/cafe/shared";
import { cn } from "@/lib/utils";
import type { Cafe } from "@/types/cafe";

export default function CardContent({ cafe, locale, href, saveReturnUrl, mobileCompact, isCinematic, ratingBadge, openStatus, locationText, tags, tCafe, tFilters }: {
 cafe: Cafe; locale: string; href: string; saveReturnUrl: () => void; mobileCompact: boolean; isCinematic: boolean; ratingBadge: ReactNode; openStatus: boolean | null; locationText: string; tags: string[]; tCafe: ReturnType<typeof useTranslations<"cafe">>; tFilters: ReturnType<typeof useTranslations<"filters">>;
}) {
 return (
      <IntentPrefetchLink
        href={href}
        className="block flex-1 outline-none focus-visible:ring-2 focus-visible:ring-[#ffe3b7]"
        onClick={saveReturnUrl}
      >
        <div
          className={cn(
            "flex flex-col gap-2",
            mobileCompact ? "px-2.5 pt-2.5 pb-4 sm:px-3 sm:pt-3 sm:pb-4 md:p-4" : "p-4",
          )}
        >
          {/* Name + rating */}
          <div
            className={cn(
              "flex items-start justify-between gap-2",
              mobileCompact && "block md:flex",
            )}
          >
            <h3
              className={cn(
                mobileCompact
                  ? "line-clamp-2 h-10 text-[13px] leading-snug font-bold sm:text-[14px] md:line-clamp-1 md:h-auto"
                  : "line-clamp-1 text-[14px] leading-snug font-bold",
                isCinematic ? "text-[#fff7e8]" : "text-[var(--foreground)]",
              )}
            >
              {cafe.name}
            </h3>
            <span className={cn(mobileCompact ? "hidden md:inline-flex" : "inline-flex")}>
              {ratingBadge}
            </span>
          </div>

          {/* Open status + location */}
          <div
            className={cn(
              "flex min-w-0 items-center gap-1.5 text-xs",
              mobileCompact && "h-5 text-[11px] md:h-auto md:text-xs",
            )}
          >
            {mobileCompact && <span className="inline-flex md:hidden">{ratingBadge}</span>}
            {openStatus !== null && (
              <span
                className={cn(
                  "inline-flex shrink-0 items-center gap-1 font-semibold",
                  mobileCompact && "ml-auto md:ml-0",
                  openStatus ? "text-[var(--status-open)]" : "text-[var(--status-closed)]",
                )}
              >
                <span className="relative flex h-1.5 w-1.5">
                  {openStatus && (
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--status-open)] opacity-75" />
                  )}
                  <span
                    className={cn(
                      "relative inline-flex h-1.5 w-1.5 rounded-full",
                      openStatus ? "bg-[var(--status-open)]" : "bg-[var(--status-closed)]",
                    )}
                  />
                </span>
                {openStatus ? tCafe("openNow") : tCafe("closedNow")}
              </span>
            )}
            {locationText && !mobileCompact && (
              <>
                {openStatus !== null && !mobileCompact && (
                  <span className={isCinematic ? "text-[#fff0d4]/26" : "text-[#C9C0B3]"}>·</span>
                )}
                <span
                  className={cn(
                    "flex min-w-0 items-center gap-0.5",
                    isCinematic ? "text-[#fff0d4]/62" : "text-[var(--foreground-muted)]",
                  )}
                >
                  <MapPin size={11} className="shrink-0 text-[var(--accent)]" />
                  <span className="truncate">{locationText}</span>
                </span>
              </>
            )}
          </div>

          {(tags.length > 0 || cafe.viewCount !== undefined) && (
            <div
              className={cn(
                "flex flex-wrap items-center gap-1.5",
                mobileCompact && "hidden md:flex",
              )}
            >
              {tags.map((tag) => {
                const translation = getCafeTagTranslation(tag);
                const classKey = VIBE_TRANSLATION_KEYS[tag] ?? tag;
                const label = translation
                  ? tFilters(
                      `${translation.group}.${translation.key}` as Parameters<typeof tFilters>[0],
                    )
                  : tag;
                return (
                  <span
                    key={tag}
                    className={cn(
                      "rounded-full px-2.5 py-0.5 text-[11px] font-medium",
                      isCinematic
                        ? "border border-[#ffe3b7]/12 bg-[#fff1d6]/9 text-[#fff0d4]/78"
                        : (VIBE_TAG_CLASSES[classKey] ??
                            "bg-[#EDE5DB] text-[#6B5B3E] dark:bg-[#2A211B] dark:text-[#D9C4B2]"),
                    )}
                  >
                    {label}
                  </span>
                );
              })}
              <span className="ml-auto">
                <CafeStatsBadge
                  cafeId={cafe.id}
                  viewCount={cafe.viewCount}
                  locale={locale}
                  variant={isCinematic ? "cinematic" : "default"}
                />
              </span>
            </div>
          )}
        </div>
      </IntentPrefetchLink>


 );
}
