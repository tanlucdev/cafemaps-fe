"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { AlertCircle, Eye, EyeOff, LoaderCircle, Lock, Mail, UserPlus } from "lucide-react";
import { toast } from "sonner";
import Input from "@/components/ui/Input";
import { useRegisterMutation } from "@/api/auth/hooks";
import { Button } from "@/components/ui/Button";
import { getAuthReturnUrl, redirectAfterAuth, setAuthUser } from "@/lib/auth-client";
import { RegisterFormValues, createRegisterSchema } from "@/lib/schemas/auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const inputClassName =
  "auth-input h-12 rounded-2xl border border-[#e2cda8] bg-[#fffaf2]/82 text-[16px] font-semibold text-[var(--foreground)] placeholder:text-[var(--foreground-muted)] shadow-[inset_0_1px_0_rgba(255,255,255,0.72)] backdrop-blur-md dark:border-[#ffe3b7]/14 dark:bg-white/7 dark:text-[#fff7e8] dark:placeholder:text-[#fff0d2]/52";
const errorInputClassName = "auth-input-error";
const labelClassName =
  "mb-1.5 block text-[13px] font-black text-[var(--foreground)] dark:text-[#fff0d2]";
const errorClassName = "mt-1.5 flex items-center gap-1.5 text-xs font-semibold text-[#C0392B] dark:text-[#FFB4AA]";

export default function RegisterForm() {
  const t = useTranslations("auth");
  const locale = useLocale();
  const [serverMessage, setServerMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const schema = createRegisterSchema({
    invalidEmail: t("errors.invalidEmail"),
    passwordMin: t("errors.passwordMin"),
    confirmPasswordMin: t("errors.confirmPasswordMin"),
    passwordMismatch: t("errors.passwordMismatch"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(schema),
  });

  const { mutate, isPending } = useRegisterMutation();

  const onSubmit = handleSubmit((data) => {
    setServerMessage(null);
    setSuccess(false);

    mutate(
      { email: data.email, password: data.password },
      {
        onSuccess(result) {
          if (result.token) {
            if (result.user) setAuthUser(result.user);
            toast.success(t("loginSuccess"));
            redirectAfterAuth(getAuthReturnUrl("/"));
            return;
          }
          setSuccess(true);
          setServerMessage(t("confirmEmail"));
        },
        onError(err) {
          const msg = err.message || "";
          const normalized = msg.toLowerCase();
          const isVietnameseRegisterError =
            normalized.includes("đăng ký") ||
            normalized.includes("tài khoản") ||
            normalized.includes("email") ||
            normalized.includes("mật khẩu") ||
            normalized.includes("tồn tại") ||
            normalized.includes("không hợp lệ");
          setServerMessage(
            locale === "en" && isVietnameseRegisterError ? t("registerError") : msg || t("registerError"),
          );
        },
      },
    );
  });

  return (
    <form onSubmit={onSubmit} className="space-y-3.5">
      <div>
        <label className={labelClassName}>{t("emailQuestion")}</label>
        <Input
          type="email"
          {...register("email")}
          autoComplete="email"
          disabled={isPending || success}
          placeholder={t("emailPlaceholder")}
          leftIcon={<Mail size={16} aria-hidden="true" />}
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
        <label className={labelClassName}>{t("setPasswordQuestion")}</label>
        <Input
          type={showPassword ? "text" : "password"}
          {...register("password")}
          autoComplete="new-password"
          disabled={isPending || success}
          placeholder={t("passwordPlaceholder")}
          leftIcon={<Lock size={16} aria-hidden="true" />}
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

      <div>
        <label className={labelClassName}>{t("confirmPasswordQuestion")}</label>
        <Input
          type={showConfirm ? "text" : "password"}
          {...register("confirmPassword")}
          autoComplete="new-password"
          disabled={isPending || success}
          placeholder={t("passwordPlaceholder")}
          leftIcon={<Lock size={16} aria-hidden="true" />}
          className={`${inputClassName} ${errors.confirmPassword ? errorInputClassName : ""}`}
          rightIcon={
            <button
              type="button"
              onClick={() => setShowConfirm((v) => !v)}
              className="flex min-h-10 min-w-10 items-center justify-end text-[var(--foreground-muted)] transition-colors hover:text-[var(--accent-hover)] dark:text-[#fff0d2]/62 dark:hover:text-[#fff7e8]"
              aria-label={showConfirm ? t("hidePassword") : t("showPassword")}
              tabIndex={-1}
            >
              {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          }
        />
        {errors.confirmPassword && (
          <p className={errorClassName}>
            <AlertCircle size={13} />
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      {serverMessage && (
        <p
          className={
            success
              ? "rounded-2xl border border-[#9fceb0]/40 bg-[#E6F5EE]/92 px-3 py-2 text-sm font-semibold text-[#166638] dark:border-[#8dd7a7]/18 dark:bg-[#1E2B1F] dark:text-[#8DD7A7]"
              : "rounded-2xl border border-[#e9a7a0]/40 bg-[#FCEDEA]/92 px-3 py-2 text-sm font-semibold text-[#C0392B] dark:border-[#ffb4aa]/16 dark:bg-[#3a211f] dark:text-[#FFB4AA]"
          }
          role="alert"
        >
          {serverMessage}
        </p>
      )}

      <Button
        type="submit"
        disabled={isPending || success}
        className="mt-0 h-12 w-full rounded-full bg-[var(--accent)] text-[15px] font-black text-white shadow-[0_14px_30px_rgba(200,132,42,0.26)] transition-all hover:-translate-y-px hover:bg-[var(--accent-hover)] focus-visible:ring-[var(--accent)]/30 disabled:hover:translate-y-0"
      >
        {isPending ? (
          <span className="inline-flex items-center gap-2">
            <LoaderCircle size={16} className="animate-spin" aria-hidden="true" />
            {t("loading")}
          </span>
        ) : (
          <span className="inline-flex items-center gap-2">
            <UserPlus size={16} aria-hidden="true" />
            {t("registerCta")}
          </span>
        )}
      </Button>
    </form>
  );
}
