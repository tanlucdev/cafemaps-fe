"use client";

import { useEffect, useId, useState } from "react";
import Image from "next/image";
import { Coffee, Download, X } from "lucide-react";
import { useTranslations } from "next-intl";
import donateQr from "../../../public/image/donate-qr.jpg";

export default function DonateFloatingButton() {
  const t = useTranslations("donate");
  const panelId = useId();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [open]);

  return (
    <div className="fixed right-4 bottom-[calc(var(--ios-bottom-guard-height,80px)+72px)] z-50 flex flex-col items-end gap-3 md:right-6 md:bottom-6">
      {open && (
        <aside
          id={panelId}
          className="max-h-[calc(100svh-var(--ios-bottom-guard-height,80px)-156px)] w-[min(calc(100vw-2rem),18rem)] overflow-y-auto rounded-lg border border-[var(--border)] bg-[var(--background)] p-4 text-[var(--foreground)] shadow-xl md:max-h-[calc(100svh-7rem)]"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold">{t("title")}</h2>
              <p className="mt-1 text-sm leading-5 text-[var(--foreground)]/75">
                {t("description")}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={t("close")}
              className="grid size-8 shrink-0 cursor-pointer place-items-center rounded-full border border-[var(--border)] text-[var(--foreground)]/70 transition hover:text-[var(--foreground)] focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:outline-none"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-4 overflow-hidden rounded-md border border-[var(--border)] bg-white p-2">
            <Image
              src={donateQr}
              alt={t("title")}
              width={224}
              height={224}
              className="mx-auto h-auto w-full max-w-44 md:max-w-full"
              priority={false}
            />
          </div>
          <p className="mt-2 text-center text-xs text-[var(--foreground)]/65">{t("scanHint")}</p>
          <a
            href="/image/donate-qr.jpg"
            download
            className="mt-3 inline-flex h-9 w-full cursor-pointer items-center justify-center gap-2 rounded-full border border-[var(--border)] text-sm font-semibold text-[var(--foreground)] transition hover:bg-[var(--accent)] hover:text-[var(--background)] focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:outline-none"
          >
            <Download className="size-4" aria-hidden="true" />
            {t("downloadQr")}
          </a>
        </aside>
      )}
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-label={t("aria")}
        aria-controls={panelId}
        aria-expanded={open}
        className="grid size-14 cursor-pointer place-items-center rounded-full bg-[var(--accent)] text-[var(--background)] shadow-lg transition hover:bg-[var(--accent-hover)] focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] focus-visible:outline-none"
      >
        <Coffee className="size-6" aria-hidden="true" />
      </button>
    </div>
  );
}
