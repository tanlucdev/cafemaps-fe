import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import {
  ClipboardList,
  Coffee,
  Compass,
  Leaf,
  MapPin,
  PlusCircle,
  Sparkles,
  UserRound,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { vibeTags, type ProfileCopy } from "./constants";

export function ProfileInfoCard({
  copy,
  email,
  isLoggedIn,
}: {
  copy: ProfileCopy;
  email: string;
  isLoggedIn: boolean;
}) {
  const rows = [
    { icon: UserRound, label: copy.account, value: isLoggedIn ? email : "Guest preview" },
    { icon: MapPin, label: copy.location, value: "Ho Chi Minh City" },
    { icon: Coffee, label: copy.memberSince, value: "2026" },
  ];

  return (
    <Panel title={copy.profileInfo} icon={ClipboardList}>
      <div className="space-y-3">
        {rows.map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex items-start gap-3">
            <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-xl bg-[var(--background-secondary)] text-[#875200] dark:text-[#f0b869]">
              <Icon size={15} />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-[var(--foreground-muted)]">{label}</p>
              <p className="truncate text-sm font-semibold text-[var(--foreground)]">{value}</p>
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}

export function PreferencesCard({ copy }: { copy: ProfileCopy }) {
  return (
    <Panel title={copy.preferences} icon={Leaf}>
      <div className="flex flex-wrap gap-2">
        {vibeTags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-[#e6d2b4] bg-[#fff8ee] px-3 py-1.5 text-xs font-bold text-[#6c4a22] dark:border-white/10 dark:bg-white/5 dark:text-[#ead8bd]"
          >
            {tag}
          </span>
        ))}
      </div>
    </Panel>
  );
}

export function QuickActions({ copy }: { copy: ProfileCopy }) {
  const actions = [
    { href: "/search", label: copy.exploreCafes, icon: Compass, primary: true },
    { href: "/quiz", label: copy.takeQuiz, icon: Sparkles },
    { href: "/contribute", label: copy.submitCafe, icon: PlusCircle },
  ];

  return (
    <Panel title={copy.quickActions} icon={Coffee}>
      <div className="grid gap-2">
        {actions.map(({ href, label, icon: Icon, primary }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-2xl px-4 text-sm font-bold transition focus-visible:ring-3 focus-visible:ring-[var(--ring)]/30 focus-visible:outline-none",
              primary
                ? "bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)]"
                : "border border-[var(--border)] bg-transparent text-[var(--foreground)] hover:bg-[var(--background-secondary)]",
            )}
          >
            <Icon size={16} />
            {label}
          </Link>
        ))}
      </div>
    </Panel>
  );
}

function Panel({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: LucideIcon;
  children: ReactNode;
}) {
  return (
    <section className="rounded-[26px] border border-[var(--border)] bg-[var(--card)] p-4 shadow-[var(--shadow-sm)]">
      <div className="mb-4 flex items-center gap-2">
        <div className="flex size-9 items-center justify-center rounded-2xl bg-[var(--accent-light)] text-[var(--accent)]">
          <Icon size={17} />
        </div>
        <h2 className="font-black text-[var(--foreground)]">{title}</h2>
      </div>
      {children}
    </section>
  );
}
