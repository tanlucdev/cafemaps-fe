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
    <span
      className="inline-flex items-center gap-1.5 rounded-full border border-[#f5c777]/35 bg-[#fff4dc]/72 px-3 py-1.5 shadow-[var(--shadow-sm)] backdrop-blur-md dark:border-[#ffe3b7]/18 dark:bg-[#fff1d6]/10"
      aria-label={`${rating.toFixed(1)} sao`}
    >
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
      <span className="text-sm font-black text-[#8a551b] dark:text-[#ffd58a]">
        {rating.toFixed(1)}
      </span>
    </span>
  );
}

function DetailDivider() {
  return <div className="my-6 h-px bg-[linear-gradient(90deg,transparent,rgba(200,132,42,0.22),transparent)]" />;
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
        className={`flex h-11 w-32 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-full border px-4 text-sm font-black whitespace-nowrap shadow-[var(--shadow-sm)] backdrop-blur-md transition-all duration-200 hover:-translate-y-px focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] disabled:cursor-not-allowed disabled:opacity-60 sm:w-32 ${
          saved
            ? "border-[var(--accent)] bg-[var(--accent)] text-white shadow-[0_12px_28px_rgba(200,132,42,0.22)]"
            : "border-[var(--border)] bg-white/68 text-[var(--foreground-muted)] hover:border-[var(--accent)] hover:bg-[var(--accent-light)] hover:text-[var(--accent-hover)] dark:bg-[var(--card)]/72"
        }`}
      >
        <Bookmark size={15} className={saved ? "fill-white" : ""} />
        {saveLabel}
      </button>
      <a
        href={mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-11 min-w-0 flex-1 cursor-pointer items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-4 text-sm font-black text-white shadow-[0_12px_28px_rgba(200,132,42,0.24)] transition-all hover:-translate-y-px hover:bg-[var(--accent-hover)] focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
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
        className="mx-auto w-full max-w-[720px] min-w-0 space-y-5 rounded-[28px] border border-[#ffe3b7]/38 bg-[#fffaf2]/76 px-4 py-5 shadow-[0_18px_54px_rgba(44,26,14,0.08)] backdrop-blur-md sm:px-6 sm:py-6 dark:border-[#ffe3b7]/14 dark:bg-[#1b0f08]/54 dark:shadow-[0_18px_54px_rgba(0,0,0,0.26)]"
      >
        <h1 className="text-[32px] leading-[1.12] font-[var(--font-lora)] font-bold text-[var(--foreground)] sm:text-[40px]">
          {cafe.name}
        </h1>

        <div className="flex flex-wrap items-center gap-3">
          {openStatus !== null && (
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${
                openStatus
                  ? "border border-[#75c79b]/28 bg-[#e6f6ef]/78 text-[#1d6b45] shadow-[var(--shadow-sm)] dark:bg-[#123028]/72 dark:text-[#8ed7ad]"
                  : "border border-[#e9a7a7]/32 bg-[#fff0ee]/78 text-[#9e3636] shadow-[var(--shadow-sm)] dark:bg-[#351514]/72 dark:text-[#f1a0a0]"
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

        <div className="flex flex-col gap-x-5 gap-y-2.5 text-[13.5px] font-medium text-[var(--foreground-muted)] sm:flex-row sm:flex-wrap">
          {cafe.address && (
            <span className="flex items-start gap-1.5">
              <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#fff0dc] text-[#b86f20] dark:bg-[#3a2414] dark:text-[#f0b869]">
                <MapPinned size={12} />
              </span>
              {cafe.address}
            </span>
          )}
          {hours && (
            <span className="flex items-center gap-1.5">
              <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#e6f6ef] text-[#1d6b45] dark:bg-[#123028] dark:text-[#8ed7ad]">
                <AlarmClock size={12} />
              </span>
              {hours}
            </span>
          )}
          {distanceText && (
            <span className="flex items-center gap-1.5 font-bold text-[var(--accent-hover)] dark:text-[#f0b869]">
              <Navigation size={14} className="shrink-0" />
              {distanceLabel}
            </span>
          )}
        </div>

        {(cafe.vibes.length > 0 || cafe.purposes.length > 0 || displayTags.length > 0) && (
          <div className="flex flex-wrap gap-2 pt-0.5">
            {cafe.vibes.map((v) => (
              <Badge key={v} label={v} variant="vibe" className="border border-[#ffe3b7]/36 bg-white/58 px-3 py-1 text-[12.5px] shadow-[var(--shadow-sm)] backdrop-blur-md dark:bg-[#fff1d6]/8" />
            ))}
            {cafe.purposes.map((p) => (
              <Badge key={p} label={p} className="border border-[#ffe3b7]/36 bg-white/58 px-3 py-1 text-[12.5px] shadow-[var(--shadow-sm)] backdrop-blur-md dark:bg-[#fff1d6]/8" />
            ))}
            {displayTags.map((tag) => (
              <Badge key={tag} label={tag} className="border border-[#ffe3b7]/36 bg-white/58 px-3 py-1 text-[12.5px] shadow-[var(--shadow-sm)] backdrop-blur-md dark:bg-[#fff1d6]/8" />
            ))}
          </div>
        )}

        <DetailDivider />

        {aboutParagraphs.length > 0 && (
          <div className="rounded-[22px] border border-[#ffe3b7]/34 bg-white/54 px-4 py-4 shadow-[var(--shadow-sm)] backdrop-blur-md dark:border-[#ffe3b7]/14 dark:bg-[#fff1d6]/7">
            <div className="space-y-4 border-l-[3px] border-[#e4ad58]/44 pl-4 text-[15px] leading-[1.85] font-[var(--font-lora)] text-[var(--foreground-muted)] italic">
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
                className="flex items-center gap-1.5 rounded-full border border-[#ffe3b7]/36 bg-white/58 px-3 py-1.5 text-sm font-medium text-[var(--foreground-muted)] shadow-[var(--shadow-sm)] backdrop-blur-md dark:border-[#ffe3b7]/14 dark:bg-[#fff1d6]/8"
              >
                <span className="text-accent">{getAmenityIcon(a)}</span>
                {getAmenityLabel(a, locale)}
              </span>
            ))}
          </div>
        )}

        {parkingLocation && (
          <div className="rounded-[22px] border border-[#ffe3b7]/34 bg-white/54 px-4 py-3.5 shadow-[var(--shadow-sm)] backdrop-blur-md dark:border-[#ffe3b7]/14 dark:bg-[#fff1d6]/7">
            <p className="mb-2.5 flex items-center gap-1.5 text-[11px] font-bold tracking-[0.08em] text-[var(--foreground-muted)] uppercase">
              <Car size={14} />
              {parkingLabel}
            </p>
            <div className="flex items-baseline gap-2 text-[13.5px]">
              <span className="min-w-13 shrink-0 font-bold text-[var(--foreground)]">
                {parkingTypeLabel}
              </span>
              <span className="text-[var(--border)] text-[11px]">·</span>
              <span className="leading-normal text-[var(--foreground-muted)]">{parkingLocation}</span>
            </div>
          </div>
        )}

        {goodForItems.length > 0 && (
          <div className="pt-1">
            <p className="mb-3 text-[11px] font-bold tracking-[0.08em] text-[var(--foreground-muted)] uppercase">
              {idealForLabel}
            </p>
            <div className="scrollbar-hide -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
              {goodForItems.map((item) => (
                <span
                  key={item.label}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[#ffe3b7]/36 bg-white/58 px-3.5 py-2 text-sm font-bold text-[var(--foreground-muted)] shadow-[var(--shadow-sm)] backdrop-blur-md dark:border-[#ffe3b7]/14 dark:bg-[#fff1d6]/8"
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
          <div className="flex items-center gap-3.5 rounded-[22px] border border-[#ffe3b7]/34 bg-white/54 p-4 shadow-[var(--shadow-sm)] backdrop-blur-md dark:border-[#ffe3b7]/14 dark:bg-[#fff1d6]/7">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[var(--accent)] text-white shadow-[0_10px_24px_rgba(200,132,42,0.18)]">
              <Coffee size={18} />
            </span>
            <div>
              <p className="mb-1 text-[11px] font-bold tracking-[0.06em] text-[var(--foreground-muted)] uppercase">
                {t("signatureDrink")}
              </p>
              <p className="text-[15px] font-black text-[var(--foreground)]">{cafe.signatureDrink}</p>
            </div>
          </div>
        )}

        {price && (
          <div className="flex items-center gap-2 text-sm font-bold text-[var(--foreground-muted)]">
            <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#fff0dc] text-[#a86d1e] dark:bg-[#33270A] dark:text-[#E6C25E]">
              <Banknote size={16} />
            </span>
            <span>{t("priceRange")}</span>
            <span className="text-[15px] font-black text-[var(--accent-hover)] dark:text-[#f0b869]">{price}</span>
          </div>
        )}

        {hasSocialBlock && (
          <div className="overflow-hidden rounded-[22px] border border-[#ffe3b7]/34 bg-white/54 shadow-[var(--shadow-sm)] backdrop-blur-md dark:border-[#ffe3b7]/14 dark:bg-[#fff1d6]/7">
            {cafeInstagram && (
              <div className="flex items-center justify-between gap-3 bg-[#fff4e5]/62 px-4 py-2.5 dark:bg-[#fff1d6]/6">
                <span className="flex shrink-0 items-center gap-1.5 text-[11px] font-bold tracking-[0.07em] text-[var(--foreground-muted)] uppercase">
                  <InstagramIcon />
                  {instagramLabel}
                </span>
                <a
                  href={cafeInstagram.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[13.5px] font-bold tracking-[-0.01em] text-[var(--foreground-muted)] transition-colors hover:text-[var(--accent-hover)]"
                >
                  {cafeInstagram.label}
                </a>
              </div>
            )}
            {photoCredits.length > 0 && (
              <div
                className={`flex flex-col gap-1.5 px-4 py-2.5 ${
                  cafeInstagram ? "border-t border-[#ffe3b7]/28" : ""
                }`}
              >
                <span className="flex items-center gap-1.5 text-[11px] font-bold tracking-[0.07em] text-[var(--foreground-muted)] uppercase">
                  <InstagramIcon />
                  {photoCreditLabel}
                </span>
                {photoCredits.map((c) => (
                  <a
                    key={c.key}
                    href={c.instagram.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[var(--foreground-muted)] transition-colors hover:text-[var(--accent-hover)]"
                  >
                    {c.instagram.label}
                    {c.note && (
                      <span className="text-[12px] font-normal text-[var(--foreground-muted)]">
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

      <div className="cafe-detail-mobile-actions fixed right-0 left-0 z-[60] border-t border-[#ffe3b7]/34 bg-[#fffaf2]/88 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-16px_42px_rgba(44,26,14,0.10)] backdrop-blur-xl lg:hidden dark:border-[#ffe3b7]/14 dark:bg-[#1b0f08]/88">
        <div className="mx-auto w-full max-w-[720px] min-w-0 px-4">
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
