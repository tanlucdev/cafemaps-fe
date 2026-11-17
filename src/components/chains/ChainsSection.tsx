import Link from "next/link";
import { getChains } from "@/apis/chains";
import ChainCard from "./ChainCard";

export default async function ChainsSection({ locale }: { locale: string }) {
  let chains;
  try {
    chains = (await getChains(locale, 1, 6)).data;
  } catch {
    return null;
  }
  if (!chains.length) return null;
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-10">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="mb-2 text-xs font-black tracking-[0.18em] text-[var(--accent)] uppercase">
            Cafe Maps
          </p>
          <h2 className="text-2xl font-black text-[var(--foreground)]">
            {locale === "vi" ? "Khám phá chuỗi cà phê" : "Explore coffee chains"}
          </h2>
        </div>
        <Link
          href={`/${locale}/chains`}
          className="text-sm font-black text-[var(--accent)] hover:underline"
        >
          {locale === "vi" ? "Xem tất cả" : "View all"}
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {chains.map((chain) => (
          <ChainCard key={chain.id} chain={chain} locale={locale} />
        ))}
      </div>
    </section>
  );
}
