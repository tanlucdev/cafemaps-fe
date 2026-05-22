"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { AlertCircle, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import Input from "@/components/ui/Input";
import { useRegisterMutation } from "@/api/auth/hooks";
import { Button } from "@/components/ui/Button";
import { setAccessToken, setAuthUser, getAuthReturnUrl } from "@/lib/auth-client";
import { RegisterFormValues, registerSchema } from "@/lib/schemas/auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const inputClassName =
  "auth-input h-11 rounded-xl border-[1.5px] border-[#E0D3C0] bg-[#FAF6F1] px-3.5 text-[15px] text-[#1C1209] placeholder:text-[#9B8B73] dark:border-[#4a4035] dark:bg-[#302b25] dark:text-[#F0EBE3]";
const errorInputClassName = "auth-input-error";
const labelClassName =
  "font-lora mb-1.5 block text-[15px] italic text-[#5C4A2F] dark:text-[#D7CABC]";
const errorClassName = "mt-1.5 flex items-center gap-1.5 text-xs text-[#C0392B]";

export default function RegisterForm() {
  const t = useTranslations("auth");
  const router = useRouter();
  const [serverMessage, setServerMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
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
            setAccessToken(result.token);
            if (result.user) setAuthUser(result.user);
            toast.success(t("loginSuccess"));
            router.replace(getAuthReturnUrl(`/`));
            return;
          }
          setSuccess(true);
          setServerMessage(t("confirmEmail"));
        },
        onError(err) {
          setServerMessage(err.message || t("registerError"));
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
        <label className={labelClassName}>{t("setPasswordQuestion")}</label>
        <Input
          type={showPassword ? "text" : "password"}
          {...register("password")}
          autoComplete="new-password"
          disabled={isPending || success}
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

      <div>
        <label className={labelClassName}>{t("confirmPasswordQuestion")}</label>
        <Input
          type={showConfirm ? "text" : "password"}
          {...register("confirmPassword")}
          autoComplete="new-password"
          disabled={isPending || success}
          placeholder={t("passwordPlaceholder")}
          className={`${inputClassName} ${errors.confirmPassword ? errorInputClassName : ""}`}
          rightIcon={
            <button
              type="button"
              onClick={() => setShowConfirm((v) => !v)}
              className="flex min-h-10 min-w-10 items-center justify-end text-[#9B8B73] transition-colors hover:text-[#5C4A2F] dark:text-[#B8AFA6] dark:hover:text-[#F0EBE3]"
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
              ? "rounded-xl bg-[#E6F5EE] px-3 py-2 text-sm text-[#166638] dark:bg-[#1E2B1F] dark:text-[#8DD7A7]"
              : "rounded-xl bg-[#FCEDEA] px-3 py-2 text-sm text-[#C0392B] dark:bg-[#3a211f] dark:text-[#FFB4AA]"
          }
          role="alert"
        >
          {serverMessage}
        </p>
      )}

      <Button
        type="submit"
        disabled={isPending || success}
        className="mt-0 h-12 w-full rounded-xl bg-[#C9870C] text-[15px] font-extrabold text-white shadow-[0_4px_18px_rgba(201,135,12,0.3)] hover:bg-[#A96E08]"
      >
        {isPending ? (
          <span className="inline-flex items-center gap-2">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
            {t("loading")}
          </span>
        ) : (
          t("registerCta")
        )}
      </Button>
    </form>
  );
}
