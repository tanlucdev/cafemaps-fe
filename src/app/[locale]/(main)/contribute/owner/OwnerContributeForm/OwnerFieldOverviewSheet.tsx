"use client";

import { useState } from "react";
import { ClipboardList } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

const ITEM_KEYS = [
  "photos",
  "name",
  "location",
  "hours",
  "description",
  "vibe",
  "parking",
  "featured",
  "menu",
  "ownerContact",
  "verification",
] as const;

export function OwnerFieldOverviewSheet() {
  const t = useTranslations("contribute.ownerSheet");
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mb-4 inline-flex h-11 items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--contribute-surface)] px-4 text-sm font-black text-[var(--foreground)] shadow-[var(--shadow-sm)] transition hover:border-[var(--accent)]/35 hover:text-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/30"
      >
        <ClipboardList className="size-4" aria-hidden="true" />
        {t("button")}
      </button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="bottom"
          overlayClassName="bg-[#2c1a0e]/18 backdrop-blur-none supports-backdrop-filter:backdrop-blur-[1px]"
          className="max-h-[86dvh] overflow-hidden rounded-t-[24px] border-[var(--border)] bg-[var(--contribute-surface)] p-0 shadow-[0_18px_60px_rgba(44,26,14,0.22)] md:top-0 md:right-0 md:bottom-auto md:left-auto md:h-full md:max-h-none md:w-[clamp(380px,32vw,460px)] md:rounded-l-2xl md:rounded-r-none md:border-l md:border-t-0"
        >
          <SheetHeader className="shrink-0 border-b border-[var(--border)] bg-[var(--contribute-surface)]/96 pr-14 backdrop-blur-[1px]">
            <SheetTitle className="font-[var(--font-lora)] text-xl font-bold">
              {t("title")}
            </SheetTitle>
            <SheetDescription>{t("description")}</SheetDescription>
          </SheetHeader>
          <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
            <ul className="grid gap-2">
              {ITEM_KEYS.map((key) => (
                <li
                  key={key}
                  className="rounded-2xl border border-[var(--border)] bg-[var(--contribute-surface-soft)] px-4 py-3 text-sm font-bold text-[var(--foreground)]"
                >
                  {t(`items.${key}`)}
                </li>
              ))}
            </ul>
          </div>
          <div className="shrink-0 border-t border-[var(--border)] bg-[var(--contribute-surface)]/96 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] backdrop-blur-[1px]">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="h-11 w-full rounded-full bg-[var(--accent)] px-5 text-sm font-black text-white shadow-[var(--shadow-sm)] transition hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/30"
            >
              {t("close")}
            </button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
