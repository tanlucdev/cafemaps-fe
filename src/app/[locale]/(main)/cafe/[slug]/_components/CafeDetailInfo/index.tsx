"use client";

import { motion, useReducedMotion } from "framer-motion";
import { AlarmClock, MapPinned, Navigation } from "lucide-react";
import { useTranslations } from "next-intl";
import { formatCafeDistanceParts } from "@/lib/distance";
import { getCafeOpenStatus } from "@/lib/opening-hours";
import { formatPrice } from "@/lib/utils";
import AboutSection from "./components/AboutSection";
import AmenitiesSection from "./components/AmenitiesSection";
import DetailActions from "./components/DetailActions";
import DetailDivider from "./components/DetailDivider";
import DetailTags from "./components/DetailTags";
import GoodForSection from "./components/GoodForSection";
import ParkingSection from "./components/ParkingSection";
import PriceSection from "./components/PriceSection";
import RatingStars from "./components/RatingStars";
import SignatureDrinkSection from "./components/SignatureDrinkSection";
import SocialSection from "./components/SocialSection";
import {
  formatTime,
  getCafeAboutText,
  getCafeRating,
  getDisplayTags,
  getGoodForItems,
  getParkingLocation,
  getTextParagraphs,
  resolveInstagramLink,
} from "./helpers";
import { useResolvedCafeDistance } from "./hooks/useResolvedCafeDistance";
import type { CafeDetailInfoProps, PhotoCreditWithInstagram } from "./types";

