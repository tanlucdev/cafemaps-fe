"use client";

import { useState } from "react";
import { AlarmClock, BookOpen, MapPinned } from "lucide-react";
import SmartGallery from "@/components/SmartGallery";
import { formatPrice } from "@/lib/utils";
import type { Cafe } from "@/types/cafe";
import CafeMenuModal from "../../../cafe/[slug]/_components/CafeMenuModal";
import AboutSection from "../../../cafe/[slug]/_components/CafeDetailInfo/components/AboutSection";
import AmenitiesSection from "../../../cafe/[slug]/_components/CafeDetailInfo/components/AmenitiesSection";
import DetailDivider from "../../../cafe/[slug]/_components/CafeDetailInfo/components/DetailDivider";
import DetailTags from "../../../cafe/[slug]/_components/CafeDetailInfo/components/DetailTags";
import GoodForSection from "../../../cafe/[slug]/_components/CafeDetailInfo/components/GoodForSection";
import ParkingSection from "../../../cafe/[slug]/_components/CafeDetailInfo/components/ParkingSection";
import PriceSection from "../../../cafe/[slug]/_components/CafeDetailInfo/components/PriceSection";
import SignatureDrinkSection from "../../../cafe/[slug]/_components/CafeDetailInfo/components/SignatureDrinkSection";
import SocialSection from "../../../cafe/[slug]/_components/CafeDetailInfo/components/SocialSection";
import {
  formatTime,
  getCafeAboutText,
  getDisplayTags,
  getGoodForItems,
  getParkingLocation,
  getTextParagraphs,
  resolveInstagramLink,
} from "../../../cafe/[slug]/_components/CafeDetailInfo/helpers";
import type { Draft } from "./model";

type PreviewPaneProps = {
  draft: Draft;
  images: string[];
  menuImages: string[];
};

export function PreviewPane({ draft, images, menuImages }: PreviewPaneProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const cafe = toPreviewCafe(draft, images, menuImages);
  const hours = [formatTime(cafe.openingTime), formatTime(cafe.closingTime)].filter(Boolean).join(" – ");
  const aboutText = getCafeAboutText(cafe, "vi");
  const aboutParagraphs = aboutText ? getTextParagraphs(aboutText) : [];
  const displayTags = getDisplayTags(cafe, "vi");
  const goodForItems = hasTaxonomy(cafe) ? getGoodForItems(cafe, "vi") : [];
  const parkingLocation = getParkingLocation(cafe, "vi");
  const cafeInstagram = resolveInstagramLink(cafe.instagramUrl);
  const price = formatPrice(cafe.priceMin, cafe.priceMax, "vi");
  const hasMiddle = Boolean(
    aboutParagraphs.length || cafe.amenities.length || parkingLocation || goodForItems.length,
  );
  const hasFooter = Boolean(cafe.signatureDrink || price || cafeInstagram);
  const hasInfo = Boolean(
    cafe.name ||
      hours ||
      cafe.address ||
      cafe.googleMapsUrl ||
      displayTags.length ||
      hasMiddle ||
      hasFooter,
  );

  if (!hasPreviewContent(draft, images, menuImages)) return null;

  return (
    <section className="min-w-0 max-w-full space-y-5 overflow-x-hidden">
      {images.length > 0 && (
        <div className="w-full min-w-0 overflow-hidden rounded-[24px] border border-[#ffe3b7]/38 bg-white/48 p-1.5 shadow-[0_22px_62px_rgba(44,26,14,0.10)] backdrop-blur-md dark:border-[#ffe3b7]/14 dark:bg-[#1b0f08]/48">
          <SmartGallery
            images={images}
            orientations={draft.imageOrientations ?? []}
            coverImageCrop={draft.coverImageCrop}
            cafeName={cafe.name}
          />
          {menuImages.length > 0 && (
            <div className="mt-3 flex flex-wrap items-center gap-3 px-1 pb-1">
              <button
                type="button"
                onClick={() => setMenuOpen(true)}
                className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-full border border-[var(--border)] bg-white/70 px-3.5 text-sm font-bold text-[var(--foreground-muted)] shadow-[var(--shadow-sm)] backdrop-blur-md transition-all hover:-translate-y-px hover:border-[var(--accent)] hover:bg-[var(--accent-light)] hover:text-[var(--accent-hover)] dark:bg-[var(--card)]/72"
              >
                <BookOpen size={15} />
                Menu
              </button>
            </div>
          )}
        </div>
      )}

      {hasInfo && (
        <div className="mx-auto w-full max-w-[720px] min-w-0 space-y-5 overflow-hidden rounded-[28px] border border-[#ffe3b7]/38 bg-[#fffaf2]/76 px-4 py-5 shadow-[0_18px_54px_rgba(44,26,14,0.08)] backdrop-blur-md [&_a]:min-w-0 [&_a]:break-words [&_a]:[overflow-wrap:anywhere] sm:px-6 sm:py-6 dark:border-[#ffe3b7]/14 dark:bg-[#1b0f08]/54">
          {cafe.name && (
            <h1 className="min-w-0 text-[32px] leading-[1.12] font-[var(--font-lora)] font-bold break-words text-[var(--foreground)] [overflow-wrap:anywhere] sm:text-[40px]">
              {cafe.name}
            </h1>
          )}
          <div className="flex min-w-0 flex-col gap-x-5 gap-y-2.5 text-[13.5px] font-medium text-[var(--foreground-muted)] sm:flex-row sm:flex-wrap">
            {hours && (
              <span className="flex min-w-0 items-center gap-1.5">
                <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#e6f6ef] text-[#1d6b45] dark:bg-[#123028] dark:text-[#8ed7ad]">
                  <AlarmClock size={12} />
                </span>
                {hours}
              </span>
            )}
            {(cafe.address || cafe.googleMapsUrl) && (
              <span className="flex min-w-0 items-start gap-1.5">
                <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#fff0dc] text-[#b86f20] dark:bg-[#3a2414] dark:text-[#f0b869]">
                  <MapPinned size={12} />
                </span>
                <span className="min-w-0 break-words [overflow-wrap:anywhere]">
                  {cafe.address || "Google Maps"}
                </span>
              </span>
            )}
          </div>
          <DetailTags
            cafe={cafe}
            displayTags={displayTags}
            featureLabel="Đặc điểm"
            purposeLabel="Phù hợp"
            vibeLabel="Vibe"
          />
          {(hasMiddle || hasFooter) && <DetailDivider />}
          <AboutSection paragraphs={aboutParagraphs} />
          <AmenitiesSection amenities={cafe.amenities} locale="vi" />
          <ParkingSection parkingLabel="Gửi xe" parkingTypeLabel="Chỗ để xe" parkingLocation={parkingLocation} />
          <GoodForSection label="Hợp để" items={goodForItems} />
          {hasMiddle && hasFooter && <DetailDivider />}
          <SignatureDrinkSection signatureDrink={cafe.signatureDrink} label="Thức uống đặc trưng" />
          <PriceSection price={price} label="Khoảng giá" />
          <SocialSection
            cafeInstagram={cafeInstagram}
            photoCredits={[]}
            instagramLabel="Instagram"
            photoCreditLabel="Nguồn ảnh"
          />
        </div>
      )}

      {menuImages.length > 0 && (
        <CafeMenuModal
          open={menuOpen}
          onClose={() => setMenuOpen(false)}
          cafeName={cafe.name}
          menuImages={menuImages}
        />
      )}
    </section>
  );
}

