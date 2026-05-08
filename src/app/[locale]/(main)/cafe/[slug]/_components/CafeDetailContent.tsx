"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  MapPin,
  Clock,
  Coffee,
  ChevronLeft,
  Share2,
  Bookmark,
  Wifi,
  AirVent,
  Car,
  TreePine,
  Zap,
  PawPrint,
} from "lucide-react";
import SmartGallery from "@/components/SmartGallery";
import Badge from "@/components/ui/Badge";
import ShareModal from "./ShareModal";
import { formatPrice } from "@/lib/utils";
import type { Cafe } from "@/types/cafe";
import { useTranslations } from "next-intl";
import { isUnauthorizedError, toggleSaveCafe } from "@/lib/api";
import { getCurrentAccessToken, saveAuthReturnUrl } from "@/lib/auth-client";

interface CafeDetailContentProps {
  cafe: Cafe;
  locale: string;
}

const AMENITY_ICONS: Record<string, React.ReactNode> = {
  wifi: <Wifi size={14} />,
  "điều hoà": <AirVent size={14} />,
  "đậu xe": <Car size={14} />,
  "ngoài trời": <TreePine size={14} />,
  "ổ cắm": <Zap size={14} />,
  "thú cưng": <PawPrint size={14} />,
};

function formatTime(time: string | null | undefined): string {
  if (!time) return "";
  // HH:MM or HH:MM:SS
  const hhMm = time.match(/^(\d{1,2}):(\d{2})/);
  if (hhMm) return `${hhMm[1].padStart(2, "0")}:${hhMm[2]}`;
  // ISO datetime e.g. "1970-01-01T07:00:00.000Z"
  const iso = time.match(/T(\d{2}):(\d{2})/);
  if (iso) return `${iso[1]}:${iso[2]}`;
  return "";
}

function getAmenityIcon(amenity: string) {
  const key = Object.keys(AMENITY_ICONS).find((k) => amenity.toLowerCase().includes(k));
  return key ? AMENITY_ICONS[key] : <Wifi size={14} />;
}

