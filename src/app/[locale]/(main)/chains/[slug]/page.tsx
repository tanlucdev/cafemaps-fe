import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getChainBySlug } from "@/apis/chains";
import { getCafesWithMeta } from "@/apis/cafes";
import CafeGrid from "@/components/cafe/CafeGrid";
import { createLocalizedMetadata } from "@/lib/metadata";

export const revalidate = 300;
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  try {
    const chain = await getChainBySlug(slug, locale);
    return createLocalizedMetadata({
      locale,
      pathname: `/chains/${slug}`,
      title: chain.name,
      description: chain.description ?? chain.descriptionEn ?? undefined,
      image: chain.coverImage ?? undefined,
    });
  } catch {
    return { robots: { index: false } };
  }
}

export default async function ChainDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; slug: string }>;
  searchParams: Promise<{ page?: string; districts?: string }>;
}) {
  const { locale, slug } = await params;
  const query = await searchParams;
  const page = Math.max(1, Number(query.page) || 1);
  let chain;
  try {
    chain = await getChainBySlug(slug, locale);
  } catch {
    notFound();
  }
  const data = await getCafesWithMeta(
    {
      chainId: chain.id,
      page,
      limit: 12,
      districts: query.districts ? query.districts.split(",").filter(Boolean) : undefined,
    },
    locale,
    { fallback: false },
  );
  const t = await getTranslations({ locale, namespace: "chains" });
  return (
    <main className="mx-auto min-h-screen w-full max-w-7xl px-4 pt-24 pb-20 sm:px-6 lg:px-10">
      <Link href={`/${locale}/chains`} className="text-sm font-bold text-[var(--accent)]">
        ← {t("allChains")}
      </Link>
      <header className="mt-8 mb-8 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <p className="text-xs font-black tracking-[0.18em] text-[var(--accent)] uppercase">
          {t("branchCount", { count: chain.branchCount })}
        </p>
        <h1 className="mt-2 text-4xl font-black">{chain.name}</h1>
        {(chain.description ?? chain.descriptionEn) && (
          <p className="mt-3 max-w-2xl text-[var(--foreground-muted)]">
            {chain.description ?? chain.descriptionEn}
          </p>
        )}
        <div className="mt-4 flex flex-wrap gap-2">
          {chain.districts.map((district) => (
            <Link
              key={district}
              href={`/${locale}/chains/${slug}?districts=${encodeURIComponent(district)}`}
              className="rounded-full border border-[var(--border)] px-3 py-1 text-sm font-bold"
            >
              {district}
            </Link>
          ))}
        </div>
      </header>
      <CafeGrid cafes={data.cafes} locale={locale} desktopColumns="three" mobileCompact />
      <div className="mt-8 flex justify-center gap-3">
        {page > 1 && (
          <Link
            className="rounded-full border px-4 py-2 font-bold"
            href={`/${locale}/chains/${slug}?page=${page - 1}`}
          >
            {t("previous")}
          </Link>
        )}
        {page < data.meta.totalPages && (
          <Link
            className="rounded-full bg-[var(--accent)] px-4 py-2 font-bold text-white"
            href={`/${locale}/chains/${slug}?page=${page + 1}`}
          >
            {t("next")}
          </Link>
        )}
      </div>
    </main>
  );
}
