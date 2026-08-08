import Image from "next/image";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { QuizResult } from "@/types/quiz";

export function QuizPosterCard({ result, className }: { result: QuizResult; className?: string }) {
  return (
    <div
      className={cn(
        "relative isolate overflow-hidden rounded-[8px] bg-[#f7ead7] shadow-[0_24px_60px_rgba(88,55,24,0.18)]",
        className,
      )}
    >
      <Image
        src={result.profile.posterImage}
        alt={result.profile.title}
        fill
        sizes="(min-width: 1280px) 390px, (min-width: 640px) 360px, 76vw"
        priority
        quality={90}
        className="object-cover"
      />
    </div>
  );
}

export function ActionButton({
  icon: Icon,
  label,
  onClick,
  disabled = false,
}: {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="inline-flex h-10 min-w-0 items-center justify-center gap-2 rounded-full border border-[#dfbf8f] bg-white/80 px-2 text-xs font-black text-[var(--foreground)] shadow-sm transition-colors hover:bg-[#fff6e5] disabled:cursor-not-allowed disabled:opacity-55 sm:h-11 sm:px-3 lg:h-10 dark:bg-white/5"
    >
      <Icon className="size-4 shrink-0" />
      <span className="min-w-0 truncate">{label}</span>
    </button>
  );
}
