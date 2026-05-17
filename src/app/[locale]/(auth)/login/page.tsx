import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import LoginForm from "./LoginForm";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "auth" });
  return { title: t("login") };
}

export default function LoginPage() {
  return <LoginForm />;
}
