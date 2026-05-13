"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import ReactCountryFlag from "react-country-flag";

interface LocaleSwitcherProps {
  className?: string;
}

export default function LocaleSwitcher({ className }: LocaleSwitcherProps) {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  function toggle() {
    const next = locale === "vi" ? "en" : "vi";
    const newPath = pathname.replace(`/${locale}`, `/${next}`);
    router.push(newPath);
  }

  return (
    <button
      onClick={toggle}
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-none border-0 bg-transparent p-0 transition-colors hover:bg-transparent",
        "text-[var(--foreground-muted)] hover:text-[var(--foreground)]",
        className,
      )}
      aria-label="Switch language"
    >
      {locale === "en" ? (
        <ReactCountryFlag
          countryCode="US"
          style={{ width: "1.2rem", height: "1.2rem" }}
          svg
          className="text-secondary hover:text-primary cursor-pointer transition-colors"
        />
      ) : (
        <ReactCountryFlag
          countryCode="VN"
          style={{ width: "1.2rem", height: "1.2rem" }}
          svg
          className="text-secondary hover:text-primary cursor-pointer transition-colors"
        />
      )}{" "}
    </button>
  );
}
