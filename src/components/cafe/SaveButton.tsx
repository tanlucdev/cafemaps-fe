"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bookmark } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { isUnauthorizedError, toggleSaveCafe } from "@/lib/api";
import { getCurrentAccessToken, saveAuthReturnUrl } from "@/lib/auth-client";
import { useTranslations } from "next-intl";

interface SaveButtonProps {
  cafeId: string;
  locale: string;
  initialSaved?: boolean;
  className?: string;
}

export default function SaveButton({
  cafeId,
  locale,
  initialSaved = false,
  className,
}: SaveButtonProps) {
  const t = useTranslations("cafe");
  const router = useRouter();
  const [saved, setSaved] = useState(initialSaved);
  const [loading, setLoading] = useState(false);

  async function handleToggle() {
    if (loading) return;

    const token = await getCurrentAccessToken();
    if (!token) {
      saveAuthReturnUrl();
      router.push(`/${locale}/login`);
      return;
    }

    setLoading(true);
    const prev = saved;
    setSaved((s) => !s); // optimistic
    try {
      const result = await toggleSaveCafe(cafeId, token);
      setSaved(result.saved);
    } catch (error) {
      setSaved(prev); // rollback
      if (isUnauthorizedError(error)) {
        saveAuthReturnUrl();
        router.push(`/${locale}/login`);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.button
      whileTap={{ scale: 0.88 }}
      onClick={handleToggle}
      disabled={loading}
      aria-label={saved ? t("unsave") : t("save")}
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-full transition-all duration-200",
        saved
          ? "bg-[var(--accent)] text-white"
          : "bg-(--background-secondary) text-[var(--foreground-muted)] hover:bg-[var(--accent-light)] hover:text-[var(--accent)]",
        className,
      )}
    >
      <Bookmark size={16} className={saved ? "fill-white" : ""} />
    </motion.button>
  );
}
