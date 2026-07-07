"use client"

import { Check, Pencil, Trash2, X } from "lucide-react"
import { toast } from "sonner"

type SavedToastKind = "rename" | "delete"

export function showSavedToast({
  kind,
  title,
  description,
  closeLabel,
}: {
  kind: SavedToastKind
  title: string
  description: string
  closeLabel: string
}) {
  toast.custom(
    (id) => (
      <div className="flex w-[min(360px,calc(100vw-32px))] items-start gap-3 rounded-[18px] border border-[#ffe3b7]/80 bg-[#fffaf2]/96 p-3.5 text-[#29170c] shadow-[0_18px_48px_rgba(44,26,14,0.18)] backdrop-blur-md dark:border-white/10 dark:bg-[#1c1209]/96 dark:text-[#f5e8d8]">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#ffe3b7]/70 bg-[#fff1da] text-[#875200] dark:border-white/10 dark:bg-[#2c1a0e] dark:text-[#ffb865]">
          {kind === "rename" ? <Pencil size={16} /> : <Trash2 size={16} />}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <Check size={13} className="shrink-0 text-[#6f8f50]" />
            <p className="truncate text-sm font-bold">{title}</p>
          </div>
          <p className="mt-0.5 line-clamp-2 text-xs leading-5 text-[#806a58] dark:text-[#d8c2ad]">{description}</p>
        </div>
        <button
          type="button"
          aria-label={closeLabel}
          onClick={() => toast.dismiss(id)}
          className="flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-full text-[#9b8675] transition-colors hover:bg-[#fff1ea] hover:text-[#29170c] dark:hover:bg-[#2c1a0e] dark:hover:text-[#f5e8d8]"
        >
          <X size={14} />
        </button>
      </div>
    ),
    { id: "saved-folder-action" }
  )
}
