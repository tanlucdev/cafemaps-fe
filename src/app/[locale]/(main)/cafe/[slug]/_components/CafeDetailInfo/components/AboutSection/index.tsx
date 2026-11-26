import { ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";

export default function AboutSection({
  paragraphs,
  experienceUrls,
}: {
  paragraphs: string[];
  experienceUrls?: string[] | null;
}) {
  const t = useTranslations("cafe");
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
    <section className="rounded-[22px] border border-[var(--border)] bg-[var(--surface-raised)] p-4 shadow-[var(--shadow-sm)] sm:p-6">
      <h2 className="mb-3 text-lg font-bold tracking-tight text-[var(--foreground)] sm:mb-4 sm:text-xl">
        {t("about")}
      </h2>
      {paragraphs.length > 0 && (
        <div className="max-w-[58ch] space-y-3 text-base leading-[1.75] break-words text-[var(--foreground)] sm:space-y-4">
          {paragraphs.map((paragraph, index) => (
            <p key={`${paragraph.slice(0, 24)}-${index}`}>{paragraph}</p>
          ))}
        </div>
      )}
      {links.size > 0 && (
        <div className={`flex flex-wrap gap-x-1 ${paragraphs.length ? "mt-2" : ""}`}>
          {Array.from(links, (href, index) => {
            const label = t("detail.experienceSourceLink", { count: links.size, index: index + 1 });
            return (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t("detail.experienceSourceLinkAria", { label })}
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
    </section>
  );
}
