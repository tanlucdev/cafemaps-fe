import { CircleOff, Coffee, Heart, Shuffle, Sparkles, Users } from "lucide-react";
import type { Ref } from "react";
import { getPersonaRelations } from "@/lib/quiz/persona-relations";
import { resolveQuizWideImage } from "@/lib/quiz/profiles";
import { cn } from "@/lib/utils";
import type { LocalizedQuizProfile, QuizResult, QuizResultVariant } from "@/types/quiz";

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
      className={cn("relative isolate flex flex-col overflow-hidden rounded-[8px] bg-[#fbf4e8] [container-type:inline-size] font-sans text-[#2c1a0e] shadow-[0_24px_60px_rgba(88,55,24,0.18)]", className)}
      style={{ fontFeatureSettings: '"ss01", "cv05", "kern"' }}
    >
      <div className="relative aspect-video shrink-0 overflow-hidden bg-[#f7ead7]">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${image})` }} />
      </div>
      <div className="flex min-h-0 flex-col gap-[2.4cqw] p-[4cqw]">
        <div>
          <h1 className="font-lora text-[7.4cqw] leading-[0.96] font-extrabold text-[#2c1a0e]">{result.profile.title}</h1>
          <p className="mt-[1.3cqw] text-[3.1cqw] leading-tight font-bold text-[#9a672f]">{result.profile.subtitle}</p>
          <p className="mt-[1.7cqw] line-clamp-3 text-[2.4cqw] leading-[1.42] text-[#5f4932]">{result.profile.description}</p>
        </div>
        <div>
          <div className="mb-[1cqw] flex items-center justify-between text-[2.4cqw] font-bold">
            <span className="inline-flex items-center gap-[1cqw]"><Coffee className="size-[3cqw] text-[#c8842a]" />{labels.match}</span>
            <span>{result.score}%</span>
          </div>
          <div className="h-[2.7cqw] overflow-hidden rounded-full border border-[#dfbf8f] bg-white/75 p-[0.45cqw]">
            <div className="h-full rounded-full bg-[linear-gradient(90deg,#7a9e7e,#c8842a,#efc06c)]" style={{ width: `${result.score}%` }} />
          </div>
          <div className="mt-[2.4cqw] grid grid-cols-6 gap-[0.8cqw]">
            {result.chips.slice(0, 6).map((chip) => (
              <span key={chip} className="flex min-h-[4.2cqw] min-w-0 items-center justify-center rounded-full border border-[#dfbf8f] bg-white/75 px-[1.1cqw] py-[0.7cqw] text-center text-[clamp(10px,1.45cqw,16px)] leading-tight font-bold break-words">{chip}</span>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-[1.2cqw]">
          <AnalysisColumn title={labels.traits} items={result.profile.personalityTraits} icon={Sparkles} />
          <AnalysisColumn title={labels.bestFor} items={result.profile.bestFor} icon={Coffee} />
          <AnalysisColumn title={labels.avoidWhen} items={result.profile.avoidWhen} icon={CircleOff} />
        </div>
        <div className="grid grid-cols-3 gap-[1.2cqw]">
          <RelationColumn title={labels.compatiblePersonas} items={relations.compatible} icon={Heart} />
          <RelationColumn title={labels.incompatiblePersonas} items={relations.incompatible} icon={Shuffle} />
          <RelationColumn title={labels.pairPersonas} items={relations.pair} icon={Users} />
        </div>
      </div>
    </div>
  );
}

function AnalysisColumn({ title, items, icon: Icon }: { title: string; items: string[]; icon: typeof Sparkles }) {
  return (
    <div className="rounded-[8px] border border-[#e5cfad] bg-[#fffdf8] p-[1.5cqw]">
      <div className="mb-[1cqw] flex items-center gap-[0.8cqw] text-[1.8cqw] font-black">
        <Icon className="size-[2.3cqw] shrink-0 text-[#c8842a]" />
        <span className="truncate">{title}</span>
      </div>
      <ul className="space-y-[0.7cqw]">
        {items.slice(0, 2).map((item) => (
          <li key={item} className="line-clamp-2 text-[1.65cqw] leading-snug text-[#5f4932]">{item}</li>
        ))}
      </ul>
    </div>
  );
}

function RelationColumn({ title, items, icon: Icon }: { title: string; items: LocalizedQuizProfile[]; icon: typeof Heart }) {
  return (
    <div className="min-w-0 rounded-[8px] border border-[#e5cfad] bg-white/55 p-[1.4cqw] shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
      <div className="mb-[1cqw] flex items-center gap-[0.8cqw] text-[1.7cqw] font-black text-[#9a672f]">
        <Icon className="size-[2.2cqw] shrink-0 text-[#c8842a]" />
        <span className="truncate">{title}</span>
      </div>
      <div className="grid gap-[0.65cqw]">
        {items.slice(0, 2).map((profile) => (
          <div key={profile.id} className="flex min-h-[5.2cqw] items-center gap-[0.75cqw] rounded-[7px] border border-[#ead5b7] bg-[#fffaf2] px-[0.85cqw] py-[0.6cqw] shadow-[0_1px_0_rgba(92,55,24,0.05)]">
            <div className="size-[3.2cqw] shrink-0 rounded-full border border-white bg-cover bg-center shadow-sm" style={{ backgroundImage: `url(${profile.posterImage})` }} />
            <span className="line-clamp-2 min-w-0 text-[clamp(9px,1.12cqw,12px)] leading-tight font-bold break-words text-[#5f4932]">{profile.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
