"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { useQueryClient } from "@tanstack/react-query";
import { ApiError, cafeDetailQuotaKey, openCafeDetail } from "@/apis/cafes";
import { Button, buttonVariants } from "@/components/ui/Button";
import SmartGallery from "@/components/SmartGallery";
import { AUTH_STORAGE_KEYS } from "@/constants/auth-keys";
import { Link } from "@/i18n/navigation";
import { getAuthUser, saveAuthReturnUrl } from "@/lib/auth-client";
import type { Cafe } from "@/types/cafe";
import CafeDetailContent from "./CafeDetailContent";
import CafePaymentDialog from "./CafePaymentDialog";

export default function CafeDetailAccess({
  preview,
  locale,
  aboveReviews,
}: {
  preview: Cafe;
  locale: string;
  aboveReviews?: ReactNode;
}) {
  const t = useTranslations("cafe");
  const [detail, setDetail] = useState<Cafe | null>(null);
  const [status, setStatus] = useState<"loading" | "login" | "guest-quota" | "quota" | "cookie" | "failed">("loading");
  const [attempt, setAttempt] = useState(0);
  const slug = preview.slug;
  const queryClient = useQueryClient();

  const retry = useCallback(() => {
    setDetail(null);
    setStatus("loading");
    setAttempt((previous) => previous + 1);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const refreshQuota = () => {
      const options = { queryKey: cafeDetailQuotaKey };
      void queryClient.cancelQueries(options).then(() => queryClient.invalidateQueries(options));
    };
    void openCafeDetail(slug, locale, controller.signal)
      .then((cafe) => {
        if (controller.signal.aborted) return;
        setDetail(cafe);
        refreshQuota();
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        const code = error instanceof ApiError ? error.code : undefined;
        switch (code) {
          case "DETAIL_GUEST_QUOTA_EXHAUSTED":
            refreshQuota();
            setStatus("guest-quota");
            break;
          case "DETAIL_QUOTA_EXHAUSTED":
            refreshQuota();
            setStatus("quota");
            break;
          case "DETAIL_LOGIN_REQUIRED":
            refreshQuota();
            setStatus("login");
            break;
          case "DETAIL_COOKIE_REQUIRED":
            setStatus("cookie");
            break;
          default:
            setStatus("failed");
        }
      });

    let userId = getAuthUser()?.id;
    const refresh = () => {
      controller.abort();
      retry();
    };
    const onAuthChange = () => {
      const nextId = getAuthUser()?.id;
      if (nextId !== userId) refresh();
      userId = nextId;
    };
    const onStorage = (event: StorageEvent) => {
      if (event.key === AUTH_STORAGE_KEYS.user) onAuthChange();
      if (event.key === null || event.key === AUTH_STORAGE_KEYS.accessToken) refresh();
    };
    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) refresh();
    };
    window.addEventListener("cafe-auth-change", onAuthChange);
    window.addEventListener("storage", onStorage);
    window.addEventListener("pageshow", onPageShow);
    return () => {
      controller.abort();
      window.removeEventListener("cafe-auth-change", onAuthChange);
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("pageshow", onPageShow);
    };
  }, [slug, locale, attempt, retry, queryClient]);

  if (detail) {
    return <CafeDetailContent cafe={detail} locale={locale} aboveReviews={aboveReviews} />;
  }

  return (
    <article className="mx-auto max-w-[960px] space-y-5 px-4 pt-24 pb-24 sm:px-6 lg:px-10">
      <h1 className="text-3xl font-black">{preview.name}</h1>
      {preview.address && <p className="text-[var(--foreground-muted)]">{preview.address}</p>}
      {preview.oneLiner && <p>{preview.oneLiner}</p>}
      {preview.coverImage && (
        <SmartGallery
          images={[preview.coverImage]}
          orientations={[]}
          coverImageCrop={preview.coverImageCrop}
          cafeName={preview.name}
        />
      )}
      <div role="status">
        {status === "loading" && t("detailOpening")}
        {status === "quota" && t("detailQuota")}
        {status === "cookie" && t("detailCookie")}
        {status === "failed" && t("detailFailed")}
      </div>
      {status === "login" && (
        <Link href="/login" className={buttonVariants()} onClick={saveAuthReturnUrl}>
          {t("detailSignIn")}
        </Link>
      )}
      {(status === "quota" || status === "guest-quota") && (
        <CafePaymentDialog key={status} cafeSlug={preview.slug} cafeName={preview.name} coverImage={preview.coverImage} requiresLogin={status === "guest-quota"} onPaid={retry} />
      )}
      {(status === "cookie" || status === "failed") && (
        <Button type="button" onClick={retry}>{t("detailRetry")}</Button>
      )}
      {aboveReviews}
    </article>
  );
}
