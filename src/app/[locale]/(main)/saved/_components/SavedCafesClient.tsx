"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Image from "next/image"
import { Link } from "@/i18n/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  Bookmark,
  Car,
  Check,
  ChevronDown,
  FolderOpen,
  FolderPlus,
  MapPin,
  MoreHorizontal,
  Pencil,
  Search,
  SlidersHorizontal,
  Trash2,
  X,
} from "lucide-react"
import { useTranslations } from "next-intl"
import type { Cafe, SavedCafeEntry } from "@/types/cafe"
import { AREAS } from "@/types/cafe"
import { getCurrentAccessToken } from "@/lib/auth-client"
import { getSavedCafeEntries, moveToCollection } from "@/lib/api"
import CafeCard from "@/components/cafe/CafeCard"
import { cn } from "@/lib/utils"
import { isCafeOpenNow } from "@/lib/opening-hours"

// ─── Types ────────────────────────────────────────────────────────────────────

interface SavedCafesClientProps {
  locale: string
  initialIsLoggedIn: boolean
  initialEntries: SavedCafeEntry[]
  previewMode?: boolean
}

type QuickFilter = "all" | "open" | "parking"

interface CollectionGroup {
  name: string
  cafes: Cafe[]
}

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
          <h2 className="text-lg font-bold text-[#29170c] dark:text-[#f5e8d8]">Tạo thư mục mới</h2>
          <button type="button" onClick={onClose} className="cursor-pointer rounded-full p-1 text-[#9b8675] hover:bg-[#f5ede7] dark:hover:bg-[#2c1a0e]">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#29170c] dark:text-[#e8d5c4]">
              Tên thư mục
            </label>
            <input
              ref={inputRef}
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="vd: Muốn thử, Hẹn hò, Hay ghé..."
              maxLength={40}
              className={cn(
                "w-full rounded-xl border px-4 py-2.5 text-sm text-[#29170c] placeholder-[#b5a090] focus:outline-none focus:ring-2 dark:bg-[#29170c] dark:text-[#f5e8d8]",
                isDuplicate
                  ? "border-red-400 focus:ring-red-300"
                  : "border-[#e6dacd] focus:border-[#c8842a] focus:ring-[#c8842a]/20 dark:border-[#3d2c1e]"
              )}
            />
            {isDuplicate && (
              <p className="mt-1 text-xs text-red-500">Tên thư mục này đã tồn tại.</p>
            )}
            <p className="mt-1 text-right text-xs text-[#9b8675]">{trimmed.length}/40</p>
          </div>

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 cursor-pointer rounded-xl border border-[#e6dacd] py-2.5 text-sm font-medium text-[#29170c] transition-colors hover:bg-[#f5ede7] dark:border-[#3d2c1e] dark:text-[#e8d5c4] dark:hover:bg-[#2c1a0e]"
            >
              Huỷ
            </button>
            <button
              type="submit"
              disabled={!isValid}
              className="flex-1 cursor-pointer rounded-xl bg-[#875200] py-2.5 text-sm font-semibold text-white shadow-sm transition-opacity disabled:opacity-40 hover:opacity-90"
            >
              Tạo thư mục
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
          <h2 className="text-lg font-bold text-[#29170c] dark:text-[#f5e8d8]">Đổi tên thư mục</h2>
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
          {isDuplicate && <p className="text-xs text-red-500">Tên này đã tồn tại.</p>}
          <div className="flex gap-2">
            <button type="button" onClick={onClose} className="flex-1 cursor-pointer rounded-xl border border-[#e6dacd] py-2.5 text-sm font-medium text-[#29170c] hover:bg-[#f5ede7] dark:border-[#3d2c1e] dark:text-[#e8d5c4]">
              Huỷ
            </button>
            <button type="submit" disabled={!isValid} className="flex-1 cursor-pointer rounded-xl bg-[#875200] py-2.5 text-sm font-semibold text-white disabled:opacity-40 hover:opacity-90">
              Lưu
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
  onMove: (collectionName: string) => void
  onCreate: (name: string) => void
  onClose: () => void
}) {
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
              <p className="text-xs text-[#9b8675]">Thêm vào thư mục</p>
              <p className="text-sm font-semibold text-[#29170c] dark:text-[#f5e8d8]">{cafe.name}</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="cursor-pointer rounded-full p-1 text-[#9b8675] hover:bg-[#f5ede7] dark:hover:bg-[#2c1a0e]">
            <X size={18} />
          </button>
        </div>

        {/* List */}
        <div className="max-h-72 overflow-y-auto py-2">
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
                  <p className="text-xs text-[#9b8675]">{col.cafes.length} quán</p>
                </div>
                {isActive && <Check size={16} className="shrink-0 text-[#875200]" />}
              </button>
            )
          })}

          {collections.length === 0 && (
            <p className="px-6 py-4 text-sm text-[#9b8675]">Chưa có thư mục nào.</p>
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
              Tạo thư mục mới
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <input
                ref={newNameRef}
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Tên thư mục..."
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
                Tạo
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
  return (
    <ModalOverlay onClose={onClose}>
      <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl dark:bg-[#1c1209]">
        <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50">
          <Trash2 size={22} className="text-red-500" />
        </div>
        <h2 className="mb-1 text-lg font-bold text-[#29170c] dark:text-[#f5e8d8]">Xoá thư mục?</h2>
        <p className="text-sm text-[#6b5a4a]">
          Thư mục <span className="font-semibold">&ldquo;{name}&rdquo;</span> có {count} quán sẽ bị xoá. Các quán vẫn giữ trong &ldquo;Tất cả&rdquo;.
        </p>
        <div className="mt-6 flex gap-2">
          <button type="button" onClick={onClose} className="flex-1 cursor-pointer rounded-xl border border-[#e6dacd] py-2.5 text-sm font-medium text-[#29170c] hover:bg-[#f5ede7] dark:border-[#3d2c1e] dark:text-[#e8d5c4]">
            Huỷ
          </button>
          <button type="button" onClick={onConfirm} className="flex-1 cursor-pointer rounded-xl bg-red-500 py-2.5 text-sm font-semibold text-white hover:bg-red-600">
            Xoá thư mục
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

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm"
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
    </AnimatePresence>
  )
}

// ─── Folder Context Menu ──────────────────────────────────────────────────────

function FolderMenu({
  onRename,
  onDelete,
  onClose,
}: {
  onRename: () => void
  onDelete: () => void
  onClose: () => void
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose()
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [onClose])

  return (
    <div
      ref={ref}
      className="absolute right-0 top-8 z-20 min-w-[140px] overflow-hidden rounded-2xl border border-[#e6dacd] bg-white py-1 shadow-xl dark:border-[#3d2c1e] dark:bg-[#1c1209]"
    >
      <button
        type="button"
        onClick={() => { onRename(); onClose() }}
        className="flex w-full cursor-pointer items-center gap-2 px-4 py-2.5 text-sm text-[#29170c] transition-colors hover:bg-[#fff8f2] dark:text-[#e8d5c4] dark:hover:bg-[#2c1a0e]"
      >
        <Pencil size={14} className="text-[#875200]" />
        Đổi tên
      </button>
      <button
        type="button"
        onClick={() => { onDelete(); onClose() }}
        className="flex w-full cursor-pointer items-center gap-2 px-4 py-2.5 text-sm text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-950/30"
      >
        <Trash2 size={14} />
        Xoá thư mục
      </button>
    </div>
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
  const preview = group.cafes.slice(0, 4)
  const extra = Math.max(group.cafes.length - 3, 0)
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="group relative min-w-[160px] shrink-0">
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={onClick}
        className="w-full cursor-pointer text-left"
        type="button"
      >
        <div
          className={cn(
            "relative mb-3 aspect-[4/3] overflow-hidden rounded-2xl border transition-all duration-200",
            active
              ? "border-[#c8842a] shadow-[0_8px_24px_rgba(200,132,42,0.22)] ring-2 ring-[#c8842a]/30"
              : "border-[#e6dacd] shadow-[0_4px_16px_rgba(41,23,12,0.07)] group-hover:border-[#c8842a]/50 group-hover:shadow-[0_8px_20px_rgba(41,23,12,0.12)]"
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
              <div className="flex items-center justify-center bg-[#875200]">
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
            <div className="pointer-events-none absolute inset-0 rounded-2xl ring-2 ring-inset ring-[#c8842a]/40" />
          )}
        </div>
        <span className={cn("block truncate text-sm font-semibold transition-colors", active ? "text-[#875200]" : "text-[#29170c] group-hover:text-[#875200] dark:text-[#e8d5c4]")}>
          {group.name}
        </span>
        <span className="block text-xs text-[#9b8675]">{group.cafes.length} quán</span>
      </motion.button>

      {/* Folder context menu trigger */}
      {canManage && (
        <div className="relative">
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setMenuOpen((v) => !v) }}
            className="absolute right-0 top-[-116px] flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-white/90 opacity-0 shadow-sm transition-opacity group-hover:opacity-100 dark:bg-[#2c1a0e]/90"
          >
            <MoreHorizontal size={14} className="text-[#6b5a4a]" />
          </button>
          {menuOpen && (
            <FolderMenu
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
        "inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all duration-150",
        active
          ? "border-[#875200] bg-[#875200] text-white shadow-sm"
          : "border-[#e6dacd] bg-white/70 text-[#4a3728] hover:border-[#c8a97a] hover:bg-[#fff8f2] dark:border-[#3d2c1e] dark:bg-[#1c1209]/60 dark:text-[#e8d5c4] dark:hover:border-[#875200]"
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
          "inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all duration-150",
          active
            ? "border-[#875200] bg-[#875200] text-white shadow-sm"
            : "border-[#e6dacd] bg-white/70 text-[#4a3728] hover:border-[#c8a97a] hover:bg-[#fff8f2] dark:border-[#3d2c1e] dark:bg-[#1c1209]/60 dark:text-[#e8d5c4]"
        )}
      >
        <MapPin size={13} />
        {active ? value : "Khu vực"}
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
            className="absolute left-0 top-10 z-30 max-h-64 w-44 overflow-y-auto rounded-2xl border border-[#e6dacd] bg-white py-1 shadow-xl dark:border-[#3d2c1e] dark:bg-[#1c1209]"
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
  return (
    <div className="relative max-w-xs">
      <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#9b8675]" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Tìm trong bộ sưu tập..."
        className="w-full rounded-full border border-[#e6dacd] bg-white/70 py-1.5 pl-8 pr-8 text-sm text-[#29170c] placeholder-[#b5a090] focus:border-[#c8842a] focus:outline-none focus:ring-2 focus:ring-[#c8842a]/20 dark:border-[#3d2c1e] dark:bg-[#1c1209]/60 dark:text-[#e8d5c4]"
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

function EmptyState({ locale, title, subtitle, cta }: { locale: string; title: string; subtitle: string; cta: string }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20 text-center"
    >
      <div className="mb-6 flex h-32 w-32 items-center justify-center rounded-full bg-[#fff1ea] shadow-[0_8px_32px_rgba(41,23,12,0.08)]">
        <Bookmark size={48} className="text-[#c8a97a]" />
      </div>
      <h2 className="text-xl font-bold text-[#29170c]">{title}</h2>
      <p className="mt-2 max-w-xs text-sm text-[#6b5a4a]">{subtitle}</p>
      <Link href="/search" className="mt-7 rounded-xl bg-[#875200] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90">
        {cta}
      </Link>
    </motion.section>
  )
}

// ─── Add-to-folder button on card overlay ─────────────────────────────────────

function AddToFolderButton({ onClick }: { onClick: (e: React.MouseEvent) => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title="Thêm vào thư mục"
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
  previewMode = false,
}: SavedCafesClientProps) {
  const t = useTranslations("saved")

  // ── Auth & entries ──────────────────────────────────────────────────────────
  const [isLoggedIn, setIsLoggedIn] = useState(initialIsLoggedIn)
  const [entries, setEntries] = useState(initialEntries)

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

  // ── Auth sync ────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (previewMode) return
    let alive = true
    const syncAuth = async () => {
      const token = await getCurrentAccessToken()
      if (alive) setIsLoggedIn(Boolean(token))
    }
    void syncAuth()
    window.addEventListener("cafe-auth-change", syncAuth)
    return () => { alive = false; window.removeEventListener("cafe-auth-change", syncAuth) }
  }, [previewMode])

  useEffect(() => {
    if (previewMode || !isLoggedIn) return
    let alive = true
    ;(async () => {
      const token = await getCurrentAccessToken()
      if (!token) { if (alive) setEntries([]); return }
      const next = await getSavedCafeEntries(token)
      if (alive) setEntries(next)
    })()
    return () => { alive = false }
  }, [isLoggedIn, previewMode])

  // ── Derived collections ──────────────────────────────────────────────────────
  const collections = useMemo<CollectionGroup[]>(() => {
    const map = new Map<string, Cafe[]>()
    for (const entry of entries) {
      const key = entry.collectionName?.trim() || ""
      if (!key) continue
      const list = map.get(key) ?? []
      list.push(entry.cafe)
      map.set(key, list)
    }
    return Array.from(map.entries()).map(([name, cafes]) => ({ name, cafes }))
  }, [entries])

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
  }, [activeCollection, quickFilter, district, search, entries])

  const activeFilterCount = [quickFilter !== "all", district !== "", search !== ""].filter(Boolean).length

  // ── Handlers ─────────────────────────────────────────────────────────────────

  function handleSavedChange(cafeId: string, saved: boolean) {
    if (!saved) setEntries((cur) => cur.filter((e) => e.cafe.id !== cafeId))
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function handleCreateFolder(_folderName: string) {
    setShowCreateFolder(false)
  }

  function handleRenameFolder(oldName: string, newName: string) {
    setEntries((cur) =>
      cur.map((e) =>
        (e.collectionName ?? "").trim() === oldName
          ? { ...e, collectionName: newName }
          : e
      )
    )
    if (activeCollection === oldName) setActiveCollection(newName)
    setRenameTarget(null)

    // fire-and-forget: patch all affected saved entries on backend
    void (async () => {
      const token = await getCurrentAccessToken()
      if (!token) return
      const affected = entries.filter((e) => (e.collectionName ?? "").trim() === oldName)
      await Promise.all(affected.map((e) => moveToCollection(e.cafe.id, newName, token).catch(() => null)))
    })()
  }

  function handleDeleteFolder(name: string) {
    // Remove collectionName from all entries in this folder (move them to "uncollected")
    setEntries((cur) =>
      cur.map((e) =>
        (e.collectionName ?? "").trim() === name
          ? { ...e, collectionName: null }
          : e
      )
    )
    if (activeCollection === name) setActiveCollection("all")
    setDeleteTarget(null)
  }

  async function handleMoveToCollection(cafe: Cafe, targetCollection: string) {
    setEntries((cur) =>
      cur.map((e) =>
        e.cafe.id === cafe.id
          ? { ...e, collectionName: targetCollection }
          : e
      )
    )
    setMoveTarget(null)

    const token = await getCurrentAccessToken()
    if (token) {
      await moveToCollection(cafe.id, targetCollection, token).catch(() => null)
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function handleEnsureCollectionExists(_folderName: string) {
    // no-op: collections are derived from entries
  }

  // ── Not logged in ─────────────────────────────────────────────────────────────
  if (!previewMode && !isLoggedIn) {
    return (
      <section className="mx-auto max-w-[1280px] px-4 pb-16 pt-24 sm:px-6 sm:pt-28 lg:pt-32">
        <div className="rounded-3xl border border-[#e6dacd] bg-gradient-to-br from-[#fffaf6] to-[#fff1e8] p-8 shadow-[0_8px_40px_rgba(41,23,12,0.07)]">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#fff1ea] shadow-sm">
            <Bookmark size={28} className="text-[#875200]" />
          </div>
          <h1 className="text-2xl font-bold text-[#29170c]">{t("title")}</h1>
          <p className="mt-2 max-w-md text-sm text-[#6b5a4a]">{t("loginRequired")}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/login" className="rounded-xl bg-[#875200] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90">
              {t("loginCta")}
            </Link>
            <Link href="/register" className="rounded-xl border border-[#e6dacd] bg-white px-5 py-2.5 text-sm font-semibold text-[#29170c] transition-colors hover:border-[#c8a97a]">
              {t("registerCta")}
            </Link>
          </div>
        </div>
      </section>
    )
  }

  const collectionNames = collections.map((c) => c.name)

  return (
    <section className="mx-auto max-w-[1280px] px-4 pb-20 pt-24 sm:px-6 sm:pt-28 lg:px-8 lg:pt-32">

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="mb-10 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-[2rem] font-bold leading-tight tracking-[-0.02em] text-[#29170c] sm:text-[2.75rem] dark:text-[#f5e8d8]">
            Bộ sưu tập của bạn
          </h1>
          <p className="mt-1.5 text-base text-[#6b5a4a]">
            Những không gian bạn đã chọn lưu lại — dễ tìm, dễ ghé.
          </p>
        </div>
        {entries.length > 0 && (
          <div className="flex items-center gap-4 text-sm text-[#6b5a4a]">
            <span><span className="font-semibold text-[#29170c] dark:text-[#f5e8d8]">{entries.length}</span> quán đã lưu</span>
            {collections.length > 0 && (
              <>
                <span className="h-3.5 w-px bg-[#d7c3b1]" />
                <span><span className="font-semibold text-[#29170c] dark:text-[#f5e8d8]">{collections.length}</span> thư mục</span>
              </>
            )}
          </div>
        )}
      </div>

      {/* ── Collections row ──────────────────────────────────────────────────── */}
      {entries.length > 0 && (
        <section className="mb-10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold text-[#29170c] dark:text-[#f5e8d8]">Thư mục</h2>
            <button
              type="button"
              onClick={() => setShowCreateFolder(true)}
              className="inline-flex cursor-pointer items-center gap-1.5 text-sm font-medium text-[#875200] transition-opacity hover:opacity-75"
            >
              <FolderPlus size={15} />
              Tạo thư mục
            </button>
          </div>

          <div className="-mx-1 flex gap-4 overflow-x-auto px-1 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {/* "All" pseudo-folder */}
            <FolderCard
              group={{ name: "Tất cả", cafes: entries.map((e) => e.cafe) }}
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
              className="group min-w-[160px] shrink-0 cursor-pointer text-left"
            >
              <div className="mb-3 flex aspect-[4/3] items-center justify-center rounded-2xl border-2 border-dashed border-[#d7c3b1] bg-[#fdf8f4] transition-all group-hover:border-[#c8842a]/60 group-hover:bg-[#fff8f2] dark:border-[#3d2c1e] dark:bg-[#1c1209]">
                <FolderPlus size={28} className="text-[#c8a97a] transition-colors group-hover:text-[#875200]" />
              </div>
              <span className="block text-sm font-medium text-[#9b8675] group-hover:text-[#875200]">Thư mục mới</span>
              <span className="block text-xs text-[#c8b9a8]">Tạo ngay</span>
            </motion.button>
          </div>
        </section>
      )}

      {/* ── Toolbar ──────────────────────────────────────────────────────────── */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Mobile toggle */}
          <button
            type="button"
            onClick={() => setFiltersOpen((v) => !v)}
            className={cn(
              "inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all sm:hidden",
              filtersOpen || activeFilterCount > 0
                ? "border-[#875200] bg-[#875200] text-white"
                : "border-[#e6dacd] bg-white/70 text-[#4a3728]"
            )}
          >
            <SlidersHorizontal size={14} />
            Bộ lọc
            {activeFilterCount > 0 && (
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white/30 text-[10px] font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Desktop chips */}
          <div className="hidden items-center gap-2 sm:flex sm:flex-wrap">
            <FilterChip active={quickFilter === "all"} onClick={() => setQuickFilter("all")}>
              Tất cả
            </FilterChip>
            <FilterChip
              active={quickFilter === "open"}
              onClick={() => setQuickFilter(quickFilter === "open" ? "all" : "open")}
              icon={<span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />}
            >
              Đang mở cửa
            </FilterChip>
            <FilterChip
              active={quickFilter === "parking"}
              onClick={() => setQuickFilter(quickFilter === "parking" ? "all" : "parking")}
              icon={<Car size={13} />}
            >
              Có chỗ đậu xe
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
              <FilterChip active={quickFilter === "all"} onClick={() => setQuickFilter("all")}>Tất cả</FilterChip>
              <FilterChip
                active={quickFilter === "open"}
                onClick={() => setQuickFilter(quickFilter === "open" ? "all" : "open")}
                icon={<span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />}
              >
                Đang mở cửa
              </FilterChip>
              <FilterChip
                active={quickFilter === "parking"}
                onClick={() => setQuickFilter(quickFilter === "parking" ? "all" : "parking")}
                icon={<Car size={13} />}
              >
                Có chỗ đậu xe
              </FilterChip>
              <DistrictDropdown value={district} onChange={setDistrict} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active filter summary */}
      {activeFilterCount > 0 && (
        <div className="mb-4 flex items-center gap-2 text-sm text-[#6b5a4a]">
          <span>{visibleCafes.length} kết quả</span>
          <button
            type="button"
            onClick={() => { setQuickFilter("all"); setDistrict(""); setSearch("") }}
            className="inline-flex cursor-pointer items-center gap-1 rounded-full border border-[#e6dacd] bg-white/70 px-2.5 py-0.5 text-xs text-[#875200] transition-colors hover:bg-[#fff1ea]"
          >
            <X size={11} />
            Xoá bộ lọc
          </button>
        </div>
      )}

      {/* ── Grid ─────────────────────────────────────────────────────────────── */}
      {visibleCafes.length === 0 ? (
        <EmptyState
          locale={locale}
          title={entries.length === 0 ? t("empty") : "Không tìm thấy quán nào"}
          subtitle={entries.length === 0 ? t("emptySubtitle") : "Thử thay đổi bộ lọc hoặc từ khoá tìm kiếm."}
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
        <div className="mt-12 flex justify-center">
          <Link
            href="/search"
            className="inline-flex items-center gap-2 rounded-2xl border border-[#e6dacd] bg-white px-6 py-3 text-sm font-semibold text-[#875200] shadow-sm transition-all hover:border-[#c8a97a] hover:bg-[#fff8f2] hover:shadow-md dark:border-[#3d2c1e] dark:bg-[#1c1209] dark:text-[#ffb865]"
          >
            <Search size={16} />
            Khám phá thêm quán mới
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
          onConfirm={(newName) => handleRenameFolder(renameTarget, newName)}
          onClose={() => setRenameTarget(null)}
        />
      )}

      {deleteTarget && (
        <DeleteFolderModal
          name={deleteTarget}
          count={collections.find((c) => c.name === deleteTarget)?.cafes.length ?? 0}
          onConfirm={() => handleDeleteFolder(deleteTarget)}
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
    </section>
  )
}
