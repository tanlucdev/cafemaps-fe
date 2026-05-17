"use client";

import { useEffect, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import {
  AirVent,
  Bookmark,
  Car,
  Clock,
  Coffee,
  MapPin,
  Navigation,
  PawPrint,
  Star,
  TreePine,
  Wifi,
  Zap,
} from "lucide-react";
import { useTranslations } from "next-intl";
import Badge from "@/components/ui/Badge";
import { formatPrice } from "@/lib/utils";
import { getLastSearchState } from "@/lib/search-state";
import type { Cafe } from "@/types/cafe";

interface CafeDetailInfoProps {
  cafe: Cafe;
  locale: string;
  saved: boolean;
  loadingSave: boolean;
  mapsUrl: string;
  saveLabel: string;
  directionsLabel: string;
  onSave: () => void | Promise<void>;
}

const AMENITY_ICONS: Record<string, ReactNode> = {
  wifi: <Wifi size={14} />,
  "điều hoà": <AirVent size={14} />,
  "đậu xe": <Car size={14} />,
  "ngoài trời": <TreePine size={14} />,
  "ổ cắm": <Zap size={14} />,
  "thú cưng": <PawPrint size={14} />,
};

const GOOD_FOR_RULES = [
  { terms: ["chill một mình", "một mình", "chill"], emoji: "☕", label: "Chill một mình" },
  { terms: ["học tập", "đọc sách", "yên tĩnh"], emoji: "📚", label: "Đọc sách" },
  { terms: ["làm việc", "remote", "wifi"], emoji: "💻", label: "Làm việc remote" },
  { terms: ["ổ cắm", "cắm máy"], emoji: "🔌", label: "Cắm máy ngồi lâu" },
  { terms: ["jazz", "acoustic", "nhạc"], emoji: "🎵", label: "Nghe nhạc" },
  { terms: ["thú cưng", "pet"], emoji: "🐶", label: "Dẫn thú cưng" },
  { terms: ["hẹn hò", "lãng mạn"], emoji: "🕯️", label: "Hẹn hò nhẹ nhàng" },
  { terms: ["gặp bạn bè", "họp nhóm", "nhộn nhịp"], emoji: "💬", label: "Gặp bạn bè" },
  { terms: ["thiên nhiên", "ngoài trời", "sân vườn"], emoji: "🌿", label: "Ngồi ngoài trời" },
  { terms: ["sáng tạo"], emoji: "✍️", label: "Viết linh tinh" },
];

const FALLBACK_GOOD_FOR = [
  { emoji: "☕", label: "Chill một mình" },
  { emoji: "📚", label: "Đọc sách" },
  { emoji: "💻", label: "Làm việc remote" },
];

type GoodForItem = {
  emoji: string;
  label: string;
};

type CafeWithRating = Cafe & {
  rating?: number | null;
  averageRating?: number | null;
  curatedRating?: number | null;
};

function formatTime(time: string | null | undefined): string {
  if (!time) return "";

  const hhMm = time.match(/^(\d{1,2}):(\d{2})/);
  if (hhMm) return `${hhMm[1].padStart(2, "0")}:${hhMm[2]}`;

  const iso = time.match(/T(\d{2}):(\d{2})/);
  if (iso) return `${iso[1]}:${iso[2]}`;
  return "";
}

function parseTimeMinutes(time: string | null | undefined): number | null {
  const formatted = formatTime(time);
  if (!formatted) return null;
  const [hours, minutes] = formatted.split(":").map(Number);
  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return null;
  return hours * 60 + minutes;
}

function isOpenNow(openingTime: string | null | undefined, closingTime: string | null | undefined) {
  const openMins = parseTimeMinutes(openingTime);
  const closeMins = parseTimeMinutes(closingTime);
  if (openMins == null || closeMins == null) return true;

  const now = new Date();
  const nowMins = now.getHours() * 60 + now.getMinutes();
  if (closeMins < openMins) return nowMins >= openMins || nowMins < closeMins;
  return nowMins >= openMins && nowMins < closeMins;
}

function formatDistance(distanceKm?: number | null): string {
  if (distanceKm == null) return "";
  if (distanceKm < 1) return `${Math.max(1, Math.round(distanceKm * 1000))}m`;
  return `${distanceKm < 10 ? distanceKm.toFixed(1) : Math.round(distanceKm)} km`;
}

function calculateDistanceKm(
  fromLat: number,
  fromLng: number,
  toLat: number,
  toLng: number,
): number {
  const earthRadiusKm = 6371;
  const toRadians = (degree: number) => (degree * Math.PI) / 180;
  const dLat = toRadians(toLat - fromLat);
  const dLng = toRadians(toLng - fromLng);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(fromLat)) * Math.cos(toRadians(toLat)) * Math.sin(dLng / 2) ** 2;
  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function getCafeRating(cafe: Cafe): number {
  const ratingCafe = cafe as CafeWithRating;
  const rating = ratingCafe.rating ?? ratingCafe.averageRating ?? ratingCafe.curatedRating;
  if (typeof rating === "number" && Number.isFinite(rating) && rating > 0) {
    return Math.min(5, Math.max(1, rating));
  }

  const seed = Array.from(cafe.slug).reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return 4.5 + (seed % 5) * 0.1;
}

function getGoodForItems(cafe: Cafe): GoodForItem[] {
  const source = [
    ...cafe.purposes,
    ...cafe.vibes,
    ...cafe.amenities,
    cafe.oneLiner ?? "",
    cafe.description ?? "",
  ]
    .join(" ")
    .toLowerCase();

  const items: GoodForItem[] = [];
  for (const rule of GOOD_FOR_RULES) {
    if (
      rule.terms.some((term) => source.includes(term)) &&
      !items.some((i) => i.label === rule.label)
    ) {
      items.push({ emoji: rule.emoji, label: rule.label });
    }
  }

  return (items.length > 0 ? items : FALLBACK_GOOD_FOR).slice(0, 5);
}

function getAmenityIcon(amenity: string) {
  const key = Object.keys(AMENITY_ICONS).find((k) => amenity.toLowerCase().includes(k));
  return key ? AMENITY_ICONS[key] : <Wifi size={14} />;
}

function RatingStars({ rating }: { rating: number }) {
  const roundedRating = Math.round(rating);

  return (
    <span className="inline-flex items-center gap-1.5" aria-label={`${rating.toFixed(1)} sao`}>
      <span className="inline-flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={14}
            className={
              star <= roundedRating
                ? "fill-[#F0A830] text-[#F0A830]"
                : "fill-[#E0D3C0] text-[#E0D3C0] dark:fill-[#4A3A2C] dark:text-[#4A3A2C]"
            }
          />
        ))}
      </span>
      <span className="text-foreground text-sm font-bold">{rating.toFixed(1)}</span>
    </span>
  );
}

