"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const CHIP_BASE =
  "inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold shadow-[var(--shadow-sm)] backdrop-blur-md transition-all duration-150 hover:-translate-y-px hover:scale-[1.02] focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] active:scale-95";

const CHIP_ACTIVE = "border-[var(--accent)] bg-[var(--accent-light)] text-[var(--accent)]";

const CHIP_INACTIVE =
  "border-[var(--border)] bg-white/62 text-[var(--foreground-muted)] hover:border-[var(--accent)] hover:bg-[var(--accent-light)] hover:text-[var(--accent)] dark:bg-[var(--card)]";

interface FilterChipButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active: boolean;
  activeClassName?: string;
  inactiveClassName?: string;
}

export const FilterChipButton = forwardRef<HTMLButtonElement, FilterChipButtonProps>(
  (
    {
      active,
      activeClassName = CHIP_ACTIVE,
      inactiveClassName = CHIP_INACTIVE,
      className,
      children,
      ...props
    },
    ref,
  ) => (
    <button
      ref={ref}
      aria-pressed={active}
      className={cn(CHIP_BASE, active ? activeClassName : inactiveClassName, className)}
      {...props}
    >
      {children}
    </button>
  ),
);

FilterChipButton.displayName = "FilterChipButton";
