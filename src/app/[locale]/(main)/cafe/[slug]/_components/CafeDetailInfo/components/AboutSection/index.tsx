import { ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";

export default function AboutSection({
  paragraphs,
  experienceUrls,
}: {
  paragraphs: string[];
  experienceUrls?: string[] | null;
}) {
  const t = useTranslations("cafe.detail");
  const links = new Set<string>();
  if (Array.isArray(experienceUrls)) {
    for (const value of experienceUrls) {
      if (typeof value !== "string" || !/^https?:\/\//i.test(value.trim())) continue;
      try {
        const url = new URL(value.trim());
        if (!url.username && !url.password) links.add(url.href);
      } catch {
        // Skip malformed source URLs.
      }
    }
  }
  if (paragraphs.length === 0 && links.size === 0) return null;

  return (
    <div className="rounded-[22px] border border-[#ffe3b7]/34 bg-white/54 px-4 py-4 shadow-[var(--shadow-sm)] backdrop-blur-md dark:border-[#ffe3b7]/14 dark:bg-[#fff1d6]/7">
      {paragraphs.length > 0 && (
        <div className="space-y-4 border-l-[3px] border-[#e4ad58]/44 pl-4 text-[15px] leading-[1.85] font-[var(--font-lora)] text-[var(--foreground-muted)] italic">
          {paragraphs.map((paragraph, index) => (
            <p key={`${paragraph.slice(0, 24)}-${index}`}>
              {index === 0 && <>&ldquo;</>}
              {paragraph}
              {index === paragraphs.length - 1 && <>&rdquo;</>}
            </p>
          ))}
        </div>
      )}
      {links.size > 0 && (
        <div className={`flex flex-wrap gap-x-1 ${paragraphs.length ? "mt-2" : ""}`}>
          {Array.from(links, (href, index) => {
            const label = t("experienceSourceLink", { count: links.size, index: index + 1 });
            return (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t("experienceSourceLinkAria", { label })}
                className="group inline-flex min-h-11 items-center gap-1.5 rounded-lg px-1.5 text-xs font-semibold text-[var(--accent-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
              >
                <span className="decoration-current underline-offset-4 group-hover:underline">
                  {label}
                </span>
                <ArrowUpRight
                  size={13}
                  className="shrink-0 opacity-60 transition-opacity group-hover:opacity-100"
                  aria-hidden="true"
                />
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}
