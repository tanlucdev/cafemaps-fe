"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { Bookmark } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { isUnauthorizedError, toggleSaveCafe } from "@/lib/api";
import { getCurrentAccessToken, saveAuthReturnUrl } from "@/lib/auth-client";
import { useTranslations } from "next-intl";
import SaveToFolderModal from "./SaveToFolderModal";

interface SaveButtonProps {
  cafeId: string;
  locale: string;
  initialSaved?: boolean;
  className?: string;
  onSavedChange?: (saved: boolean) => void;
}

export default function SaveButton({
  cafeId,
  initialSaved = false,
  className,
  onSavedChange,
}: SaveButtonProps) {
  const t = useTranslations("cafe");
  const router = useRouter();
  const [saved, setSaved] = useState(initialSaved);
  const [loading, setLoading] = useState(false);
  const [pickerToken, setPickerToken] = useState<string | null>(null);

  async function handleToggle() {
    if (loading) return;

    const token = await getCurrentAccessToken();
    if (!token) {
      saveAuthReturnUrl();
      router.push("/login");
      return;
    }

    const prev = saved;
    if (!prev) {
      setPickerToken(token);
      return;
    }

    setLoading(true);
    setSaved(false);
    try {
      const result = await toggleSaveCafe(cafeId, token, prev);
      setSaved(result.saved);
      onSavedChange?.(result.saved);
    } catch (error) {
      setSaved(prev);
      if (isUnauthorizedError(error)) {
        saveAuthReturnUrl();
        router.push("/login");
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveToFolder(collectionName: string | null) {
    if (!pickerToken || loading) return;
    setLoading(true);
    try {
      const result = await toggleSaveCafe(cafeId, pickerToken, false, collectionName);
      setSaved(result.saved);
      onSavedChange?.(result.saved);
      setPickerToken(null);
      toast.success(
        result.collectionName
          ? t("savedToFolder", { folder: result.collectionName })
          : t("savedToAll")
      );
    } catch (error) {
      if (isUnauthorizedError(error)) {
        saveAuthReturnUrl();
        router.push("/login");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
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
      <SaveToFolderModal
        open={Boolean(pickerToken)}
        token={pickerToken}
        saving={loading}
        onClose={() => setPickerToken(null)}
        onSelect={handleSaveToFolder}
      />
    </>
  );
}
