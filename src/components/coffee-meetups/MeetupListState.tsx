import { ArrowRight, RotateCcw } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import CoffeeSticker from "./CoffeeSticker";

export default function MeetupListState({
  loading,
  filtered,
  onReset,
}: {
  loading: boolean;
  filtered: boolean;
  onReset: () => void;
}) {
  const t = useTranslations("coffeeMeetups");
  if (loading)
    return (
      <div
        role="status"
        aria-label={t("loading")}
        className="grid gap-5 md:grid-cols-2 xl:grid-cols-3"
      >
        {Array.from({ length: 3 }, (_, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--card)] motion-safe:animate-pulse"
          >
            <div className="h-48 bg-[var(--background-secondary)]" />
            <div className="space-y-4 p-5">
              <div className="h-4 w-1/3 rounded bg-[var(--border)]" />
              <div className="h-6 w-4/5 rounded bg-[var(--border)]" />
              <div className="h-4 w-3/5 rounded bg-[var(--border)]" />
              <div className="mt-6 h-10 rounded-xl bg-[var(--background-secondary)]" />
            </div>
          </div>
        ))}
      </div>
    );
  return (
    <div className="relative overflow-hidden rounded-[28px] border border-[var(--border)]/65 bg-[var(--card)] px-6 py-14 text-center sm:py-20">
      <CoffeeSticker className="mx-auto mb-5 w-28 -rotate-3" />
      <p className="text-[10px] font-medium tracking-[0.16em] text-[var(--foreground-muted)] uppercase">
        {t("emptyState.eyebrow")}
      </p>
      <h3 className="font-lora mt-3 text-[23px] leading-relaxed tracking-tight text-[var(--foreground)] sm:text-[28px]">
        {t(filtered ? "emptyState.filteredTitle" : "emptyState.title")}
      </h3>
      <p className="mx-auto mt-3 max-w-[340px] text-sm leading-7 text-[var(--foreground-muted)]">
        {t(filtered ? "emptyState.filteredDescription" : "emptyState.description")}
      </p>
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        {filtered && (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex h-11 items-center gap-2 rounded-full border border-[var(--border)] px-5 text-sm font-bold text-[var(--foreground)] transition hover:bg-[var(--background-secondary)]"
          >
            <RotateCcw size={15} aria-hidden="true" />
            {t("filters.reset")}
          </button>
        )}
        <Link
          href="/coffee-meetups/new"
          className="inline-flex h-11 items-center gap-3 rounded-full bg-[var(--accent)] px-5 text-sm font-semibold text-white transition hover:bg-[var(--accent-hover)]"
        >
          {t("actions.create")}
          <ArrowRight size={15} aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
