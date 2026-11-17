"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

const triggerClassName =
  "h-11 w-full rounded-2xl border border-[var(--border)] bg-[var(--card)]/72 px-3 text-[16px] lg:text-sm font-bold focus:!border-[#8f5a16] focus:!shadow-none focus:!ring-0 focus-visible:!border-[#8f5a16] focus-visible:!ring-0 focus-visible:!outline-none outline-none data-[size=default]:h-11";

export default function MeetupFilterSelect({
  label,
  placeholder,
  value,
  options,
  onChange,
  className,
}: {
  label: string;
  placeholder: string;
  value: string;
  options: readonly string[];
  onChange: (value: string) => void;
  className: string;
}) {
  return (
    <div className={cn("grid flex-1 gap-1", className)}>
      <span className="px-1 text-[11px] font-black text-[var(--accent)] uppercase">{label}</span>
      <Select value={value} onValueChange={(nextValue) => onChange(nextValue ?? "")}>
        <SelectTrigger aria-label={label} className={triggerClassName}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent side="bottom" align="start" sideOffset={8} alignItemWithTrigger={false}
          className="max-h-[min(16rem,var(--available-height))] rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-lg [scrollbar-width:thin]">
          <SelectItem className="min-h-11 cursor-pointer rounded-xl data-highlighted:bg-[var(--accent-light)] data-selected:bg-[var(--accent-light)] data-selected:font-bold data-selected:text-[var(--accent)]" value="">{placeholder}</SelectItem>
          {options.map((option) => (
            <SelectItem className="min-h-11 cursor-pointer rounded-xl data-highlighted:bg-[var(--accent-light)] data-selected:bg-[var(--accent-light)] data-selected:font-bold data-selected:text-[var(--accent)]" key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
