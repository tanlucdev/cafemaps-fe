import type { ReactNode } from "react";
import { getCafeRatingValue } from "@/lib/cafe-rating";
import type { Cafe } from "@/types/cafe";
import {
  AMENITY_ICONS,
  AMENITY_LABELS,
  DISPLAY_TAG_RULES,
  FALLBACK_GOOD_FOR,
  GOOD_FOR_RULES,
  PARKING_LOCATION_LABELS,
} from "./constants";
import type { CafeTextAliases, GoodForItem, InstagramLink, LocalizedText } from "./types";

export function getInstagramHref(value: string): string {
  if (/^https?:\/\//i.test(value)) return value;

  const withoutLeadingSlashes = value.replace(/^\/+/, "");
  if (withoutLeadingSlashes.includes(".")) {
    return `https://${withoutLeadingSlashes}`;
  }

  return `https://instagram.com/${withoutLeadingSlashes}`;
}

export function getInstagramLabel(href: string, value: string): string {
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

export function resolveInstagramLink(value: string | null | undefined): InstagramLink | null {
  const trimmed = value?.trim().replace(/^@/, "");
  if (!trimmed) return null;

  const href = getInstagramHref(trimmed);
  return {
    href,
    label: getInstagramLabel(href, trimmed),
  };
}

export function isEnglishLocale(locale: string): boolean {
  return locale.startsWith("en");
}

export function pickLocalizedText({ vi, en }: LocalizedText, locale: string): string | null {
  const primary = isEnglishLocale(locale) ? en : vi;
  const fallback = isEnglishLocale(locale) ? vi : en;
  return primary?.trim() || fallback?.trim() || null;
}

export function formatTime(time: string | null | undefined): string {
  if (!time) return "";

  const hhMm = time.match(/^(\d{1,2}):(\d{2})/);
  if (hhMm) return `${hhMm[1].padStart(2, "0")}:${hhMm[2]}`;

  const iso = time.match(/T(\d{2}):(\d{2})/);
  if (iso) return `${iso[1]}:${iso[2]}`;
  return "";
}

export function calculateDistanceKm(
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

export function getCafeRating(cafe: Cafe): number {
  const rating = getCafeRatingValue(cafe);
  if (rating != null) return rating;

  const seed = Array.from(cafe.slug).reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return 4.5 + (seed % 5) * 0.1;
}

export function getGoodForItems(cafe: Cafe, locale: string): GoodForItem[] {
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

export function getDisplayTags(cafe: Cafe, locale: string): string[] {
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

export function normalizeLabelKey(value: string): string {
  return value.trim().toLowerCase();
}

export function getAmenityLabel(amenity: string, locale: string): string {
  const labels = AMENITY_LABELS[normalizeLabelKey(amenity)];
  if (!labels) return amenity;
  return isEnglishLocale(locale) ? labels.en : labels.vi;
}

function getKnownParkingLocationLabel(value: string, locale: string): string {
  const labels = PARKING_LOCATION_LABELS[normalizeLabelKey(value)];
  if (!labels) return value;
  return isEnglishLocale(locale) ? labels.en : labels.vi;
}

export function getParkingLocation(cafe: Cafe, locale: string): string | null {
  const value = pickLocalizedText(
    {
      vi: cafe.parkingLocation ?? cafe.parking_location,
      en: cafe.parkingLocationEn,
    },
    locale,
  );

  return value ? getKnownParkingLocationLabel(value, locale) : null;
}

export function getCafeAboutText(cafe: Cafe, locale: string): string | null {
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

export function getTextParagraphs(text: string): string[] {
  return text
    .replace(/\\r\\n/g, "\n")
    .replace(/\\n/g, "\n")
    .replace(/\r\n/g, "\n")
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.replace(/\n/g, " ").trim())
    .filter(Boolean);
}

export function getAmenityIcon(amenity: string): ReactNode {
  const key = Object.keys(AMENITY_ICONS).find((k) => amenity.toLowerCase().includes(k));
  return key ? AMENITY_ICONS[key] : AMENITY_ICONS.wifi;
}
