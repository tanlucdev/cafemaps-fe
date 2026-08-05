import { Coffee, Moon, Sparkles } from "lucide-react";
import type { Ref } from "react";
import { getPersonaRelations } from "@/lib/quiz/persona-relations";
import { cn } from "@/lib/utils";
import type { LocalizedQuizProfile, QuizResult } from "@/types/quiz";

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

export default function QuizResultBoardCard({
  result,
  profiles,
  labels,
  className,
  cardRef,
}: {
  result: QuizResult;
  profiles: LocalizedQuizProfile[];
  labels: BoardLabels;
  className?: string;
  cardRef?: Ref<HTMLDivElement>;
}) {
  const relations = getPersonaRelations(result.profile, profiles);

  return (
    <div
      ref={cardRef}
      className={cn(
        "relative isolate flex overflow-hidden rounded-[8px] bg-[#fbf4e8] font-sans text-[#2c1a0e] shadow-[0_24px_60px_rgba(88,55,24,0.18)]",
        className,
      )}
      style={{ fontFeatureSettings: '"ss01", "cv05", "kern"' }}
    >
      <div className="relative h-full w-[34%] shrink-0 overflow-hidden bg-[#f7ead7]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${result.profile.posterImage})` }}
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-4 p-9">
        <div className="flex items-center gap-3">
          <span className="rounded-[6px] border border-[#ead5b7] bg-white/70 px-4 py-2 text-[17px] font-bold tracking-[0.14em] text-[#9a672f] uppercase">
            {labels.result}
          </span>
          <span className="rounded-full bg-[#2c1a0e] px-4 py-2 text-[17px] font-black text-[#fff7ea]">
            {result.dna}
          </span>
        </div>
        <div>
          <h1 className="font-lora text-[64px] leading-[0.98] font-extrabold text-[#2c1a0e]">
            {result.profile.title}
          </h1>
          <p className="mt-3 text-[27px] leading-tight font-bold text-[#9a672f]">
            {result.profile.subtitle}
          </p>
          <p className="mt-4 line-clamp-4 text-[23px] leading-[1.55] text-[#5f4932]">
            {result.profile.description}
          </p>
        </div>
        <div>
          <div className="mb-2 flex items-center justify-between text-[20px] font-bold">
            <span className="inline-flex items-center gap-2">
              <Coffee className="size-6 text-[#c8842a]" />
              {labels.match}
            </span>
            <span>{result.score}%</span>
          </div>
          <div className="h-6 overflow-hidden rounded-full border border-[#dfbf8f] bg-white/70 p-1">
            <div
              className="h-full rounded-full bg-[linear-gradient(90deg,#7a9e7e,#c8842a,#efc06c)]"
              style={{ width: `${result.score}%` }}
            />
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {result.chips.map((chip) => (
              <span
                key={chip}
                className="rounded-full border border-[#dfbf8f] bg-white/70 px-4 py-2 text-[17px] font-bold"
              >
                {chip}
              </span>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <AnalysisColumn title={labels.traits} items={result.profile.personalityTraits} icon={Sparkles} />
          <AnalysisColumn title={labels.bestFor} items={result.profile.bestFor} icon={Coffee} />
          <AnalysisColumn title={labels.avoidWhen} items={result.profile.avoidWhen} icon={Moon} />
        </div>
        <div className="grid flex-1 grid-cols-3 gap-3">
          <RelationColumn title={labels.compatiblePersonas} items={relations.compatible} />
          <RelationColumn title={labels.incompatiblePersonas} items={relations.incompatible} />
          <RelationColumn title={labels.pairPersonas} items={relations.pair} />
        </div>
      </div>
    </div>
  );
}

function AnalysisColumn({
  title,
  items,
  icon: Icon,
}: {
  title: string;
  items: string[];
  icon: typeof Sparkles;
}) {
  return (
    <div className="rounded-[8px] border border-[#e5cfad] bg-[#fffdf8] p-4">
      <div className="mb-3 flex items-center gap-2 text-[18px] font-black">
        <Icon className="size-5 text-[#c8842a]" />
        {title}
      </div>
      <ul className="space-y-2">
        {items.slice(0, 3).map((item) => (
          <li key={item} className="text-[17px] leading-snug text-[#5f4932]">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function RelationColumn({ title, items }: { title: string; items: LocalizedQuizProfile[] }) {
  return (
    <div className="flex h-full flex-col rounded-[8px] border border-[#e5cfad] bg-white/70 p-4">
      <div className="mb-3 text-[18px] font-black text-[#9a672f]">{title}</div>
      <div className="grid flex-1 content-start gap-2">
        {items.map((profile) => (
          <div
            key={profile.id}
            className="flex min-h-12 items-center gap-2 rounded-[8px] border border-[#e5cfad] bg-[#fff8ee] p-2 text-[#2c1a0e]"
          >
            <div
              className="size-9 shrink-0 rounded-[6px] border border-white bg-cover bg-center shadow-sm"
              style={{ backgroundImage: `url(${profile.posterImage})` }}
            />
            <span className="min-w-0 text-[13px] leading-tight font-bold">{profile.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
