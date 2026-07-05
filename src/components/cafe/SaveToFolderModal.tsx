"use client";

import { useEffect, useRef, useState } from "react";
import { Check, FolderOpen, FolderPlus, X } from "lucide-react";
import { useTranslations } from "next-intl";
import Modal from "@/components/ui/Modal";
import { getSavedCollections } from "@/lib/api";
import { cn } from "@/lib/utils";
import type { SavedCollection } from "@/types/cafe";

interface SaveToFolderModalProps {
  open: boolean;
  token: string | null;
  saving?: boolean;
  onClose: () => void;
  onSelect: (collectionName: string | null) => void;
}

export default function SaveToFolderModal({
  open,
  token,
  saving = false,
  onClose,
  onSelect,
}: SaveToFolderModalProps) {
  const t = useTranslations("saved");
  const [folders, setFolders] = useState<SavedCollection[]>([]);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const trimmed = newName.trim().slice(0, 40);
  const duplicate = folders.some((f) => f.name.toLowerCase() === trimmed.toLowerCase());
  const canCreate = Boolean(trimmed) && !duplicate && !saving;

  useEffect(() => {
    if (!open || !token) return;
    let alive = true;
    getSavedCollections(token).then((next) => {
      if (alive) setFolders(next);
    });
    return () => {
      alive = false;
    };
  }, [open, token]);

  useEffect(() => {
    if (creating) inputRef.current?.focus();
  }, [creating]);

  function select(collectionName: string | null) {
    if (!saving) onSelect(collectionName);
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={t("saveToFolder")}
      size="sm"
      contentClassName="p-0"
    >
      <div className="py-2">
        <FolderOption
          label={t("all")}
          active={false}
          disabled={saving}
          onClick={() => select(null)}
        />
        {folders.map((folder) => (
          <FolderOption
            key={folder.name}
            label={folder.name}
            active={false}
            disabled={saving}
            onClick={() => select(folder.name)}
          />
        ))}
      </div>
      <div className="border-t border-[var(--border)] p-4">
        {!creating ? (
          <button
            type="button"
            onClick={() => setCreating(true)}
            className="inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-[#875200] hover:underline dark:text-[#ffb865]"
          >
            <FolderPlus size={16} />
            {t("createFolderTitle")}
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && canCreate) select(trimmed);
                if (e.key === "Escape") setCreating(false);
              }}
              placeholder={t("folderNameEllipsis")}
              maxLength={40}
              className={cn(
                "h-9 min-w-0 flex-1 rounded-xl border px-3 text-sm text-[var(--foreground)] focus:outline-none focus:ring-2",
                duplicate
                  ? "border-red-400 focus:ring-red-300"
                  : "border-[var(--border)] focus:ring-[var(--accent)]"
              )}
            />
            <button
              type="button"
              disabled={!canCreate}
              onClick={() => select(trimmed)}
              className="h-9 cursor-pointer rounded-xl bg-[#875200] px-3 text-xs font-semibold text-white disabled:opacity-40"
            >
              {t("create")}
            </button>
            <button
              type="button"
              onClick={() => setCreating(false)}
              className="cursor-pointer rounded-lg p-1.5 text-[var(--foreground-muted)] hover:bg-[var(--background-secondary)]"
              aria-label={t("cancel")}
            >
              <X size={16} />
            </button>
          </div>
        )}
        {duplicate && <p className="mt-2 text-xs text-red-500">{t("folderDuplicateShort")}</p>}
      </div>
    </Modal>
  );
}

function FolderOption({
  label,
  active,
  disabled,
  onClick,
}: {
  label: string;
  active: boolean;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="flex w-full cursor-pointer items-center gap-3 px-5 py-3 text-left text-sm transition-colors hover:bg-[#fff8f2] disabled:opacity-60 dark:hover:bg-[#2c1a0e]"
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#e6dacd] bg-[#ffeadf] dark:border-[#3d2c1e] dark:bg-[#29170c]">
        <FolderOpen size={16} className="text-[#c8a97a]" />
      </span>
      <span className="min-w-0 flex-1 truncate font-medium text-[var(--foreground)]">{label}</span>
      {active && <Check size={16} className="shrink-0 text-[#875200]" />}
    </button>
  );
}
