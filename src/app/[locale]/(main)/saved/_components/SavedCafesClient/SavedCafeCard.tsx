"use client";

import { FolderPlus } from "lucide-react";
import { useTranslations } from "next-intl";
import type { Cafe } from "@/types/cafe";
import CafeCard from "@/components/cafe/CafeCard";

export function AddToFolderButton({ onClick }: { onClick: (e: React.MouseEvent) => void }) {
  const t = useTranslations("saved")
  return (
    <button
      type="button"
      onClick={onClick}
      title={t("addToFolder")}
      className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-white/30 bg-white/88 text-[var(--accent)] shadow-sm backdrop-blur-md transition-all hover:scale-110 hover:bg-white dark:border-white/10 dark:bg-[#1c1209]/85 dark:text-[var(--accent)]"
    >
      <FolderPlus size={14} />
    </button>
  )
}

export function SavedCafeCard({
  cafe,
  locale,
  index,
  onSavedChange,
  onAddToFolder,
}: {
  cafe: Cafe
  locale: string
  index: number
  onSavedChange: (saved: boolean) => void
  onAddToFolder: (cafe: Cafe) => void
}) {
  return (
    <div className="group/wrapper relative">
      <CafeCard
        cafe={cafe}
        locale={locale}
        index={index}
        animationType="slide"
        initialSaved
        onSavedChange={onSavedChange}
      />
      {/* Floating folder button — bottom-left of card */}
      <div className="absolute bottom-[4.25rem] left-3 opacity-0 transition-opacity duration-150 group-hover/wrapper:opacity-100">
        <AddToFolderButton onClick={(e) => { e.preventDefault(); e.stopPropagation(); onAddToFolder(cafe) }} />
      </div>
    </div>
  )
}
