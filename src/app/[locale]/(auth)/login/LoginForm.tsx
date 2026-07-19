"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { AlertCircle, Eye, EyeOff, LoaderCircle, LogIn } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useLoginMutation } from "@/api/auth/hooks";
import {
  getAuthReturnUrl,
  redirectAfterAuth,
  setAccessToken,
  setAuthUser,
} from "@/lib/auth-client";
import { LoginFormValues, createLoginSchema } from "@/lib/schemas/auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import GoogleLoginButton from "./GoogleLoginButton";

const inputClassName =
  "auth-input h-12 rounded-2xl border border-[#e2cda8] bg-[#fffaf2]/82 text-[16px] font-semibold text-[var(--foreground)] placeholder:text-[var(--foreground-muted)] shadow-[inset_0_1px_0_rgba(255,255,255,0.72)] backdrop-blur-md focus:ring-0 dark:border-[#ffe3b7]/14 dark:bg-white/7 dark:text-[#fff7e8] dark:placeholder:text-[#fff0d2]/52";
const errorInputClassName = "auth-input-error";
const labelClassName =
  "mb-1.5 block text-[13px] font-black text-[var(--foreground)] dark:text-[#fff0d2]";
const errorClassName =
  "mt-1.5 flex items-center gap-1.5 text-xs font-semibold text-[#C0392B] dark:text-[#FFB4AA]";

export default function LoginForm() {
  const t = useTranslations("auth");
  const locale = useLocale();
  const searchParams = useSearchParams();
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const schema = createLoginSchema({
    invalidEmail: t("errors.invalidEmail"),
    passwordMin: t("errors.passwordMin"),
    confirmPasswordMin: t("errors.confirmPasswordMin"),
    passwordMismatch: t("errors.passwordMismatch"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(schema),
  });

  const { mutate, isPending } = useLoginMutation();

  const onSubmit = handleSubmit((data) => {
    setServerError(null);
    mutate(data, {
      onSuccess: (result) => {
        setAccessToken(result.token);
        if (result.user) setAuthUser(result.user);
        toast.success(t("loginSuccess"));
        const returnUrl = getAuthReturnUrl("/", searchParams.get("returnUrl"));
        redirectAfterAuth(returnUrl);
      },
      onError: (error: unknown) => {
        const msg = error instanceof Error ? error.message : "";
        const normalized = msg.toLowerCase();
        const isVietnameseAuthError =
          normalized.includes("đăng nhập") ||
          normalized.includes("mật khẩu") ||
          normalized.includes("không đúng") ||
          normalized.includes("không hợp lệ");
        setServerError(
          locale === "en" && isVietnameseAuthError ? t("loginError") : msg || t("loginError"),
        );
      },
    });
  });

  return (
    <form onSubmit={onSubmit} className="space-y-3.5">
      <div>
        <label className={labelClassName}>{t("emailQuestion")}</label>
        <Input
          type="email"
          {...register("email")}
          autoComplete="email"
          disabled={isPending}
          placeholder={t("emailPlaceholder")}
          className={`${inputClassName} ${errors.email ? errorInputClassName : ""}`}
        />
        {errors.email && (
          <p className={errorClassName}>
            <AlertCircle size={13} />
            {errors.email.message}
          </p>
        )}
      </div>

      <div>
        <div className="mb-1.5 flex items-baseline justify-between">
          <label className="text-[13px] font-black text-[var(--foreground)] dark:text-[#fff0d2]">
            {t("passwordQuestion")}
          </label>
          <span className="text-xs font-black text-[var(--accent-hover)] dark:text-[#f0b869]">
            {t("forgotShort")}
          </span>
        </div>
        <Input
          type={showPassword ? "text" : "password"}
          {...register("password")}
          autoComplete="current-password"
          disabled={isPending}
          placeholder={t("passwordPlaceholder")}
          className={`${inputClassName} ${errors.password ? errorInputClassName : ""}`}
          rightIcon={
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="flex min-h-10 min-w-10 items-center justify-end text-[var(--foreground-muted)] transition-colors hover:text-[var(--accent-hover)] dark:text-[#fff0d2]/62 dark:hover:text-[#fff7e8]"
              aria-label={showPassword ? t("hidePassword") : t("showPassword")}
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          }
        />
        {errors.password && (
          <p className={errorClassName}>
            <AlertCircle size={13} />
            {errors.password.message}
          </p>
        )}
      </div>

      {serverError && (
        <p
          className="rounded-2xl border border-[#e9a7a0]/40 bg-[#FCEDEA]/92 px-3 py-2 text-sm font-semibold text-[#C0392B] dark:border-[#ffb4aa]/16 dark:bg-[#3a211f] dark:text-[#FFB4AA]"
          role="alert"
        >
          {serverError}
        </p>
      )}

      <Button
        type="submit"
        disabled={isPending}
        className="mt-0 h-12 w-full rounded-full bg-[var(--accent)] text-[15px] font-black text-white shadow-[0_14px_30px_rgba(200,132,42,0.26)] transition-all hover:-translate-y-px hover:bg-[var(--accent-hover)] focus-visible:ring-[var(--accent)]/30 disabled:hover:translate-y-0"
      >
        {isPending ? (
          <span className="inline-flex items-center gap-2">
            <LoaderCircle size={16} className="animate-spin" aria-hidden="true" />
            {t("loading")}
          </span>
        ) : (
          <span className="inline-flex items-center gap-2">
            <LogIn size={16} aria-hidden="true" />
            {t("loginCta")}
          </span>
        )}
      </Button>

      <GoogleLoginButton disabled={isPending} />
    </form>
  );
}
