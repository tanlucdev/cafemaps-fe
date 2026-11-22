import { useState } from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Dialog } from "@base-ui/react/dialog";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { getCafeBySlug } from "@/apis/cafes";
import type { CoffeeMeetup } from "@/apis/coffee-meetups";

export default function InvitationVenue({
  meetup,
  draft,
  sample,
}: {
  meetup: CoffeeMeetup;
  draft: boolean;
  sample?: boolean;
}) {
  const t = useTranslations("coffeeMeetups");
  const locale = useLocale();
  const cafe = meetup.cafe;
  const cafeName = cafe?.name;
  const cafeImage = cafe?.coverImage || cafe?.images?.[0];
  const [previewOpen, setPreviewOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fullCafe, setFullCafe] = useState<Awaited<ReturnType<typeof getCafeBySlug>>>(null);
  async function openPreview() {
    setPreviewOpen(true);
    if (sample || !cafe || fullCafe || loading) return;
    setLoading(true);
    try {
      setFullCafe(await getCafeBySlug(cafe.slug, locale));
    } finally {
      setLoading(false);
    }
  }
  return (
    <>
      {meetup.place.kind === "external" ? (
        <div className="flex flex-wrap items-center gap-x-2 sm:block">
          <p className="font-semibold">{meetup.place.name || t("invitation.placeMissing")}</p>
          {!draft && meetup.place.googleMapsUrl && (
            <a
              className="inline-flex min-h-9 items-center gap-1 rounded-full px-2 text-xs font-bold whitespace-nowrap text-[var(--accent-ink)] underline underline-offset-4 sm:mt-1 sm:bg-[var(--wash)] sm:px-3 sm:no-underline sm:hover:underline"
              href={meetup.place.googleMapsUrl}
              target="_blank"
              rel="noreferrer"
            >
              {t("form.googleMapsOpen")} <ArrowUpRight size={14} aria-hidden="true" />
            </a>
          )}
        </div>
      ) : cafe ? (
        <div className="flex flex-wrap items-center gap-x-3 sm:block">
          <div className="min-w-0 grow">
            <p className="font-semibold">{cafe.name}</p>
            {(cafe.address || cafe.district) && (
              <p className="text-[13px] text-[#6e6254] sm:mt-1 sm:text-sm">
                {cafe.address || cafe.district}
              </p>
            )}
          </div>
          {!draft && (
            <>
              <button
                type="button"
                onClick={openPreview}
                className="min-h-9 shrink-0 text-xs font-bold text-[var(--accent-ink)] underline decoration-[#cbaa80] underline-offset-4 hover:decoration-current sm:mt-1 sm:text-sm"
              >
                {t("form.quickPreview")}
              </button>
              <Dialog.Root open={previewOpen} onOpenChange={setPreviewOpen}>
                <Dialog.Portal>
                  <Dialog.Backdrop className="fixed inset-0 z-[90] bg-black/40" />
                  <Dialog.Popup className="fixed top-1/2 left-1/2 z-[91] flex max-h-[85svh] w-[calc(100%-2rem)] max-w-lg -translate-1/2 flex-col overflow-hidden rounded-3xl bg-[#fffdf8] p-5 shadow-xl">
                    <Dialog.Title className="font-lora text-xl font-bold">{cafeName}</Dialog.Title>
                    <div className="min-h-0 flex-1 overflow-y-auto py-4">
                      {(fullCafe?.coverImage || fullCafe?.images?.[0] || cafeImage) && (
                        <div className="relative mb-4 h-48 overflow-hidden rounded-2xl">
                          <Image
                            src={fullCafe?.coverImage || fullCafe?.images?.[0] || cafeImage!}
                            alt=""
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <p>{fullCafe?.address || cafe?.address || cafe?.district || cafeName}</p>
                      {loading && <p className="mt-3 text-sm text-[#6e6254]">{t("loading")}</p>}
                    </div>
                    <div className="flex justify-between gap-3">
                      <Link
                        href={`/cafe/${cafe.slug}`}
                        className="self-center font-bold text-[#8b5d2e] underline"
                      >
                        {t("form.cafeDetails")}
                      </Link>
                      <Dialog.Close className="min-h-11 rounded-full bg-[#8b5d2e] px-5 font-bold text-white">
                        {t("form.closePicker")}
                      </Dialog.Close>
                    </div>
                  </Dialog.Popup>
                </Dialog.Portal>
              </Dialog.Root>
            </>
          )}
        </div>
      ) : (
        <p className="mt-1 text-sm text-[#6e6254]">
          {draft ? t("invitation.placeMissing") : t("linkedCafeMissing")}
        </p>
      )}
    </>
  );
}
