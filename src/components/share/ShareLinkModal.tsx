"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { Check, Copy, ExternalLink } from "lucide-react";
import Modal from "@/components/ui/Modal";
import { cn } from "@/lib/utils";

export interface ShareLinkItem {
  key: string;
  label: string;
  url: string;
  icon: ReactNode;
}

export default function ShareLinkModal({
  open,
  onClose,
  title,
  links,
  copyLabel,
  copiedLabel,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  links: ShareLinkItem[];
  copyLabel: string;
  copiedLabel: string;
}) {
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  async function handleCopyLink(key: string, value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedLink(key);
      setTimeout(() => setCopiedLink(null), 2000);
    } catch {
      // clipboard API unavailable
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={title} size="sm">
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
                    type="button"
                    onClick={() => handleCopyLink(link.key, link.url)}
                    className={cn(
                      "flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-200",
                      copied ? "bg-green-500 text-white" : "bg-accent text-white hover:opacity-90",
                    )}
                  >
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                    {copied ? copiedLabel : copyLabel}
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
