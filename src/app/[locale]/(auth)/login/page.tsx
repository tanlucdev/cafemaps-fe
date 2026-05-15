import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import LoginForm from "./LoginForm";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "auth" });
  return { title: t("login") };
}

export default async function LoginPage({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "auth" });

  return (
    <div className="flex min-h-screen items-center justify-center px-4 pt-16">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="font-display text-2xl font-bold text-[var(--foreground)]">{t("login")}</h1>
        </div>

        <LoginForm />

        <p className="mt-5 text-center text-sm text-[var(--foreground-muted)]">
          {t("noAccount")}{" "}
          <Link
            href={`/${locale}/register`}
            className="font-medium text-[var(--accent)] hover:underline"
          >
            {t("register")}
          </Link>
        </p>
      </div>
    </div>
  );
}