export default function CafeDetailContent({ cafe, locale }: CafeDetailContentProps) {
  const t = useTranslations("cafe");
  const tc = useTranslations("common");
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  const cafeUrl =
    typeof window !== "undefined"
      ? window.location.href
      : `https://cafefinder.vn/${locale}/cafe/${cafe.slug}`;

  const mapsUrl =
    cafe.googleMapsUrl ??
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(cafe.name + " " + (cafe.address ?? ""))}`;

  async function handleSave() {
    if (loadingSave) return;

    const token = await getCurrentAccessToken();
    if (!token) {
      saveAuthReturnUrl();
      router.push(`/${locale}/login`);
      return;
    }

    setLoadingSave(true);
    const prev = saved;
    setSaved((s) => !s);
    try {
      const result = await toggleSaveCafe(cafe.id, token, prev);
      setSaved(result.saved);
    } catch (error) {
      setSaved(prev);
      if (isUnauthorizedError(error)) {
        saveAuthReturnUrl();
        router.push(`/${locale}/login`);
      }
    } finally {
      setLoadingSave(false);
    }
  }

  return (
    <article className="min-h-screen pt-16 pb-24 lg:pb-8">
      {/* Top bar */}
      <div className="mx-auto flex max-w-2xl items-center justify-between px-4 pt-6 pb-4 sm:px-6 lg:max-w-[900px] lg:px-10">
        <button
          onClick={() => {
            const returnUrl =
              typeof window !== "undefined" ? sessionStorage.getItem("cafe-return-url") : null;
            if (returnUrl) {
              sessionStorage.removeItem("cafe-return-url");
              router.push(returnUrl);
            } else {
              router.back();
            }
          }}
          className="hover:text-foreground inline-flex items-center gap-1.5 text-sm text-(--foreground-muted) transition-colors"
        >
          <ChevronLeft size={16} />
          {tc("back")}
        </button>
        <button
          onClick={() => setShareOpen(true)}
          className="hover:text-foreground border-border hover:border-accent inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm text-(--foreground-muted) transition-colors"
        >
          <Share2 size={14} />
          {t("share")}
        </button>
      </div>

      <div className="mx-auto max-w-2xl space-y-6 px-4 pb-4 sm:px-6 lg:max-w-[900px] lg:px-10">
        {/* 1. Gallery */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <SmartGallery
            images={cafe.images ?? []}
            orientations={cafe.image_orientations ?? []}
            cafeName={cafe.name}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="space-y-4"
        >
          {/* 2. Name + Save */}
          <div className="flex items-start justify-between gap-3">
            <h1 className="font-display text-foreground text-2xl leading-tight font-bold sm:text-3xl">
              {cafe.name}
            </h1>
            <button
              onClick={handleSave}
              disabled={loadingSave}
              aria-label={saved ? "Bỏ lưu" : "Lưu quán"}
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full border transition-all duration-200 ${
                saved
                  ? "border-amber-500 bg-amber-500 text-white"
                  : "border-border hover:text-accent hover:border-accent bg-(--background-secondary) text-(--foreground-muted) hover:bg-(--accent-light)"
              }`}
            >
              <Bookmark size={20} className={saved ? "fill-white" : ""} />
            </button>
          </div>

          {/* 3. Open status badge */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-green-200 bg-green-50 px-2.5 py-1 dark:border-green-900/60 dark:bg-green-950/40">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
              <span className="text-xs font-medium text-green-700 dark:text-green-400">
                {t("openNow")}
              </span>
            </span>
          </div>

          {/* 4. Address + Hours — same row */}
          <div className="flex flex-col gap-x-5 gap-y-2 text-sm text-(--foreground-muted) sm:flex-row sm:flex-wrap">
            <span className="flex items-start gap-1.5">
              <MapPin size={14} className="text-accent mt-0.5 shrink-0" />
              {cafe.address}
            </span>
            {(cafe.openingTime || cafe.closingTime) && (
              <span className="flex items-center gap-1.5">
                <Clock size={14} className="text-accent shrink-0" />
                {[formatTime(cafe.openingTime), formatTime(cafe.closingTime)]
                  .filter(Boolean)
                  .join(" – ")}
              </span>
            )}
          </div>

          {/* 5. Vibe + Purpose tags */}
          {(cafe.vibes.length > 0 || cafe.purposes.length > 0) && (
            <div className="flex flex-wrap gap-2">
              {cafe.vibes.map((v) => (
                <Badge key={v} label={v} variant="vibe" />
              ))}
              {cafe.purposes.map((p) => (
                <Badge key={p} label={p} />
              ))}
            </div>
          )}

          <hr className="border-border" />

          {/* 6. About */}
          {cafe.description && (
            <div>
              <h2 className="text-foreground mb-2 font-semibold">{t("about")}</h2>
              <p className="text-sm leading-relaxed text-(--foreground-muted)">
                {cafe.description}
              </p>
            </div>
          )}

          {/* 7. Amenities as icon chips */}
          {cafe.amenities && cafe.amenities.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {cafe.amenities.map((a) => (
                <span
                  key={a}
                  className="border-border flex items-center gap-1.5 rounded-full border bg-(--background-secondary) px-3 py-1.5 text-sm text-(--foreground-muted)"
                >
                  <span className="text-accent">{getAmenityIcon(a)}</span>
                  {a}
                </span>
              ))}
            </div>
          )}

          {/* 8. Signature drink highlight card */}
          {cafe.signatureDrink && (
            <div className="flex items-center gap-3 rounded-xl border border-[#E8D8C0] bg-[#F0E8DC] p-3 dark:border-[#4A2E14] dark:bg-[#3D2510]">
              <Coffee size={18} className="text-accent shrink-0" />
              <div>
                <p className="mb-0.5 text-xs text-(--foreground-muted)">{t("signatureDrink")}</p>
                <p className="text-foreground text-sm font-semibold">{cafe.signatureDrink}</p>
              </div>
            </div>
          )}

          {/* 9. Price range */}
          {formatPrice(cafe.priceMin, cafe.priceMax) && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-(--foreground-muted)">Khoảng giá:</span>
              <span className="text-accent rounded-full bg-(--accent-light) px-3 py-1 font-medium">
                {formatPrice(cafe.priceMin, cafe.priceMax)}
              </span>
            </div>
          )}
        </motion.div>
      </div>

      <ShareModal
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        cafeName={cafe.name}
        oneLiner={cafe.oneLiner}
        url={cafeUrl}
      />

      {/* 10. CTA — sticky on mobile, static on desktop */}
      <div className="border-border fixed right-0 bottom-0 left-0 z-30 border-t bg-(--background)/95 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-md lg:static lg:z-auto lg:border-0 lg:bg-transparent lg:pt-0 lg:pb-0 lg:backdrop-blur-none">
        <div className="mx-auto flex max-w-2xl gap-3 px-4 lg:mt-6 lg:max-w-[900px] lg:px-10">
          <button
            onClick={handleSave}
            disabled={loadingSave}
            aria-label={saved ? "Bỏ lưu" : "Lưu quán"}
            className={`flex h-12 items-center gap-2 rounded-xl border px-5 text-sm font-medium transition-all duration-200 ${
              saved
                ? "border-amber-500 bg-amber-500 text-white"
                : "border-border hover:border-accent hover:text-accent text-(--foreground-muted)"
            }`}
          >
            <Bookmark size={16} className={saved ? "fill-white" : ""} />
            Lưu
          </button>
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-accent flex h-12 flex-1 items-center justify-center gap-2 rounded-xl text-sm font-semibold text-white transition-colors hover:bg-(--accent-hover)"
          >
            <MapPin size={16} />
            Chỉ đường
          </a>
        </div>
      </div>
    </article>
  );
}
