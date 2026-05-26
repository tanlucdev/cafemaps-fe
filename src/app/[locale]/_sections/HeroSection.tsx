import { HeroBackground } from "./hero/HeroBackground";
import { HeroSearchIsland } from "./hero/HeroSearchIsland";

interface HeroSectionProps {
  locale: string;
}

export default function HeroSection({ locale }: HeroSectionProps) {
  const isVi = locale === "vi";

  return (
    <section className="relative isolate min-h-[100svh] overflow-hidden border-b border-[#e8d8c0] bg-[#f5efe6]">
      <HeroBackground />

      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-5xl flex-col items-center justify-center px-5 pt-[calc(112px+env(safe-area-inset-top,0px))] pb-20 text-center sm:px-6 sm:pt-[calc(82px+env(safe-area-inset-top,0px))] sm:pb-28 md:pb-16">
        <h1 className="font-lora max-w-[22rem] text-[34px] leading-[1.08] font-bold text-[#160b05] drop-shadow-[0_3px_16px_rgba(255,248,238,1)] sm:max-w-[760px] sm:text-[48px] md:text-[60px] lg:text-[66px]">
          {isVi ? (
            <>
              Bạn đang tìm quán cà phê <span className="text-[#b96a16] italic">kiểu nào</span>?
            </>
          ) : (
            <>
              What kind of <span className="text-[#b96a16] italic">cafe</span> are you looking for?
            </>
          )}
        </h1>

        <p className="mt-4 max-w-[21rem] text-[15px] leading-[1.55] font-bold text-[#281608] drop-shadow-[0_2px_14px_rgba(255,248,238,1)] sm:mt-5 sm:max-w-2xl sm:text-lg md:text-xl">
          {isVi
            ? "Một chiếc bản đồ nhỏ cho những buổi cà phê thật vừa ý."
            : "A little map for coffee plans that feel just right."}
        </p>

        <p className="mt-2 max-w-[20rem] text-sm leading-6 font-semibold text-[#6f4a28] drop-shadow-[0_2px_12px_rgba(255,248,238,0.95)] sm:max-w-xl sm:text-base">
          {isVi
            ? "Đi một mình, hẹn bạn hay tìm góc làm việc, cứ để Cafe Maps gợi vài nơi hợp mood."
            : "Solo coffee, friendly catch-ups, or a quiet work corner, Cafe Maps keeps a few good ideas ready."}
        </p>

        <HeroSearchIsland locale={locale} />
      </div>
    </section>
  );
}
