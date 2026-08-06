"use client";

import { Globe2, MapPinned } from "lucide-react";
import ShareLinkModal from "@/components/share/ShareLinkModal";
import { useTranslations } from "next-intl";

interface ShareModalProps {
  open: boolean;
  onClose: () => void;
  cafeName: string;
  description?: string | null;
  mapsUrl: string;
  websiteUrl: string;
}

export default function ShareModal({ open, onClose, mapsUrl, websiteUrl }: ShareModalProps) {
  const t = useTranslations("common");

  const links = [
    {
      key: "maps",
      label: t("googleMapsLink"),
      url: mapsUrl,
      icon: <MapPinned size={16} />,
    },
    {
      key: "website",
      label: t("websiteLink"),
      url: websiteUrl,
      icon: <Globe2 size={16} />,
    },
  ];

  return (
    <ShareLinkModal
      open={open}
      onClose={onClose}
      title={t("share")}
      links={links}
      copyLabel={t("copy")}
      copiedLabel={t("copied")}
    />
  );
}
