import Image from "next/image";
import Link from "next/link";
import type { Chain } from "@/types/cafe";

export default function ChainCard({ chain, locale }: { chain: Chain; locale: string }) {
  return (
    <Link
      href={`/${locale}/chains/${chain.slug}`}
      className="group overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-sm)] transition hover:-translate-y-1 hover:shadow-[var(--shadow-md)] focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-[linear-gradient(135deg,#3d2415,#d39a58)]">
        {chain.coverImage ? (
          <Image
            src={chain.coverImage}
            alt={chain.name}
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,#f8d9a2,transparent_35%),linear-gradient(135deg,#3d2415,#b86f35)]" />
        )}
      </div>
      <div className="p-4 pt-5">
        <h3 className="text-lg leading-tight font-black text-[var(--foreground)]">{chain.name}</h3>
        <p className="mt-2 text-xs font-bold tracking-[0.08em] text-[var(--foreground-muted)] uppercase">
          {chain.branchCount} {locale === "vi" ? "chi nhánh trên Cafe Maps" : "Cafe Maps branches"}
        </p>
      </div>
    </Link>
  );
}
