"use client";

import { useState } from "react";
import { AlertCircle, LoaderCircle, Mail, Send } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useForgotPasswordMutation } from "@/api/auth/hooks";
import { createForgotPasswordSchema, type ForgotPasswordFormValues } from "@/lib/schemas/auth";

const inputClassName =
  "auth-input h-12 rounded-2xl border border-[#e2cda8] bg-[#fffaf2]/82 text-[16px] font-semibold text-[var(--foreground)] placeholder:text-[var(--foreground-muted)] dark:border-[#ffe3b7]/14 dark:bg-white/7 dark:text-[#fff7e8]";
const errorClassName =
  "mt-1.5 flex items-center gap-1.5 text-xs font-semibold text-[#C0392B] dark:text-[#FFB4AA]";

export default function ForgotPasswordForm() {
  const t = useTranslations("auth");
  const locale = useLocale() as "vi" | "en";
  const [message, setMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const schema = createForgotPasswordSchema({
    invalidEmail: t("errors.invalidEmail"),
    passwordMin: t("errors.passwordMin"),
    confirmPasswordMin: t("errors.confirmPasswordMin"),
    passwordMismatch: t("errors.passwordMismatch"),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({ resolver: zodResolver(schema) });
  const { mutate, isPending } = useForgotPasswordMutation();

  const onSubmit = handleSubmit(({ email }) => {
    setMessage(null);
    mutate(
      { email, locale },
      {
        onSuccess: (result) => {
          setSuccess(true);
          setMessage(result.message || t("forgotSuccess"));
        },
        onError: () => setMessage(t("forgotError")),
      },
    );
  });

  return (
    <form onSubmit={onSubmit} className="space-y-3.5">
      <div>
        <label className="mb-1.5 block text-[13px] font-black text-[var(--foreground)] dark:text-[#fff0d2]">
          {t("emailQuestion")}
        </label>
        <Input
          type="email"
          autoComplete="email"
          disabled={isPending || success}
          placeholder={t("emailPlaceholder")}
          leftIcon={<Mail size={16} aria-hidden="true" />}
          {...register("email")}
          className={`${inputClassName} ${errors.email ? "auth-input-error" : ""}`}
        />
        {errors.email && (
          <p className={errorClassName}>
            <AlertCircle size={13} />
            {errors.email.message}
          </p>
        )}
      </div>
      {message && (
        <p
          role="alert"
          className={`rounded-2xl border px-3 py-2 text-sm font-semibold ${success ? "border-[#9fceb0]/40 bg-[#E6F5EE]/92 text-[#166638] dark:bg-[#1E2B1F] dark:text-[#8DD7A7]" : "border-[#e9a7a0]/40 bg-[#FCEDEA]/92 text-[#C0392B] dark:bg-[#3a211f] dark:text-[#FFB4AA]"}`}
        >
          {message}
        </p>
      )}
      <Button
        type="submit"
        disabled={isPending || success}
        className="h-12 w-full rounded-full bg-[var(--accent)] text-[15px] font-black text-white hover:bg-[var(--accent-hover)]"
      >
        {isPending ? (
          <span className="inline-flex items-center gap-2">
            <LoaderCircle size={16} className="animate-spin" />
            {t("loading")}
          </span>
        ) : (
          <span className="inline-flex items-center gap-2">
            <Send size={16} />
            {t("forgotCta")}
          </span>
        )}
      </Button>
    </form>
  );
}
