import Badge from "@/components/ui/Badge";
import type { Cafe } from "@/types/cafe";

const badgeClassName =
  "border border-[#ffe3b7]/36 bg-white/58 px-3 py-1 text-[12.5px] shadow-[var(--shadow-sm)] backdrop-blur-md dark:bg-[#fff1d6]/8";

type DetailTagsProps = {
  cafe: Cafe;
  displayTags: string[];
};

export default function DetailTags({ cafe, displayTags }: DetailTagsProps) {
  if (cafe.vibes.length === 0 && cafe.purposes.length === 0 && displayTags.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2 pt-0.5">
      {cafe.vibes.map((v) => (
        <Badge key={v} label={v} variant="vibe" className={badgeClassName} />
      ))}
      {cafe.purposes.map((p) => (
        <Badge key={p} label={p} className={badgeClassName} />
      ))}
      {displayTags.map((tag) => (
        <Badge key={tag} label={tag} className={badgeClassName} />
      ))}
    </div>
  );
}
