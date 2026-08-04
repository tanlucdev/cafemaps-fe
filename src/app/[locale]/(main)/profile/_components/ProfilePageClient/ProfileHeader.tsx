import { Coffee, Edit3, UserRound } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { ProfileCopy } from "./constants";
import type { ProfileStat } from "./types";

export function ProfileHeader({
  copy,
  displayName,
  email,
  initials,
  isLoggedIn,
  hasPreviewProfileData,
}: {
  copy: ProfileCopy;
  displayName: string;
  email: string;
  initials: string;
  isLoggedIn: boolean;
  hasPreviewProfileData: boolean;
}) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-[#fffaf2] p-4 shadow-[var(--shadow-sm)] sm:rounded-[32px] sm:p-7 dark:bg-[var(--card)]">
      <div
        className="absolute top-5 right-5 hidden h-24 w-24 rounded-full border border-dashed border-[#d9b47d] opacity-50 sm:block"
        aria-hidden="true"
      />
      <div
        className="absolute right-20 bottom-6 hidden h-10 w-20 rotate-[-12deg] rounded-full border border-[#e6c89f] opacity-45 lg:block"
        aria-hidden="true"
      />

      <div className="relative flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex size-18 shrink-0 items-center justify-center rounded-[24px] bg-[var(--accent)] text-xl font-black text-white shadow-[0_14px_30px_rgba(200,132,42,0.22)] sm:size-20 sm:rounded-[26px] sm:text-2xl">
            {initials}
          </div>
          <div className="min-w-0">
            <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-[#ead8bd] bg-white/70 px-3 py-1 text-xs font-bold text-[#875200] dark:border-white/10 dark:bg-white/5 dark:text-[#f0b869]">
              <Coffee size={13} />
              {copy.eyebrow}
            </div>
            <h1 className="font-display text-2xl leading-tight font-black break-words text-[var(--foreground)] sm:text-4xl">
              {displayName}
            </h1>
            <p className="mt-1 truncate text-sm font-medium text-[var(--foreground-muted)]">
              {email}
            </p>
            <p className="mt-2 max-w-xl text-sm text-[var(--foreground-muted)]">{copy.subtitle}</p>
            {hasPreviewProfileData && (
              <p className="mt-2 text-xs font-semibold text-[#9a6a26]">{copy.mockLabel}</p>
            )}
          </div>
        </div>

        {isLoggedIn ? (
          <button
            type="button"
            className="inline-flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-5 text-sm font-bold text-white shadow-[0_10px_24px_rgba(200,132,42,0.22)] transition hover:bg-[var(--accent-hover)] focus-visible:ring-3 focus-visible:ring-[var(--ring)]/30 focus-visible:outline-none sm:w-auto"
          >
            <Edit3 size={16} />
            {copy.editProfile}
          </button>
        ) : (
          <Link
            href="/login"
            className="inline-flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-5 text-sm font-bold text-white shadow-[0_10px_24px_rgba(200,132,42,0.22)] transition hover:bg-[var(--accent-hover)] focus-visible:ring-3 focus-visible:ring-[var(--ring)]/30 focus-visible:outline-none sm:w-auto"
          >
            <UserRound size={16} />
            {copy.signIn}
          </Link>
        )}
      </div>
    </section>
  );
}

export function ProfileStats({ stats }: { stats: ProfileStat[] }) {
  return (
    <section className="mt-4 grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4">
      {stats.map(({ label, value, icon: Icon }) => (
        <div
          key={label}
          className="min-w-0 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-3 shadow-[var(--shadow-sm)] sm:p-4"
        >
          <div className="mb-3 flex size-10 items-center justify-center rounded-2xl bg-[var(--accent-light)] text-[var(--accent)]">
            <Icon size={18} />
          </div>
          <p className="text-2xl leading-none font-black text-[var(--foreground)]">{value}</p>
          <p className="mt-1 text-xs leading-snug font-bold text-[var(--foreground-muted)]">
            {label}
          </p>
        </div>
      ))}
    </section>
  );
}
