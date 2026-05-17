import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import RegisterForm from "./RegisterForm";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "auth" });
  return { title: t("register") };
}

export default function RegisterPage() {
  return <RegisterForm />;
}
