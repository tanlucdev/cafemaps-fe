import { Coffee } from "lucide-react";

type SignatureDrinkSectionProps = {
  signatureDrink: string | null | undefined;
  label: string;
};

export default function SignatureDrinkSection({
  signatureDrink,
  label,
}: SignatureDrinkSectionProps) {
  if (!signatureDrink) return null;

  return (
    <div className="flex items-center gap-3.5 rounded-[22px] border border-[#ffe3b7]/34 bg-white/54 p-4 shadow-[var(--shadow-sm)] backdrop-blur-md dark:border-[#ffe3b7]/14 dark:bg-[#fff1d6]/7">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[var(--accent)] text-white shadow-[0_10px_24px_rgba(200,132,42,0.18)]">
        <Coffee size={18} />
      </span>
      <div>
        <p className="mb-1 text-[11px] font-bold tracking-[0.06em] text-[var(--foreground-muted)] uppercase">
          {label}
        </p>
        <p className="text-[15px] font-black text-[var(--foreground)]">{signatureDrink}</p>
      </div>
    </div>
  );
}
