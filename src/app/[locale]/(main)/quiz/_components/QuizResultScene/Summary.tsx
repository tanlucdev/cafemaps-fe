"use client";

import type { QuizResult } from "@/types/quiz";
import type { ResultLabels } from ".";

export default function ResultSummary({
  result,
  labels,
  isPreview,
}: {
  result: QuizResult;
  labels: ResultLabels;
  isPreview: boolean;
}) {
  return (
    <div className="relative isolate overflow-hidden rounded-[8px] border border-[#e5cfad] bg-[#fffaf2] p-4 shadow-[0_18px_46px_rgba(88,55,24,0.12)] sm:p-6 lg:p-4 xl:p-5 dark:bg-[var(--card)]">
      <div className="absolute -top-24 -right-24 size-64 rounded-full bg-[#f2cf88]/28" />
      <div className="relative flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-[#ead5b7] bg-white/75 px-3 py-1 text-xs font-black tracking-[0.14em] text-[#9a672f] uppercase">
            {labels.result}
          </span>
          <span className="rounded-full bg-[#2c1a0e] px-3 py-1 text-xs font-black text-[#fff7ea]">
            {result.dna}
          </span>
        </div>
        <div className="relative">
          <div className="relative grid size-20 place-items-center rounded-full border border-[#dfbf8f] bg-white/78 shadow-[0_12px_28px_rgba(88,55,24,0.12)] ring-4 ring-[#fff5e4] xl:size-22">
            <div className="text-center">
              <span className="block text-2xl leading-none font-black text-[#9a672f]">
                {result.score}%
              </span>
              <span className="mt-1 block text-[10px] leading-none font-black whitespace-nowrap text-[#6b4a28]">
                {labels.match}
              </span>
            </div>
          </div>
        </div>
      </div>
      {isPreview ? (
        <p className="relative mt-3 rounded-[8px] border border-[#e6cda2] bg-[#fff7e8] p-3 text-sm leading-6 font-semibold text-[#7a5528]">
          {labels.previewNote}
        </p>
      ) : null}
      <h1 className="font-lora relative mt-2 max-w-3xl text-3xl leading-[0.98] font-extrabold text-[var(--foreground)] sm:text-6xl lg:text-4xl xl:text-5xl 2xl:text-6xl">
        {result.profile.title}
      </h1>
      <p className="relative mt-2 text-base font-black text-[#9a672f] first-letter:uppercase sm:text-lg">
        {result.profile.subtitle}
      </p>
      <p className="relative mt-2 line-clamp-2 max-w-3xl text-sm leading-6 text-[var(--foreground-muted)] sm:text-base sm:leading-7 lg:leading-6">
        {result.profile.description}
      </p>
      <div className="relative mt-4">
        <div className="flex flex-wrap gap-2">
          {result.chips.map((chip) => (
            <span
              key={chip}
              className="rounded-full border border-[#dfbf8f] bg-white/75 px-3 py-1 text-[11px] font-black text-[var(--foreground)] first-letter:uppercase dark:bg-white/5"
            >
              {chip}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
