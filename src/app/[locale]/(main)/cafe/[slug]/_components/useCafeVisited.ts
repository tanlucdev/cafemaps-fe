"use client";

import { useEffect, useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { getVisitedCafeEntries, isUnauthorizedError, markVisitedCafe, unmarkVisitedCafe } from "@/lib/api";
import { getCurrentAccessToken, saveAuthReturnUrl } from "@/lib/auth-client";

export function useCafeVisited(cafeId: string, locale: string) {
  const t = useTranslations("cafe");
  const router = useRouter();
  const [visited, setVisited] = useState(false);
  const [loadingVisited, setLoadingVisited] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadVisitedState() {
      const token = await getCurrentAccessToken();
      if (!token) return;
      const entries = await getVisitedCafeEntries(token, locale);
      if (!cancelled) setVisited(entries.some((entry) => entry.cafe.id === cafeId));
    }

    void loadVisitedState().catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [cafeId, locale]);

  async function handleVisited() {
    if (loadingVisited) return;
    const token = await getCurrentAccessToken();
    if (!token) {
      saveAuthReturnUrl();
      router.push("/login");
      return;
    }

    const nextVisited = !visited;
    setLoadingVisited(true);
    setVisited(nextVisited);
    try {
      await (nextVisited ? markVisitedCafe : unmarkVisitedCafe)(cafeId, token);
      toast.success(t(nextVisited ? "markVisitedSuccess" : "unmarkVisitedSuccess"));
    } catch (error) {
      setVisited(!nextVisited);
      if (isUnauthorizedError(error)) {
        saveAuthReturnUrl();
        router.push("/login");
      }
    } finally {
      setLoadingVisited(false);
    }
  }

  return { visited, loadingVisited, handleVisited };
}
