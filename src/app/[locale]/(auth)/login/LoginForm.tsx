"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Lock, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useLoginMutation } from "@/api/auth/hooks";
import { setAccessToken, setAuthUser, getAuthReturnUrl } from "@/lib/auth-client";
import { LoginFormValues, loginSchema } from "@/lib/schemas/auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

interface LoginFormProps {
  locale: string;
}

export default function LoginForm({ locale }: LoginFormProps) {
  const t = useTranslations("auth");
  const router = useRouter();
  const searchParams = useSearchParams();
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const { mutate, isPending } = useLoginMutation();

  const onSubmit = handleSubmit((data) => {
    setServerError(null);
    mutate(data, {
      onSuccess: (result) => {
        setAccessToken(result.token);
        if (result.user) setAuthUser(result.user);
        toast.success(t("loginSuccess"));
        const returnUrl = searchParams.get("returnUrl") || getAuthReturnUrl("/");
        router.push(returnUrl);
      },
      onError: (error: unknown) => {
        const msg = error instanceof Error ? error.message : "Đăng nhập thất bại, thử lại.";
        setServerError(msg);
      },
    });
  });

  return (
    <form onSubmit={onSubmit} className="bg-card border-border space-y-4 rounded-2xl border p-6">
      <div className="space-y-1.5">
        <label className="block text-xs font-medium text-(--foreground-muted)">{t("email")}</label>
        <Input
          type="email"
          {...register("email")}
          autoComplete="email"
          disabled={isPending}
          placeholder="you@example.com"
        />
        {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-medium text-(--foreground-muted)">
            {t("password")}
          </label>
          <span className="text-xs text-(--foreground-muted)">{t("forgotPassword")}</span>
        </div>
        <Input
          type={showPassword ? "text" : "password"}
          {...register("password")}
          autoComplete="current-password"
          disabled={isPending}
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

      {serverError && (
        <p className="text-sm text-red-600 dark:text-red-400" role="alert">
          {serverError}
        </p>
      )}

      <Button
        type="submit"
        disabled={isPending}
        className="mt-2 h-11 w-full rounded-full text-sm font-medium"
      >
        {isPending ? t("loading") : t("login")}
      </Button>
    </form>
  );
}
