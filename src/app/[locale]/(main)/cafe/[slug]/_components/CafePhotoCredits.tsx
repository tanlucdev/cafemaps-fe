"use client";

import { ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";
import InstagramIcon from "./CafeDetailInfo/components/InstagramIcon";
import type { Cafe } from "@/types/cafe";

export default function CafePhotoCredits({ cafe }: { cafe: Cafe }) {
  const t = useTranslations("cafe.detail");
  const sources = cafe.imageSourceUsernames ?? cafe.image_source_usernames;
  const usernames = Array.isArray(sources)
    ? [
        ...new Set(
          sources.flatMap((value) => {
            if (typeof value !== "string") return [];
            const username = value.trim().replace(/^@/, "").toLowerCase();
            return /^[a-z0-9_](?:[a-z0-9._]{0,28}[a-z0-9_])?$/.test(username) &&
              !username.includes("..")
              ? [username]
              : [];
          }),
        ),
      ]
    : [];
  // ponytail: cafe-level sources; add per-image credits when image provenance is stored.
  if (usernames.length === 0 || cafe.images.length === 0) return null;

  return (
    <div className="ml-auto flex max-w-full flex-wrap items-center justify-end gap-x-1.5 gap-y-0 text-[var(--foreground-muted)]">
      <span className="text-xs font-medium">
        {t("photoCredit")}
      </span>
      {usernames.map((username) => (
        <a
          key={username}
          href={`https://www.instagram.com/${username}/`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t("photoCreditLink", { username: `@${username}` })}
          className="inline-flex min-h-11 max-w-full items-center gap-1.5 rounded-lg px-1.5 text-xs font-semibold text-[var(--accent-hover)] transition-colors hover:bg-[var(--accent-light)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
        >
          <span className="shrink-0 opacity-70" aria-hidden="true">
            <InstagramIcon />
          </span>
          <span className="min-w-0 break-all">@{username}</span>
          <ArrowUpRight size={13} className="shrink-0 opacity-60" aria-hidden="true" />
        </a>
      ))}
    </div>
  );
}