export function hasPreviewContent(draft: Draft, images: string[], menuImages: string[]) {
  return Boolean(
    images.length ||
      menuImages.length ||
      draft.name?.trim() ||
      draft.openingTime?.trim() ||
      draft.closingTime?.trim() ||
      draft.address?.trim() ||
      draft.googleMapsUrl?.trim() ||
      draft.oneLiner?.trim() ||
      draft.description?.trim() ||
      draft.signatureDrink?.trim() ||
      draft.parkingLocation?.trim() ||
      draft.instagramUrl?.trim() ||
      draft.priceMin ||
      draft.priceMax ||
      draft.vibes?.length ||
      draft.purposes?.length ||
      draft.amenities?.length ||
      draft.tags?.length,
  );
}

function toPreviewCafe(draft: Draft, images: string[], menuImages: string[]): Cafe {
  return {
    id: "owner-preview",
    slug: "owner-preview",
    name: draft.name?.trim() || "",
    address: draft.address?.trim() || null,
    district: draft.district?.trim() || null,
    googleMapsUrl: draft.googleMapsUrl?.trim() || null,
    openingTime: draft.openingTime?.trim() || null,
    closingTime: draft.closingTime?.trim() || null,
    priceMin: draft.priceMin ?? null,
    priceMax: draft.priceMax ?? null,
    oneLiner: draft.oneLiner?.trim() || null,
    description: draft.description?.trim() || null,
    vibes: draft.vibes ?? [],
    purposes: draft.purposes ?? [],
    amenities: draft.amenities ?? [],
    tags: draft.tags ?? [],
    signatureDrink: draft.signatureDrink?.trim() || null,
    parkingLocation: draft.parkingLocation?.trim() || null,
    images,
    image_orientations: draft.imageOrientations ?? [],
    coverImage: images[0] ?? null,
    coverImageCrop: draft.coverImageCrop ?? null,
    menuImages,
    instagramUrl: draft.instagramUrl?.trim() || null,
    isPublished: false,
  };
}

function hasTaxonomy(cafe: Cafe) {
  return cafe.vibes.length + cafe.purposes.length + cafe.amenities.length + cafe.tags.length > 0;
}
