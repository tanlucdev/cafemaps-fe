"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { AlertCircle, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useLoginMutation } from "@/api/auth/hooks";
import { getAuthReturnUrl, redirectAfterAuth, setAccessToken, setAuthUser } from "@/lib/auth-client";
import { LoginFormValues, createLoginSchema } from "@/lib/schemas/auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const inputClassName =
  "auth-input h-11 rounded-xl border-[1.5px] border-[#E0D3C0] bg-[#FAF6F1] px-3.5 text-[15px] text-[#1C1209] placeholder:text-[#9B8B73] dark:border-[#4a4035] dark:bg-[#302b25] dark:text-[#F0EBE3]";
const errorInputClassName = "auth-input-error";
const labelClassName =
  "font-lora mb-1.5 block text-[15px] italic text-[#5C4A2F] dark:text-[#D7CABC]";
const errorClassName = "mt-1.5 flex items-center gap-1.5 text-xs text-[#C0392B]";

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
          placeholder="hello@email.com"
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
          <label className="font-lora text-[15px] text-[#5C4A2F] italic dark:text-[#D7CABC]">
            {t("passwordQuestion")}
          </label>
          <span className="text-xs font-semibold text-[#C9870C]">{t("forgotShort")}</span>
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
              className="flex min-h-10 min-w-10 items-center justify-end text-[#9B8B73] transition-colors hover:text-[#5C4A2F] dark:text-[#B8AFA6] dark:hover:text-[#F0EBE3]"
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
          className="rounded-xl bg-[#FCEDEA] px-3 py-2 text-sm text-[#C0392B] dark:bg-[#3a211f] dark:text-[#FFB4AA]"
          role="alert"
        >
          {serverError}
        </p>
      )}

      <Button
        type="submit"
        disabled={isPending}
        className="mt-0 h-12 w-full rounded-xl bg-[#C9870C] text-[15px] font-extrabold text-white shadow-[0_4px_18px_rgba(201,135,12,0.3)] hover:bg-[#A96E08]"
      >
        {isPending ? (
          <span className="inline-flex items-center gap-2">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
            {t("loading")}
          </span>
        ) : (
          t("loginCta")
        )}
      </Button>
    </form>
  );
}
