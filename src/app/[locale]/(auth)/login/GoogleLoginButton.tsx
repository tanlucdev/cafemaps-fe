"use client";

import { useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { LoaderCircle } from "lucide-react";
import { useGoogleOAuthStartMutation } from "@/api/auth/hooks";
import { Button } from "@/components/ui/Button";

export default function GoogleLoginButton({ disabled }: { disabled?: boolean }) {
  const t = useTranslations("auth");
  const locale = useLocale();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const { mutate, isPending } = useGoogleOAuthStartMutation();

  function handleClick() {
    const returnUrl = searchParams.get("returnUrl") || "/";
    setError(null);
    mutate(returnUrl, {
      onSuccess: ({ authorizationUrl }) => window.location.assign(authorizationUrl),
      onError: () => setError(t("googleLoginError")),
    });
  }

  return (
    <div className="space-y-2 text-center">
      <p className="text-xs font-black text-[var(--foreground-muted)] dark:text-[#fff0d2]/70">
        {locale === "vi" ? "Đăng nhập bằng" : "Log in with"}
      </p>
      <Button
        type="button"
        disabled={disabled || isPending}
        onClick={handleClick}
        aria-label={t("loginWithGoogle")}
        className="mx-auto size-12 rounded-full border border-[#e2cda8] bg-white p-0 text-[#332018] shadow-sm transition-all hover:-translate-y-px hover:bg-[#fff8ec] focus-visible:ring-[var(--accent)]/25 dark:border-[#ffe3b7]/14 dark:bg-white/8"
      >
        {isPending ? (
          <LoaderCircle size={18} className="animate-spin" aria-hidden="true" />
        ) : (
          <Image src="/image/google-logo.png" alt="" width={20} height={20} aria-hidden="true" />
        )}
      </Button>
      {error && (
        <p className="text-center text-xs font-semibold text-[#C0392B] dark:text-[#FFB4AA]">
          {error}
        </p>
      )}
    </div>
  );
}
