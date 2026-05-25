import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { createLocalizedMetadata } from "@/lib/metadata";
import ContributeForm from "./ContributeForm";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contribute" });
  return createLocalizedMetadata({
    locale,
    pathname: "/contribute",
    title: t("title"),
    description: t("subtitle"),
  });
}

export default async function ContributePage() {
  return (
    <div
      className="flex min-h-[100svh] flex-col overflow-hidden px-6 pt-20 pb-4"
      style={{ background: "#F5EFE6", fontFamily: "Be Vietnam Pro, sans-serif" }}
    >
      <div className="mx-auto flex min-h-0 w-full max-w-lg flex-1 flex-col">
        <ContributeForm />
      </div>
    </div>
  );
}
