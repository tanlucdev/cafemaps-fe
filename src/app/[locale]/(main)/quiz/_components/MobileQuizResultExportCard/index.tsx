import { CircleOff, Coffee, Heart, Shuffle, Sparkles, Users } from "lucide-react";
import type { Ref } from "react";
import { getPersonaRelations } from "@/lib/quiz/persona-relations";
import { resolveQuizWideImage } from "@/lib/quiz/profiles";
import { cn } from "@/lib/utils";
import type { LocalizedQuizProfile, QuizResult, QuizResultVariant } from "@/types/quiz";
import { MOBILE_BOARD } from "../../mobile-board-tokens";

export type BoardLabels = {
  result: string;
  match: string;
  traits: string;
  bestFor: string;
  avoidWhen: string;
  compatiblePersonas: string;
  incompatiblePersonas: string;
  pairPersonas: string;
};

export default function MobileQuizResultExportCard({
  result,
  profiles,
  labels,
  variant,
  className,
  cardRef,
}: {
  result: QuizResult;
  profiles: LocalizedQuizProfile[];
  labels: BoardLabels;
  variant: QuizResultVariant;
  className?: string;
  cardRef?: Ref<HTMLDivElement>;
}) {
  const relations = getPersonaRelations(result.profile, profiles);
  const image = resolveQuizWideImage(result.profile.posterImageSlug, variant);

  return (
    <div
      ref={cardRef}
      className={cn(
        "[container-type:inline-size] relative isolate flex flex-col overflow-hidden rounded-[8px] bg-[#fff8ee] font-sans text-[#24150b] shadow-[0_24px_60px_rgba(88,55,24,0.2)]",
        className,
      )}
      style={{ fontFeatureSettings: '"ss01", "cv05", "kern"' }}
    >
      <div className="relative aspect-[1080/460] shrink-0 overflow-hidden bg-[#f5e0c1]">
        <div
          className="absolute inset-0 scale-[1.02] bg-cover bg-center"
          style={{ backgroundImage: `url(${image})` }}
        />
      </div>
      <div className="flex min-h-0 flex-col gap-[3cqw] p-[4cqw]">
        <div className="rounded-[8px] border border-[#ead1aa] bg-white/72 p-[3.4cqw] shadow-[inset_0_1px_0_rgba(255,255,255,0.75)]">
          <div className="mb-[2.7cqw] flex items-center justify-between gap-[2cqw]">
            <span className="rounded-full border border-[#dfbf8f] bg-[#fffaf2] px-[2cqw] py-[0.85cqw] text-[1.7cqw] font-black tracking-[0.12em] text-[#8b521b] uppercase">
              {labels.result}
            </span>
            <span className="rounded-full bg-[#24150b] px-[2cqw] py-[0.85cqw] text-[1.85cqw] font-black text-[#fff7ea]">
              {result.dna}
            </span>
          </div>
          <h1 className="font-lora text-[7.8cqw] leading-[0.98] font-extrabold text-[#24150b]">
            {result.profile.title}
          </h1>
          <p className="mt-[1.7cqw] text-[2.8cqw] leading-tight font-black text-[#9b5f20] first-letter:uppercase">
            {result.profile.subtitle}
          </p>
          <p className="mt-[2.2cqw] line-clamp-3 text-[2.45cqw] leading-[1.45] font-semibold text-[#5f4932] first-letter:uppercase">
            {result.profile.description}
          </p>
          <div className="mt-[2.8cqw] flex items-center gap-[2cqw]">
            <span className="text-[4cqw] leading-none font-black text-[#9b5f20]">{result.score}%</span>
            <span className="text-[1.8cqw] font-black text-[#6b4a28]">{labels.match}</span>
            <div className="h-[1.3cqw] flex-1 overflow-hidden rounded-full bg-[#ead1aa]">
              <div className="h-full rounded-full bg-[#9b5f20]" style={{ width: `${result.score}%` }} />
            </div>
          </div>
          <div className="mt-[3cqw] flex flex-wrap gap-[1cqw]">
            {result.chips.slice(0, 6).map((chip) => (
              <span
                key={chip}
                className="rounded-full border border-[#dfbf8f] bg-[#fff8ee] px-[1.5cqw] py-[0.8cqw] text-[clamp(9px,1.4cqw,13px)] leading-tight font-black text-[#4b2b14] first-letter:uppercase"
              >
                {chip}
              </span>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-[1.2cqw]">
          <AnalysisColumn
            title={labels.traits}
            items={result.profile.personalityTraits}
            icon={Sparkles}
            tone="warm"
          />
          <AnalysisColumn
            title={labels.bestFor}
            items={result.profile.bestFor}
            icon={Coffee}
            tone="green"
          />
          <AnalysisColumn
            title={labels.avoidWhen}
            items={result.profile.avoidWhen}
            icon={CircleOff}
            tone="rose"
          />
        </div>
        <div className="grid grid-cols-3 gap-[1.2cqw]">
          <RelationColumn
            title={labels.compatiblePersonas}
            items={relations.compatible}
            icon={Heart}
          />
          <RelationColumn
            title={labels.incompatiblePersonas}
            items={relations.incompatible}
            icon={Shuffle}
          />
          <RelationColumn title={labels.pairPersonas} items={relations.pair} icon={Users} />
        </div>
      </div>
    </div>
  );
}

function AnalysisColumn({
  title,
  items,
  icon: Icon,
  tone,
}: {
  title: string;
  items: string[];
  icon: typeof Sparkles;
  tone: "warm" | "green" | "rose";
}) {
  const colors = MOBILE_BOARD.tones[tone];
  const toneClass = {
    warm: "border-[#e6bf82] bg-[#fff8ec] text-[#9b5f20]",
    green: "border-[#b9cfad] bg-[#f5fbef] text-[#526f35]",
    rose: "border-[#e4b8a5] bg-[#fff4ef] text-[#9b4e31]",
  }[tone];
  return (
    <div
      className={cn(
        "rounded-[8px] border p-[1.5cqw] shadow-[0_6px_16px_rgba(88,55,24,0.06)]",
        toneClass,
      )}
    >
      <div className="mb-[1cqw] flex items-center gap-[0.8cqw] text-[1.8cqw] font-black">
        <Icon className="size-[2.3cqw] shrink-0" style={{ color: colors[2] }} />
        <span className="truncate">{title}</span>
      </div>
      <ul className="space-y-[0.7cqw]">
        {items.slice(0, 2).map((item) => (
          <li
            key={item}
            className="flex gap-[0.8cqw] text-[1.65cqw] leading-snug font-medium text-[#5f4932]"
          >
            <span className="mt-[0.7cqw] size-[0.8cqw] shrink-0 rounded-full bg-current" />
            <span className="line-clamp-2 first-letter:uppercase">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function RelationColumn({
  title,
  items,
  icon: Icon,
}: {
  title: string;
  items: LocalizedQuizProfile[];
  icon: typeof Heart;
}) {
  return (
    <div className="min-w-0 rounded-[8px] border border-[#e5cfad] bg-white/65 p-[1.4cqw] shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
      <div className="mb-[1cqw] flex items-center gap-[0.8cqw] text-[1.45cqw] font-medium text-[#8b521b]">
        <Icon className="size-[2.2cqw] shrink-0 text-[#c8842a]" />
        <span className="truncate">{title}</span>
      </div>
      <div className="grid gap-[0.65cqw]">
        {items.slice(0, 2).map((profile) => (
          <div
            key={profile.id}
            className="flex min-h-[5.2cqw] items-center gap-[0.75cqw] rounded-[7px] border border-[#ead5b7] bg-[#fffaf2] px-[0.85cqw] py-[0.6cqw] shadow-[0_1px_0_rgba(92,55,24,0.05)]"
          >
            <div
              className="size-[3.5cqw] shrink-0 rounded-[6px] border border-white bg-cover bg-center shadow-sm"
              style={{ backgroundImage: `url(${profile.posterImage})` }}
            />
            <span className="line-clamp-2 min-w-0 text-[clamp(8px,1cqw,11px)] leading-tight font-medium break-words text-[#5f4932] first-letter:uppercase">
              {profile.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
