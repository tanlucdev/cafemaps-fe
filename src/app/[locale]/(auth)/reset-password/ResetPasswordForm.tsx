"use client";

import { useState } from "react";
import { AlertCircle, Check, Eye, EyeOff, LoaderCircle, Lock } from "lucide-react";
import { useTranslations } from "next-intl";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Link, useRouter } from "@/i18n/navigation";
import { useResetPasswordMutation } from "@/api/auth/hooks";
import { createResetPasswordSchema, type ResetPasswordFormValues } from "@/lib/schemas/auth";

const inputClassName =
  "auth-input h-12 rounded-2xl border border-[#e2cda8] bg-[#fffaf2]/82 text-[16px] font-semibold text-[var(--foreground)] placeholder:text-[var(--foreground-muted)] dark:border-[#ffe3b7]/14 dark:bg-white/7 dark:text-[#fff7e8]";
const errorClassName =
  "mt-1.5 flex items-center gap-1.5 text-xs font-semibold text-[#C0392B] dark:text-[#FFB4AA]";

export default function ResetPasswordForm({ token }: { token: string }) {
  const t = useTranslations("auth");
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(token ? null : t("errors.tokenRequired"));
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const schema = createResetPasswordSchema({
    invalidEmail: t("errors.invalidEmail"),
    passwordMin: t("errors.passwordMin"),
    passwordMax: t("errors.passwordMax"),
    confirmPasswordMin: t("errors.confirmPasswordMin"),
    passwordMismatch: t("errors.passwordMismatch"),
    tokenRequired: t("errors.tokenRequired"),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({ resolver: zodResolver(schema), defaultValues: { token } });
  const { mutate, isPending } = useResetPasswordMutation();

  const onSubmit = handleSubmit(({ token: resetToken, newPassword }) => {
    setMessage(null);
    mutate(
      { token: resetToken, newPassword },
      {
        onSuccess: (result) => {
          setSuccess(true);
          setMessage(result.message || t("resetSuccess"));
          window.setTimeout(() => router.replace("/login"), 1500);
        },
        onError: () => setMessage(t("resetError")),
      },
    );
  });

  return (
    <form onSubmit={onSubmit} className="space-y-3.5">
      <input type="hidden" {...register("token")} />
      <div>
        <label className="mb-1.5 block text-[13px] font-black text-[var(--foreground)] dark:text-[#fff0d2]">
          {t("setPasswordQuestion")}
        </label>
        <Input
          type={showPassword ? "text" : "password"}
          autoComplete="new-password"
          disabled={isPending || success}
          placeholder={t("passwordPlaceholder")}
          leftIcon={<Lock size={16} aria-hidden="true" />}
          {...register("newPassword")}
          className={`${inputClassName} ${errors.newPassword ? "auth-input-error" : ""}`}
          rightIcon={
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              aria-label={showPassword ? t("hidePassword") : t("showPassword")}
              className="flex min-h-10 min-w-10 items-center justify-end"
            >
              <>{showPassword ? <EyeOff size={15} /> : <Eye size={15} />}</>
            </button>
          }
        />
        {errors.newPassword && (
          <p className={errorClassName}>
            <AlertCircle size={13} />
            {errors.newPassword.message}
          </p>
        )}
      </div>
      <div>
        <label className="mb-1.5 block text-[13px] font-black text-[var(--foreground)] dark:text-[#fff0d2]">
          {t("confirmPasswordQuestion")}
        </label>
        <Input
          type="password"
          autoComplete="new-password"
          disabled={isPending || success}
          placeholder={t("passwordPlaceholder")}
          leftIcon={<Lock size={16} aria-hidden="true" />}
          {...register("confirmPassword")}
          className={`${inputClassName} ${errors.confirmPassword ? "auth-input-error" : ""}`}
        />
        {errors.confirmPassword && (
          <p className={errorClassName}>
            <AlertCircle size={13} />
            {errors.confirmPassword.message}
          </p>
        )}
      </div>
      {(message || errors.token) && (
        <p
          role="alert"
          className={`rounded-2xl border px-3 py-2 text-sm font-semibold ${success ? "border-[#9fceb0]/40 bg-[#E6F5EE]/92 text-[#166638] dark:bg-[#1E2B1F] dark:text-[#8DD7A7]" : "border-[#e9a7a0]/40 bg-[#FCEDEA]/92 text-[#C0392B] dark:bg-[#3a211f] dark:text-[#FFB4AA]"}`}
        >
          {message || errors.token?.message}
        </p>
      )}
      {success ? (
        <Link
          href="/login"
          className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-[var(--accent)] text-[15px] font-black text-white"
        >
          {t("switchToLogin")}
        </Link>
      ) : (
        <Button
          type="submit"
          disabled={isPending || !token}
          className="h-12 w-full rounded-full bg-[var(--accent)] text-[15px] font-black text-white hover:bg-[var(--accent-hover)]"
        >
          {isPending ? (
            <span className="inline-flex items-center gap-2">
              <LoaderCircle size={16} className="animate-spin" />
              {t("loading")}
            </span>
          ) : (
            <span className="inline-flex items-center gap-2">
              <Check size={16} />
              {t("resetCta")}
            </span>
          )}
        </Button>
      )}
    </form>
  );
}
