import type { GoodForItem } from "../../types";

type GoodForSectionProps = {
  label: string;
  items: GoodForItem[];
};

export default function GoodForSection({ label, items }: GoodForSectionProps) {
  if (items.length === 0) return null;

  return (
    <div className="pt-1">
      <p className="mb-3 text-[11px] font-bold tracking-[0.08em] text-[var(--foreground-muted)] uppercase">
        {label}
      </p>
      <div className="scrollbar-hide -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
        {items.map((item) => (
          <span
            key={item.label}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[#ffe3b7]/36 bg-white/58 px-3.5 py-2 text-sm font-bold text-[var(--foreground-muted)] shadow-[var(--shadow-sm)] backdrop-blur-md dark:border-[#ffe3b7]/14 dark:bg-[#fff1d6]/8"
          >
            <span aria-hidden>{item.emoji}</span>
            {item.label}
          </span>
        ))}
      </div>
    </div>
  );
}
