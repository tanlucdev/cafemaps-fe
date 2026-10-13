"use client";

import { LockKeyhole } from "lucide-react";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { cloudinaryImageUrl } from "@/lib/cloudinary-image";
import { cn } from "@/lib/utils";

interface LockedCafeCardProps {
  locale: string;
  variant?: "grid" | "list";
  index?: number;
  coverImage?: string | null;
  mobileCompact?: boolean;
}

const LOCKED_CAFE_IMAGES = [
  "/quiz/wide/woman/6-sunny-iced-coffee.webp",
  "/quiz/wide/man/1-cozy-plant-corner.webp",
  "/quiz/wide/woman/12-quiet-reading-nook.webp",
];

export default function LockedCafeCard({
  locale,
  variant = "grid",
  index = 0,
  coverImage,
  mobileCompact = false,
}: LockedCafeCardProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams.toString();
  const returnUrl = `${pathname}${query ? `?${query}` : ""}`;
  const image = coverImage ? cloudinaryImageUrl(coverImage, "card") : LOCKED_CAFE_IMAGES[index % LOCKED_CAFE_IMAGES.length];
  const copy =
    locale === "en"
      ? {
          aria: "Log in to view more matching cafes",
          body: "Log in to see more cafes that fit your taste",
          cta: "Log in to continue",
        }
      : {
          aria: "Đăng nhập để xem thêm quán hợp gu",
          body: "Đăng nhập để xem thêm quán hợp gu nha",
          cta: "Đăng nhập xem tiếp",
        };

  return (
    <Link
      href={{ pathname: "/login", query: { returnUrl } }}
      aria-label={copy.aria}
      className={cn(
        "group relative isolate flex cursor-pointer overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-sm)] transition-transform outline-none hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-[var(--accent)]",
        variant === "list" ? "min-h-[140px]" : "h-full flex-col",
      )}
    >
      <div
        aria-hidden="true"
        className={cn(
          "relative overflow-hidden bg-[#392516]",
          variant === "list"
            ? "w-32 shrink-0 sm:w-44"
            : cn(
                "w-full md:h-56",
                mobileCompact ? "aspect-[4/3] sm:aspect-[8/5] md:aspect-auto" : "h-52",
              ),
        )}
      >
        <Image
          src={image}
          alt=""
          fill
          sizes={variant === "list" ? "176px" : "(max-width: 768px) 50vw, 33vw"}
          className="scale-110 object-cover blur-[6px] saturate-125"
        />
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(55,28,11,0.18),rgba(7,4,2,0.56))]" />
        <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-[#21120a]/45 to-transparent" />
      </div>
      <div
        className={cn(
          "flex min-w-0 flex-1 flex-col justify-center",
          variant === "list" ? "gap-2 p-4 pr-12" : "gap-3 p-4",
        )}
      >
        <span className="flex size-9 items-center justify-center rounded-full bg-[var(--accent)] text-[var(--accent-foreground)] shadow-[0_8px_20px_rgba(200,132,42,0.24)]">
          <LockKeyhole size={16} aria-hidden="true" />
        </span>
        <p className="max-w-[22rem] text-sm leading-relaxed font-bold text-[var(--foreground)]">
          {copy.body}
        </p>
        <span className="text-sm font-black text-[var(--accent)] underline decoration-[var(--accent)]/35 underline-offset-4">
          {copy.cta}
        </span>
      </div>
    </Link>
  );
}
