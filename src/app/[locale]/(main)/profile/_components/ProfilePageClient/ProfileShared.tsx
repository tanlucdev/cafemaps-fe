import type { LucideIcon } from "lucide-react";
import { CheckCircle2 } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { ProfileCopy } from "./constants";

export function EmptyState({
  icon: Icon,
  title,
  body,
  actionHref,
  actionLabel,
}: {
  icon: LucideIcon;
  title: string;
  body: string;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <div className="flex min-h-72 flex-col items-center justify-center rounded-3xl border border-dashed border-[#dfc9aa] bg-[#fffaf2] px-5 py-10 text-center dark:border-white/15 dark:bg-white/5">
      <div className="mb-4 flex size-14 items-center justify-center rounded-3xl bg-[var(--accent-light)] text-[var(--accent)]">
        <Icon size={24} />
      </div>
      <h2 className="text-lg font-black text-[var(--foreground)]">{title}</h2>
      <p className="mt-2 max-w-sm text-sm text-[var(--foreground-muted)]">{body}</p>
      {actionHref && actionLabel && (
        <Link
          href={actionHref}
          className="mt-5 inline-flex h-10 cursor-pointer items-center justify-center rounded-2xl bg-[var(--accent)] px-4 text-sm font-bold text-white transition hover:bg-[var(--accent-hover)] focus-visible:ring-3 focus-visible:ring-[var(--ring)]/30 focus-visible:outline-none"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}

export function StatusBadge({ status, copy }: { status: string; copy: ProfileCopy }) {
  const statusCopy =
    status === "approved" ? copy.approved : status === "rejected" ? copy.rejected : copy.pending;

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--accent-light)] px-3 py-1.5 text-xs font-black text-[#875200] dark:text-[#f0b869]">
      <CheckCircle2 size={13} />
      {statusCopy}
    </span>
  );
}
