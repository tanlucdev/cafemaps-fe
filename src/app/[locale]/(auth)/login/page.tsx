import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { createLocalizedMetadata, normalizeLocale } from "@/lib/metadata";
import LoginForm from "./LoginForm";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const normalizedLocale = normalizeLocale(locale);
  const t = await getTranslations({ locale, namespace: "auth" });
  return createLocalizedMetadata({
    locale,
    pathname: "/login",
    title: t("login"),
    description:
      normalizedLocale === "vi"
        ? "Đăng nhập Cafe Maps để lưu và quản lý những quán cà phê yêu thích."
        : "Sign in to Cafe Maps to save and manage your favorite cafés.",
  });
}

export default function LoginPage() {
  return <LoginForm />;
}
