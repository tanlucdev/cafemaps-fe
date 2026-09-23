import Image from "next/image";
import { Coffee, Heart, MapPin } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { coverObjectPosition } from "@/lib/cover-image";
import { cloudinaryImageUrl } from "@/lib/cloudinary-image";
import type { Cafe } from "@/types/cafe";
import type { ProfileCopy } from "./constants";
import { EmptyState } from "./ProfileShared";

export function SavedCafeList({ cafes, copy }: { cafes: Cafe[]; copy: ProfileCopy }) {
  if (cafes.length === 0) {
    return (
      <EmptyState
        icon={Heart}
        title={copy.noSavedTitle}
        body={copy.noSavedBody}
        actionHref="/search"
        actionLabel={copy.exploreCafes}
      />
    );
  }

  return (
    <div className="grid gap-3">
      {cafes.map((cafe, index) => (
        <article
          key={cafe.id}
          className="grid min-w-0 gap-3 rounded-3xl border border-[var(--border)] bg-[#fffaf2] p-3 transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-warm)] sm:grid-cols-[116px_minmax(0,1fr)_auto] sm:items-center dark:bg-white/5"
        >
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-[var(--background-secondary)] sm:aspect-auto sm:h-24">
            {cafe.coverImage ? (
              <Image
                src={cloudinaryImageUrl(cafe.coverImage, "thumb")}
                alt={cafe.name}
                fill
                sizes="(max-width: 640px) 100vw, 116px"
                priority={index === 0}
                className="object-cover"
                style={{ objectPosition: coverObjectPosition(cafe) }}
              />
            ) : (
              <div className="flex h-full items-center justify-center text-[var(--accent)]">
                <Coffee size={24} />
              </div>
            )}
          </div>
          <div className="min-w-0">
            <h2 className="truncate text-base font-black text-[var(--foreground)]">{cafe.name}</h2>
            <p className="mt-1 flex min-w-0 items-center gap-1.5 text-sm font-medium text-[var(--foreground-muted)]">
              <MapPin size={14} className="shrink-0" />
              <span className="truncate">{cafe.district || cafe.address || "Ho Chi Minh City"}</span>
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {cafe.vibes.slice(0, 3).map((vibe) => (
                <span
                  key={vibe}
                  className="rounded-full bg-[var(--accent-light)] px-2.5 py-1 text-xs font-bold text-[#875200] dark:text-[#f0b869]"
                >
                  {vibe}
                </span>
              ))}
            </div>
          </div>
          <Link
            href={`/cafe/${cafe.slug}`}
            className="inline-flex h-10 w-full cursor-pointer items-center justify-center rounded-2xl border border-[var(--border)] px-4 text-sm font-bold text-[var(--foreground)] transition hover:bg-[var(--background-secondary)] focus-visible:ring-3 focus-visible:ring-[var(--ring)]/30 focus-visible:outline-none sm:w-auto"
          >
            {copy.view}
          </Link>
        </article>
      ))}
    </div>
  );
}
