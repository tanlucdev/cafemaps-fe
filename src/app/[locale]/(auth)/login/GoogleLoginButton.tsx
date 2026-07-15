"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { LoaderCircle } from "lucide-react";
import { useGoogleOAuthStartMutation } from "@/api/auth/hooks";
import { Button } from "@/components/ui/Button";

export default function GoogleLoginButton({ disabled }: { disabled?: boolean }) {
  const t = useTranslations("auth");
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
    <div className="space-y-2">
      <Button
        type="button"
        disabled={disabled || isPending}
        onClick={handleClick}
        className="h-12 w-full rounded-full border border-[#e2cda8] bg-white text-[15px] font-black text-[#332018] shadow-sm transition-all hover:-translate-y-px hover:bg-[#fff8ec] dark:border-[#ffe3b7]/14 dark:bg-white/8 dark:text-[#fff7e8]"
      >
        {isPending ? (
          <span className="inline-flex items-center gap-2">
            <LoaderCircle size={16} className="animate-spin" aria-hidden="true" />
            {t("googleLoginLoading")}
          </span>
        ) : (
          t("loginWithGoogle")
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
