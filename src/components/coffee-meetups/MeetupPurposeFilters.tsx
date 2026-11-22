import { useTranslations } from "next-intl";
import { MEETUP_PURPOSES } from "@/apis/coffee-meetups";
import PurposeIcon from "./PurposeIcon";

export default function MeetupPurposeFilters({
  value,
  onChange,
}: {
  value: string;
  onChange: (purpose: string) => void;
}) {
  const t = useTranslations("coffeeMeetups");
  const purposes = t.raw("purposes") as string[];
  return (
    <div className="flex flex-wrap gap-2 pb-3" role="group" aria-label={t("fields.purpose")}>
      {["", ...MEETUP_PURPOSES].map((purpose, index) => (
        <button
          key={purpose}
          type="button"
          aria-pressed={value === purpose}
          onClick={() => onChange(purpose)}
          className={`inline-flex min-h-12 shrink-0 items-center gap-2 rounded-full border py-1.5 pr-4 pl-2 text-[13px] font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] ${value === purpose ? "border-[var(--accent)]/50 bg-[var(--accent-light)] text-[var(--accent-hover)] shadow-[0_3px_8px_-4px_rgba(143,90,22,0.2)]" : "border-[var(--border)]/65 bg-[var(--card)] text-[var(--foreground-muted)] hover:border-[var(--accent)]/50 hover:bg-[var(--accent-light)]/40 hover:text-[var(--foreground)]"}`}
        >
          <span
            className={`flex size-8 items-center justify-center rounded-full ${["bg-[#f7e8cf]", "bg-[#e9eedf]", "bg-[#f5e2d8]", "bg-[#eee5f2]", "bg-[#f5eaca]", "bg-[#f6e1dd]", "bg-[#e3ece6]"][index]}`}
          >
            <PurposeIcon
              name={["sparkles", "book", "work", "language", "book", "friends", "chat"][index]}
              color="#795a3b"
            />
          </span>
          {index === 0 ? t("filters.allPurposes") : purposes[index - 1]}
        </button>
      ))}
    </div>
  );
}
