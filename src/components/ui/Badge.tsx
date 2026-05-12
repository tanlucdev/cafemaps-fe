import { cn } from "@/lib/utils";

type BadgeVariant = "vibe" | "purpose" | "price" | "default";

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  className?: string;
  onClick?: () => void;
  active?: boolean;
  children?: React.ReactNode;
}

const WARM_TAG =
  "bg-[#F0E8DC] text-[#2C1A0E] dark:bg-[#2A1A0A] dark:text-[#C4A882] hover:brightness-95";
const SAGE_TAG =
  "bg-[#EAF2EB] text-[#4A7A4E] dark:bg-[#1A2C1B] dark:text-[#7A9E7E] hover:brightness-95";

const vibeColors: Record<string, string> = {
  "yên tĩnh": WARM_TAG,
  "nhộn nhịp": WARM_TAG,
  vintage: WARM_TAG,
  "hiện đại": WARM_TAG,
  "thiên nhiên": SAGE_TAG,
  "sáng tạo": WARM_TAG,
  "lãng mạn": WARM_TAG,
  minimalist: WARM_TAG,
  "sôi động": WARM_TAG,
  chill: WARM_TAG,
  acoustic: WARM_TAG,
};

export default function Badge({
  label,
  variant = "default",
  className,
  onClick,
  active = false,
  children,
}: BadgeProps) {
  const vibeClass = variant === "vibe" ? vibeColors[label] : undefined;

  return (
    <span
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === "Enter" && onClick() : undefined}
      onClick={onClick}
      className={cn(
        "inline-flex items-center rounded-full border border-transparent px-2.5 py-0.5 text-xs font-medium select-none",
        "transition-all duration-150",
        onClick && "cursor-pointer",
        variant === "default" &&
          (active
            ? "bg-primary text-primary-foreground shadow-sm"
            : "bg-secondary text-secondary-foreground hover:bg-primary/20"),
        variant === "vibe" &&
          (active
            ? "bg-primary text-primary-foreground shadow-sm"
            : vibeClass || "bg-secondary text-secondary-foreground hover:bg-primary/20"),
        className,
      )}
    >
      {children || label}
    </span>
  );
}
