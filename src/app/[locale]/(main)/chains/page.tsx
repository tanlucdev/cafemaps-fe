import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { getChains } from "@/apis/chains";
import ChainCard from "@/components/chains/ChainCard";
import { createLocalizedMetadata } from "@/lib/metadata";

export const revalidate = 300;
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "chains" });
  return createLocalizedMetadata({
    locale,
    pathname: "/chains",
    title: t("title"),
    description: t("description"),
  });
}

export default async function ChainsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { locale } = await params;
  const page = Math.max(1, Number((await searchParams).page) || 1);
  const t = await getTranslations({ locale, namespace: "chains" });
  const result = await getChains(locale, page, 12);
  return (
    <main className="mx-auto min-h-screen w-full max-w-7xl px-4 pt-24 pb-20 sm:px-6 lg:px-10">
      <Link href={`/${locale}`} className="text-sm font-bold text-[var(--accent)]">
        ← {t("back")}
      </Link>
      <div className="mt-8 mb-8">
        <p className="mb-2 text-xs font-black tracking-[0.18em] text-[var(--accent)] uppercase">
          Cafe Maps
        </p>
        <h1 className="text-4xl font-black text-[var(--foreground)]">{t("title")}</h1>
        <p className="mt-2 max-w-2xl text-[var(--foreground-muted)]">{t("description")}</p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {result.data.map((chain) => (
          <ChainCard key={chain.id} chain={chain} locale={locale} />
        ))}
      </div>
      {result.data.length === 0 && (
        <p className="py-20 text-center text-[var(--foreground-muted)]">{t("empty")}</p>
      )}
      <div className="mt-10 flex justify-center gap-3">
        {page > 1 && (
          <Link
            className="rounded-full border px-4 py-2 font-bold"
            href={`/${locale}/chains?page=${page - 1}`}
          >
            {t("previous")}
          </Link>
        )}
        {result.data.length === result.limit && (
          <Link
            className="rounded-full bg-[var(--accent)] px-4 py-2 font-bold text-white"
            href={`/${locale}/chains?page=${page + 1}`}
          >
            {t("next")}
          </Link>
        )}
      </div>
    </main>
  );
}
