"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { motion } from "framer-motion";
import { ChevronLeft, Share2 } from "lucide-react";
import SmartGallery from "@/components/SmartGallery";
import type { Cafe } from "@/types/cafe";
import { useTranslations } from "next-intl";
import { isUnauthorizedError, toggleSaveCafe } from "@/lib/api";
import { getCurrentAccessToken, saveAuthReturnUrl } from "@/lib/auth-client";
import ShareModal from "./ShareModal";
import CafeDetailInfo from "./CafeDetailInfo";

interface CafeDetailContentProps {
  cafe: Cafe;
  locale: string;
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
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      cafe.name + " " + (cafe.address ?? ""),
    )}`;
  const saveLabel = locale === "vi" ? (saved ? "Đã lưu" : "Lưu") : saved ? t("saved") : t("save");
  const directionsLabel = locale === "vi" ? "Chỉ đường đến đây" : t("openMaps");

  async function handleSave() {
    if (loadingSave) return;

    const token = await getCurrentAccessToken();
    if (!token) {
      saveAuthReturnUrl();
      router.push("/login");
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
        router.push("/login");
      }
    } finally {
      setLoadingSave(false);
    }
  }

  function handleBack() {
    const returnUrl =
      typeof window !== "undefined" ? sessionStorage.getItem("cafe-return-url") : null;
    if (returnUrl) {
      sessionStorage.removeItem("cafe-return-url");
      router.push(returnUrl);
      return;
    }

    router.back();
  }

  return (
    <article className="pt-16 pb-1 lg:pb-8">
      <div className="mx-auto flex max-w-2xl items-center justify-between px-4 pt-6 pb-4 sm:px-6 lg:max-w-[900px] lg:px-10">
        <button
          onClick={handleBack}
          className="hover:text-foreground inline-flex cursor-pointer items-center gap-1.5 text-sm text-(--foreground-muted) transition-colors"
        >
          <ChevronLeft size={16} />
          {tc("back")}
        </button>
        <button
          onClick={() => setShareOpen(true)}
          className="hover:text-foreground border-border hover:border-accent inline-flex cursor-pointer items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm text-(--foreground-muted) transition-colors"
        >
          <Share2 size={14} />
          {t("share")}
        </button>
      </div>

      <div className="mx-auto max-w-2xl space-y-6 px-4 pb-4 sm:px-6 lg:max-w-[900px] lg:px-10">
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

        <CafeDetailInfo
          cafe={cafe}
          locale={locale}
          saved={saved}
          loadingSave={loadingSave}
          mapsUrl={mapsUrl}
          saveLabel={saveLabel}
          directionsLabel={directionsLabel}
          onSave={handleSave}
        />
      </div>

      <ShareModal
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        cafeName={cafe.name}
        oneLiner={cafe.oneLiner}
        url={cafeUrl}
      />
    </article>
  );
}
