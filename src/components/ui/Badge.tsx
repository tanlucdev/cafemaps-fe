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
const BLUE_TAG =
  "bg-[#E6F0F9] text-[#1A3A5A] dark:bg-[#1A2530] dark:text-[#7DA0C2] hover:brightness-95";
const ROSE_TAG =
  "bg-[#FCE8ED] text-[#5A1A2A] dark:bg-[#301A20] dark:text-[#C28292] hover:brightness-95";
const LAVENDER_TAG =
  "bg-[#F0E6F9] text-[#3A1A5A] dark:bg-[#251A30] dark:text-[#9A7DC2] hover:brightness-95";
const PEACH_TAG =
  "bg-[#FFF1E6] text-[#8A3E12] dark:bg-[#351C0D] dark:text-[#F0AA72] hover:brightness-95";
const MINT_TAG =
  "bg-[#E6F6F1] text-[#1D6B58] dark:bg-[#123028] dark:text-[#7FCDB8] hover:brightness-95";
const GOLD_TAG =
  "bg-[#FFF4CF] text-[#7A5200] dark:bg-[#33270A] dark:text-[#E6C25E] hover:brightness-95";
const SKY_TAG =
  "bg-[#E7F3FF] text-[#285A88] dark:bg-[#10283F] dark:text-[#88BDE8] hover:brightness-95";

const TAG_PALETTE = [
  WARM_TAG,
  SAGE_TAG,
  BLUE_TAG,
  ROSE_TAG,
  LAVENDER_TAG,
  PEACH_TAG,
  MINT_TAG,
  GOLD_TAG,
  SKY_TAG,
];

function normalizeLabel(label: string) {
  return label.trim().toLowerCase();
}

function getFallbackTagClass(label: string) {
  const normalized = normalizeLabel(label);
  const seed = Array.from(normalized).reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return TAG_PALETTE[seed % TAG_PALETTE.length];
}

const vibeColors: Record<string, string> = {
  "yên tĩnh": BLUE_TAG,
  "nhộn nhịp": WARM_TAG,
  vintage: ROSE_TAG,
  "hiện đại": BLUE_TAG,
  "thiên nhiên": SAGE_TAG,
  "sáng tạo": LAVENDER_TAG,
  "lãng mạn": ROSE_TAG,
  minimalist: WARM_TAG,
  "sôi động": WARM_TAG,
  chill: LAVENDER_TAG,
  acoustic: WARM_TAG,
};

const tagColors: Record<string, string> = {
  ...vibeColors,
  "hẹn hò": ROSE_TAG,
  "làm việc": BLUE_TAG,
  work: BLUE_TAG,
  "học tập": SKY_TAG,
  study: SKY_TAG,
  "đọc sách": LAVENDER_TAG,
  "chill một mình": MINT_TAG,
  "một mình": MINT_TAG,
  "gặp bạn bè": PEACH_TAG,
  "họp nhóm": PEACH_TAG,
  "ngồi lâu": GOLD_TAG,
  "sân vườn": SAGE_TAG,
  "thú cưng": GOLD_TAG,
  pet: GOLD_TAG,
};

export default function Badge({
  label,
  variant = "default",
  className,
  onClick,
  active = false,
  children,
}: BadgeProps) {
  const normalizedLabel = normalizeLabel(label);
  const tagClass = tagColors[normalizedLabel] ?? getFallbackTagClass(label);
  const vibeClass = variant === "vibe" ? tagClass : undefined;

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
          (active ? "bg-primary text-primary-foreground shadow-sm" : tagClass),
        variant === "vibe" && (active ? "bg-primary text-primary-foreground shadow-sm" : vibeClass),
        className,
      )}
    >
      {children || label}
    </span>
  );
}
