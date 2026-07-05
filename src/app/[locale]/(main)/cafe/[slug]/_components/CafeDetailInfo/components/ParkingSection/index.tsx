import { Car } from "lucide-react";

type ParkingSectionProps = {
  parkingLabel: string;
  parkingTypeLabel: string;
  parkingLocation: string | null;
};

export default function ParkingSection({
  parkingLabel,
  parkingTypeLabel,
  parkingLocation,
}: ParkingSectionProps) {
  if (!parkingLocation) return null;

  return (
    <div className="rounded-[22px] border border-[#ffe3b7]/34 bg-white/54 px-4 py-3.5 shadow-[var(--shadow-sm)] backdrop-blur-md dark:border-[#ffe3b7]/14 dark:bg-[#fff1d6]/7">
      <p className="mb-2.5 flex items-center gap-1.5 text-[11px] font-bold tracking-[0.08em] text-[var(--foreground-muted)] uppercase">
        <Car size={14} />
        {parkingLabel}
      </p>
      <div className="flex items-baseline gap-2 text-[13.5px]">
        <span className="min-w-13 shrink-0 font-bold text-[var(--foreground)]">
          {parkingTypeLabel}
        </span>
        <span className="text-[11px] text-[var(--border)]">·</span>
        <span className="leading-normal text-[var(--foreground-muted)]">{parkingLocation}</span>
      </div>
    </div>
  );
}
