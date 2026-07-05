import { getAmenityIcon, getAmenityLabel } from "../../helpers";

type AmenitiesSectionProps = {
  amenities: string[];
  locale: string;
};

export default function AmenitiesSection({ amenities, locale }: AmenitiesSectionProps) {
  if (!amenities || amenities.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {amenities.map((a) => (
        <span
          key={a}
          className="flex items-center gap-1.5 rounded-full border border-[#ffe3b7]/36 bg-white/58 px-3 py-1.5 text-sm font-medium text-[var(--foreground-muted)] shadow-[var(--shadow-sm)] backdrop-blur-md dark:border-[#ffe3b7]/14 dark:bg-[#fff1d6]/8"
        >
          <span className="text-accent">{getAmenityIcon(a)}</span>
          {getAmenityLabel(a, locale)}
        </span>
      ))}
    </div>
  );
}
