"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
}

export default function ThemeToggle({ className }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();

  function toggleTheme() {
    const isDark =
      resolvedTheme === "dark" || document.documentElement.classList.contains("dark");
    setTheme(isDark ? "light" : "dark");
  }

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className={cn(
        "relative flex h-8 w-8 cursor-pointer items-center justify-center rounded-none border-0 p-0",
        "text-[var(--foreground-muted)] hover:text-[var(--foreground)]",
        "bg-transparent hover:bg-transparent",
        "transition-all duration-200",
        className,
      )}
    >
      <Moon size={18} className="dark:hidden" aria-hidden />
      <Sun size={18} className="hidden dark:block" aria-hidden />
    </button>
  );
}
