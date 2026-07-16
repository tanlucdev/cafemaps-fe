import type { ReactNode } from "react";
import {
  BookOpen,
  Camera,
  Heart,
  Home,
  Laptop,
  Leaf,
  MessageCircle,
  ShoppingBag,
  Sparkles,
  Users,
  Wind,
  type LucideIcon,
} from "lucide-react";
import Badge from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import type { Cafe } from "@/types/cafe";

const vibeBadgeClassName =
  "gap-2 rounded-[14px] border border-[#e6b56f]/34 bg-[#fff8ec]/72 px-2.5 py-1 text-[12.5px] font-bold text-[#4a2a16] shadow-none backdrop-blur-md dark:border-[#e6b56f]/20 dark:bg-[#2a190c]/64 dark:text-[#f2c27f]";
const purposeBadgeClassName =
  "gap-2 rounded-[13px] border border-[#dcc6a6]/36 bg-[#f8efe0]/58 px-2.5 py-1 text-[12px] font-semibold text-[#76573c] shadow-none backdrop-blur-md dark:border-[#ffe3b7]/12 dark:bg-[#fff1d6]/6 dark:text-[#d8c3a8]";
const featureBadgeClassName =
  "gap-2 rounded-[13px] border border-[#d8c0a0]/28 bg-white/26 px-2.5 py-1 text-[12px] font-semibold text-[#8a6a4c] shadow-none backdrop-blur-md dark:border-[#ffe3b7]/10 dark:bg-[#fff1d6]/5 dark:text-[#c8b199]";

const tagStyles: Record<string, string> = {
  vintage: "border-[#c58a61]/34 bg-[#fff1e6]/72 text-[#67381f] dark:text-[#f0b98c]",
  "lãng mạn": "border-[#d99aa2]/34 bg-[#fff0f2]/72 text-[#71313b] dark:text-[#f1b0ba]",
  minimalist: "border-[#d6c3a5]/38 bg-[#f8f1e7]/72 text-[#4f3b29]",
  "hiện đại": "border-[#9fb9c9]/34 bg-[#edf6f8]/72 text-[#315565] dark:text-[#a9d2df]",
  "thiên nhiên": "border-[#8eb889]/36 bg-[#eef7eb]/72 text-[#315b35] dark:text-[#a9d6a5]",
  "yên tĩnh": "border-[#9db1ce]/34 bg-[#eef3fb]/72 text-[#354d74] dark:text-[#b8c9ea]",
  "hẹn hò": "border-[#d99aa2]/30 bg-[#fff4f3]/62 text-[#754047] dark:text-[#efb3bb]",
  "gặp bạn bè": "border-[#e2b36c]/34 bg-[#fff7e8]/68 text-[#765024] dark:text-[#efc77f]",
  "chụp ảnh": "border-[#b7a2cf]/34 bg-[#f6f0fb]/68 text-[#5f4677] dark:text-[#d1b8ea]",
  "làm việc": "border-[#9fb9c9]/30 bg-[#eef6f8]/64 text-[#365a67] dark:text-[#abd5df]",
  "học tập": "border-[#b7a2cf]/30 bg-[#f7f2fb]/64 text-[#604977] dark:text-[#d2bdeb]",
  "ngoài trời": "border-[#8eb889]/30 bg-[#f0f7ec]/62 text-[#42623a] dark:text-[#acd3a4]",
  "trong nhà": "border-[#d6c3a5]/32 bg-[#fbf4ea]/62 text-[#705539] dark:text-[#d9bea0]",
  "máy lạnh": "border-[#9fc4d6]/30 bg-[#eef8fb]/62 text-[#416678] dark:text-[#abd7e8]",
  "view đẹp": "border-[#b7a2cf]/30 bg-[#f7f2fb]/62 text-[#604977] dark:text-[#d2bdeb]",
  "mang đi": "border-[#e2b36c]/30 bg-[#fff7e8]/62 text-[#765024] dark:text-[#efc77f]",
};

const tagIcons: Record<string, LucideIcon> = {
  vintage: Sparkles,
  "lãng mạn": Heart,
  minimalist: Sparkles,
  "hiện đại": Sparkles,
  "thiên nhiên": Leaf,
  "yên tĩnh": BookOpen,
  "hẹn hò": Heart,
  "gặp bạn bè": Users,
  "chụp ảnh": Camera,
  "làm việc": Laptop,
  "học tập": BookOpen,
  "đọc sách": BookOpen,
  chat: MessageCircle,
  work: Laptop,
  "ngoài trời": Leaf,
  "trong nhà": Home,
  "máy lạnh": Wind,
  "view đẹp": Sparkles,
  "mang đi": ShoppingBag,
} satisfies Record<string, typeof Sparkles>;

type DetailTagsProps = {
  cafe: Cafe;
  displayTags: string[];
  featureLabel: string;
  purposeLabel: string;
  vibeLabel: string;
};

function TagGroup({
  label,
  children,
  compact = false,
}: {
  label: string;
  children: ReactNode;
  compact?: boolean;
}) {
  return (
    <div className="grid min-w-0 gap-2 sm:grid-cols-[108px_minmax(0,1fr)] sm:items-start">
      <p className="pt-1 text-[10px] font-bold tracking-[0.12em] text-[#9a7651] uppercase dark:text-[#c09a70]">
        {label}
      </p>
      <div className={compact ? "flex flex-wrap gap-x-3 gap-y-1.5" : "flex flex-wrap gap-2"}>
        {children}
      </div>
    </div>
  );
}

function getTagKey(label: string) {
  return label.trim().toLowerCase();
}

function TagIcon({ label }: { label: string }) {
  const Icon = tagIcons[getTagKey(label)] ?? Sparkles;
  return <Icon size={13} strokeWidth={2.2} className="shrink-0 opacity-80" />;
}

export default function DetailTags({
  cafe,
  displayTags,
  featureLabel,
  purposeLabel,
  vibeLabel,
}: DetailTagsProps) {
  if (cafe.vibes.length === 0 && cafe.purposes.length === 0 && displayTags.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3 border-y border-[#ead8bf]/58 py-4 dark:border-[#ffe3b7]/10">
      {cafe.vibes.length > 0 && (
        <TagGroup label={vibeLabel}>
          {cafe.vibes.map((v) => (
            <Badge
              key={v}
              label={v}
              variant="vibe"
              className={cn(vibeBadgeClassName, tagStyles[getTagKey(v)])}
            >
              <TagIcon label={v} />
              {v}
            </Badge>
          ))}
        </TagGroup>
      )}
      {cafe.purposes.length > 0 && (
        <TagGroup label={purposeLabel}>
          {cafe.purposes.map((p) => (
            <Badge key={p} label={p} className={cn(purposeBadgeClassName, tagStyles[getTagKey(p)])}>
              <TagIcon label={p} />
              {p}
            </Badge>
          ))}
        </TagGroup>
      )}
      {displayTags.length > 0 && (
        <div>
          <TagGroup label={featureLabel} compact>
            {displayTags.map((tag) => (
              <Badge
                key={tag}
                label={tag}
                className={cn(featureBadgeClassName, tagStyles[getTagKey(tag)])}
              >
                <TagIcon label={tag} />
                {tag}
              </Badge>
            ))}
          </TagGroup>
        </div>
      )}
    </div>
  );
}
