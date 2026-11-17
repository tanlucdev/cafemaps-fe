import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Store } from "lucide-react";
import { createLocalizedMetadata } from "@/lib/metadata";
import OwnerContributeForm from "./OwnerContributeForm";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contribute" });
  return createLocalizedMetadata({
    locale,
    pathname: "/contribute/owner",
    title: t("ownerPage.metadataTitle"),
    description: t("ownerPage.metadataDescription"),
  });
}

export default async function OwnerContributePage({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contribute" });

  return (
    <div className="relative min-h-[100svh] max-w-full overflow-x-hidden bg-[var(--background)] px-4 pt-[104px] pb-[calc(var(--mobile-bottom-nav-height)+20px)] text-[var(--foreground)] sm:px-6 sm:pt-[128px] lg:pt-32 lg:pb-10">
      <div className="pointer-events-none absolute inset-0 [background-image:radial-gradient(#8b5b2b_0.8px,transparent_0.8px)] [background-size:18px_18px] opacity-[0.12]" />
      <div className="relative mx-auto grid w-full max-w-full gap-5 lg:max-w-7xl lg:gap-6">
        <section className="min-w-0 max-w-full space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#ffe3b7]/60 bg-[#fffaf2]/70 px-3 py-1.5 text-[11.5px] font-bold text-[var(--accent)] shadow-[0_10px_28px_rgba(44,26,14,0.07)] backdrop-blur sm:text-[12px] dark:border-[#ffe3b7]/12 dark:bg-white/6">
            <Store className="size-3.5" aria-hidden="true" />
            {t("ownerPage.eyebrow")}
          </div>
          <h1 className="font-lora max-w-full text-[1.32rem] leading-tight font-bold text-wrap break-words text-[var(--foreground)] sm:max-w-3xl sm:text-[clamp(2.6rem,5vw,3.85rem)]">
            {t("ownerPage.title")}
          </h1>
          <p className="max-w-full break-words text-[13.5px] leading-5 text-[var(--foreground-muted)] sm:max-w-2xl sm:text-[16px] sm:leading-7">
            {t("ownerPage.body")}
          </p>
        </section>
        <OwnerContributeForm />
      </div>
    </div>
  );
}
