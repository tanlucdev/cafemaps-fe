"use client";

import { MapPin, Search, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { AREAS } from "@/types/cafe";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import { cn } from "@/lib/utils";

export function FilterChip({
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
          ? "border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-foreground)] shadow-[0_8px_22px_rgba(135,82,0,0.18)]"
          : "border-[#ffe3b7]/70 bg-[#fffaf2]/72 text-[var(--foreground)] shadow-[0_8px_24px_rgba(44,26,14,0.05)] backdrop-blur hover:border-[#c8a97a] hover:bg-[#fff8f2] dark:border-white/10 dark:bg-white/6 dark:text-[#f5e8d8] dark:hover:border-[var(--accent)]"
      )}
    >
      {icon}
      {children}
    </button>
  )
}

export function DistrictDropdown({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const t = useTranslations("saved");
  return (
    <Select value={value} onValueChange={(next) => onChange(next ?? "")}>
      <SelectTrigger aria-label={t("area")} className="min-h-10 rounded-full border-[var(--border)] bg-[var(--card)] px-3.5 text-[16px] lg:text-sm">
        <MapPin size={13} />
        <span>{value || t("area")}</span>
      </SelectTrigger>
      <SelectContent align="start" alignItemWithTrigger={false} className="rounded-2xl border border-[var(--border)]">
        <SelectItem value="">{t("all")}</SelectItem>
        {AREAS.map((area) => <SelectItem key={area} value={area}>{area}</SelectItem>)}
      </SelectContent>
    </Select>
  );
}

export function SearchBar({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const t = useTranslations("saved")
  return (
    <div className="relative w-full min-w-0 rounded-full sm:max-w-xs">
      <Search size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9b8675]" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={t("searchPlaceholder")}
        className="min-h-11 w-full rounded-full border border-[#ffe3b7]/75 bg-[#fffaf2]/82 py-2.5 pl-9 pr-9 text-[16px] lg:text-sm font-semibold text-[var(--foreground)] placeholder-[#9b8675] shadow-[0_10px_26px_rgba(44,26,14,0.06)] backdrop-blur dark:border-white/10 dark:bg-white/6 dark:text-[#f5e8d8]"
      />
      {value && (
        <button type="button" onClick={() => onChange("")} className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-[#9b8675] hover:text-[var(--foreground)]">
          <X size={13} />
        </button>
      )}
    </div>
  )
}
