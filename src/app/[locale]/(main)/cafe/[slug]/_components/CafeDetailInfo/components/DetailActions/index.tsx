import { Bookmark, Check, Heart, Navigation } from "lucide-react";
import type { DetailActionsProps } from "../../types";

export default function DetailActions({
  saved,
  loadingSave,
  visited,
  loadingVisited,
  saveLabel,
  visitedLabel,
  voteLabel,
  votedLabel,
  voted,
  loadingVote,
  directionsLabel,
  saveAriaLabel,
  visitedAriaLabel,
  mapsUrl,
  onSave,
  onVisited,
  onVote,
  variant = "default",
}: DetailActionsProps) {
  if (variant === "compact") {
    const iconButton =
      "flex h-12 w-[3.1rem] shrink-0 cursor-pointer flex-col items-center justify-center gap-0.5 rounded-xl border text-[9px] leading-none font-black shadow-[var(--shadow-sm)] backdrop-blur-md transition-all hover:-translate-y-px focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] disabled:cursor-not-allowed disabled:opacity-60";
    const idle =
      "border-[var(--border)] bg-white/68 text-[var(--foreground-muted)] hover:border-[var(--accent)] hover:bg-[var(--accent-light)] hover:text-[var(--accent-hover)] dark:bg-[var(--card)]/72";

    return (
      <div className="grid w-full grid-cols-[minmax(0,1fr)_repeat(3,3.1rem)] gap-1.5 pt-1">
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-12 min-w-0 cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-[var(--accent)] px-3 text-[13px] font-black text-white shadow-[0_10px_24px_rgba(200,132,42,0.22)] transition-all hover:-translate-y-px hover:bg-[var(--accent-hover)] focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
        >
          <Navigation size={15} className="shrink-0" />
          <span className="truncate">{directionsLabel}</span>
        </a>
        <button
          onClick={onSave}
          disabled={loadingSave}
          aria-label={saveAriaLabel}
          title={saveAriaLabel}
          className={`${iconButton} ${
            saved
              ? "border-[var(--accent)] bg-[var(--accent)] text-white shadow-[0_12px_28px_rgba(200,132,42,0.22)]"
              : idle
          }`}
        >
          <Bookmark size={14} className={saved ? "fill-white" : ""} />
          <span className="max-w-full truncate">{saveLabel}</span>
        </button>
        <button
          onClick={onVisited}
          disabled={loadingVisited}
          aria-label={visitedAriaLabel}
          title={visitedAriaLabel}
          className={`${iconButton} ${
            visited
              ? "border-[#d9962f] bg-[#f4b35d] text-[#2c1a0e] shadow-[0_12px_28px_rgba(244,179,93,0.25)]"
              : idle
          }`}
        >
          <Check size={14} strokeWidth={2.5} />
          <span className="max-w-full truncate">{visitedLabel}</span>
        </button>
        <button
          onClick={onVote}
          disabled={loadingVote}
          aria-label={voted ? votedLabel : voteLabel}
          title={voted ? votedLabel : voteLabel}
          className={`${iconButton} ${
            voted
              ? "border-[var(--accent)] bg-[var(--accent)] text-white shadow-[0_12px_28px_rgba(200,132,42,0.22)]"
              : idle
          }`}
        >
          <Heart size={14} className={voted ? "fill-white" : ""} />
          <span className="max-w-full truncate">{voted ? votedLabel : voteLabel}</span>
        </button>
      </div>
    );
  }

  return (
    <div className="grid w-full grid-cols-3 gap-2 sm:flex sm:gap-3">
      <button
        onClick={onSave}
        disabled={loadingSave}
        aria-label={saveAriaLabel}
        className={`flex h-11 min-w-0 shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-full border px-2 text-sm font-black whitespace-nowrap shadow-[var(--shadow-sm)] backdrop-blur-md transition-all duration-200 hover:-translate-y-px focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] disabled:cursor-not-allowed disabled:opacity-60 sm:w-28 sm:gap-2 sm:px-4 ${
          saved
            ? "border-[var(--accent)] bg-[var(--accent)] text-white shadow-[0_12px_28px_rgba(200,132,42,0.22)]"
            : "border-[var(--border)] bg-white/68 text-[var(--foreground-muted)] hover:border-[var(--accent)] hover:bg-[var(--accent-light)] hover:text-[var(--accent-hover)] dark:bg-[var(--card)]/72"
        }`}
      >
        <Bookmark size={15} className={saved ? "fill-white" : ""} />
        {saveLabel}
      </button>
      <button
        onClick={onVisited}
        disabled={loadingVisited}
        aria-label={visitedAriaLabel}
        className={`flex h-11 min-w-0 shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-full border px-2 text-sm font-black whitespace-nowrap shadow-[var(--shadow-sm)] backdrop-blur-md transition-all duration-200 hover:-translate-y-px focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] disabled:cursor-not-allowed disabled:opacity-60 sm:w-28 sm:gap-2 sm:px-4 ${
          visited
            ? "border-[#d9962f] bg-[#f4b35d] text-[#2c1a0e] shadow-[0_12px_28px_rgba(244,179,93,0.25)]"
            : "border-[var(--border)] bg-white/68 text-[var(--foreground-muted)] hover:border-[var(--accent)] hover:bg-[var(--accent-light)] hover:text-[var(--accent-hover)] dark:bg-[var(--card)]/72"
        }`}
      >
        <Check size={15} strokeWidth={2.5} />
        {visitedLabel}
      </button>
      <button
        onClick={onVote}
        disabled={loadingVote}
        aria-label={voted ? votedLabel : voteLabel}
        className={`flex h-11 min-w-0 shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-full border px-2 text-sm font-black whitespace-nowrap shadow-[var(--shadow-sm)] backdrop-blur-md transition-all duration-200 hover:-translate-y-px focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] disabled:cursor-not-allowed disabled:opacity-60 sm:w-28 sm:gap-2 sm:px-4 ${
          voted
            ? "border-[var(--accent)] bg-[var(--accent)] text-white shadow-[0_12px_28px_rgba(200,132,42,0.22)]"
            : "border-[var(--border)] bg-white/68 text-[var(--foreground-muted)] hover:border-[var(--accent)] hover:bg-[var(--accent-light)] hover:text-[var(--accent-hover)] dark:bg-[var(--card)]/72"
        }`}
      >
        <Heart size={15} className={voted ? "fill-white" : ""} />
        {voted ? votedLabel : voteLabel}
      </button>
      <a
        href={mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="col-span-3 flex h-11 min-w-0 flex-1 cursor-pointer items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-4 text-sm font-black text-white shadow-[0_12px_28px_rgba(200,132,42,0.24)] transition-all hover:-translate-y-px hover:bg-[var(--accent-hover)] focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] sm:col-span-1"
      >
        <Navigation size={16} className="shrink-0" />
        <span className="truncate">{directionsLabel}</span>
      </a>
    </div>
  );
}
