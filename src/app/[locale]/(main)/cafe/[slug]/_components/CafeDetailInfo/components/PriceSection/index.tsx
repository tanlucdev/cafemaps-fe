import { Banknote } from "lucide-react";

type PriceSectionProps = {
  price: string;
  label: string;
};

export default function PriceSection({ price, label }: PriceSectionProps) {
  if (!price) return null;

  return (
    <div className="flex items-center gap-2 text-sm font-bold text-[var(--foreground-muted)]">
      <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#fff0dc] text-[#a86d1e] dark:bg-[#33270A] dark:text-[#E6C25E]">
        <Banknote size={16} />
      </span>
      <span>{label}</span>
      <span className="text-[15px] font-black text-[var(--accent-hover)] dark:text-[#f0b869]">
        {price}
      </span>
    </div>
  );
}
