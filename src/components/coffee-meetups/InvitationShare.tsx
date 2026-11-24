"use client";

import { useState } from "react";
import { Download, Link2, MapPin, Share2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import type { CoffeeMeetup } from "@/apis/coffee-meetups";
import type { InvitationStyle } from "@/apis/coffee-meetups/invitation";
import ShareLinkModal from "@/components/share/ShareLinkModal";
import { trackEvent } from "@/lib/analytics";

export default function InvitationShare({
  meetup,
  design,
}: {
  meetup: CoffeeMeetup;
  design: InvitationStyle;
}) {
  const locale = useLocale();
  const t = useTranslations("coffeeMeetups.invitation");
  const common = useTranslations("common");
  const [url, setUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);
  const id = encodeURIComponent(meetup.id);
  const params = new URLSearchParams(design);
  const mapsUrl =
    meetup.place.kind === "external"
      ? meetup.place.googleMapsUrl
      : meetup.cafe &&
        `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          [meetup.cafe.name, meetup.cafe.address || meetup.cafe.district].filter(Boolean).join(" "),
        )}`;

  async function download() {
    setBusy(true);
    setFailed(false);
    try {
      const response = await fetch(
        `/api/coffee-meetups/${id}/invitation-image?${params}&locale=${locale}`,
      );
      if (!response.ok || !response.headers.get("content-type")?.startsWith("image/png")) {
        throw new Error("Invitation PNG unavailable");
      }
      const objectUrl = URL.createObjectURL(await response.blob());
      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = `cafe-maps-${id}.png`;
      document.body.append(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
    } catch {
      setFailed(true);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <button
        type="button"
        data-invitation-share
        onClick={() => {
          setUrl(new URL(`/${locale}/coffee-meetups/${id}?${params}`, window.location.origin).href);
          setFailed(false);
          trackEvent("coffee_meetup_share");
        }}
        className="inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-sm font-bold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-ink)]"
      >
        <Share2 size={16} aria-hidden="true" />
        {t("share")}
      </button>
      <ShareLinkModal
        open={Boolean(url)}
        onClose={() => setUrl("")}
        title={t("share")}
        copyLabel={common("copy")}
        copiedLabel={common("copied")}
        links={[
          { key: "invitation", label: t("link"), url, icon: <Link2 size={14} /> },
          ...(mapsUrl
            ? [{ key: "maps", label: "Google Maps", url: mapsUrl, icon: <MapPin size={14} /> }]
            : []),
        ]}
        footer={
          <div>
            <button
              type="button"
              onClick={download}
              disabled={busy}
              className="bg-accent flex min-h-11 w-full items-center justify-center gap-2 rounded-xl px-3 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
            >
              <Download size={16} aria-hidden="true" />
              {busy ? t("downloading") : t("download")}
            </button>
            {failed && (
              <p role="alert" className="mt-2 text-sm text-red-700">
                {t("downloadError")}
              </p>
            )}
          </div>
        }
      />
    </>
  );
}
