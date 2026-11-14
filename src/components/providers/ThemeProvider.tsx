"use client";

import { createContext, useContext, useLayoutEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTranslations } from "next-intl";
import { Toaster } from "sonner";
import { cn } from "@/lib/utils";
import { persistTheme, resolveTheme, themeColor, type Theme } from "./theme";

export { THEME_STORAGE_KEY, type Theme } from "./theme";

type ThemeContextValue = { theme: Theme; toggleTheme: () => void };

const ThemeContext = createContext<ThemeContextValue | null>(null);

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.dataset.theme = theme;
  root.style.colorScheme = theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute(
    "content",
    themeColor(theme),
  );
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light");

  useLayoutEffect(() => {
    const initialTheme = resolveTheme(document.documentElement.dataset.theme ?? null);
    setThemeState(initialTheme);
    applyTheme(initialTheme);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setThemeState(nextTheme);
    applyTheme(nextTheme);
    persistTheme(nextTheme, () => localStorage);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
      <Toaster richColors position="top-right" theme={theme} />
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const theme = useContext(ThemeContext);
  if (!theme) throw new Error("useTheme must be used within ThemeProvider");
  return theme;
}

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  const t = useTranslations("nav");
  const nextTheme = theme === "light" ? "dark" : "light";
  const Icon = theme === "light" ? Sun : Moon;

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={cn(
        "inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-transparent transition-colors outline-none focus-visible:border-[var(--border)] focus-visible:ring-2 focus-visible:ring-[var(--header-focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent min-[390px]:size-9",
        "text-[var(--foreground)] hover:opacity-80",
        className,
      )}
      aria-label={nextTheme === "dark" ? t("themeToDark") : t("themeToLight")}
      title={nextTheme === "dark" ? t("themeToDark") : t("themeToLight")}
    >
      <Icon size={15} className="text-[var(--accent)]" aria-hidden />
    </button>
  );
}
