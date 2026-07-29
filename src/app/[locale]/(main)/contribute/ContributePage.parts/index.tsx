import type { LucideIcon } from "lucide-react";
import Image from "next/image";

export function TrustNotes({
  notes,
  className = "",
}: {
  notes: { icon: LucideIcon; label: string }[];
  className?: string;
}) {
  return (
    <div className={className}>
      {notes.map((note) => {
        const Icon = note.icon;
        return (
          <div
            key={note.label}
            className="flex items-center gap-3 rounded-[18px] border border-[var(--border)] bg-[#fffaf2]/68 px-4 py-3 text-[13px] font-bold text-[var(--foreground)] shadow-[0_10px_28px_rgba(44,26,14,0.06)] backdrop-blur dark:bg-white/5"
          >
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[var(--accent-light)] text-[var(--accent)]">
              <Icon className="size-4" aria-hidden="true" />
            </span>
            {note.label}
          </div>
        );
      })}
    </div>
  );
}

export function ContributeVisual({
  alt,
  kicker,
  caption,
  priority = false,
}: {
  alt: string;
  kicker: string;
  caption: string;
  priority?: boolean;
}) {
  return (
    <div className="relative w-full min-w-0 overflow-hidden rounded-[28px] border border-[#ffe3b7]/45 bg-[#1f1209] shadow-[0_24px_70px_rgba(44,26,14,0.22)] sm:rounded-[34px]">
      <div className="relative aspect-[4/3] min-h-[310px] lg:h-[318px] lg:min-h-0 lg:aspect-auto">
        <Image
          src="/image/home-polaroid-3.jpg"
          alt={alt}
          fill
          className="object-cover"
          sizes="(min-width: 1024px) 56vw, 100vw"
          priority={priority}
        />
        <div className="absolute inset-0 bg-linear-to-t from-[#1f1209]/92 via-[#1f1209]/28 to-transparent" />
        <div className="absolute right-3 bottom-3 left-3 rounded-[22px] border border-[#ffe3b7]/20 bg-[#1f1209]/42 p-4 text-[#fff0d2] backdrop-blur-xl sm:right-6 sm:bottom-6 sm:left-6 sm:p-5">
          <p className="text-[12px] font-bold text-[#ffd18c]">{kicker}</p>
          <p className="mt-2 break-words text-[14px] leading-6 text-[#fff7e8]/88 sm:text-[15px]">
            {caption}
          </p>
        </div>
      </div>
    </div>
  );
}
