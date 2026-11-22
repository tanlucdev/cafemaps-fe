"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const triggerClassName =
  "h-12 w-full min-w-0 rounded-full border border-[var(--border)] bg-[var(--background)] px-3 text-[16px] lg:text-sm font-medium focus:!border-[#8f5a16] focus:!shadow-none focus:!ring-0 focus-visible:!border-[#8f5a16] focus-visible:!ring-0 focus-visible:!outline-none outline-none data-[size=default]:h-12";

export default function MeetupFilterSelect({
  label,
  placeholder,
  value,
  options,
  labels,
  onChange,
  className,
}: {
  label: string;
  placeholder: string;
  value: string;
  options: readonly string[];
  labels?: readonly string[];
  onChange: (value: string) => void;
  className: string;
}) {
  return (
    <div className={cn("grid min-w-0 gap-1.5", className)}>
      <span className="px-1 text-xs font-semibold text-[var(--foreground-muted)]">{label}</span>
      <Select
        items={[
          { value: "", label: placeholder },
          ...options.map((option, index) => ({ value: option, label: labels?.[index] ?? option })),
        ]}
        value={value}
        onValueChange={(nextValue) => onChange(nextValue ?? "")}
      >
        <SelectTrigger aria-label={label} className={triggerClassName}>
          <SelectValue className="min-w-0 truncate" placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent
          side="bottom"
          align="start"
          sideOffset={8}
          alignItemWithTrigger={false}
          className="max-h-[min(16rem,var(--available-height))] rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-lg [scrollbar-width:thin]"
        >
          <SelectItem
            className="min-h-11 cursor-pointer rounded-xl focus:bg-[var(--accent-light)] focus:text-[#875200] focus:**:!text-[#875200] data-highlighted:bg-[var(--accent-light)] data-highlighted:text-[#875200] data-selected:bg-[var(--accent-light)] data-selected:font-bold data-selected:text-[#875200]"
            value=""
          >
            {placeholder}
          </SelectItem>
          {options.map((option, index) => (
            <SelectItem
              className="min-h-11 cursor-pointer rounded-xl focus:bg-[var(--accent-light)] focus:text-[#875200] focus:**:!text-[#875200] data-highlighted:bg-[var(--accent-light)] data-highlighted:text-[#875200] data-selected:bg-[var(--accent-light)] data-selected:font-bold data-selected:text-[#875200]"
              key={option}
              value={option}
            >
              {labels?.[index] ?? option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
