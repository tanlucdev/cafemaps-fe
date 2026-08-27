"use client";

import { useEffect, useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { BookOpen, ChevronLeft, Share2 } from "lucide-react";
import { toast } from "sonner";
import SmartGallery from "@/components/SmartGallery";
import type { Cafe } from "@/types/cafe";
import { useTranslations } from "next-intl";
import { AUTH_STORAGE_KEYS } from "@/constants/auth-keys";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import {
  getMyCafeVotes,
  isUnauthorizedError,
  toggleSaveCafe,
  unvoteCafe,
  voteCafe,
} from "@/lib/api";
import { getCurrentAccessToken, saveAuthReturnUrl } from "@/lib/auth-client";
import SaveToFolderModal from "@/components/cafe/SaveToFolderModal";
import ShareModal from "./ShareModal";
import CafeDetailInfo from "./CafeDetailInfo";
import CafeMenuModal from "./CafeMenuModal";
import { useCafeVisited } from "./useCafeVisited";
import { useTrackCafeView } from "./useTrackCafeView";

interface CafeDetailContentProps {
  cafe: Cafe;
  locale: string;
}

export default function CafeDetailContent({ cafe, locale }: CafeDetailContentProps) {
  const t = useTranslations("cafe");
  const tc = useTranslations("common");
  const router = useRouter();
  const reduceMotion = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll();
  const galleryY = useSpring(useTransform(scrollYProgress, [0, 0.22], [0, -34]), {
    stiffness: 120,
    damping: 24,
    mass: 0.7,
  });
  const [saved, setSaved] = useState(false);
  const [voted, setVoted] = useState(cafe.hasUserVote ?? false);
  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingVote, setLoadingVote] = useState(false);
  const [pickerToken, setPickerToken] = useState<string | null>(null);
  const [shareOpen, setShareOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const viewCount = useTrackCafeView(cafe.id, cafe.viewCount);

  const cafeUrl =
    typeof window !== "undefined"
      ? window.location.href
      : `https://cafefinder.vn/${locale}/cafe/${cafe.slug}`;

  const mapsUrl =
    cafe.googleMapsUrl ??
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      cafe.name + " " + (cafe.address ?? ""),
    )}`;
  const { visited, loadingVisited, handleVisited } = useCafeVisited(cafe.id, locale);
  const saveLabel = saved ? t("saved") : t("saveShort");
  const visitedLabel = visited ? t("visited") : t("markVisited");
  const voteLabel = t("vote");
  const votedLabel = t("voted");
  const directionsLabel = t("directions");
  const heroTransition = reduceMotion
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 180, damping: 24, mass: 0.82 };

  useEffect(() => {
    let cancelled = false;

    async function loadVoteState() {
      const token = await getCurrentAccessToken();
      if (!token) return;
      const ids = await getMyCafeVotes(token);
      if (!cancelled && ids.includes(cafe.id)) setVoted(true);
    }

    void loadVoteState().catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [cafe.id]);

  async function handleSave() {
    if (loadingSave) return;

    const token = await getCurrentAccessToken();
    if (!token) {
      saveAuthReturnUrl();
      router.push("/login");
      return;
    }

    const prev = saved;
    if (!prev) {
      setPickerToken(token);
      return;
    }

    setLoadingSave(true);
    setSaved(false);
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

  async function handleSaveToFolder(collectionName: string | null) {
    if (!pickerToken || loadingSave) return;
    setLoadingSave(true);
    try {
      const result = await toggleSaveCafe(cafe.id, pickerToken, false, collectionName);
      setSaved(result.saved);
      setPickerToken(null);
      toast.success(
        result.collectionName
          ? t("savedToFolder", { folder: result.collectionName })
          : t("savedToAll")
      );
    } catch (error) {
      if (isUnauthorizedError(error)) {
        saveAuthReturnUrl();
        router.push("/login");
      }
    } finally {
      setLoadingSave(false);
    }
  }

  async function handleVote() {
    if (loadingVote) return;

    function redirectToLogin() {
      toast.warning(t("loginRequiredToVote"));
      saveAuthReturnUrl();
      setTimeout(() => router.push("/login"), 700);
    }

    const token = await getCurrentAccessToken();
    if (!token) {
      redirectToLogin();
      return;
    }

    setLoadingVote(true);
    const nextVoted = !voted;
    setVoted(nextVoted);
    try {
      await (nextVoted ? voteCafe : unvoteCafe)(cafe.id, token);
      toast.success(t(nextVoted ? "voteSuccess" : "unvoteSuccess"));
    } catch (error) {
      setVoted(!nextVoted);
      if (isUnauthorizedError(error)) redirectToLogin();
    } finally {
      setLoadingVote(false);
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
    <article className="cafe-detail-page relative isolate overflow-hidden bg-[var(--background)] pt-16 !pb-[calc(var(--mobile-bottom-nav-height)+env(safe-area-inset-bottom,0px)+1rem)] md:!pb-8">
      <div className="pointer-events-none absolute inset-0 -z-20 bg-[linear-gradient(180deg,var(--background)_0%,#fff8ee_36%,var(--background-secondary)_100%)] dark:bg-[linear-gradient(180deg,var(--background)_0%,#251b13_42%,#1a1714_100%)]" />
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-[0.04] mix-blend-multiply [background-image:url('data:image/svg+xml,%3Csvg_viewBox=%220_0_160_160%22_xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter_id=%22n%22%3E%3CfeTurbulence_type=%22fractalNoise%22_baseFrequency=%220.74%22_numOctaves=%223%22_stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect_width=%22100%25%22_height=%22100%25%22_filter=%22url(%23n)%22_opacity=%220.45%22/%3E%3C/svg%3E')] dark:mix-blend-screen" />

      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={heroTransition}
        className="mx-auto flex w-full max-w-2xl min-w-0 items-center justify-between px-4 pt-5 pb-3 sm:px-6 lg:max-w-[960px] lg:px-10"
      >
        <motion.button
          onClick={handleBack}
          whileHover={reduceMotion ? undefined : { y: -2, scale: 1.02 }}
          whileTap={reduceMotion ? undefined : { scale: 0.96 }}
          className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-full border border-[var(--border)] bg-white/62 px-3 text-sm font-bold text-[var(--foreground-muted)] shadow-[var(--shadow-sm)] backdrop-blur-md transition-all hover:-translate-y-px hover:border-[var(--accent)] hover:bg-[var(--accent-light)] hover:text-[var(--accent-hover)] focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] dark:bg-[var(--card)]/72"
        >
          <ChevronLeft size={16} />
          {tc("back")}
        </motion.button>
        <motion.button
          onClick={() => setShareOpen(true)}
          whileHover={reduceMotion ? undefined : { y: -2, scale: 1.02 }}
          whileTap={reduceMotion ? undefined : { scale: 0.96 }}
          className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-full border border-[var(--border)] bg-white/62 px-3 text-sm font-bold text-[var(--foreground-muted)] shadow-[var(--shadow-sm)] backdrop-blur-md transition-all hover:-translate-y-px hover:border-[var(--accent)] hover:bg-[var(--accent-light)] hover:text-[var(--accent-hover)] focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] dark:bg-[var(--card)]/72"
        >
          <Share2 size={14} />
          {t("share")}
        </motion.button>
      </motion.div>

      <div className="mx-auto w-full max-w-2xl min-w-0 space-y-5 px-4 pb-4 sm:px-6 lg:max-w-[960px] lg:px-10">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, scale: 0.982 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={reduceMotion ? undefined : { scale: 1.006 }}
          style={reduceMotion ? undefined : { y: galleryY }}
          transition={{ ...heroTransition, delay: reduceMotion ? 0 : 0.06 }}
          className="w-full min-w-0 max-w-full overflow-hidden rounded-[24px] border border-[#ffe3b7]/38 bg-white/48 p-1.5 shadow-[0_22px_62px_rgba(44,26,14,0.10)] backdrop-blur-md dark:border-[#ffe3b7]/14 dark:bg-[#1b0f08]/48 dark:shadow-[0_22px_62px_rgba(0,0,0,0.28)]"
        >
          <SmartGallery
            images={cafe.images ?? []}
            orientations={cafe.image_orientations ?? []}
            cafeName={cafe.name}
          />
          {cafe.menuImage && (
            <div className="mt-3 flex flex-wrap items-center gap-3 px-1 pb-1">
              <motion.button
                type="button"
                onClick={() => setMenuOpen(true)}
                whileHover={reduceMotion ? undefined : { y: -2, scale: 1.02 }}
                whileTap={reduceMotion ? undefined : { scale: 0.96 }}
                className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-full border border-[var(--border)] bg-white/70 px-3.5 text-sm font-bold text-[var(--foreground-muted)] shadow-[var(--shadow-sm)] backdrop-blur-md transition-all hover:-translate-y-px hover:border-[var(--accent)] hover:bg-[var(--accent-light)] hover:text-[var(--accent-hover)] focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] dark:bg-[var(--card)]/72"
              >
                <BookOpen size={15} />
                Menu
              </motion.button>
            </div>
          )}
        </motion.div>

        <CafeDetailInfo
          cafe={{ ...cafe, viewCount }}
          locale={locale}
            saved={saved}
            loadingSave={loadingSave}
            visited={visited}
            loadingVisited={loadingVisited}
            voted={voted}
            loadingVote={loadingVote}
            mapsUrl={mapsUrl}
            saveLabel={saveLabel}
            visitedLabel={visitedLabel}
            voteLabel={voteLabel}
            votedLabel={votedLabel}
            directionsLabel={directionsLabel}
            onSave={handleSave}
            onVisited={handleVisited}
            onVote={handleVote}
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
      <SaveToFolderModal
        open={Boolean(pickerToken)}
        token={pickerToken}
        saving={loadingSave}
        onClose={() => setPickerToken(null)}
        onSelect={handleSaveToFolder}
      />
    </article>
  );
}
