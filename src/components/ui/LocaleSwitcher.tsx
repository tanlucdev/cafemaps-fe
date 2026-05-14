"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import ReactCountryFlag from "react-country-flag";

const LOCALES = [
  { code: "vi", label: "Tiếng Việt", countryCode: "VN" },
  { code: "en", label: "English", countryCode: "US" },
] as const;

interface LocaleSwitcherProps {
  className?: string;
}

export default function LocaleSwitcher({ className }: LocaleSwitcherProps) {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function switchLocale(next: string) {
    setOpen(false);
    if (next === locale) return;
    router.replace(pathname, { locale: next });
  }

  const current = LOCALES.find((l) => l.code === locale) ?? LOCALES[0];

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex h-8 items-center gap-1.5 rounded-full px-2 py-1 transition-colors",
          "text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-(--background-secondary)",
        )}
        aria-label="Switch language"
        aria-expanded={open}
      >
        <ReactCountryFlag
          countryCode={current.countryCode}
          style={{ width: "1.1rem", height: "1.1rem" }}
          svg
        />
        <span className="text-xs font-medium uppercase">{current.code}</span>
        <ChevronDown
          size={12}
          className={cn("transition-transform duration-200", open && "rotate-180")}
        />
      </button>

      {open && (
        <div
          className={cn(
            "absolute right-0 top-full z-50 mt-1.5 w-40 overflow-hidden rounded-xl",
            "border border-(--border) bg-(--background) shadow-lg",
          )}
        >
          {LOCALES.map((l) => (
            <button
              key={l.code}
              onClick={() => switchLocale(l.code)}
              className={cn(
                "flex w-full items-center gap-2.5 px-3 py-2.5 text-sm transition-colors",
                l.code === locale
                  ? "text-accent bg-(--accent-light) font-medium"
                  : "text-(--foreground-muted) hover:text-(--foreground) hover:bg-(--background-secondary)",
              )}
            >
              <ReactCountryFlag
                countryCode={l.countryCode}
                style={{ width: "1.1rem", height: "1.1rem" }}
                svg
              />
              {l.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
