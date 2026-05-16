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
  align?: "right" | "center";
}

export default function LocaleSwitcher({ className, align = "right" }: LocaleSwitcherProps) {
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
            "absolute top-full z-50 mt-2 w-44 overflow-hidden rounded-2xl",
            "border border-(--border) bg-(--background)",
            "shadow-[0_8px_32px_rgba(40,22,4,0.14)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)]",
            "animate-in fade-in-0 zoom-in-95 duration-150",
            align === "center"
              ? "left-1/2 -translate-x-1/2"
              : "right-0",
          )}
        >
          <div className="p-1.5">
            {LOCALES.map((l) => (
              <button
                key={l.code}
                onClick={() => switchLocale(l.code)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
                  l.code === locale
                    ? "bg-[rgba(201,135,12,0.12)] font-semibold text-[#C9870C] dark:bg-[rgba(240,168,48,0.12)] dark:text-[#F0A830]"
                    : "text-(--foreground-muted) hover:text-foreground hover:bg-(--background-secondary)",
                )}
              >
                <ReactCountryFlag
                  countryCode={l.countryCode}
                  style={{ width: "1.2rem", height: "1.2rem" }}
                  svg
                />
                <span>{l.label}</span>
                {l.code === locale && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#C9870C] dark:bg-[#F0A830]" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
