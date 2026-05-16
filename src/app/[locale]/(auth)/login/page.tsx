import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import AuthShell from "../AuthShell";
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
    <AuthShell
      locale={locale}
      mode="login"
      copy={{
        backHome: t("backHome"),
        brand: t("brand"),
        footerLine: t("footerLine"),
        loginGreetingTitle: t("loginGreetingTitle"),
        loginGreetingSub: t("loginGreetingSub"),
        registerGreetingTitle: t("registerGreetingTitle"),
        registerGreetingSub: t("registerGreetingSub"),
        loginTab: t("loginTab"),
        registerTab: t("registerTab"),
        noAccount: t("noAccount"),
        hasAccount: t("hasAccount"),
        switchToRegister: t("switchToRegister"),
        switchToLogin: t("switchToLogin"),
      }}
    >
      <LoginForm />
    </AuthShell>
  );
}
