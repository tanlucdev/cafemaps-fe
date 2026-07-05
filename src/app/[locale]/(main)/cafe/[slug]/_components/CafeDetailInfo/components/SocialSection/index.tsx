import InstagramIcon from "../InstagramIcon";
import type { InstagramLink, PhotoCreditWithInstagram } from "../../types";

type SocialSectionProps = {
  cafeInstagram: InstagramLink | null;
  photoCredits: PhotoCreditWithInstagram[];
  instagramLabel: string;
  photoCreditLabel: string;
};

export default function SocialSection({
  cafeInstagram,
  photoCredits,
  instagramLabel,
  photoCreditLabel,
}: SocialSectionProps) {
  if (!cafeInstagram && photoCredits.length === 0) return null;

  return (
    <div className="overflow-hidden rounded-[22px] border border-[#ffe3b7]/34 bg-white/54 shadow-[var(--shadow-sm)] backdrop-blur-md dark:border-[#ffe3b7]/14 dark:bg-[#fff1d6]/7">
      {cafeInstagram && (
        <div className="flex items-center justify-between gap-3 bg-[#fff4e5]/62 px-4 py-2.5 dark:bg-[#fff1d6]/6">
          <span className="flex shrink-0 items-center gap-1.5 text-[11px] font-bold tracking-[0.07em] text-[var(--foreground-muted)] uppercase">
            <InstagramIcon />
            {instagramLabel}
          </span>
          <a
            href={cafeInstagram.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[13.5px] font-bold tracking-[-0.01em] text-[var(--foreground-muted)] transition-colors hover:text-[var(--accent-hover)]"
          >
            {cafeInstagram.label}
          </a>
        </div>
      )}
      {photoCredits.length > 0 && (
        <div
          className={`flex flex-col gap-1.5 px-4 py-2.5 ${
            cafeInstagram ? "border-t border-[#ffe3b7]/28" : ""
          }`}
        >
          <span className="flex items-center gap-1.5 text-[11px] font-bold tracking-[0.07em] text-[var(--foreground-muted)] uppercase">
            <InstagramIcon />
            {photoCreditLabel}
          </span>
          {photoCredits.map((c) => (
            <a
              key={c.key}
              href={c.instagram.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[var(--foreground-muted)] transition-colors hover:text-[var(--accent-hover)]"
            >
              {c.instagram.label}
              {c.note && (
                <span className="text-[12px] font-normal text-[var(--foreground-muted)]">
                  · {c.note}
                </span>
              )}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
