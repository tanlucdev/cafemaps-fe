"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
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
  onSavedChange?: (saved: boolean) => void;
}

export default function SaveButton({
  cafeId,
  locale,
  initialSaved = false,
  className,
  onSavedChange,
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
      router.push("/login");
      return;
    }

    setLoading(true);
    const prev = saved;
    setSaved((s) => !s); // optimistic
    try {
      const result = await toggleSaveCafe(cafeId, token, prev);
      setSaved(result.saved);
      onSavedChange?.(result.saved);
    } catch (error) {
      setSaved(prev); // rollback
      if (isUnauthorizedError(error)) {
        saveAuthReturnUrl();
        router.push("/login");
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
        "flex items-center justify-center rounded-full transition-all duration-200",
        saved ? "bg-accent text-white" : "bg-white/88 text-[#875200] dark:bg-[#1C1210]/85 dark:text-[#FFB865]",
        className,
      )}
    >
      <Bookmark size={16} className={saved ? "fill-white" : ""} />
    </motion.button>
  );
}
