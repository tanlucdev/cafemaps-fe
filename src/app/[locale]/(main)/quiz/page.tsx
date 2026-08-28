import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { createLocalizedMetadata } from "@/lib/metadata";
import QuizExperience from "./_components/QuizExperience";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "quiz" });
  return createLocalizedMetadata({
    locale,
    pathname: "/quiz",
    title: t("title"),
    description: t("subtitle"),
  });
}

export default async function QuizPage({ params }: PageProps) {
  const { locale } = await params;

  return <QuizExperience locale={locale} />;
}
