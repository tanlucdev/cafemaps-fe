import { cn } from "@/lib/utils"

type BadgeVariant = "vibe" | "purpose" | "price" | "default"

interface BadgeProps {
  label: string
  variant?: BadgeVariant
  className?: string
  onClick?: () => void
  active?: boolean
}

const vibeColors: Record<string, string> = {
  "yên tĩnh": "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  "nhộn nhịp": "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
  vintage: "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  "hiện đại": "bg-slate-50 text-slate-700 dark:bg-slate-900/30 dark:text-slate-300",
  "thiên nhiên": "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300",
  "sáng tạo": "bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
  "lãng mạn": "bg-pink-50 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300",
  minimalist: "bg-neutral-50 text-neutral-700 dark:bg-neutral-900/30 dark:text-neutral-300",
}

export default function Badge({
  label,
  variant = "default",
  className,
  onClick,
  active = false,
}: BadgeProps) {
  const vibeClass = variant === "vibe" ? vibeColors[label] : undefined

  return (
    <span
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => e.key === "Enter" && onClick()
          : undefined
      }
      onClick={onClick}
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium select-none",
        "transition-all duration-150",
        onClick && "cursor-pointer",
        variant === "default" &&
          !active &&
          "bg-[var(--background-secondary)] text-[var(--foreground-muted)]",
        variant === "price" &&
          "bg-[var(--accent-light)] text-[var(--accent)]",
        vibeClass,
        active &&
          "bg-[var(--accent)] text-[var(--accent-foreground)]",
        className
      )}
    >
      {label}
    </span>
  )
}
