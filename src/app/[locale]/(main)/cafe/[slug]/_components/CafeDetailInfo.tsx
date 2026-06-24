"use client";

import { useEffect, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import {
  AirVent,
  AlarmClock,
  Banknote,
  Bookmark,
  Car,
  Coffee,
  MapPinned,
  Navigation,
  PawPrint,
  Star,
  TreePine,
  Wifi,
  Zap,
} from "lucide-react";
import { useTranslations } from "next-intl";
import Badge from "@/components/ui/Badge";
import { getNearbyCafes } from "@/lib/api";
import { getCafeRatingValue } from "@/lib/cafe-rating";
import { formatCafeDistanceParts } from "@/lib/distance";
import { getCafeOpenStatus } from "@/lib/opening-hours";
import { formatPrice } from "@/lib/utils";
import { getLastSearchState } from "@/lib/search-state";
import type { Cafe } from "@/types/cafe";

function InstagramIcon({ size = 14 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

type InstagramLink = {
  href: string;
  label: string;
};

type PhotoCreditWithInstagram = NonNullable<Cafe["photoCredits"]>[number] & {
  instagram: InstagramLink;
  key: string;
};

function getInstagramHref(value: string): string {
  if (/^https?:\/\//i.test(value)) return value;

  const withoutLeadingSlashes = value.replace(/^\/+/, "");
  if (withoutLeadingSlashes.includes(".")) {
    return `https://${withoutLeadingSlashes}`;
  }

  return `https://instagram.com/${withoutLeadingSlashes}`;
}

function getInstagramLabel(href: string, value: string): string {
  try {
    const parsed = new URL(href);
    const handle = parsed.hostname.toLowerCase().includes("instagram.com")
      ? parsed.pathname.split("/").filter(Boolean)[0]?.replace(/^@/, "")
      : null;

    if (handle) return `@${handle}`;
  } catch {
    // Fall back to the raw value below if URL parsing is unavailable.
  }

  if (!value.includes("/") && !value.includes(".")) return `@${value}`;
  return value.replace(/^https?:\/\//i, "").replace(/\/$/, "");
}

function resolveInstagramLink(value: string | null | undefined): InstagramLink | null {
  const trimmed = value?.trim().replace(/^@/, "");
  if (!trimmed) return null;

  const href = getInstagramHref(trimmed);
  return {
    href,
    label: getInstagramLabel(href, trimmed),
  };
}

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

type DetailActionsProps = Omit<CafeDetailInfoProps, "cafe" | "locale"> & {
  saveAriaLabel: string;
};

const AMENITY_ICONS: Record<string, ReactNode> = {
  wifi: <Wifi size={14} />,
  "điều hoà": <AirVent size={14} />,
  "điều hòa": <AirVent size={14} />,
  "air conditioning": <AirVent size={14} />,
  ac: <AirVent size={14} />,
  "đậu xe": <Car size={14} />,
  parking: <Car size={14} />,
  "ngoài trời": <TreePine size={14} />,
  outdoor: <TreePine size={14} />,
  "ổ cắm": <Zap size={14} />,
  outlet: <Zap size={14} />,
  "power outlet": <Zap size={14} />,
  "thú cưng": <PawPrint size={14} />,
  pet: <PawPrint size={14} />,
};

const GOOD_FOR_RULES = [
  {
    terms: ["chill một mình", "một mình", "chill", "solo"],
    emoji: "☕",
    labels: { vi: "Chill một mình", en: "Solo chill" },
  },
  {
    terms: ["học tập", "đọc sách", "yên tĩnh", "study", "read", "quiet"],
    emoji: "📚",
    labels: { vi: "Đọc sách", en: "Reading" },
  },
  {
    terms: ["làm việc", "remote", "wifi", "work"],
    emoji: "💻",
    labels: { vi: "Làm việc remote", en: "Remote work" },
  },
  {
    terms: ["ổ cắm", "cắm máy", "outlet", "power"],
    emoji: "🔌",
    labels: { vi: "Cắm máy ngồi lâu", en: "Long laptop sessions" },
  },
  {
    terms: ["jazz", "acoustic", "nhạc", "music"],
    emoji: "🎵",
    labels: { vi: "Nghe nhạc", en: "Music" },
  },
  { terms: ["thú cưng", "pet"], emoji: "🐶", labels: { vi: "Dẫn thú cưng", en: "Pet friendly" } },
  {
    terms: ["hẹn hò", "lãng mạn", "date", "romantic"],
    emoji: "🕯️",
    labels: { vi: "Hẹn hò nhẹ nhàng", en: "Easy dates" },
  },
  {
    terms: ["gặp bạn bè", "họp nhóm", "nhộn nhịp", "friends", "group", "lively"],
    emoji: "💬",
    labels: { vi: "Gặp bạn bè", en: "Friends hangout" },
  },
  {
    terms: ["thiên nhiên", "ngoài trời", "sân vườn", "nature", "outdoor", "garden"],
    emoji: "🌿",
    labels: { vi: "Ngồi ngoài trời", en: "Outdoor seating" },
  },
  {
    terms: ["sáng tạo", "creative"],
    emoji: "✍️",
    labels: { vi: "Viết linh tinh", en: "Creative writing" },
  },
];

const FALLBACK_GOOD_FOR = [
  { emoji: "☕", labels: { vi: "Chill một mình", en: "Solo chill" } },
  { emoji: "📚", labels: { vi: "Đọc sách", en: "Reading" } },
  { emoji: "💻", labels: { vi: "Làm việc remote", en: "Remote work" } },
];

const DISPLAY_TAG_RULES = [
  {
    terms: [
      "ngoài trời",
      "sân vườn",
      "ban công",
      "rooftop",
      "terrace",
      "garden",
      "outdoor",
      "balcony",
    ],
    labels: { vi: "ngoài trời", en: "outdoor seating" },
  },
  {
    terms: ["hút thuốc", "khói thuốc", "cho phép hút thuốc", "smoking", "smoking allowed"],
    labels: { vi: "chỗ hút thuốc", en: "smoking allowed" },
  },
];

const AMENITY_LABELS: Record<string, { vi: string; en: string }> = {
  wifi: { vi: "wifi", en: "wifi" },
  "điều hoà": { vi: "điều hoà", en: "air conditioning" },
  "điều hòa": { vi: "điều hòa", en: "air conditioning" },
  ac: { vi: "điều hoà", en: "air conditioning" },
  "air conditioning": { vi: "điều hoà", en: "air conditioning" },
  "chỗ đậu xe": { vi: "chỗ đậu xe", en: "parking" },
  "đậu xe": { vi: "đậu xe", en: "parking" },
  parking: { vi: "đậu xe", en: "parking" },
  "ngoài trời": { vi: "ngoài trời", en: "outdoor seating" },
  outdoor: { vi: "ngoài trời", en: "outdoor seating" },
  "ổ cắm": { vi: "ổ cắm", en: "power outlets" },
  outlet: { vi: "ổ cắm", en: "power outlets" },
  "power outlets": { vi: "ổ cắm", en: "power outlets" },
  "pet-friendly": { vi: "thân thiện thú cưng", en: "pet friendly" },
};

const PARKING_LOCATION_LABELS: Record<string, { vi: string; en: string }> = {
  "gửi xe vỉa hè phía trước": {
    vi: "Gửi xe vỉa hè phía trước",
    en: "Street-side parking in front",
  },
  "gửi xe trước quán": { vi: "Gửi xe trước quán", en: "Parking in front" },
  "có chỗ đậu xe": { vi: "Có chỗ đậu xe", en: "Parking available" },
};

type GoodForItem = {
  emoji: string;
  label: string;
};

type ResolvedDistance = Pick<Cafe, "distanceKm" | "distanceMode" | "durationMin">;

type CafeTextAliases = Cafe & {
  onlineEn?: string | null;
  online_en?: string | null;
  one_line_en?: string | null;
};

type LocalizedText = {
  vi?: string | null;
  en?: string | null;
};

function isEnglishLocale(locale: string): boolean {
  return locale.startsWith("en");
}

function pickLocalizedText({ vi, en }: LocalizedText, locale: string): string | null {
  const primary = isEnglishLocale(locale) ? en : vi;
  const fallback = isEnglishLocale(locale) ? vi : en;
  return primary?.trim() || fallback?.trim() || null;
}

function formatTime(time: string | null | undefined): string {
  if (!time) return "";

  const hhMm = time.match(/^(\d{1,2}):(\d{2})/);
  if (hhMm) return `${hhMm[1].padStart(2, "0")}:${hhMm[2]}`;

  const iso = time.match(/T(\d{2}):(\d{2})/);
  if (iso) return `${iso[1]}:${iso[2]}`;
  return "";
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
  const rating = getCafeRatingValue(cafe);
  if (rating != null) return rating;

  const seed = Array.from(cafe.slug).reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return 4.5 + (seed % 5) * 0.1;
}

function getGoodForItems(cafe: Cafe, locale: string): GoodForItem[] {
  const isEnglish = isEnglishLocale(locale);
  const source = [
    ...cafe.purposes,
    ...cafe.vibes,
    ...cafe.amenities,
    ...cafe.tags,
    cafe.oneLiner ?? "",
    cafe.oneLinerEn ?? "",
    cafe.description ?? "",
    cafe.descriptionEn ?? "",
  ]
    .join(" ")
    .toLowerCase();

  const items: GoodForItem[] = [];
  for (const rule of GOOD_FOR_RULES) {
    const label = isEnglish ? rule.labels.en : rule.labels.vi;
    if (rule.terms.some((term) => source.includes(term)) && !items.some((i) => i.label === label)) {
      items.push({ emoji: rule.emoji, label });
    }
  }

  return (
    items.length > 0
      ? items
      : FALLBACK_GOOD_FOR.map((item) => ({
          emoji: item.emoji,
          label: isEnglish ? item.labels.en : item.labels.vi,
        }))
  ).slice(0, 5);
}

function getDisplayTags(cafe: Cafe, locale: string): string[] {
  const isEnglish = isEnglishLocale(locale);
  const amenityKeys = new Set(
    cafe.amenities.flatMap((amenity) => {
      const labels = AMENITY_LABELS[normalizeLabelKey(amenity)];
      return labels
        ? [amenity, labels.vi, labels.en].map(normalizeLabelKey)
        : [normalizeLabelKey(amenity)];
    }),
  );
  const source = [
    ...cafe.tags,
    ...cafe.amenities,
    ...cafe.vibes,
    cafe.oneLiner ?? "",
    cafe.oneLinerEn ?? "",
    cafe.description ?? "",
    cafe.descriptionEn ?? "",
  ]
    .join(" ")
    .toLowerCase();

  const tags = cafe.tags.filter((tag) => !amenityKeys.has(normalizeLabelKey(tag)));
  const seen = new Set(tags.map((tag) => normalizeLabelKey(tag)));

  for (const rule of DISPLAY_TAG_RULES) {
    const label = isEnglish ? rule.labels.en : rule.labels.vi;
    if (amenityKeys.has(normalizeLabelKey(label))) continue;
    const equivalentTags = [...rule.terms, rule.labels.vi, rule.labels.en].map(normalizeLabelKey);
    const hasEquivalentTag = equivalentTags.some((tag) => seen.has(tag));
    if (
      rule.terms.some((term) => source.includes(term)) &&
      !hasEquivalentTag &&
      !seen.has(normalizeLabelKey(label))
    ) {
      tags.push(label);
      seen.add(normalizeLabelKey(label));
    }
  }

  return tags;
}

function normalizeLabelKey(value: string): string {
  return value.trim().toLowerCase();
}

function getAmenityLabel(amenity: string, locale: string): string {
  const labels = AMENITY_LABELS[normalizeLabelKey(amenity)];
  if (!labels) return amenity;
  return isEnglishLocale(locale) ? labels.en : labels.vi;
}

function getKnownParkingLocationLabel(value: string, locale: string): string {
  const labels = PARKING_LOCATION_LABELS[normalizeLabelKey(value)];
  if (!labels) return value;
  return isEnglishLocale(locale) ? labels.en : labels.vi;
}

function getParkingLocation(cafe: Cafe, locale: string): string | null {
  const value = pickLocalizedText(
    {
      vi: cafe.parkingLocation ?? cafe.parking_location,
      en: cafe.parkingLocationEn,
    },
    locale,
  );

  return value ? getKnownParkingLocationLabel(value, locale) : null;
}

function getCafeAboutText(cafe: Cafe, locale: string): string | null {
  const textCafe = cafe as CafeTextAliases;
  return pickLocalizedText(
    {
      vi: cafe.description ?? cafe.oneLiner,
      en:
        cafe.descriptionEn ??
        cafe.oneLinerEn ??
        textCafe.onlineEn ??
        textCafe.online_en ??
        textCafe.one_line_en,
    },
    locale,
  );
}

function getTextParagraphs(text: string): string[] {
  return text
    .replace(/\\r\\n/g, "\n")
    .replace(/\\n/g, "\n")
    .replace(/\r\n/g, "\n")
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.replace(/\n/g, " ").trim())
    .filter(Boolean);
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
  saveAriaLabel,
  mapsUrl,
  onSave,
}: DetailActionsProps) {
  return (
    <div className="flex w-full gap-3">
      <button
        onClick={onSave}
        disabled={loadingSave}
        aria-label={saveAriaLabel}
        className={`flex h-11 w-32 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-2xl border px-5 text-sm font-semibold whitespace-nowrap transition-all duration-200 disabled:cursor-not-allowed sm:w-32 ${
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
  const [resolvedDistance, setResolvedDistance] = useState<ResolvedDistance>({
    distanceKm: cafe.distanceKm,
    distanceMode: cafe.distanceMode,
    durationMin: cafe.durationMin,
  });

  const hours = [formatTime(cafe.openingTime), formatTime(cafe.closingTime)]
    .filter(Boolean)
    .join(" – ");
  const price = formatPrice(cafe.priceMin, cafe.priceMax, locale);
  const distanceText = formatCafeDistanceParts(resolvedDistance, locale).join(" • ");
  const rating = getCafeRating(cafe);
  const openStatus = getCafeOpenStatus(cafe.openingTime, cafe.closingTime);
  const aboutText = getCafeAboutText(cafe, locale);
  const aboutParagraphs = aboutText ? getTextParagraphs(aboutText) : [];
  const goodForItems = getGoodForItems(cafe, locale);
  const displayTags = getDisplayTags(cafe, locale);
  const idealForLabel = t("detail.idealFor");
  const distanceLabel = t("detail.distanceFromYou", { distance: distanceText });
  const parkingLabel = t("detail.parking");
  const parkingTypeLabel = t("detail.parkingType");
  const parkingLocation = getParkingLocation(cafe, locale);
  const instagramLabel = t("detail.instagram");
  const photoCreditLabel = t("detail.photoCredit");
  const saveAriaLabel = saved ? t("unsave") : t("save");
  const cafeInstagram = resolveInstagramLink(cafe.instagramUrl);
  const photoCredits =
    cafe.photoCredits
      ?.map((credit, index) => {
        const instagram = resolveInstagramLink(credit.ig);
        if (!instagram) return null;

        return {
          ...credit,
          instagram,
          key: `${instagram.href}-${index}`,
        };
      })
      .filter((credit): credit is PhotoCreditWithInstagram => credit !== null) ?? [];
  const hasSocialBlock = Boolean(cafeInstagram) || photoCredits.length > 0;

  useEffect(() => {
    if (cafe.distanceKm != null) {
      setResolvedDistance({
        distanceKm: cafe.distanceKm,
        distanceMode: cafe.distanceMode,
        durationMin: cafe.durationMin,
      });
      return;
    }

    let cancelled = false;
    const lastSearch = getLastSearchState();
    const fromLat = lastSearch?.filter.lat;
    const fromLng = lastSearch?.filter.lng;
    if (fromLat == null || fromLng == null || cafe.lat == null || cafe.lng == null) {
      setResolvedDistance({});
      return;
    }

    const originLat = fromLat;
    const originLng = fromLng;
    const searchRadiusKm = lastSearch?.filter.radiusKm ?? 2;

    setResolvedDistance({
      distanceKm: calculateDistanceKm(originLat, originLng, cafe.lat, cafe.lng),
      distanceMode: "straight",
    });

    async function resolveRouteDistance() {
      const nearbyCafes = await getNearbyCafes(originLat, originLng, searchRadiusKm, locale);
      if (cancelled) return;

      const routeCafe = nearbyCafes.find(
        (nearbyCafe) => nearbyCafe.id === cafe.id || nearbyCafe.slug === cafe.slug,
      );
      if (routeCafe?.distanceKm == null) return;

      setResolvedDistance({
        distanceKm: routeCafe.distanceKm,
        distanceMode: routeCafe.distanceMode,
        durationMin: routeCafe.durationMin,
      });
    }

    void resolveRouteDistance();

    return () => {
      cancelled = true;
    };
  }, [
    cafe.distanceKm,
    cafe.distanceMode,
    cafe.durationMin,
    cafe.id,
    cafe.lat,
    cafe.lng,
    cafe.slug,
    locale,
  ]);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mx-auto max-w-[680px] space-y-5 pt-2"
      >
        <h1 className="text-foreground text-[32px] leading-[1.18] font-[var(--font-lora)] font-semibold sm:text-[38px]">
          {cafe.name}
        </h1>

        <div className="flex flex-wrap items-center gap-3">
          {openStatus !== null && (
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${
                openStatus
                  ? "bg-[var(--status-open-background)] text-[var(--status-open-foreground)]"
                  : "bg-[var(--status-closed-background)] text-[var(--status-closed-foreground)]"
              }`}
            >
              <span className="relative flex h-2 w-2">
                {openStatus && (
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-60" />
                )}
                <span className="relative inline-flex h-2 w-2 rounded-full bg-current" />
              </span>
              {openStatus ? t("openNow") : t("closedNow")}
            </span>
          )}
          <RatingStars rating={rating} />
        </div>

        <div className="flex flex-col gap-x-5 gap-y-2 text-[13.5px] text-(--foreground-muted) sm:flex-row sm:flex-wrap">
          {cafe.address && (
            <span className="flex items-start gap-1.5">
              <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#FCE8ED] text-[#B4325E] dark:bg-[#3A1224] dark:text-[#E890B4]">
                <MapPinned size={12} />
              </span>
              {cafe.address}
            </span>
          )}
          {hours && (
            <span className="flex items-center gap-1.5">
              <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#E6F6F1] text-[#1D6B58] dark:bg-[#123028] dark:text-[#7FCDB8]">
                <AlarmClock size={12} />
              </span>
              {hours}
            </span>
          )}
          {distanceText && (
            <span className="text-accent flex items-center gap-1.5 font-medium">
              <Navigation size={14} className="shrink-0" />
              {distanceLabel}
            </span>
          )}
        </div>

        {(cafe.vibes.length > 0 || cafe.purposes.length > 0 || displayTags.length > 0) && (
          <div className="flex flex-wrap gap-2 pt-0.5">
            {cafe.vibes.map((v) => (
              <Badge key={v} label={v} variant="vibe" className="px-3 py-1 text-[12.5px]" />
            ))}
            {cafe.purposes.map((p) => (
              <Badge key={p} label={p} className="px-3 py-1 text-[12.5px]" />
            ))}
            {displayTags.map((tag) => (
              <Badge key={tag} label={tag} className="px-3 py-1 text-[12.5px]" />
            ))}
          </div>
        )}

        <DetailDivider />

        {aboutParagraphs.length > 0 && (
          <div className="border-l-[3px] border-[var(--border-light,#ECE4D6)] pl-5">
            <div className="space-y-4 text-[15px] leading-[1.85] font-[var(--font-lora)] text-(--foreground-muted) italic">
              {aboutParagraphs.map((paragraph, index) => (
                <p key={`${paragraph.slice(0, 24)}-${index}`}>
                  {index === 0 && <>&ldquo;</>}
                  {paragraph}
                  {index === aboutParagraphs.length - 1 && <>&rdquo;</>}
                </p>
              ))}
            </div>
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
                {getAmenityLabel(a, locale)}
              </span>
            ))}
          </div>
        )}

        {parkingLocation && (
          <div className="rounded-2xl border border-(--border-light,#ECE4D6) bg-[#FAF6F1] px-4 py-3.5 dark:bg-[#241B15]">
            <p className="mb-2.5 flex items-center gap-1.5 text-[11px] font-bold tracking-[0.08em] text-(--foreground-muted) uppercase">
              <Car size={14} />
              {parkingLabel}
            </p>
            <div className="flex items-baseline gap-2 text-[13.5px]">
              <span className="text-foreground min-w-13 shrink-0 font-bold">
                {parkingTypeLabel}
              </span>
              <span className="text-border text-[11px]">·</span>
              <span className="leading-normal text-(--foreground-muted)">{parkingLocation}</span>
            </div>
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
          <div className="flex items-center gap-2 text-sm font-bold text-(--foreground-muted)">
            <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#FFF4CF] text-[#A06C08] dark:bg-[#33270A] dark:text-[#E6C25E]">
              <Banknote size={16} />
            </span>
            <span>{t("priceRange")}</span>
            <span className="text-accent text-[15px] font-extrabold">{price}</span>
          </div>
        )}

        {hasSocialBlock && (
          <div className="overflow-hidden rounded-2xl border border-(--border-light,#ECE4D6)">
            {cafeInstagram && (
              <div className="flex items-center justify-between gap-3 bg-[#FAF6F1] px-4 py-2.5 dark:bg-[#241B15]">
                <span className="flex shrink-0 items-center gap-1.5 text-[11px] font-bold tracking-[0.07em] text-(--foreground-muted) uppercase">
                  <InstagramIcon />
                  {instagramLabel}
                </span>
                <a
                  href={cafeInstagram.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent text-[13.5px] font-bold tracking-[-0.01em] text-(--foreground-muted) transition-colors"
                >
                  {cafeInstagram.label}
                </a>
              </div>
            )}
            {photoCredits.length > 0 && (
              <div
                className={`flex flex-col gap-1.5 px-4 py-2.5 ${
                  cafeInstagram ? "border-t border-(--border-light,#ECE4D6)" : ""
                }`}
              >
                <span className="flex items-center gap-1.5 text-[11px] font-bold tracking-[0.07em] text-(--foreground-muted) uppercase">
                  <InstagramIcon />
                  {photoCreditLabel}
                </span>
                {photoCredits.map((c) => (
                  <a
                    key={c.key}
                    href={c.instagram.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-accent inline-flex items-center gap-1.5 text-[13px] font-semibold text-(--foreground-muted) transition-colors"
                  >
                    {c.instagram.label}
                    {c.note && (
                      <span className="text-[12px] font-normal text-(--foreground-muted)">
                        · {c.note}
                      </span>
                    )}
                  </a>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="hidden pt-8 lg:block">
          <DetailActions
            saved={saved}
            loadingSave={loadingSave}
            saveLabel={saveLabel}
            directionsLabel={directionsLabel}
            saveAriaLabel={saveAriaLabel}
            mapsUrl={mapsUrl}
            onSave={onSave}
          />
        </div>
      </motion.div>

      <div className="cafe-detail-mobile-actions border-border fixed right-0 left-0 z-[60] border-t bg-(--background)/95 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-md lg:hidden">
        <div className="mx-auto max-w-[680px] px-4">
          <DetailActions
            saved={saved}
            loadingSave={loadingSave}
            saveLabel={saveLabel}
            directionsLabel={directionsLabel}
            saveAriaLabel={saveAriaLabel}
            mapsUrl={mapsUrl}
            onSave={onSave}
          />
        </div>
      </div>
    </>
  );
}
