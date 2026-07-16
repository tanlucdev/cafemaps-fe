"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Image from "next/image"
import { Link } from "@/i18n/navigation"
import { createPortal } from "react-dom"
import { motion, AnimatePresence } from "framer-motion"
import {
  Bookmark,
  Car,
  Check,
  ChevronDown,
  Coffee,
  Compass,
  FolderOpen,
  FolderPlus,
  Layers3,
  LogIn,
  MapPin,
  MoreHorizontal,
  Pencil,
  Search,
  SlidersHorizontal,
  Trash2,
  UserPlus,
  X,
} from "lucide-react"
import { useTranslations } from "next-intl"
import type { Cafe, SavedCafeEntry, SavedCollection } from "@/types/cafe"
import { AREAS } from "@/types/cafe"
import { getCurrentAccessToken } from "@/lib/auth-client"
import { getSavedCafeEntries, getSavedCollections } from "@/lib/api"
import CafeCard from "@/components/cafe/CafeCard"
import { cn } from "@/lib/utils"
import { isCafeOpenNow } from "@/lib/opening-hours"
import { CafeCardSkeleton } from "@/components/ui/Skeleton"
import { useSavedFolders } from "./useSavedFolders"
import type { CollectionGroup } from "./saved-folders.types"
import { showSavedToast } from "./saved-toast"

// ─── Types ────────────────────────────────────────────────────────────────────

interface SavedCafesClientProps {
  locale: string
  initialIsLoggedIn: boolean
  initialEntries: SavedCafeEntry[]
  initialFolders: SavedCollection[]
  previewMode?: boolean
}

type QuickFilter = "all" | "open" | "parking"

// ─── Helpers ──────────────────────────────────────────────────────────────────

// ─── Create Folder Modal ──────────────────────────────────────────────────────

function CreateFolderModal({
  existing,
  onConfirm,
  onClose,
}: {
  existing: string[]
  onConfirm: (name: string) => void
  onClose: () => void
}) {
  const t = useTranslations("saved")
  const [value, setValue] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const trimmed = value.trim()
  const isDuplicate = existing.map((n) => n.toLowerCase()).includes(trimmed.toLowerCase())
  const isValid = trimmed.length > 0 && !isDuplicate

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!isValid) return
    onConfirm(trimmed)
  }

  return (
    <ModalOverlay onClose={onClose}>
      <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl dark:bg-[#1c1209]">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#29170c] dark:text-[#f5e8d8]">{t("createFolderTitle")}</h2>
          <button type="button" onClick={onClose} className="cursor-pointer rounded-full p-1 text-[#9b8675] hover:bg-[#f5ede7] dark:hover:bg-[#2c1a0e]">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#29170c] dark:text-[#e8d5c4]">
              {t("folderName")}
            </label>
            <input
              ref={inputRef}
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={t("folderNamePlaceholder")}
              maxLength={40}
              className={cn(
                "w-full rounded-xl border px-4 py-2.5 text-sm text-[#29170c] placeholder-[#b5a090] focus:outline-none focus:ring-2 dark:bg-[#29170c] dark:text-[#f5e8d8]",
                isDuplicate
                  ? "border-red-400 focus:ring-red-300"
                  : "border-[#e6dacd] focus:border-[#c8842a] focus:ring-[#c8842a]/20 dark:border-[#3d2c1e]"
              )}
            />
            {isDuplicate && (
              <p className="mt-1 text-xs text-red-500">{t("folderDuplicate")}</p>
            )}
            <p className="mt-1 text-right text-xs text-[#9b8675]">{trimmed.length}/40</p>
          </div>

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 cursor-pointer rounded-xl border border-[#e6dacd] py-2.5 text-sm font-medium text-[#29170c] transition-colors hover:bg-[#f5ede7] dark:border-[#3d2c1e] dark:text-[#e8d5c4] dark:hover:bg-[#2c1a0e]"
            >
              {t("cancel")}
            </button>
            <button
              type="submit"
              disabled={!isValid}
              className="flex-1 cursor-pointer rounded-xl bg-[#875200] py-2.5 text-sm font-semibold text-white shadow-sm transition-opacity disabled:opacity-40 hover:opacity-90"
            >
              {t("createFolder")}
            </button>
          </div>
        </form>
      </div>
    </ModalOverlay>
  )
}

// ─── Rename Folder Modal ──────────────────────────────────────────────────────

function RenameFolderModal({
  current,
  existing,
  onConfirm,
  onClose,
}: {
  current: string
  existing: string[]
  onConfirm: (name: string) => void
  onClose: () => void
}) {
  const t = useTranslations("saved")
  const [value, setValue] = useState(current)
  const inputRef = useRef<HTMLInputElement>(null)
  const trimmed = value.trim()
  const isDuplicate =
    trimmed.toLowerCase() !== current.toLowerCase() &&
    existing.map((n) => n.toLowerCase()).includes(trimmed.toLowerCase())
  const isValid = trimmed.length > 0 && !isDuplicate && trimmed !== current

  useEffect(() => {
    inputRef.current?.focus()
    inputRef.current?.select()
  }, [])

  return (
    <ModalOverlay onClose={onClose}>
      <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl dark:bg-[#1c1209]">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#29170c] dark:text-[#f5e8d8]">{t("renameFolderTitle")}</h2>
          <button type="button" onClick={onClose} className="cursor-pointer rounded-full p-1 text-[#9b8675] hover:bg-[#f5ede7]">
            <X size={18} />
          </button>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            if (isValid) onConfirm(trimmed)
          }}
          className="space-y-4"
        >
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            maxLength={40}
            className={cn(
              "w-full rounded-xl border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 dark:bg-[#29170c] dark:text-[#f5e8d8]",
              isDuplicate
                ? "border-red-400 focus:ring-red-300"
                : "border-[#e6dacd] focus:border-[#c8842a] focus:ring-[#c8842a]/20 dark:border-[#3d2c1e]"
            )}
          />
          {isDuplicate && <p className="text-xs text-red-500">{t("folderDuplicateShort")}</p>}
          <div className="flex gap-2">
            <button type="button" onClick={onClose} className="flex-1 cursor-pointer rounded-xl border border-[#e6dacd] py-2.5 text-sm font-medium text-[#29170c] hover:bg-[#f5ede7] dark:border-[#3d2c1e] dark:text-[#e8d5c4]">
              {t("cancel")}
            </button>
            <button type="submit" disabled={!isValid} className="flex-1 cursor-pointer rounded-xl bg-[#875200] py-2.5 text-sm font-semibold text-white disabled:opacity-40 hover:opacity-90">
              {t("save")}
            </button>
          </div>
        </form>
      </div>
    </ModalOverlay>
  )
}

