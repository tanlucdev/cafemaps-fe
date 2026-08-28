import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { createLocalizedMetadata } from "@/lib/metadata";
import { normalizeQuizProfileId, normalizeQuizResultVariant } from "@/lib/quiz";
import QuizExperience from "./_components/QuizExperience";

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
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

export default async function QuizPage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  const query = await searchParams;
  const type = firstParam(query?.type);
  const dna = firstParam(query?.dna);
  const variant = normalizeQuizResultVariant(firstParam(query?.variant));

  return (
    <QuizExperience
      locale={locale}
      initialProfileId={normalizeQuizProfileId(type)}
      initialDna={dna}
      initialVariant={variant}
    />
  );
}

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}
