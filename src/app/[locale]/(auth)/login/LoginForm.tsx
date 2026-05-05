"use client"

import { useState } from "react"
import { useRouter } from "@/i18n/navigation"
import { useTranslations } from "next-intl"
import { Mail, Lock } from "lucide-react"
import { Button } from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import { useLoginMutation } from "@/api/auth/hooks"
import { setAccessToken, setAuthUser, getAuthReturnUrl } from "@/lib/auth-client"

interface LoginFormProps {
  locale: string
}

export default function LoginForm({ locale }: LoginFormProps) {
  const t = useTranslations("auth")
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState<string | null>(null)

  const { mutate, isPending } = useLoginMutation()

  function submit() {
    setMessage(null)

    if (!email.trim() || password.length < 6) {
      setMessage(t("validationError"))
      return
    }

    mutate(
      { email: email.trim(), password },
      {
        onSuccess({ token, user }) {
          setAccessToken(token)
          if (user) setAuthUser(user)
          router.replace(getAuthReturnUrl(`/${locale}`))
          router.refresh()
        },
        onError(err) {
          setMessage(err.message || t("loginError"))
        },
      }
    )
  }

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); submit() }}
      className="bg-card border border-border rounded-2xl p-6 space-y-4"
    >
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-(--foreground-muted) block">
          {t("email")}
        </label>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
          disabled={isPending}
          placeholder="you@example.com"
          leftIcon={<Mail size={15} />}
        />
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-(--foreground-muted) block">
            {t("password")}
          </label>
          <span className="text-xs text-(--foreground-muted)">
            {t("forgotPassword")}
          </span>
        </div>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
          minLength={6}
          disabled={isPending}
          placeholder="••••••"
          leftIcon={<Lock size={15} />}
        />
      </div>

      {message && (
        <p className="text-sm text-red-600 dark:text-red-400" role="alert">
          {message}
        </p>
      )}

      <Button
        type="submit"
        disabled={isPending}
        className="w-full h-11 rounded-full text-sm font-medium mt-2"
      >
        {isPending ? t("loading") : t("login")}
      </Button>
    </form>
  )
}
