"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { Bookmark, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { coverObjectPosition } from "@/lib/cover-image";
import { cn } from "@/lib/utils";
import type { CollectionGroup } from "../saved-folders.types";

export function FolderMenu({
  triggerRef,
  position,
  onRename,
  onDelete,
  onClose,
}: {
  triggerRef: React.RefObject<HTMLButtonElement | null>
  position: { right: number; bottom: number }
  onRename: () => void
  onDelete: () => void
  onClose: () => void
}) {
  const t = useTranslations("saved")
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const target = e.target as Node
      if (ref.current?.contains(target) || triggerRef.current?.contains(target)) return
      onClose()
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [onClose, triggerRef])

  return createPortal(
    <div
      ref={ref}
      className="fixed z-[90] min-w-[180px] overflow-hidden rounded-2xl border border-[var(--border)] bg-white py-1 shadow-xl dark:border-[#3d2c1e] dark:bg-[#1c1209]"
      style={position}
    >
      <button
        type="button"
        onClick={() => { onRename(); onClose() }}
        className="flex w-full cursor-pointer items-center gap-2 px-4 py-2.5 text-sm text-[var(--foreground)] transition-colors hover:bg-[#fff8f2] dark:text-[#e8d5c4] dark:hover:bg-[#2c1a0e]"
      >
        <Pencil size={14} className="text-[var(--accent)]" />
        {t("rename")}
      </button>
      <button
        type="button"
        onClick={() => { onDelete(); onClose() }}
        className="flex w-full cursor-pointer items-center gap-2 px-4 py-2.5 text-sm text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-950/30"
      >
        <Trash2 size={14} />
        {t("deleteFolder")}
      </button>
    </div>,
    document.body
  )
}

export function FolderCard({
  group,
  active,
  canManage,
  onClick,
  onRename,
  onDelete,
}: {
  group: CollectionGroup
  active: boolean
  canManage?: boolean
  onClick: () => void
  onRename?: () => void
  onDelete?: () => void
}) {
  const t = useTranslations("saved")
  const preview = group.cafes.slice(0, 4)
  const extra = Math.max(group.cafes.length - 3, 0)
  const [menuOpen, setMenuOpen] = useState(false)
  const [menuPosition, setMenuPosition] = useState({ right: 16, bottom: 16 })
  const menuButtonRef = useRef<HTMLButtonElement>(null)

  return (
    <div className="group relative min-w-[150px] shrink-0 sm:min-w-[168px]">
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={onClick}
        className="w-full cursor-pointer rounded-[20px] text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#fff8ed] dark:focus-visible:ring-offset-[#1f1209]"
        type="button"
      >
        <div
          className={cn(
            "relative mb-3 aspect-[4/3] overflow-hidden rounded-[18px] border transition-all duration-200",
            active
              ? "border-[var(--accent)] shadow-[0_14px_36px_rgba(200,132,42,0.24)] ring-2 ring-[var(--accent)]/28"
              : "border-[#ffe3b7]/70 shadow-[0_10px_26px_rgba(44,26,14,0.08)] group-hover:border-[var(--accent)]/55 group-hover:shadow-[0_14px_32px_rgba(44,26,14,0.13)]"
          )}
        >
          {preview.length >= 3 ? (
            <div className="grid h-full grid-cols-2 grid-rows-2 gap-px bg-[#e6dacd]">
              {preview.slice(0, 3).map((cafe) => (
                <div key={cafe.id} className="relative overflow-hidden bg-[var(--season-soft)]">
                  {cafe.coverImage && (
                    <Image src={cafe.coverImage} alt={cafe.name} fill sizes="80px" className="object-cover transition-transform duration-300 group-hover:scale-105" style={{ objectPosition: coverObjectPosition(cafe) }} />
                  )}
                </div>
              ))}
              <div className="flex items-center justify-center bg-[#1f1209]/86">
                <span className="text-base font-bold text-white">+{extra > 0 ? extra : 1}</span>
              </div>
            </div>
          ) : preview.length === 2 ? (
            <div className="grid h-full grid-cols-2 gap-px bg-[#e6dacd]">
              {preview.map((cafe) => (
                <div key={cafe.id} className="relative overflow-hidden bg-[var(--season-soft)]">
                  {cafe.coverImage && <Image src={cafe.coverImage} alt={cafe.name} fill sizes="80px" className="object-cover" style={{ objectPosition: coverObjectPosition(cafe) }} />}
                </div>
              ))}
            </div>
          ) : (
            <div className="relative h-full w-full bg-[var(--season-soft)]">
              {preview[0]?.coverImage ? (
                <Image src={preview[0].coverImage} alt={group.name} fill sizes="160px" className="object-cover transition-transform duration-300 group-hover:scale-105" style={{ objectPosition: coverObjectPosition(preview[0]) }} />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <Bookmark size={32} className="text-[#c8a97a]" />
                </div>
              )}
            </div>
          )}
          {active && (
            <div className="pointer-events-none absolute inset-0 rounded-[18px] bg-linear-to-t from-[#1f1209]/28 to-transparent ring-2 ring-inset ring-[var(--accent)]/40" />
          )}
        </div>
        <span className={cn("block truncate text-sm font-bold transition-colors", active ? "text-[var(--accent)] dark:text-[var(--accent)]" : "text-[var(--foreground)] group-hover:text-[var(--accent)]")}>
          {group.name}
        </span>
        <span className="block text-xs text-[var(--foreground-muted)]">{t("cafeCount", { count: group.cafes.length })}</span>
      </motion.button>

      {/* Folder context menu trigger */}
      {canManage && (
        <div className="relative">
          <button
            ref={menuButtonRef}
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              const rect = e.currentTarget.getBoundingClientRect()
              setMenuPosition({
                right: Math.max(12, window.innerWidth - rect.right),
                bottom: Math.max(12, window.innerHeight - rect.top + 8),
              })
              setMenuOpen((v) => !v)
            }}
            className="absolute right-2 top-[-112px] flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-[#ffe3b7]/60 bg-[#fffaf2]/92 opacity-0 shadow-sm backdrop-blur transition-opacity focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] group-hover:opacity-100 dark:border-white/10 dark:bg-[#2c1a0e]/90"
          >
            <MoreHorizontal size={14} className="text-[#6b5a4a]" />
          </button>
          {menuOpen && (
            <FolderMenu
              triggerRef={menuButtonRef}
              position={menuPosition}
              onRename={() => onRename?.()}
              onDelete={() => onDelete?.()}
              onClose={() => setMenuOpen(false)}
            />
          )}
        </div>
      )}
    </div>
  )
}
