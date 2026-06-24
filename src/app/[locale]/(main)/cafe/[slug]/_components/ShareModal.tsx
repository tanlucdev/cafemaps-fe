"use client";

import { useState } from "react";
import { Check, Copy, ExternalLink, Globe2, MapPinned } from "lucide-react";
import Modal from "@/components/ui/Modal";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface SharePlatform {
  name: string;
  href: string;
  colorClass: string;
  icon: React.ReactNode;
}

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

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function ThreadsIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.964-.065-1.19.408-2.285 1.33-3.082.88-.76 2.119-1.207 3.583-1.291a13.853 13.853 0 013.02.142c-.126-.742-.375-1.332-.75-1.757-.513-.586-1.312-.883-2.371-.887h-.018c-.868 0-1.992.247-2.721 1.23l-1.664-1.189C8.548 5.17 10.044 4.404 12 4.404h.033c3.894.033 5.904 2.151 5.904 6.092 0 .033-.005.065-.005.098.97.449 1.752 1.111 2.292 1.955.77 1.185 1.072 2.694.831 4.245-.262 1.73-1.139 3.34-2.374 4.433C17.044 22.852 14.832 23.983 12.186 24z" />
    </svg>
  );
}

function buildPlatforms(shareText: string, shareUrl: string): SharePlatform[] {
  return [
    {
      name: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
      colorClass: "bg-[#1877F2] hover:bg-[#166FE5] text-white",
      icon: <FacebookIcon />,
    },
    {
      name: "X",
      href: `https://x.com/intent/tweet?text=${shareText}&url=${shareUrl}`,
      colorClass: "bg-[#000000] hover:bg-[#111111] text-white",
      icon: <XIcon />,
    },
    {
      name: "WhatsApp",
      href: `https://wa.me/?text=${shareText}%20${shareUrl}`,
      colorClass: "bg-[#25D366] hover:bg-[#20bd5a] text-white",
      icon: <WhatsAppIcon />,
    },
    {
      name: "Threads",
      href: `https://www.threads.net/intent/post?text=${shareText}%20${shareUrl}`,
      colorClass:
        "bg-[var(--social-threads-bg)] hover:bg-[var(--social-threads-bg-hover)] text-[var(--social-threads-fg)]",
      icon: <ThreadsIcon />,
    },
  ];
}

export default function ShareModal({
  open,
  onClose,
  cafeName,
  description,
  mapsUrl,
  websiteUrl,
}: ShareModalProps) {
  const t = useTranslations("common");
  const [copiedLink, setCopiedLink] = useState<ShareLinkKey | null>(null);

  const shareText = encodeURIComponent(`${cafeName}${description ? ` — ${description}` : ""}`);
  const shareUrl = encodeURIComponent(websiteUrl);
  const platforms = buildPlatforms(shareText, shareUrl);
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
