"use client";

import type { ReactNode } from "react";
import { CheckCircle2, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FocusKey, RequiredItem, SectionId } from "./model";
import { previewMutedClass } from "./editable-controls";

export function RequiredProgress({
  items,
  onOpen,
}: {
  items: RequiredItem[];
  onOpen: (section: SectionId | "gallery", focusKey: FocusKey) => void;
}) {
  return (
    <div className="rounded-[22px] border border-[#ffe3b7]/38 bg-white/58 p-3 shadow-[0_14px_42px_rgba(44,26,14,0.08)] backdrop-blur-md dark:border-[#ffe3b7]/14 dark:bg-[#1b0f08]/48">
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => onOpen(item.section, item.focusKey)}
            className={cn(
              "inline-flex h-9 items-center gap-1.5 rounded-full border px-3 text-xs font-black transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(200,132,42,0.18)]",
              item.done
                ? "border-[#bfe2cf] bg-[#effaf4] text-[#276747] dark:border-[#285d43] dark:bg-[#123028] dark:text-[#9be0ba]"
                : "border-[var(--accent)] bg-white text-[var(--accent-hover)] shadow-[var(--shadow-sm)] dark:bg-white/5",
            )}
          >
            {item.done && <CheckCircle2 size={14} />}
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function ClickableSection({
  children,
  onEdit,
  label,
  actionLabel = "Sửa",
  forceAction,
  className,
}: {
  children: ReactNode;
  onEdit: () => void;
  label: string;
  actionLabel?: string;
  forceAction?: boolean;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onEdit}
      aria-label={label}
      className={cn(
        "group relative block w-full rounded-2xl text-left transition hover:bg-white/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(200,132,42,0.18)]",
        className,
      )}
    >
      {children}
      <span
        className={cn(
          "absolute top-4 right-4 rounded-full border border-[var(--border)] bg-white/90 px-3 py-1.5 text-xs font-black text-[var(--foreground-muted)] opacity-0 shadow-[var(--shadow-sm)] transition group-hover:opacity-100 group-focus-visible:opacity-100 dark:bg-[#2a160c]/90",
          forceAction && "opacity-100",
        )}
      >
        {actionLabel}
      </span>
    </button>
  );
}

export function RequiredMiniBlock({
  title,
  children,
  onEdit,
  actionLabel = "Sửa",
  forceAction,
}: {
  title: string;
  children: ReactNode;
  onEdit: () => void;
  actionLabel?: string;
  forceAction?: boolean;
}) {
  return (
    <ClickableSection
      onEdit={onEdit}
      label={actionLabel}
      actionLabel={actionLabel}
      forceAction={forceAction}
      className="min-h-[92px] rounded-2xl border border-[var(--border)] bg-white/50 p-4 pr-28 dark:bg-white/5"
    >
      <p className="mb-1 text-xs font-bold text-[var(--foreground)]">{title}</p>
      <div className={previewMutedClass}>{children}</div>
    </ClickableSection>
  );
}

export function TitleActionBlock({
  title,
  onEdit,
  actionLabel,
}: {
  title: string;
  onEdit: () => void;
  actionLabel: string;
}) {
  return (
    <button
      type="button"
      onClick={onEdit}
      className="group flex w-full items-start justify-between gap-4 rounded-2xl p-3 text-left transition hover:bg-white/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(200,132,42,0.18)]"
    >
      <h1 className="min-w-0 text-[32px] leading-[1.12] font-[var(--font-lora)] font-bold break-words sm:text-[40px]">
        {title}
      </h1>
      <span className="mt-2 inline-flex h-10 shrink-0 items-center gap-1.5 rounded-full border border-[var(--border)] bg-white/90 px-4 text-xs font-black text-[var(--foreground-muted)] shadow-[var(--shadow-sm)] transition group-hover:border-[var(--accent)] group-hover:text-[var(--accent-hover)] dark:bg-[#2a160c]/90">
        <Plus size={14} />
        {actionLabel}
      </span>
    </button>
  );
}

export function SoftActionBlock({
  children,
  onEdit,
  label,
}: {
  children: ReactNode;
  onEdit: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onEdit}
      className="group flex w-full items-center justify-between gap-3 rounded-2xl border border-[var(--border)] bg-white/42 p-3 text-left transition hover:border-[var(--accent)] hover:bg-white/62 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(200,132,42,0.18)] dark:bg-white/5"
    >
      <div className="min-w-0">{children}</div>
      <span className="inline-flex h-8 shrink-0 items-center gap-1 rounded-full border border-[var(--border)] bg-white/88 px-3 text-xs font-black text-[var(--foreground-muted)] shadow-[var(--shadow-sm)] group-hover:text-[var(--accent-hover)] dark:bg-[#2a160c]/90">
        <Plus size={13} />
        {label}
      </span>
    </button>
  );
}

export function FormGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="space-y-3">
      <h2 className="text-xs font-black uppercase text-[var(--foreground-muted)]">{title}</h2>
      {children}
    </div>
  );
}
