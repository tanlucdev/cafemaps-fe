import { Coffee, Sparkles } from "lucide-react";

export default function QuizLoading() {
  return (
    <section className="relative grid min-h-[100svh] place-items-center bg-[#fbf4e8] px-4 pt-[calc(env(safe-area-inset-top,0px)+5rem)] pb-[calc(var(--mobile-bottom-nav-height,72px)+env(safe-area-inset-bottom,0px)+1rem)] dark:bg-[#1e1c1a]">
      <div className="grid gap-4 text-center">
        <div className="relative mx-auto grid size-16 place-items-center rounded-[8px] border border-[#dfbf8f] bg-[#fff7e8] text-[#9b5c20] shadow-[0_16px_36px_rgba(88,55,24,0.12)]">
          <Sparkles className="absolute -top-2 -right-2 size-5 animate-pulse text-[#c8842a]" />
          <Coffee className="size-8 animate-pulse" />
        </div>
        <div className="mx-auto h-2 w-40 overflow-hidden rounded-full bg-[#ead1aa]">
          <div className="h-full w-1/2 animate-[quiz-steam_1.2s_ease-in-out_infinite] rounded-full bg-[#c8842a]" />
        </div>
      </div>
    </section>
  );
}