export default function CafeDetailInfo({
  cafe,
  locale,
  saved,
  loadingSave,
  visited,
  loadingVisited,
  voted,
  loadingVote,
  mapsUrl,
  saveLabel,
  visitedLabel,
  voteLabel,
  votedLabel,
  directionsLabel,
  onSave,
  onVisited,
  onVote,
}: CafeDetailInfoProps) {
  const t = useTranslations("cafe");
  const reduceMotion = useReducedMotion();
  const resolvedDistance = useResolvedCafeDistance(cafe, locale);
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
  const featureLabel = t("detail.features");
  const idealForLabel = t("detail.idealFor");
  const purposeLabel = t("detail.purpose");
  const vibeLabel = t("detail.vibe");
  const distanceLabel = t("detail.distanceFromYou", { distance: distanceText });
  const parkingLabel = t("detail.parking");
  const parkingTypeLabel = t("detail.parkingType");
  const parkingLocation = getParkingLocation(cafe, locale);
  const instagramLabel = t("detail.instagram");
  const photoCreditLabel = t("detail.photoCredit");
  const saveAriaLabel = saved ? t("unsave") : t("save");
  const visitedAriaLabel = visited ? t("unmarkVisited") : t("markVisited");
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
  const panelVariants = {
    hidden: reduceMotion ? { opacity: 1 } : { opacity: 0, y: 22, scale: 0.992 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: reduceMotion
        ? { duration: 0 }
        : {
            type: "spring" as const,
            stiffness: 170,
            damping: 24,
            mass: 0.86,
          },
    },
  };
  const itemVariants = {
    hidden: reduceMotion ? { opacity: 1 } : { opacity: 0, y: 14 },
    show: {
      opacity: 1,
      y: 0,
      transition: reduceMotion
        ? { duration: 0 }
        : { duration: 0.34, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
    },
  };
  const revealInitial = reduceMotion ? false : "hidden";
  const revealViewport = { once: true, amount: 0.28, margin: "0px 0px -8% 0px" };

  return (
    <>
      <motion.div
        variants={panelVariants}
        initial="hidden"
        animate="show"
        className="mx-auto w-full max-w-[720px] min-w-0 space-y-5 rounded-[28px] border border-[#ffe3b7]/38 bg-[#fffaf2]/76 px-4 py-5 shadow-[0_18px_54px_rgba(44,26,14,0.08)] backdrop-blur-md sm:px-6 sm:py-6 dark:border-[#ffe3b7]/14 dark:bg-[#1b0f08]/54 dark:shadow-[0_18px_54px_rgba(0,0,0,0.26)]"
      >
        <motion.h1
          variants={itemVariants}
          initial={revealInitial}
          whileInView="show"
          viewport={revealViewport}
          className="text-[32px] leading-[1.12] font-[var(--font-lora)] font-bold text-[var(--foreground)] sm:text-[40px]"
        >
          {cafe.name}
        </motion.h1>

        <motion.div
          variants={itemVariants}
          initial={revealInitial}
          whileInView="show"
          viewport={revealViewport}
          className="flex flex-wrap items-center gap-3"
        >
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
        </motion.div>

        <motion.div
          variants={itemVariants}
          initial={revealInitial}
          whileInView="show"
          viewport={revealViewport}
          className="flex flex-col gap-x-5 gap-y-2.5 text-[13.5px] font-medium text-[var(--foreground-muted)] sm:flex-row sm:flex-wrap"
        >
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
        </motion.div>

        <motion.div variants={itemVariants} initial={revealInitial} whileInView="show" viewport={revealViewport}>
          <DetailTags
            cafe={cafe}
            displayTags={displayTags}
            featureLabel={featureLabel}
            purposeLabel={purposeLabel}
            vibeLabel={vibeLabel}
          />
        </motion.div>
        <motion.div variants={itemVariants} initial={revealInitial} whileInView="show" viewport={revealViewport}>
          <DetailDivider />
        </motion.div>
        <motion.div variants={itemVariants} initial={revealInitial} whileInView="show" viewport={revealViewport}>
          <AboutSection paragraphs={aboutParagraphs} />
        </motion.div>
        <motion.div variants={itemVariants} initial={revealInitial} whileInView="show" viewport={revealViewport}>
          <AmenitiesSection amenities={cafe.amenities} locale={locale} />
        </motion.div>
        <motion.div variants={itemVariants} initial={revealInitial} whileInView="show" viewport={revealViewport}>
          <ParkingSection
            parkingLabel={parkingLabel}
            parkingTypeLabel={parkingTypeLabel}
            parkingLocation={parkingLocation}
          />
        </motion.div>
        <motion.div variants={itemVariants} initial={revealInitial} whileInView="show" viewport={revealViewport}>
          <GoodForSection label={idealForLabel} items={goodForItems} />
        </motion.div>
        <motion.div variants={itemVariants} initial={revealInitial} whileInView="show" viewport={revealViewport}>
          <DetailDivider />
        </motion.div>
        <motion.div variants={itemVariants} initial={revealInitial} whileInView="show" viewport={revealViewport}>
          <SignatureDrinkSection signatureDrink={cafe.signatureDrink} label={t("signatureDrink")} />
        </motion.div>
        <motion.div variants={itemVariants} initial={revealInitial} whileInView="show" viewport={revealViewport}>
          <PriceSection price={price} label={t("priceRange")} />
        </motion.div>
        <motion.div variants={itemVariants} initial={revealInitial} whileInView="show" viewport={revealViewport}>
          <SocialSection
            cafeInstagram={cafeInstagram}
            photoCredits={photoCredits}
            instagramLabel={instagramLabel}
            photoCreditLabel={photoCreditLabel}
          />
        </motion.div>

        <motion.div
          variants={itemVariants}
          initial={revealInitial}
          whileInView="show"
          viewport={revealViewport}
          className="hidden pt-8 lg:block"
        >
          <DetailActions
            saved={saved}
            loadingSave={loadingSave}
            visited={visited}
            loadingVisited={loadingVisited}
            voted={voted}
            loadingVote={loadingVote}
            saveLabel={saveLabel}
            visitedLabel={visitedLabel}
            voteLabel={voteLabel}
            votedLabel={votedLabel}
            directionsLabel={directionsLabel}
            saveAriaLabel={saveAriaLabel}
            visitedAriaLabel={visitedAriaLabel}
            mapsUrl={mapsUrl}
            onSave={onSave}
            onVisited={onVisited}
            onVote={onVote}
          />
        </motion.div>
      </motion.div>

      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={reduceMotion ? { duration: 0 } : { duration: 0.32, delay: 0.18 }}
        className="cafe-detail-mobile-actions fixed right-0 left-0 z-[60] border-t border-[#ffe3b7]/34 bg-[#fffaf2]/88 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-16px_42px_rgba(44,26,14,0.10)] backdrop-blur-xl lg:hidden dark:border-[#ffe3b7]/14 dark:bg-[#1b0f08]/88"
      >
        <div className="mx-auto w-full max-w-[720px] min-w-0 px-4">
          <DetailActions
            saved={saved}
            loadingSave={loadingSave}
            visited={visited}
            loadingVisited={loadingVisited}
            voted={voted}
            loadingVote={loadingVote}
            saveLabel={saveLabel}
            visitedLabel={visitedLabel}
            voteLabel={voteLabel}
            votedLabel={votedLabel}
            directionsLabel={directionsLabel}
            saveAriaLabel={saveAriaLabel}
            visitedAriaLabel={visitedAriaLabel}
            mapsUrl={mapsUrl}
            onSave={onSave}
            onVisited={onVisited}
            onVote={onVote}
          />
        </div>
      </motion.div>
    </>
  );
}
