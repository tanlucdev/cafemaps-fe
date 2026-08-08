import { CircleOff, Coffee, Heart, Shuffle, Sparkles, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { getPersonaRelations } from "@/lib/quiz/persona-relations";
import { cn } from "@/lib/utils";
import type { LocalizedQuizProfile, QuizResult } from "@/types/quiz";
import type { ResultLabels } from ".";

export function PersonaAnalysis({ result, labels }: { result: QuizResult; labels: ResultLabels }) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
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
  );
}

export function PersonaRelations({
  result,
  profiles,
  labels,
}: {
  result: QuizResult;
  profiles: LocalizedQuizProfile[];
  labels: ResultLabels;
}) {
  const relations = getPersonaRelations(result.profile, profiles);
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <RelationColumn title={labels.compatiblePersonas} items={relations.compatible} icon={Heart} />
      <RelationColumn
        title={labels.incompatiblePersonas}
        items={relations.incompatible}
        icon={Shuffle}
      />
      <RelationColumn title={labels.pairPersonas} items={relations.pair} icon={Users} />
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
  icon: LucideIcon;
}) {
  return (
    <div className="min-h-0 rounded-[8px] border border-[#e5cfad] bg-white/70 p-3 shadow-[0_12px_30px_rgba(88,55,24,0.08)] lg:p-2.5 dark:bg-[var(--card)]">
      <div className="mb-1.5 flex items-center gap-2 text-sm font-black text-[#8b521b]">
        <Icon className="size-4 text-[#c8842a]" />
        {title}
      </div>
      <div className="grid gap-1.5">
        {items.slice(0, 2).map((profile) => (
          <div
            key={profile.id}
            className="flex min-h-11 items-center gap-2 rounded-[8px] border border-[#ead5b7] bg-[#fff8ee] p-1.5 text-[var(--foreground)] shadow-[0_1px_0_rgba(92,55,24,0.05)] lg:min-h-10 lg:p-1 dark:bg-white/5"
          >
            <div
              className="size-9 shrink-0 rounded-[7px] border border-white bg-cover bg-center shadow-sm"
              style={{ backgroundImage: `url(${profile.posterImage})` }}
            />
            <span className="min-w-0 text-[11px] leading-tight font-black first-letter:uppercase xl:text-xs">
              {profile.title}
            </span>
          </div>
        ))}
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
  icon: LucideIcon;
  tone: "warm" | "green" | "rose";
}) {
  const toneClass = {
    warm: "border-[#e6bf82] bg-[#fff8ec] text-[#9b5f20]",
    green: "border-[#b9cfad] bg-[#f5fbef] text-[#526f35]",
    rose: "border-[#e4b8a5] bg-[#fff4ef] text-[#9b4e31]",
  }[tone];
  return (
    <div className={cn("min-h-0 rounded-[8px] border p-3 shadow-[0_12px_30px_rgba(88,55,24,0.08)] lg:p-2.5 dark:bg-[var(--card)]", toneClass)}>
      <div className="mb-2 flex items-center gap-2 text-sm font-black">
        <Icon className="size-4 shrink-0" />
        {title}
      </div>
      <ul>
        {items.map((item) => (
          <li
            key={item}
            className="flex gap-2 py-1.5 text-sm leading-5 font-medium text-[#5f4932] first-letter:uppercase dark:text-[var(--foreground-muted)]"
          >
            <span className="mt-2 size-1.5 shrink-0 rounded-full bg-current" />
            <span className="first-letter:uppercase">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
