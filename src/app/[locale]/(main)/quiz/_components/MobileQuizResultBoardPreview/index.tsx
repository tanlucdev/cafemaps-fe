import type { BoardLabels } from "../QuizResultBoardCard";
import MobileQuizResultExportCard from "../MobileQuizResultExportCard";
import type { LocalizedQuizProfile, QuizResult, QuizResultVariant } from "@/types/quiz";

export default function MobileQuizResultBoardPreview({
  result,
  profiles,
  variant,
  labels,
}: {
  result: QuizResult;
  profiles: LocalizedQuizProfile[];
  variant: QuizResultVariant;
  labels: BoardLabels;
}) {
  return (
    <div className="grid gap-4">
      <p className="inline-flex w-fit items-center gap-1.5 rounded-full border border-[#dfbf8f] bg-[#fff7e8] px-3 py-1.5 text-[11px] font-black tracking-[0.1em] text-[#9a672f] uppercase shadow-[0_6px_16px_rgba(88,55,24,0.07)]">
        Cafe Maps Quiz
      </p>
      <MobileQuizResultExportCard
        result={result}
        profiles={profiles}
        variant={variant}
        labels={labels}
        className="w-full"
      />
    </div>
  );
}
