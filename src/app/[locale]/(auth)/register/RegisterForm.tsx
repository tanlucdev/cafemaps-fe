"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import Input from "@/components/ui/Input";
import { useRegisterMutation } from "@/api/auth/hooks";
import { Button } from "@/components/ui/Button";
import { setAccessToken, setAuthUser, getAuthReturnUrl } from "@/lib/auth-client";
import { RegisterFormValues, registerSchema } from "@/lib/schemas/auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

interface RegisterFormProps {
  locale: string;
}

export default function RegisterForm({ locale }: RegisterFormProps) {
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
            router.refresh();
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
    <form onSubmit={onSubmit} className="bg-card border-border space-y-4 rounded-2xl border p-6">
      <div className="space-y-1.5">
        <label className="block text-xs font-medium text-(--foreground-muted)">{t("email")}</label>
        <Input
          type="email"
          {...register("email")}
          autoComplete="email"
          disabled={isPending || success}
          placeholder="you@example.com"
          leftIcon={<Mail size={15} />}
        />
        {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
      </div>

      <div className="space-y-1.5">
        <label className="block text-xs font-medium text-(--foreground-muted)">
          {t("password")}
        </label>
        <Input
          type={showPassword ? "text" : "password"}
          {...register("password")}
          autoComplete="new-password"
          disabled={isPending || success}
          placeholder="••••••"
          leftIcon={<Lock size={15} />}
          rightIcon={
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="hover:text-foreground text-(--foreground-muted) transition-colors"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          }
        />
        {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
      </div>

      <div className="space-y-1.5">
        <label className="block text-xs font-medium text-(--foreground-muted)">
          {t("confirmPassword")}
        </label>
        <Input
          type={showConfirm ? "text" : "password"}
          {...register("confirmPassword")}
          autoComplete="new-password"
          disabled={isPending || success}
          placeholder="••••••"
          leftIcon={<Lock size={15} />}
          rightIcon={
            <button
              type="button"
              onClick={() => setShowConfirm((v) => !v)}
              className="hover:text-foreground text-(--foreground-muted) transition-colors"
              tabIndex={-1}
            >
              {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          }
        />
        {errors.confirmPassword && (
          <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
        )}
      </div>

      {serverMessage && (
        <p
          className={
            success
              ? "text-sm text-green-700 dark:text-green-400"
              : "text-sm text-red-600 dark:text-red-400"
          }
          role="alert"
        >
          {serverMessage}
        </p>
      )}

      <Button
        type="submit"
        disabled={isPending || success}
        className="mt-2 h-11 w-full rounded-full text-sm font-medium"
      >
        {isPending ? t("loading") : t("register")}
      </Button>
    </form>
  );
}
