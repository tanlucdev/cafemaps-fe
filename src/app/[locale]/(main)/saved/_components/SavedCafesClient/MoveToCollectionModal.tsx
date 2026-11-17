"use client";

import { cloudinaryImageUrl } from "@/lib/cloudinary-image";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Bookmark, Check, FolderOpen, FolderPlus, X } from "lucide-react";
import { useTranslations } from "next-intl";
import type { Cafe } from "@/types/cafe";
import { coverObjectPosition } from "@/lib/cover-image";
import type { CollectionGroup } from "../saved-folders.types";
import { ModalOverlay } from './ModalOverlay';

export function MoveToCollectionModal({
  cafe,
  collections,
  currentCollection,
  onMove,
  onCreate,
  onClose,
}: {
  cafe: Cafe
  collections: CollectionGroup[]
  currentCollection: string | null
  onMove: (collectionName: string | null) => void
  onCreate: (name: string) => void
  onClose: () => void
}) {
  const t = useTranslations("saved")
  const [creating, setCreating] = useState(false)
  const [newName, setNewName] = useState("")
  const newNameRef = useRef<HTMLInputElement>(null)
  const trimmed = newName.trim()
  const existingNames = collections.map((c) => c.name)
  const isDuplicate = existingNames.map((n) => n.toLowerCase()).includes(trimmed.toLowerCase())

  useEffect(() => {
    if (creating) newNameRef.current?.focus()
  }, [creating])

  return (
    <ModalOverlay onClose={onClose}>
      <div className="w-full max-w-sm rounded-3xl bg-[var(--card)] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#f0e8df] px-6 py-4 dark:border-[#3d2c1e]">
          <div className="flex items-center gap-3">
            {cafe.coverImage ? (
              <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl">
                <Image src={cloudinaryImageUrl(cafe.coverImage, "thumb")} alt={cafe.name} fill sizes="40px" className="object-cover" style={{ objectPosition: coverObjectPosition(cafe) }} />
              </div>
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--season-soft)]">
                <Bookmark size={18} className="text-[var(--accent)]" />
              </div>
            )}
            <div>
              <p className="text-xs text-[var(--foreground-muted)]">{t("addToFolder")}</p>
              <p className="text-sm font-semibold text-[var(--foreground)]">{cafe.name}</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="cursor-pointer rounded-full p-1 text-[var(--foreground-muted)] hover:bg-[var(--season-soft)] dark:hover:bg-[var(--season-soft)]">
            <X size={18} />
          </button>
        </div>

        {/* List */}
        <div className="max-h-72 overflow-y-auto py-2">
          <button
            type="button"
            onClick={() => onMove(null)}
            className="flex w-full cursor-pointer items-center gap-3 px-6 py-3 text-left transition-colors hover:bg-[var(--season-soft)] dark:hover:bg-[var(--season-soft)]"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--season-soft)] dark:border-[#3d2c1e]">
              <FolderOpen size={16} className="text-[#c8a97a]" />
            </div>
            <p className="min-w-0 flex-1 truncate text-sm font-medium text-[var(--foreground)]">{t("all")}</p>
            {currentCollection === null && <Check size={16} className="shrink-0 text-[var(--accent)]" />}
          </button>
          {collections.map((col) => {
            const isActive = col.name === currentCollection
            return (
              <button
                key={col.name}
                type="button"
                onClick={() => onMove(col.name)}
                className="flex w-full cursor-pointer items-center gap-3 px-6 py-3 text-left transition-colors hover:bg-[var(--season-soft)] dark:hover:bg-[var(--season-soft)]"
              >
                {/* Mini preview */}
                <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--season-soft)]">
                  {col.cafes[0]?.coverImage ? (
                    <Image src={cloudinaryImageUrl(col.cafes[0].coverImage, "thumb")} alt={col.name} fill sizes="36px" className="object-cover" style={{ objectPosition: coverObjectPosition(col.cafes[0]) }} />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <FolderOpen size={16} className="text-[#c8a97a]" />
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-[var(--foreground)]">{col.name}</p>
                  <p className="text-xs text-[var(--foreground-muted)]">{t("cafeCount", { count: col.cafes.length })}</p>
                </div>
                {isActive && <Check size={16} className="shrink-0 text-[var(--accent)]" />}
              </button>
            )
          })}

          {collections.length === 0 && (
            <p className="px-6 py-4 text-sm text-[var(--foreground-muted)]">{t("noFolders")}</p>
          )}
        </div>

        {/* Create new inline */}
        <div className="border-t border-[#f0e8df] px-6 py-4 dark:border-[#3d2c1e]">
          {!creating ? (
            <button
              type="button"
              onClick={() => setCreating(true)}
              className="inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-[var(--accent)] hover:underline"
            >
              <FolderPlus size={16} />
              {t("createFolderTitle")}
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <input
                ref={newNameRef}
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder={t("folderNameEllipsis")}
                maxLength={40}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && trimmed && !isDuplicate) {
                    onCreate(trimmed)
                    onMove(trimmed)
                    onClose()
                  }
                  if (e.key === "Escape") setCreating(false)
                }}
                className="flex-1 rounded-xl border border-[var(--border)] px-3 py-2 text-[16px] lg:text-sm focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 dark:border-[#3d2c1e]"
              />
              <button
                type="button"
                disabled={!trimmed || isDuplicate}
                onClick={() => {
                  if (!trimmed || isDuplicate) return
                  onCreate(trimmed)
                  onMove(trimmed)
                  onClose()
                }}
                className="cursor-pointer rounded-xl bg-[var(--accent)] px-3 py-2 text-xs font-semibold text-[var(--accent-foreground)] disabled:opacity-40"
              >
                {t("create")}
              </button>
              <button type="button" onClick={() => setCreating(false)} className="cursor-pointer text-[var(--foreground-muted)] hover:text-[var(--foreground)]">
                <X size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </ModalOverlay>
  )
}
