"use client"

import { useState } from "react"
import { useRouter } from "@/i18n/navigation"
import { useTranslations } from "next-intl"
import { Mail, Lock } from "lucide-react"
import { Button } from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import { useRegisterMutation } from "@/api/auth/hooks"
import { setAccessToken, setAuthUser, getAuthReturnUrl } from "@/lib/auth-client"

interface RegisterFormProps {
  locale: string
}

export default function RegisterForm({ locale }: RegisterFormProps) {
  const t = useTranslations("auth")
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [success, setSuccess] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const { mutate, isPending } = useRegisterMutation()

  function submit() {
    setMessage(null)
    setSuccess(false)

    if (!email.trim() || password.length < 6) {
      setMessage(t("validationError"))
      return
    }

    mutate(
      { email: email.trim(), password },
      {
        onSuccess(result) {
          if (result.token) {
            setAccessToken(result.token)
            if (result.user) setAuthUser(result.user)
            router.replace(getAuthReturnUrl(`/${locale}`))
            router.refresh()
            return
          }
          setSuccess(true)
          setMessage(t("confirmEmail"))
        },
        onError(err) {
          setMessage(err.message || t("registerError"))
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
          disabled={isPending || success}
          placeholder="you@example.com"
          leftIcon={<Mail size={15} />}
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-medium text-(--foreground-muted) block">
          {t("password")}
        </label>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
          required
          minLength={6}
          disabled={isPending || success}
          placeholder="••••••"
          leftIcon={<Lock size={15} />}
        />
      </div>

      {message && (
        <p
          className={success ? "text-sm text-green-700 dark:text-green-400" : "text-sm text-red-600 dark:text-red-400"}
          role="alert"
        >
          {message}
        </p>
      )}

      <Button
        type="submit"
        disabled={isPending || success}
        className="w-full h-11 rounded-full text-sm font-medium mt-2"
      >
        {isPending ? t("loading") : t("register")}
      </Button>
    </form>
  )
}
