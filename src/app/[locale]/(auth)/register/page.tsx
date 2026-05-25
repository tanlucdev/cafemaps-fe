import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { createLocalizedMetadata, normalizeLocale } from "@/lib/metadata";
import RegisterForm from "./RegisterForm";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const normalizedLocale = normalizeLocale(locale);
  const t = await getTranslations({ locale, namespace: "auth" });
  return createLocalizedMetadata({
    locale,
    pathname: "/register",
    title: t("register"),
    description:
      normalizedLocale === "vi"
        ? "Tạo tài khoản Cafe Maps để lưu các quán cà phê yêu thích."
        : "Create a Cafe Maps account to save your favorite cafés.",
  });
}

export default function RegisterPage() {
  return <RegisterForm />;
}
