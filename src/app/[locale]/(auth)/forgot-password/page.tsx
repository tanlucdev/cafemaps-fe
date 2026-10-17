import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { createLocalizedMetadata } from "@/lib/metadata";
import ForgotPasswordForm from "./ForgotPasswordForm";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "auth" });
  return createLocalizedMetadata({
    locale,
    pathname: "/forgot-password",
    title: t("forgotPassword"),
    description: t("forgotHeroBody"),
  });
}

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
