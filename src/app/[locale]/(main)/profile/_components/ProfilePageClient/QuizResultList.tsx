import Image from "next/image";
import { useState } from "react";
import { Sparkles } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { QUIZ_PROFILES, resolveQuizPosterImage } from "@/lib/quiz";
import type { QuizResultVariant } from "@/types/quiz";
import type { ProfileCopy } from "./constants";
import { EmptyState } from "./ProfileShared";
import { QuizHistoryModal } from "./QuizHistoryModal";
import type { ProfileQuizResult } from "./types";

export function QuizResultList({
  copy,
  locale,
  quizCompletedCount,
  results,
}: {
  copy: ProfileCopy;
  locale: string;
  quizCompletedCount: number;
  results: ProfileQuizResult[];
}) {
  const [selected, setSelected] = useState<ProfileQuizResult | null>(null);

  if (quizCompletedCount === 0) {
    return (
      <EmptyState
        icon={Sparkles}
        title={copy.quizEmptyTitle}
        body={copy.quizEmptyBody}
        actionHref="/quiz"
        actionLabel={copy.takeQuiz}
      />
    );
  }

  return (
    <>
      <div className="rounded-3xl border border-[var(--border)] bg-[#fffaf2] p-4 dark:bg-white/5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-black text-[var(--foreground)]">{copy.quizTitle}</h2>
          <p className="mt-1 text-sm text-[var(--foreground-muted)]">
            {copy.quizCompletedSummary.replace("{count}", String(quizCompletedCount))}
          </p>
        </div>
        <Link
          href="/quiz"
          className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-2xl bg-[var(--accent)] px-4 text-sm font-bold text-white transition hover:bg-[var(--accent-hover)] focus-visible:ring-3 focus-visible:ring-[var(--ring)]/30 focus-visible:outline-none"
        >
          <Sparkles size={15} />
          {copy.retakeQuiz}
        </Link>
      </div>

      {results.length > 0 && (
        <div className="mt-4 grid gap-2">
          {results.map((result) => (
            <QuizResultRow
              key={result.id}
              copy={copy}
              result={result}
              onOpen={() => setSelected(result)}
            />
          ))}
        </div>
      )}
      </div>
      <QuizHistoryModal
        locale={locale}
        open={Boolean(selected)}
        result={selected}
        onClose={() => setSelected(null)}
      />
    </>
  );
}

function QuizResultRow({
  copy,
  result,
  onOpen,
}: {
  copy: ProfileCopy;
  result: ProfileQuizResult;
  onOpen: () => void;
}) {
  const image = resolveProfileImage(result.profileId, result.variant);
  const meta = [result.score ? `${result.score}%` : null, result.dna].filter(Boolean).join(" · ");

  return (
    <button
      type="button"
      onClick={onOpen}
      className="grid cursor-pointer grid-cols-[56px_minmax(0,1fr)] gap-3 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-2.5 text-left transition hover:bg-[var(--background-secondary)] focus-visible:ring-3 focus-visible:ring-[var(--ring)]/30 focus-visible:outline-none"
    >
      <div className="relative size-14 overflow-hidden rounded-xl bg-[var(--accent-light)]">
        {image ? (
          <Image src={image} alt="" fill sizes="56px" className="object-cover" />
        ) : (
          <div className="grid h-full place-items-center text-[var(--accent)]">
            <Sparkles size={20} />
          </div>
        )}
      </div>
      <div className="min-w-0">
        <h3 className="truncate text-sm font-black text-[var(--foreground)]">
          {result.profileTitle}
        </h3>
        {meta && <p className="mt-0.5 truncate text-xs text-[var(--foreground-muted)]">{meta}</p>}
        <p className="mt-1 text-xs font-bold text-[var(--foreground-muted)]">
          {formatDate(result.createdAt, copy)}
        </p>
      </div>
    </button>
  );
}

function resolveProfileImage(profileId: string, variant: unknown) {
  const profile = QUIZ_PROFILES.find((item) => item.id === profileId);
  if (!profile) return null;
  const safeVariant: QuizResultVariant = variant === "man" ? "man" : "woman";
  return resolveQuizPosterImage(profile.posterImageSlug, safeVariant);
}

function formatDate(value: string, copy: ProfileCopy) {
  const locale = copy.savedCafes === "Saved cafés" ? "en-US" : "vi-VN";
  return new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(new Date(value));
}
