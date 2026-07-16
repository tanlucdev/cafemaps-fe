"use client";

import { useState } from "react";
import { Check, Copy, ExternalLink, Globe2, MapPinned } from "lucide-react";
import Modal from "@/components/ui/Modal";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface ShareModalProps {
  open: boolean;
  onClose: () => void;
  cafeName: string;
  description?: string | null;
  mapsUrl: string;
  websiteUrl: string;
}

type ShareLinkKey = "website" | "maps";

interface ShareLink {
  key: ShareLinkKey;
  label: string;
  url: string;
  icon: React.ReactNode;
}

export default function ShareModal({
  open,
  onClose,
  mapsUrl,
  websiteUrl,
}: ShareModalProps) {
  const t = useTranslations("common");
  const [copiedLink, setCopiedLink] = useState<ShareLinkKey | null>(null);

  const links: ShareLink[] = [
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

  async function handleCopyLink(key: ShareLinkKey, value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedLink(key);
      setTimeout(() => setCopiedLink(null), 2000);
    } catch {
      // clipboard API unavailable
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={t("share")} size="sm">
      <div className="space-y-5 px-6 py-5">
        <div className="space-y-3">
          {links.map((link) => {
            const copied = copiedLink === link.key;

            return (
              <div
                key={link.key}
                className="border-border rounded-xl border bg-(--background-secondary) p-3"
              >
                <div className="mb-2 flex items-center justify-between gap-2">
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-(--foreground)">
                    {link.icon}
                    {link.label}
                  </span>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-(--foreground-muted) transition-colors hover:text-(--foreground)"
                    aria-label={link.label}
                  >
                    <ExternalLink size={14} />
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <span className="flex-1 truncate text-sm text-(--foreground-muted)">
                    {link.url}
                  </span>
                  <button
                    onClick={() => handleCopyLink(link.key, link.url)}
                    className={cn(
                      "flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-200",
                      copied ? "bg-green-500 text-white" : "bg-accent text-white hover:opacity-90",
                    )}
                  >
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                    {copied ? t("copied") : t("copy")}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Modal>
  );
}