function DetailDivider() {
  return <div className="my-7 h-px bg-[var(--border-light,#ECE4D6)]" />;
}

function DetailActions({
  saved,
  loadingSave,
  saveLabel,
  directionsLabel,
  mapsUrl,
  onSave,
}: Omit<CafeDetailInfoProps, "cafe" | "locale">) {
  return (
    <div className="flex w-full gap-3">
      <button
        onClick={onSave}
        disabled={loadingSave}
        aria-label={saved ? "Bỏ lưu" : "Lưu quán"}
        className={`flex h-11 w-32 shrink-0 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-2xl border px-5 text-sm font-semibold transition-all duration-200 disabled:cursor-not-allowed sm:w-32 ${
          saved
            ? "border-amber-500 bg-amber-500 text-white shadow-[0_2px_8px_rgba(245,158,11,0.35)]"
            : "border-border hover:border-accent hover:text-accent text-(--foreground-muted)"
        }`}
      >
        <Bookmark size={15} className={saved ? "fill-white" : ""} />
        {saveLabel}
      </button>
      <a
        href={mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-accent flex h-11 min-w-0 flex-1 cursor-pointer items-center justify-center gap-2 rounded-2xl px-4 text-sm font-bold text-white transition-colors hover:bg-(--accent-hover)"
      >
        <Navigation size={16} className="shrink-0" />
        <span className="truncate">{directionsLabel}</span>
      </a>
    </div>
  );
}

export default function CafeDetailInfo({
  cafe,
  locale,
  saved,
  loadingSave,
  mapsUrl,
  saveLabel,
  directionsLabel,
  onSave,
}: CafeDetailInfoProps) {
  const t = useTranslations("cafe");
  const [resolvedDistanceKm, setResolvedDistanceKm] = useState<number | null>(
    cafe.distanceKm ?? null,
  );

  const hours = [formatTime(cafe.openingTime), formatTime(cafe.closingTime)]
    .filter(Boolean)
    .join(" – ");
  const price = formatPrice(cafe.priceMin, cafe.priceMax);
  const distance = formatDistance(resolvedDistanceKm);
  const rating = getCafeRating(cafe);
  const openNow = isOpenNow(cafe.openingTime, cafe.closingTime);
  const aboutText = cafe.description ?? cafe.oneLiner;
  const goodForItems = getGoodForItems(cafe);
  const idealForLabel = locale === "vi" ? "Lý tưởng cho" : "Good for";
  const distanceLabel = locale === "vi" ? `Cách bạn ${distance}` : `${distance} away`;

  useEffect(() => {
    if (cafe.distanceKm != null) {
      setResolvedDistanceKm(cafe.distanceKm);
      return;
    }

    const lastSearch = getLastSearchState();
    const fromLat = lastSearch?.filter.lat;
    const fromLng = lastSearch?.filter.lng;
    if (fromLat == null || fromLng == null || cafe.lat == null || cafe.lng == null) {
      setResolvedDistanceKm(null);
      return;
    }

    setResolvedDistanceKm(calculateDistanceKm(fromLat, fromLng, cafe.lat, cafe.lng));
  }, [cafe.distanceKm, cafe.lat, cafe.lng]);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mx-auto max-w-[680px] space-y-5 pt-2"
      >
        <h1 className="text-foreground text-[32px] leading-[1.18] font-[var(--font-lora)] font-semibold italic sm:text-[38px]">
          {cafe.name}
        </h1>

        <div className="flex flex-wrap items-center gap-3">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${
              openNow
                ? "bg-[#E6F5EE] text-[#166638] dark:bg-[#17351F] dark:text-[#7DC89E]"
                : "bg-[#F6E6E1] text-[#8A3C2F] dark:bg-[#3A211E] dark:text-[#E5A092]"
            }`}
          >
            <span className="relative flex h-2 w-2">
              {openNow && (
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-60" />
              )}
              <span className="relative inline-flex h-2 w-2 rounded-full bg-current" />
            </span>
            {openNow ? t("openNow") : t("closedNow")}
          </span>
          <RatingStars rating={rating} />
        </div>

        <div className="flex flex-col gap-x-5 gap-y-2 text-[13.5px] text-(--foreground-muted) sm:flex-row sm:flex-wrap">
          {cafe.address && (
            <span className="flex items-start gap-1.5">
              <MapPin size={14} className="mt-0.5 shrink-0 text-(--foreground-muted)" />
              {cafe.address}
            </span>
          )}
          {hours && (
            <span className="flex items-center gap-1.5">
              <Clock size={14} className="shrink-0 text-(--foreground-muted)" />
              {hours}
            </span>
          )}
          {distance && (
            <span className="text-accent flex items-center gap-1.5 font-medium">
              <Navigation size={14} className="shrink-0" />
              {distanceLabel}
            </span>
          )}
        </div>

        {(cafe.vibes.length > 0 || cafe.purposes.length > 0) && (
          <div className="flex flex-wrap gap-2 pt-0.5">
            {cafe.vibes.map((v) => (
              <Badge key={v} label={v} variant="vibe" className="px-3 py-1 text-[12.5px]" />
            ))}
            {cafe.purposes.map((p) => (
              <Badge key={p} label={p} className="px-3 py-1 text-[12.5px]" />
            ))}
          </div>
        )}

        <DetailDivider />

        {aboutText && (
          <div className="border-l-[3px] border-[var(--border-light,#ECE4D6)] pl-5">
            <p className="text-[15px] leading-[1.85] font-[var(--font-lora)] text-(--foreground-muted) italic">
              &ldquo;{aboutText}&rdquo;
            </p>
          </div>
        )}

        {cafe.amenities && cafe.amenities.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {cafe.amenities.map((a) => (
              <span
                key={a}
                className="flex items-center gap-1.5 rounded-full border-[1.5px] border-[var(--border-light,#ECE4D6)] bg-[#FAF6F1] px-3 py-1.5 text-sm text-(--foreground-muted) dark:bg-[#241B15]"
              >
                <span className="text-accent">{getAmenityIcon(a)}</span>
                {a}
              </span>
            ))}
          </div>
        )}

        {goodForItems.length > 0 && (
          <div className="pt-1">
            <p className="mb-3 text-[11px] font-bold tracking-[0.08em] text-(--foreground-muted) uppercase">
              {idealForLabel}
            </p>
            <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0 [&::-webkit-scrollbar]:hidden">
              {goodForItems.map((item) => (
                <span
                  key={item.label}
                  className="bg-card inline-flex shrink-0 items-center gap-1.5 rounded-full border-[1.5px] border-[var(--border-light,#ECE4D6)] px-3.5 py-2 text-sm font-medium text-(--foreground-muted) shadow-[0_1px_3px_rgba(40,22,4,0.06)]"
                >
                  <span aria-hidden>{item.emoji}</span>
                  {item.label}
                </span>
              ))}
            </div>
          </div>
        )}

        <DetailDivider />

        {cafe.signatureDrink && (
          <div className="flex items-center gap-3.5 rounded-2xl border-[1.5px] border-[var(--border-light,#ECE4D6)] bg-[#FAF6F1] p-4 dark:bg-[#241B15]">
            <span className="text-accent flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-(--accent-light)">
              <Coffee size={18} />
            </span>
            <div>
              <p className="mb-1 text-[11px] font-medium tracking-[0.06em] text-(--foreground-muted) uppercase">
                {t("signatureDrink")}
              </p>
              <p className="text-foreground text-[15px] font-bold">{cafe.signatureDrink}</p>
            </div>
          </div>
        )}

        {price && (
          <div className="flex items-center gap-2 text-sm text-(--foreground-muted)">
            <span>{t("priceRange")}</span>
            <span className="text-accent text-[15px] font-bold">{price}</span>
          </div>
        )}

        <div className="hidden pt-8 lg:block">
          <DetailActions
            saved={saved}
            loadingSave={loadingSave}
            saveLabel={saveLabel}
            directionsLabel={directionsLabel}
            mapsUrl={mapsUrl}
            onSave={onSave}
          />
        </div>
      </motion.div>

      <div className="border-border fixed right-0 bottom-0 left-0 z-30 border-t bg-(--background)/95 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-md lg:hidden">
        <div className="mx-auto max-w-[680px] px-4">
          <DetailActions
            saved={saved}
            loadingSave={loadingSave}
            saveLabel={saveLabel}
            directionsLabel={directionsLabel}
            mapsUrl={mapsUrl}
            onSave={onSave}
          />
        </div>
      </div>
    </>
  );
}