// ─── Move To Collection Modal ────────────────────────────────────────────────

function MoveToCollectionModal({
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
      <div className="w-full max-w-sm rounded-3xl bg-white shadow-2xl dark:bg-[#1c1209]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#f0e8df] px-6 py-4 dark:border-[#3d2c1e]">
          <div className="flex items-center gap-3">
            {cafe.coverImage ? (
              <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl">
                <Image src={cafe.coverImage} alt={cafe.name} fill sizes="40px" className="object-cover" />
              </div>
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f5ede7]">
                <Bookmark size={18} className="text-[#875200]" />
              </div>
            )}
            <div>
              <p className="text-xs text-[#9b8675]">{t("addToFolder")}</p>
              <p className="text-sm font-semibold text-[#29170c] dark:text-[#f5e8d8]">{cafe.name}</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="cursor-pointer rounded-full p-1 text-[#9b8675] hover:bg-[#f5ede7] dark:hover:bg-[#2c1a0e]">
            <X size={18} />
          </button>
        </div>

        {/* List */}
        <div className="max-h-72 overflow-y-auto py-2">
          <button
            type="button"
            onClick={() => onMove(null)}
            className="flex w-full cursor-pointer items-center gap-3 px-6 py-3 text-left transition-colors hover:bg-[#fff8f2] dark:hover:bg-[#2c1a0e]"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#e6dacd] bg-[#ffeadf] dark:border-[#3d2c1e] dark:bg-[#29170c]">
              <FolderOpen size={16} className="text-[#c8a97a]" />
            </div>
            <p className="min-w-0 flex-1 truncate text-sm font-medium text-[#29170c] dark:text-[#e8d5c4]">{t("all")}</p>
            {currentCollection === null && <Check size={16} className="shrink-0 text-[#875200]" />}
          </button>
          {collections.map((col) => {
            const isActive = col.name === currentCollection
            return (
              <button
                key={col.name}
                type="button"
                onClick={() => onMove(col.name)}
                className="flex w-full cursor-pointer items-center gap-3 px-6 py-3 text-left transition-colors hover:bg-[#fff8f2] dark:hover:bg-[#2c1a0e]"
              >
                {/* Mini preview */}
                <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-lg border border-[#e6dacd] bg-[#ffeadf]">
                  {col.cafes[0]?.coverImage ? (
                    <Image src={col.cafes[0].coverImage} alt={col.name} fill sizes="36px" className="object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <FolderOpen size={16} className="text-[#c8a97a]" />
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-[#29170c] dark:text-[#e8d5c4]">{col.name}</p>
                  <p className="text-xs text-[#9b8675]">{t("cafeCount", { count: col.cafes.length })}</p>
                </div>
                {isActive && <Check size={16} className="shrink-0 text-[#875200]" />}
              </button>
            )
          })}

          {collections.length === 0 && (
            <p className="px-6 py-4 text-sm text-[#9b8675]">{t("noFolders")}</p>
          )}
        </div>

        {/* Create new inline */}
        <div className="border-t border-[#f0e8df] px-6 py-4 dark:border-[#3d2c1e]">
          {!creating ? (
            <button
              type="button"
              onClick={() => setCreating(true)}
              className="inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-[#875200] hover:underline"
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
                className="flex-1 rounded-xl border border-[#e6dacd] px-3 py-2 text-sm focus:border-[#c8842a] focus:outline-none focus:ring-2 focus:ring-[#c8842a]/20 dark:border-[#3d2c1e] dark:bg-[#29170c] dark:text-[#f5e8d8]"
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
                className="cursor-pointer rounded-xl bg-[#875200] px-3 py-2 text-xs font-semibold text-white disabled:opacity-40"
              >
                {t("create")}
              </button>
              <button type="button" onClick={() => setCreating(false)} className="cursor-pointer text-[#9b8675] hover:text-[#29170c]">
                <X size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </ModalOverlay>
  )
}

// ─── Delete Folder Confirm Modal ──────────────────────────────────────────────

function DeleteFolderModal({
  name,
  count,
  onConfirm,
  onClose,
}: {
  name: string
  count: number
  onConfirm: () => void
  onClose: () => void
}) {
  const t = useTranslations("saved")
  return (
    <ModalOverlay onClose={onClose}>
      <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl dark:bg-[#1c1209]">
        <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50">
          <Trash2 size={22} className="text-red-500" />
        </div>
        <h2 className="mb-1 text-lg font-bold text-[#29170c] dark:text-[#f5e8d8]">{t("deleteFolderTitle")}</h2>
        <p className="text-sm text-[#6b5a4a]">
          {t.rich("deleteFolderDesc", {
            name,
            count,
            strong: (chunks) => <span className="font-semibold">&ldquo;{chunks}&rdquo;</span>,
          })}
        </p>
        <div className="mt-6 flex gap-2">
          <button type="button" onClick={onClose} className="flex-1 cursor-pointer rounded-xl border border-[#e6dacd] py-2.5 text-sm font-medium text-[#29170c] hover:bg-[#f5ede7] dark:border-[#3d2c1e] dark:text-[#e8d5c4]">
            {t("cancel")}
          </button>
          <button type="button" onClick={onConfirm} className="flex-1 cursor-pointer rounded-xl bg-red-500 py-2.5 text-sm font-semibold text-white hover:bg-red-600">
            {t("deleteFolder")}
          </button>
        </div>
      </div>
    </ModalOverlay>
  )
}

// ─── Modal Overlay ────────────────────────────────────────────────────────────

function ModalOverlay({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
    document.addEventListener("keydown", handleKey)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", handleKey)
      document.body.style.overflow = ""
    }
  }, [onClose])

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm"
        onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 12 }}
          transition={{ duration: 0.18, ease: [0.33, 1, 0.68, 1] }}
          className="w-full"
          style={{ maxWidth: 400 }}
        >
          {children}
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  )
}

// ─── Folder Context Menu ──────────────────────────────────────────────────────

function FolderMenu({
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
      className="fixed z-[90] min-w-[180px] overflow-hidden rounded-2xl border border-[#e6dacd] bg-white py-1 shadow-xl dark:border-[#3d2c1e] dark:bg-[#1c1209]"
      style={position}
    >
      <button
        type="button"
        onClick={() => { onRename(); onClose() }}
        className="flex w-full cursor-pointer items-center gap-2 px-4 py-2.5 text-sm text-[#29170c] transition-colors hover:bg-[#fff8f2] dark:text-[#e8d5c4] dark:hover:bg-[#2c1a0e]"
      >
        <Pencil size={14} className="text-[#875200]" />
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

// ─── FolderCard ───────────────────────────────────────────────────────────────

function FolderCard({
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
              ? "border-[#c8842a] shadow-[0_14px_36px_rgba(200,132,42,0.24)] ring-2 ring-[#c8842a]/28"
              : "border-[#ffe3b7]/70 shadow-[0_10px_26px_rgba(44,26,14,0.08)] group-hover:border-[#c8842a]/55 group-hover:shadow-[0_14px_32px_rgba(44,26,14,0.13)]"
          )}
        >
          {preview.length >= 3 ? (
            <div className="grid h-full grid-cols-2 grid-rows-2 gap-px bg-[#e6dacd]">
              {preview.slice(0, 3).map((cafe) => (
                <div key={cafe.id} className="relative overflow-hidden bg-[#ffeadf]">
                  {cafe.coverImage && (
                    <Image src={cafe.coverImage} alt={cafe.name} fill sizes="80px" className="object-cover transition-transform duration-300 group-hover:scale-105" />
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
                <div key={cafe.id} className="relative overflow-hidden bg-[#ffeadf]">
                  {cafe.coverImage && <Image src={cafe.coverImage} alt={cafe.name} fill sizes="80px" className="object-cover" />}
                </div>
              ))}
            </div>
          ) : (
            <div className="relative h-full w-full bg-[#ffeadf]">
              {preview[0]?.coverImage ? (
                <Image src={preview[0].coverImage} alt={group.name} fill sizes="160px" className="object-cover transition-transform duration-300 group-hover:scale-105" />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <Bookmark size={32} className="text-[#c8a97a]" />
                </div>
              )}
            </div>
          )}
          {active && (
            <div className="pointer-events-none absolute inset-0 rounded-[18px] bg-linear-to-t from-[#1f1209]/28 to-transparent ring-2 ring-inset ring-[#c8842a]/40" />
          )}
        </div>
        <span className={cn("block truncate text-sm font-bold transition-colors", active ? "text-[#875200] dark:text-[#ffb865]" : "text-[var(--foreground)] group-hover:text-[#875200]")}>
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

// ─── Filter Chip ──────────────────────────────────────────────────────────────

function FilterChip({
  active,
  onClick,
  children,
  icon,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
  icon?: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex min-h-10 cursor-pointer items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm font-bold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#fff8ed] dark:focus-visible:ring-offset-[#1f1209]",
        active
          ? "border-[#875200] bg-[#875200] text-white shadow-[0_8px_22px_rgba(135,82,0,0.18)]"
          : "border-[#ffe3b7]/70 bg-[#fffaf2]/72 text-[var(--foreground)] shadow-[0_8px_24px_rgba(44,26,14,0.05)] backdrop-blur hover:border-[#c8a97a] hover:bg-[#fff8f2] dark:border-white/10 dark:bg-white/6 dark:text-[#f5e8d8] dark:hover:border-[#875200]"
      )}
    >
      {icon}
      {children}
    </button>
  )
}

// ─── District Dropdown ────────────────────────────────────────────────────────

function DistrictDropdown({
  value,
  onChange,
}: {
  value: string
  onChange: (v: string) => void
}) {
  const t = useTranslations("saved")
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  const active = value !== ""

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "inline-flex min-h-10 cursor-pointer items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm font-bold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#fff8ed] dark:focus-visible:ring-offset-[#1f1209]",
          active
            ? "border-[#875200] bg-[#875200] text-white shadow-[0_8px_22px_rgba(135,82,0,0.18)]"
            : "border-[#ffe3b7]/70 bg-[#fffaf2]/72 text-[var(--foreground)] shadow-[0_8px_24px_rgba(44,26,14,0.05)] backdrop-blur hover:border-[#c8a97a] hover:bg-[#fff8f2] dark:border-white/10 dark:bg-white/6 dark:text-[#f5e8d8]"
        )}
      >
        <MapPin size={13} />
        {active ? value : t("area")}
        {active ? (
          <span
            role="button"
            tabIndex={0}
            onClick={(e) => { e.stopPropagation(); onChange("") }}
            onKeyDown={(e) => { if (e.key === "Enter") { e.stopPropagation(); onChange("") } }}
            className="ml-0.5 flex h-4 w-4 cursor-pointer items-center justify-center rounded-full bg-white/25 hover:bg-white/40"
          >
            <X size={10} />
          </span>
        ) : (
          <ChevronDown size={13} className={cn("transition-transform", open && "rotate-180")} />
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute left-0 top-12 z-30 max-h-64 w-44 overflow-y-auto rounded-2xl border border-[#ffe3b7]/70 bg-[#fffaf2] py-1 shadow-[0_18px_44px_rgba(44,26,14,0.16)] dark:border-white/10 dark:bg-[#1c1209]"
          >
            {AREAS.map((area) => (
              <button
                key={area}
                type="button"
                onClick={() => { onChange(area); setOpen(false) }}
                className={cn(
                  "flex w-full cursor-pointer items-center justify-between px-4 py-2 text-sm transition-colors",
                  value === area
                    ? "bg-[#fff1ea] font-semibold text-[#875200] dark:bg-[#2c1a0e]"
                    : "text-[#29170c] hover:bg-[#fff8f2] dark:text-[#e8d5c4] dark:hover:bg-[#2c1a0e]"
                )}
              >
                {area}
                {value === area && <Check size={13} className="text-[#875200]" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Search bar ────────────────────────────────────────────────────────────────

function SearchBar({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const t = useTranslations("saved")
  return (
    <div className="relative w-full min-w-0 rounded-full focus-within:ring-2 focus-within:ring-[var(--accent)]/35 sm:max-w-xs">
      <Search size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9b8675]" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={t("searchPlaceholder")}
        className="min-h-11 w-full rounded-full border border-[#ffe3b7]/75 bg-[#fffaf2]/82 py-2.5 pl-9 pr-9 text-sm font-semibold text-[var(--foreground)] placeholder-[#9b8675] shadow-[0_10px_26px_rgba(44,26,14,0.06)] backdrop-blur dark:border-white/10 dark:bg-white/6 dark:text-[#f5e8d8]"
      />
      {value && (
        <button type="button" onClick={() => onChange("")} className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-[#9b8675] hover:text-[#29170c]">
          <X size={13} />
        </button>
      )}
    </div>
  )
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState({ title, subtitle, cta }: { title: string; subtitle: string; cta: string }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-[28px] border border-[#ffe3b7]/55 bg-[#1f1209] px-5 py-14 text-center shadow-[0_22px_70px_rgba(44,26,14,0.16)] sm:px-8 sm:py-18"
    >
      <Image
        src="/image/home-polaroid-2.jpg"
        alt=""
        fill
        sizes="(min-width: 768px) 70vw, 100vw"
        className="object-cover opacity-58"
      />
      <div className="absolute inset-0 bg-linear-to-t from-[#1f1209]/95 via-[#1f1209]/60 to-[#1f1209]/18" />
      <div className="relative mx-auto flex max-w-md flex-col items-center">
        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#ffe3b7]/24 bg-[#fff0d2]/12 text-[#ffd18c] shadow-[0_18px_40px_rgba(0,0,0,0.18)] backdrop-blur">
          <Bookmark size={25} />
        </div>
        <h2 className="font-lora text-2xl font-bold leading-tight text-[#fff7e8] sm:text-3xl">{title}</h2>
        <p className="mt-3 max-w-xs text-sm leading-6 text-[#fff0d2]/78">{subtitle}</p>
        <Link href="/search" className="mt-7 inline-flex min-h-11 items-center gap-2 rounded-full bg-[#fff0d2] px-5 py-2.5 text-sm font-bold text-[#2a170c] shadow-[0_12px_34px_rgba(0,0,0,0.22)] transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffd18c] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1f1209]">
          <Compass size={16} />
          {cta}
        </Link>
      </div>
    </motion.section>
  )
}

// ─── Add-to-folder button on card overlay ─────────────────────────────────────

function AddToFolderButton({ onClick }: { onClick: (e: React.MouseEvent) => void }) {
  const t = useTranslations("saved")
  return (
    <button
      type="button"
      onClick={onClick}
      title={t("addToFolder")}
      className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-white/30 bg-white/88 text-[#875200] shadow-sm backdrop-blur-md transition-all hover:scale-110 hover:bg-white dark:border-white/10 dark:bg-[#1c1209]/85 dark:text-[#ffb865]"
    >
      <FolderPlus size={14} />
    </button>
  )
}

// ─── CafeCard wrapper that injects a folder button ───────────────────────────

function SavedCafeCard({
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

// ─── Main component ───────────────────────────────────────────────────────────

export default function SavedCafesClient({
  locale,
  initialIsLoggedIn,
  initialEntries,
  initialFolders,
  previewMode = false,
}: SavedCafesClientProps) {
  const t = useTranslations("saved")

  // ── Auth & entries ──────────────────────────────────────────────────────────
  const [isLoggedIn, setIsLoggedIn] = useState(initialIsLoggedIn)
  const [entries, setEntries] = useState(initialEntries)
  const [entriesLoading, setEntriesLoading] = useState(initialIsLoggedIn && initialEntries.length === 0)

  // ── Filters ─────────────────────────────────────────────────────────────────
  const [activeCollection, setActiveCollection] = useState<string>("all")
  const [quickFilter, setQuickFilter] = useState<QuickFilter>("all")
  const [district, setDistrict] = useState("")
  const [search, setSearch] = useState("")
  const [filtersOpen, setFiltersOpen] = useState(false)

  // ── Modals ──────────────────────────────────────────────────────────────────
  const [showCreateFolder, setShowCreateFolder] = useState(false)
  const [renameTarget, setRenameTarget] = useState<string | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const [moveTarget, setMoveTarget] = useState<Cafe | null>(null)
  const pendingFolderActionRef = useRef(false)
  const {
    collections,
    collectionNames,
    replaceFolders,
    createFolder,
    renameFolder,
    deleteFolder,
    moveCafeToFolder,
  } = useSavedFolders({
    initialFolders,
    entries,
    setEntries,
    activeCollection,
    setActiveCollection,
  })

  // ── Auth sync ────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (previewMode) return
    let alive = true
    const syncAuth = async () => {
      const token = await getCurrentAccessToken()
      if (alive) {
        const loggedIn = Boolean(token)
        setIsLoggedIn(loggedIn)
        if (!loggedIn) setEntriesLoading(false)
      }
    }
    void syncAuth()
    window.addEventListener("cafe-auth-change", syncAuth)
    return () => { alive = false; window.removeEventListener("cafe-auth-change", syncAuth) }
  }, [previewMode])

  useEffect(() => {
    if (previewMode || !isLoggedIn) {
      setEntriesLoading(false)
      return
    }
    let alive = true
    ;(async () => {
      setEntriesLoading(true)
      const token = await getCurrentAccessToken()
      if (!token) {
        if (alive) {
          setEntries([])
          setEntriesLoading(false)
        }
        return
      }
      const [nextEntries, nextFolders] = await Promise.all([
        getSavedCafeEntries(token, locale),
        getSavedCollections(token),
      ])
      if (alive) {
        setEntries(nextEntries)
        replaceFolders(nextFolders)
        setEntriesLoading(false)
      }
    })()
    return () => { alive = false }
  }, [isLoggedIn, locale, previewMode, replaceFolders])

  useEffect(() => {
    if (activeCollection === "all") return
    if (!collections.some((c) => c.name === activeCollection)) setActiveCollection("all")
  }, [activeCollection, collections])

  // ── Filtered cafes ───────────────────────────────────────────────────────────
  const visibleCafes = useMemo(() => {
    let list =
      activeCollection === "all"
        ? entries.map((e) => e.cafe)
        : (collections.find((c) => c.name === activeCollection)?.cafes ?? [])

    if (quickFilter === "open") list = list.filter(isCafeOpenNow)
    if (quickFilter === "parking") list = list.filter((c) => c.amenities.some((a) => a.toLowerCase().includes("đậu xe")))
    if (district) list = list.filter((c) => c.district === district || c.district_legacy === district)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter((c) => c.name.toLowerCase().includes(q) || c.district?.toLowerCase().includes(q) || c.address?.toLowerCase().includes(q))
    }
    return list
  }, [activeCollection, quickFilter, district, search, entries, collections])

  const activeFilterCount = [quickFilter !== "all", district !== "", search !== ""].filter(Boolean).length

  // ── Handlers ─────────────────────────────────────────────────────────────────

  function handleSavedChange(cafeId: string, saved: boolean) {
    if (!saved) setEntries((cur) => cur.filter((e) => e.cafe.id !== cafeId))
  }

  function handleCreateFolder(folderName: string) {
    void createFolder(folderName)
    setShowCreateFolder(false)
  }

  async function handleRenameFolder(oldName: string, newName: string) {
    if (pendingFolderActionRef.current) return
    pendingFolderActionRef.current = true
    setRenameTarget(null)
    try {
      const renamed = await renameFolder(oldName, newName)
      if (renamed) {
        showSavedToast({
          kind: "rename",
          title: t("folderRenamedToastTitle"),
          description: t("folderRenamedToastDesc", { oldName, newName }),
          closeLabel: t("closeToast"),
        })
      }
    } finally {
      pendingFolderActionRef.current = false
    }
  }

  async function handleDeleteFolder(name: string) {
    if (pendingFolderActionRef.current) return
    pendingFolderActionRef.current = true
    setDeleteTarget(null)
    try {
      const deleted = await deleteFolder(name)
      if (deleted) {
        showSavedToast({
          kind: "delete",
          title: t("folderDeletedToastTitle"),
          description: t("folderDeletedToastDesc", { name }),
          closeLabel: t("closeToast"),
        })
      }
    } finally {
      pendingFolderActionRef.current = false
    }
  }

  function handleMoveToCollection(cafe: Cafe, targetCollection: string | null) {
    void moveCafeToFolder(cafe, targetCollection)
    setMoveTarget(null)
  }

  function handleEnsureCollectionExists(folderName: string) {
    void createFolder(folderName)
  }

  // ── Not logged in ─────────────────────────────────────────────────────────────
  if (!previewMode && !isLoggedIn) {
    return (
      <section className="relative min-h-[100svh] overflow-hidden bg-[var(--background)] px-4 pb-[calc(var(--mobile-bottom-nav-height)+28px)] pt-[76px] text-[var(--foreground)] sm:px-6 sm:pt-[104px] lg:pb-16 lg:pt-28">
        <div className="pointer-events-none absolute inset-0 opacity-[0.14] [background-image:radial-gradient(#8b5b2b_0.8px,transparent_0.8px)] [background-size:18px_18px]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-linear-to-b from-[#fff0d2]/55 to-transparent dark:from-white/6" />

        <div className="relative mx-auto grid w-full max-w-6xl overflow-hidden rounded-[30px] border border-[#ffe3b7]/55 bg-[#1f1209] shadow-[0_28px_90px_rgba(44,26,14,0.2)] lg:grid-cols-[0.96fr_1.04fr]">
          <div className="relative min-h-[260px] lg:min-h-[560px]">
            <Image
              src="/image/home-polaroid-4.jpg"
              alt={t("loginVisualAlt")}
              fill
              priority
              sizes="(min-width: 1024px) 46vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-[#1f1209]/92 via-[#1f1209]/32 to-transparent lg:bg-linear-to-r lg:from-[#1f1209]/28 lg:via-[#1f1209]/22 lg:to-[#1f1209]/86" />
            <div className="absolute inset-x-4 bottom-4 rounded-[22px] border border-[#ffe3b7]/18 bg-[#1f1209]/42 p-4 text-[#fff0d2] backdrop-blur-xl sm:inset-x-6 sm:bottom-6 sm:p-5 lg:max-w-sm">
              <p className="text-[12px] font-bold text-[#ffd18c]">{t("loginVisualKicker")}</p>
              <p className="mt-2 text-sm leading-6 text-[#fff7e8]/84">{t("loginVisualCaption")}</p>
            </div>
          </div>
          <div className="flex flex-col justify-center bg-[#fffaf2]/94 p-6 backdrop-blur dark:bg-[#1f1209]/92 sm:p-9 lg:p-12">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#ffe3b7]/70 bg-white/55 px-3 py-1.5 text-[12px] font-bold text-[var(--accent)] shadow-[0_10px_28px_rgba(44,26,14,0.07)] dark:border-white/10 dark:bg-white/7">
              <Bookmark className="size-3.5" aria-hidden="true" />
              {t("collection")}
            </div>
            <h1 className="mt-4 max-w-xl font-lora text-[2rem] font-bold leading-[1.05] text-[var(--foreground)] sm:text-[3rem] lg:text-[3.55rem]">
              {t("title")}
            </h1>
            <p className="mt-4 max-w-md text-[15px] leading-7 text-[var(--foreground-muted)] sm:text-base">
              {t("loginRequired")}
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/login" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#875200] px-5 py-2.5 text-sm font-bold text-white shadow-[0_12px_32px_rgba(135,82,0,0.24)] transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#fffaf2] dark:focus-visible:ring-offset-[#1f1209]">
                <LogIn size={16} />
                {t("loginCta")}
              </Link>
              <Link href="/register" className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[#ffe3b7]/85 bg-white/72 px-5 py-2.5 text-sm font-bold text-[var(--foreground)] shadow-[0_10px_26px_rgba(44,26,14,0.06)] transition-colors hover:border-[#c8a97a] hover:bg-[#fff8f2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#fffaf2] dark:border-white/10 dark:bg-white/6 dark:focus-visible:ring-offset-[#1f1209]">
                <UserPlus size={16} />
                {t("registerCta")}
              </Link>
            </div>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <div className="rounded-[18px] border border-[#ffe3b7]/70 bg-white/56 p-4 shadow-[0_10px_28px_rgba(44,26,14,0.05)] dark:border-white/10 dark:bg-white/5">
                <Coffee className="mb-3 size-5 text-[var(--accent)]" aria-hidden="true" />
                <p className="text-sm font-bold text-[var(--foreground)]">{t("loginNoteOneTitle")}</p>
                <p className="mt-1 text-xs leading-5 text-[var(--foreground-muted)]">{t("loginNoteOneBody")}</p>
              </div>
              <div className="rounded-[18px] border border-[#dbe8d2] bg-[#f2f8ef]/72 p-4 shadow-[0_10px_28px_rgba(44,26,14,0.05)] dark:border-[#7a9e7e]/22 dark:bg-[#7a9e7e]/10">
                <Layers3 className="mb-3 size-5 text-[var(--sage)]" aria-hidden="true" />
                <p className="text-sm font-bold text-[var(--foreground)]">{t("loginNoteTwoTitle")}</p>
                <p className="mt-1 text-xs leading-5 text-[var(--foreground-muted)]">{t("loginNoteTwoBody")}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-[var(--background)] px-4 pb-[calc(var(--mobile-bottom-nav-height)+28px)] pt-[72px] text-[var(--foreground)] sm:px-6 sm:pt-[104px] lg:px-8 lg:pb-20 lg:pt-28">
      <div className="pointer-events-none absolute inset-0 opacity-[0.14] [background-image:radial-gradient(#8b5b2b_0.8px,transparent_0.8px)] [background-size:18px_18px]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-linear-to-b from-[#fff0d2]/55 to-transparent dark:from-white/6" />

      <div className="relative mx-auto max-w-[1280px]">

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="mb-5 grid gap-4 lg:mb-7 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-stretch">
        <div className="rounded-[28px] border border-[#ffe3b7]/60 bg-[#fffaf2]/72 p-4 shadow-[0_18px_58px_rgba(44,26,14,0.1)] backdrop-blur dark:border-white/10 dark:bg-white/5 sm:p-6 lg:p-7">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#ffe3b7]/70 bg-white/55 px-3 py-1.5 text-[12px] font-bold text-[var(--accent)] shadow-[0_10px_28px_rgba(44,26,14,0.06)] dark:border-white/10 dark:bg-white/7">
              <Bookmark className="size-3.5" aria-hidden="true" />
              {t("collection")}
            </span>
            {entries.length > 0 && (
              <span className="inline-flex items-center gap-2 rounded-full border border-[#dbe8d2] bg-[#f2f8ef]/72 px-3 py-1.5 text-[12px] font-bold text-[#4d7651] dark:border-[#7a9e7e]/24 dark:bg-[#7a9e7e]/12 dark:text-[#a7c9aa]">
                <Coffee className="size-3.5" aria-hidden="true" />
                {t("savedCafeTotalPlain", { count: entries.length })}
              </span>
            )}
          </div>

          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
              <h1 className="font-lora text-[2rem] font-bold leading-[1.04] text-[var(--foreground)] sm:text-[3.1rem] lg:text-[3.75rem]">
                {t("collectionTitle")}
              </h1>
              <p className="mt-3 max-w-2xl text-[14px] leading-6 text-[var(--foreground-muted)] sm:text-base sm:leading-7">
                {t("collectionSubtitle")}
              </p>
            </div>
            {entries.length > 0 && (
              <div className="grid grid-cols-2 gap-2 sm:min-w-[240px]">
                <div className="rounded-[18px] border border-[#ffe3b7]/70 bg-white/56 px-4 py-3 shadow-[0_10px_28px_rgba(44,26,14,0.05)] dark:border-white/10 dark:bg-white/5">
                  <p className="text-[11px] font-bold uppercase text-[var(--foreground-muted)]">{t("total")}</p>
                  <p className="mt-1 text-2xl font-bold text-[var(--foreground)]">{entries.length}</p>
                </div>
                <div className="rounded-[18px] border border-[#ffe3b7]/70 bg-white/56 px-4 py-3 shadow-[0_10px_28px_rgba(44,26,14,0.05)] dark:border-white/10 dark:bg-white/5">
                  <p className="text-[11px] font-bold uppercase text-[var(--foreground-muted)]">{t("folders")}</p>
                  <p className="mt-1 text-2xl font-bold text-[var(--foreground)]">{collections.length}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="relative hidden overflow-hidden rounded-[28px] border border-[#ffe3b7]/45 bg-[#1f1209] shadow-[0_24px_70px_rgba(44,26,14,0.16)] lg:block">
          <Image
            src="/image/home-polaroid-1.jpg"
            alt={t("collectionVisualAlt")}
            fill
            priority
            sizes="360px"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-[#1f1209]/92 via-[#1f1209]/32 to-transparent" />
          <div className="absolute right-4 bottom-4 left-4 rounded-[20px] border border-[#ffe3b7]/20 bg-[#1f1209]/44 p-4 text-[#fff0d2] backdrop-blur-xl">
            <p className="text-[12px] font-bold text-[#ffd18c]">{t("collectionVisualKicker")}</p>
            <p className="mt-2 text-sm leading-6 text-[#fff7e8]/84">{t("collectionVisualCaption")}</p>
          </div>
        </div>
      </div>

      <div className="rounded-[28px] border border-[#ffe3b7]/60 bg-[#fffaf2]/64 p-3 shadow-[0_20px_70px_rgba(44,26,14,0.09)] backdrop-blur dark:border-white/10 dark:bg-white/5 sm:p-5">

      {/* ── Collections row ──────────────────────────────────────────────────── */}
      {(entries.length > 0 || collections.length > 0) && (
        <section className="mb-5" aria-label={t("folders")}>
          <div className="mb-3 flex items-center justify-between gap-3 px-1">
            <h2 className="inline-flex items-center gap-2 text-sm font-bold text-[var(--foreground)] sm:text-base">
              <FolderOpen className="size-4 text-[var(--accent)]" aria-hidden="true" />
              {t("folders")}
            </h2>
            <button
              type="button"
              onClick={() => setShowCreateFolder(true)}
              className="inline-flex min-h-10 cursor-pointer items-center gap-1.5 rounded-full border border-[#ffe3b7]/75 bg-white/64 px-3.5 py-2 text-sm font-bold text-[#875200] shadow-[0_8px_22px_rgba(44,26,14,0.05)] transition-colors hover:bg-[#fff8f2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#fff8ed] dark:border-white/10 dark:bg-white/6 dark:text-[#ffb865] dark:focus-visible:ring-offset-[#1f1209]"
            >
              <FolderPlus size={15} />
              {t("createFolder")}
            </button>
          </div>

          <div className="-mx-1 flex gap-4 overflow-x-auto px-1 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {/* "All" pseudo-folder */}
            <FolderCard
              group={{ name: t("all"), cafes: entries.map((e) => e.cafe) }}
              active={activeCollection === "all"}
              onClick={() => setActiveCollection("all")}
            />

            {/* User collections */}
            {collections.map((col) => (
              <FolderCard
                key={col.name}
                group={col}
                active={activeCollection === col.name}
                canManage
                onClick={() => setActiveCollection(col.name)}
                onRename={() => setRenameTarget(col.name)}
                onDelete={() => setDeleteTarget(col.name)}
              />
            ))}

            {/* New folder CTA card */}
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => setShowCreateFolder(true)}
              type="button"
              className="group min-w-[150px] shrink-0 cursor-pointer rounded-[20px] text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#fff8ed] dark:focus-visible:ring-offset-[#1f1209] sm:min-w-[168px]"
            >
              <div className="mb-3 flex aspect-[4/3] items-center justify-center rounded-[18px] border-2 border-dashed border-[#d7c3b1] bg-[#fffaf2]/76 transition-all group-hover:border-[#c8842a]/60 group-hover:bg-[#fff8f2] dark:border-white/12 dark:bg-white/5">
                <FolderPlus size={28} className="text-[#c8a97a] transition-colors group-hover:text-[#875200]" />
              </div>
              <span className="block text-sm font-bold text-[var(--foreground-muted)] group-hover:text-[#875200]">{t("newFolder")}</span>
              <span className="block text-xs text-[#b99d7f]">{t("createNow")}</span>
            </motion.button>
          </div>
        </section>
      )}

      {/* ── Toolbar ──────────────────────────────────────────────────────────── */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between" aria-label={t("filters")}>
        <div className="flex flex-wrap items-center gap-2">
          {/* Mobile toggle */}
          <button
            type="button"
            onClick={() => setFiltersOpen((v) => !v)}
            className={cn(
              "inline-flex min-h-10 cursor-pointer items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm font-bold transition-all sm:hidden",
              filtersOpen || activeFilterCount > 0
                ? "border-[#875200] bg-[#875200] text-white"
                : "border-[#ffe3b7]/70 bg-[#fffaf2]/72 text-[var(--foreground)]"
            )}
          >
            <SlidersHorizontal size={14} />
            {t("filters")}
            {activeFilterCount > 0 && (
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white/30 text-[10px] font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Desktop chips */}
          <div className="hidden items-center gap-2 sm:flex sm:flex-wrap">
            <FilterChip active={quickFilter === "all"} onClick={() => setQuickFilter("all")}>
              {t("all")}
            </FilterChip>
            <FilterChip
              active={quickFilter === "open"}
              onClick={() => setQuickFilter(quickFilter === "open" ? "all" : "open")}
              icon={<span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />}
            >
              {t("openNow")}
            </FilterChip>
            <FilterChip
              active={quickFilter === "parking"}
              onClick={() => setQuickFilter(quickFilter === "parking" ? "all" : "parking")}
              icon={<Car size={13} />}
            >
              {t("hasParking")}
            </FilterChip>
            <DistrictDropdown value={district} onChange={setDistrict} />
          </div>
        </div>

        <SearchBar value={search} onChange={setSearch} />
      </div>

      {/* Mobile filter panel */}
      <AnimatePresence>
        {filtersOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="mb-4 overflow-hidden sm:hidden"
          >
            <div className="flex flex-wrap gap-2 pb-3">
              <FilterChip active={quickFilter === "all"} onClick={() => setQuickFilter("all")}>{t("all")}</FilterChip>
              <FilterChip
                active={quickFilter === "open"}
                onClick={() => setQuickFilter(quickFilter === "open" ? "all" : "open")}
                icon={<span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />}
              >
                {t("openNow")}
              </FilterChip>
              <FilterChip
                active={quickFilter === "parking"}
                onClick={() => setQuickFilter(quickFilter === "parking" ? "all" : "parking")}
                icon={<Car size={13} />}
              >
                {t("hasParking")}
              </FilterChip>
              <DistrictDropdown value={district} onChange={setDistrict} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active filter summary */}
      {activeFilterCount > 0 && (
        <div className="mb-4 flex flex-wrap items-center gap-2 px-1 text-sm text-[var(--foreground-muted)]">
          <span>{t("resultCount", { count: visibleCafes.length })}</span>
          <button
            type="button"
            onClick={() => { setQuickFilter("all"); setDistrict(""); setSearch("") }}
            className="inline-flex min-h-8 cursor-pointer items-center gap-1 rounded-full border border-[#ffe3b7]/70 bg-white/70 px-2.5 py-1 text-xs font-bold text-[#875200] transition-colors hover:bg-[#fff1ea] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] dark:border-white/10 dark:bg-white/6 dark:text-[#ffb865]"
          >
            <X size={11} />
            {t("clearFilters")}
          </button>
        </div>
      )}

      {/* ── Grid ─────────────────────────────────────────────────────────────── */}
      {entriesLoading ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <CafeCardSkeleton key={index} />
          ))}
        </div>
      ) : visibleCafes.length === 0 ? (
        <EmptyState
          title={entries.length === 0 ? t("empty") : t("noResults")}
          subtitle={entries.length === 0 ? t("emptySubtitle") : t("noResultsSubtitle")}
          cta={t("explore")}
        />
      ) : (
        <motion.div
          key={`${activeCollection}-${quickFilter}-${district}-${search}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {visibleCafes.map((cafe, index) => (
            <SavedCafeCard
              key={cafe.id}
              cafe={cafe}
              locale={locale}
              index={index}
              onSavedChange={(saved) => handleSavedChange(cafe.id, saved)}
              onAddToFolder={(c) => setMoveTarget(c)}
            />
          ))}
        </motion.div>
      )}

      {/* ── Bottom CTA ────────────────────────────────────────────────────────── */}
      {entries.length > 0 && (
        <div className="mt-10 flex justify-center">
          <Link
            href="/search"
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[#ffe3b7]/75 bg-[#fffaf2]/78 px-5 py-2.5 text-sm font-bold text-[#875200] shadow-[0_10px_26px_rgba(44,26,14,0.06)] transition-all hover:border-[#c8a97a] hover:bg-[#fff8f2] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#fff8ed] dark:border-white/10 dark:bg-white/6 dark:text-[#ffb865] dark:focus-visible:ring-offset-[#1f1209]"
          >
            <Search size={16} />
            {t("exploreMore")}
          </Link>
        </div>
      )}

      {/* ── Modals ───────────────────────────────────────────────────────────── */}

      {showCreateFolder && (
        <CreateFolderModal
          existing={collectionNames}
          onConfirm={handleCreateFolder}
          onClose={() => setShowCreateFolder(false)}
        />
      )}

      {renameTarget && (
        <RenameFolderModal
          current={renameTarget}
          existing={collectionNames.filter((n) => n !== renameTarget)}
          onConfirm={(newName) => { void handleRenameFolder(renameTarget, newName) }}
          onClose={() => setRenameTarget(null)}
        />
      )}

      {deleteTarget && (
        <DeleteFolderModal
          name={deleteTarget}
          count={collections.find((c) => c.name === deleteTarget)?.cafes.length ?? 0}
          onConfirm={() => { void handleDeleteFolder(deleteTarget) }}
          onClose={() => setDeleteTarget(null)}
        />
      )}

      {moveTarget && (
        <MoveToCollectionModal
          cafe={moveTarget}
          collections={collections}
          currentCollection={entries.find((e) => e.cafe.id === moveTarget.id)?.collectionName ?? null}
          onMove={(col) => handleMoveToCollection(moveTarget, col)}
          onCreate={handleEnsureCollectionExists}
          onClose={() => setMoveTarget(null)}
        />
      )}
      </div>
      </div>
    </section>
  )
}
