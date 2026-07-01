"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { motion } from "framer-motion";
import { BookOpen, ChevronLeft, Share2 } from "lucide-react";
import { toast } from "sonner";
import SmartGallery from "@/components/SmartGallery";
import type { Cafe } from "@/types/cafe";
import { useTranslations } from "next-intl";
import { AUTH_STORAGE_KEYS } from "@/constants/auth-keys";
import { isUnauthorizedError, toggleSaveCafe } from "@/lib/api";
import { getCurrentAccessToken, saveAuthReturnUrl } from "@/lib/auth-client";
import ShareModal from "./ShareModal";
import CafeDetailInfo from "./CafeDetailInfo";
import CafeMenuModal from "./CafeMenuModal";

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
  const [menuOpen, setMenuOpen] = useState(false);

  const cafeUrl =
    typeof window !== "undefined"
      ? window.location.href
      : `https://cafefinder.vn/${locale}/cafe/${cafe.slug}`;

  const mapsUrl =
    cafe.googleMapsUrl ??
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      cafe.name + " " + (cafe.address ?? ""),
    )}`;
  const saveLabel = saved ? t("saved") : t("saveShort");
  const directionsLabel = t("directions");

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
      if (!prev && result.saved) {
        toast.success(t("saveSuccess"));
      }
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
      typeof window !== "undefined" ? sessionStorage.getItem(AUTH_STORAGE_KEYS.returnUrl) : null;
    if (returnUrl) {
      sessionStorage.removeItem(AUTH_STORAGE_KEYS.returnUrl);
      router.push(returnUrl);
      return;
    }

    router.back();
  }

  return (
    <article className="cafe-detail-page relative isolate overflow-hidden bg-[var(--background)] pt-16 lg:pb-8">
      <div className="pointer-events-none absolute inset-0 -z-20 bg-[linear-gradient(180deg,var(--background)_0%,#fff8ee_36%,var(--background-secondary)_100%)] dark:bg-[linear-gradient(180deg,var(--background)_0%,#251b13_42%,#1a1714_100%)]" />
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-[0.04] mix-blend-multiply [background-image:url('data:image/svg+xml,%3Csvg_viewBox=%220_0_160_160%22_xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter_id=%22n%22%3E%3CfeTurbulence_type=%22fractalNoise%22_baseFrequency=%220.74%22_numOctaves=%223%22_stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect_width=%22100%25%22_height=%22100%25%22_filter=%22url(%23n)%22_opacity=%220.45%22/%3E%3C/svg%3E')] dark:mix-blend-screen" />

      <div className="mx-auto flex w-full max-w-2xl min-w-0 items-center justify-between px-4 pt-5 pb-3 sm:px-6 lg:max-w-[960px] lg:px-10">
        <button
          onClick={handleBack}
          className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-full border border-[var(--border)] bg-white/62 px-3 text-sm font-bold text-[var(--foreground-muted)] shadow-[var(--shadow-sm)] backdrop-blur-md transition-all hover:-translate-y-px hover:border-[var(--accent)] hover:bg-[var(--accent-light)] hover:text-[var(--accent-hover)] focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] dark:bg-[var(--card)]/72"
        >
          <ChevronLeft size={16} />
          {tc("back")}
        </button>
        <button
          onClick={() => setShareOpen(true)}
          className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-full border border-[var(--border)] bg-white/62 px-3 text-sm font-bold text-[var(--foreground-muted)] shadow-[var(--shadow-sm)] backdrop-blur-md transition-all hover:-translate-y-px hover:border-[var(--accent)] hover:bg-[var(--accent-light)] hover:text-[var(--accent-hover)] focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] dark:bg-[var(--card)]/72"
        >
          <Share2 size={14} />
          {t("share")}
        </button>
      </div>

      <div className="mx-auto w-full max-w-2xl min-w-0 space-y-5 px-4 pb-4 sm:px-6 lg:max-w-[960px] lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full min-w-0 max-w-full overflow-hidden rounded-[24px] border border-[#ffe3b7]/38 bg-white/48 p-1.5 shadow-[0_22px_62px_rgba(44,26,14,0.10)] backdrop-blur-md dark:border-[#ffe3b7]/14 dark:bg-[#1b0f08]/48 dark:shadow-[0_22px_62px_rgba(0,0,0,0.28)]"
        >
          <SmartGallery
            images={cafe.images ?? []}
            orientations={cafe.image_orientations ?? []}
            cafeName={cafe.name}
          />
          {cafe.menuImage && (
            <div className="mt-3 flex flex-wrap items-center gap-3 px-1 pb-1">
              <button
                type="button"
                onClick={() => setMenuOpen(true)}
                className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-full border border-[var(--border)] bg-white/70 px-3.5 text-sm font-bold text-[var(--foreground-muted)] shadow-[var(--shadow-sm)] backdrop-blur-md transition-all hover:-translate-y-px hover:border-[var(--accent)] hover:bg-[var(--accent-light)] hover:text-[var(--accent-hover)] focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] dark:bg-[var(--card)]/72"
              >
                <BookOpen size={15} />
                Menu
              </button>
            </div>
          )}
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
        description={cafe.description ?? cafe.oneLiner}
        mapsUrl={mapsUrl}
        websiteUrl={cafe.websiteUrl ?? cafeUrl}
      />
      {cafe.menuImage && (
        <CafeMenuModal
          open={menuOpen}
          onClose={() => setMenuOpen(false)}
          cafeName={cafe.name}
          menuImage={cafe.menuImage}
        />
      )}
    </article>
  );
}
