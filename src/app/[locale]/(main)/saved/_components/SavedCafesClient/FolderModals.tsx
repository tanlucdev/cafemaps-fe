"use client";

import { useEffect, useRef, useState } from "react";
import { Trash2, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { ModalOverlay } from './ModalOverlay';

export function CreateFolderModal({
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
      <div className="w-full max-w-sm rounded-3xl bg-[var(--card)] p-6 shadow-2xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-bold text-[var(--foreground)]">{t("createFolderTitle")}</h2>
          <button type="button" onClick={onClose} className="cursor-pointer rounded-full p-1 text-[var(--foreground-muted)] hover:bg-[var(--season-soft)] dark:hover:bg-[var(--season-soft)]">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="saved-folder-name" className="mb-1.5 block text-sm font-medium text-[var(--foreground)]">
              {t("folderName")}
            </label>
            <input
              ref={inputRef}
              id="saved-folder-name"
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={t("folderNamePlaceholder")}
              maxLength={40}
              className={cn(
                "w-full rounded-xl border px-4 py-2.5 text-[16px] lg:text-sm text-[var(--foreground)] placeholder:text-[var(--foreground-muted)] focus:outline-none focus:ring-2",
                isDuplicate
                  ? "border-red-400 focus:ring-red-300"
                  : "border-[var(--border)] focus:border-[var(--accent)] focus:ring-[var(--accent)]/20 dark:border-[#3d2c1e]"
              )}
            />
            {isDuplicate && (
              <p className="mt-1 text-xs text-[var(--danger)]">{t("folderDuplicate")}</p>
            )}
            <p className="mt-1 text-right text-xs text-[var(--foreground-muted)]">{trimmed.length}/40</p>
          </div>

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 cursor-pointer rounded-xl border border-[var(--border)] py-2.5 text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--season-soft)] dark:border-[#3d2c1e] dark:hover:bg-[var(--season-soft)]"
            >
              {t("cancel")}
            </button>
            <button
              type="submit"
              disabled={!isValid}
              className="flex-1 cursor-pointer rounded-xl bg-[var(--accent)] py-2.5 text-sm font-semibold text-[var(--accent-foreground)] shadow-sm transition-opacity disabled:opacity-40 hover:opacity-90"
            >
              {t("createFolder")}
            </button>
          </div>
        </form>
      </div>
    </ModalOverlay>
  )
}

export function RenameFolderModal({
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
      <div className="w-full max-w-sm rounded-3xl bg-[var(--card)] p-6 shadow-2xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-bold text-[var(--foreground)]">{t("renameFolderTitle")}</h2>
          <button type="button" onClick={onClose} className="cursor-pointer rounded-full p-1 text-[var(--foreground-muted)] hover:bg-[var(--season-soft)]">
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
              "w-full rounded-xl border px-4 py-2.5 text-[16px] lg:text-sm focus:outline-none focus:ring-0",
              isDuplicate
                ? "border-red-400 focus:ring-red-300"
                : "border-[var(--border)] focus:border-[var(--accent)] focus:ring-[var(--accent)]/20 dark:border-[#3d2c1e]"
            )}
          />
          {isDuplicate && <p className="text-xs text-[var(--danger)]">{t("folderDuplicateShort")}</p>}
          <div className="flex gap-2">
            <button type="button" onClick={onClose} className="flex-1 cursor-pointer rounded-xl border border-[var(--border)] py-2.5 text-sm font-medium text-[var(--foreground)] hover:bg-[var(--season-soft)] dark:border-[#3d2c1e]">
              {t("cancel")}
            </button>
            <button type="submit" disabled={!isValid} className="flex-1 cursor-pointer rounded-xl bg-[var(--accent)] py-2.5 text-sm font-semibold text-[var(--accent-foreground)] disabled:opacity-40 hover:opacity-90">
              {t("save")}
            </button>
          </div>
        </form>
      </div>
    </ModalOverlay>
  )
}

export function DeleteFolderModal({
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
      <div className="w-full max-w-sm rounded-3xl bg-[var(--card)] p-6 shadow-2xl">
        <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50">
          <Trash2 size={22} className="text-[var(--danger)]" />
        </div>
        <h2 className="mb-1 text-lg font-bold text-[var(--foreground)]">{t("deleteFolderTitle")}</h2>
        <p className="text-sm text-[var(--foreground-muted)]">
          {t.rich("deleteFolderDesc", {
            name,
            count,
            strong: (chunks) => <span className="font-semibold">&ldquo;{chunks}&rdquo;</span>,
          })}
        </p>
        <div className="mt-6 flex gap-2">
          <button type="button" onClick={onClose} className="flex-1 cursor-pointer rounded-xl border border-[var(--border)] py-2.5 text-sm font-medium text-[var(--foreground)] hover:bg-[var(--season-soft)] dark:border-[#3d2c1e]">
            {t("cancel")}
          </button>
          <button type="button" onClick={onConfirm} className="flex-1 cursor-pointer rounded-xl bg-[var(--accent)] py-2.5 text-sm font-semibold text-[var(--accent-foreground)] hover:bg-[var(--accent-hover)]">
            {t("deleteFolder")}
          </button>
        </div>
      </div>
    </ModalOverlay>
  )
}
