import Image from "next/image";
import { cn } from "@/lib/utils";
import { BACKGROUND_CAFES, MOBILE_POLAROIDS, POLAROIDS } from "./data";
import { PolaroidCard } from "./PolaroidCard";

export function HeroBackground() {
  return (
    <>
      <div className="absolute inset-0 z-0 overflow-hidden bg-[#1b1008]">
        <div className="absolute inset-x-[-22%] top-[-12%] grid min-h-[124%] grid-cols-3 gap-1.5 opacity-95 sm:inset-x-[-16%] sm:grid-cols-4 md:inset-x-[-10%] md:grid-cols-6 md:gap-2 lg:grid-cols-7">
          {BACKGROUND_CAFES.map((cafe, index) => (
            <div
              key={`${cafe.name}-${index}`}
              className={cn(
                "relative min-h-[112px] overflow-hidden rounded-[10px] bg-[#2c1a0e] shadow-[0_18px_42px_rgba(27,16,8,0.28)] sm:min-h-[132px]",
                cafe.tileClassName,
              )}
            >
              <Image
                src={cafe.src}
                alt=""
                fill
                sizes="(min-width: 1280px) 16vw, (min-width: 768px) 22vw, 40vw"
                className="object-cover brightness-[0.82] contrast-[1.03] saturate-[1.02] md:brightness-[0.74] md:contrast-[1.08] md:saturate-[1.08]"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,6,3,0.12)_0%,rgba(10,6,3,0.22)_45%,rgba(10,6,3,0.58)_100%)]" />
              <div className="absolute inset-x-0 bottom-0 p-2.5 sm:p-3">
                <p className="line-clamp-2 text-left text-[11px] leading-tight font-semibold text-white/88 drop-shadow-[0_1px_5px_rgba(0,0,0,0.55)] sm:text-xs">
                  {cafe.name}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(22,13,7,0.46)_0%,rgba(68,43,21,0.18)_34%,rgba(245,239,230,0.56)_100%)] md:bg-[linear-gradient(180deg,rgba(22,13,7,0.54)_0%,rgba(68,43,21,0.2)_34%,rgba(116,78,42,0.28)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_39%,rgba(255,249,240,0.92)_0%,rgba(255,249,240,0.76)_30%,rgba(255,249,240,0.38)_58%,rgba(74,48,25,0.2)_82%,rgba(18,11,6,0.56)_100%)] md:bg-[radial-gradient(ellipse_at_50%_39%,rgba(255,249,240,0.9)_0%,rgba(255,249,240,0.7)_30%,rgba(255,249,240,0.28)_58%,rgba(74,48,25,0.3)_82%,rgba(18,11,6,0.68)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_48%_54%,rgba(255,249,240,0.56)_0%,rgba(255,249,240,0.24)_36%,transparent_66%)] md:bg-[radial-gradient(ellipse_at_48%_54%,rgba(255,249,240,0.42)_0%,rgba(255,249,240,0.16)_36%,transparent_66%)]" />
        <div className="absolute inset-y-0 left-0 w-[36%] bg-gradient-to-r from-[#1b1008]/48 via-[#1b1008]/16 to-transparent md:w-[42%] md:from-[#1b1008]/68 md:via-[#1b1008]/24" />
        <div className="absolute inset-y-0 right-0 w-[36%] bg-gradient-to-l from-[#1b1008]/48 via-[#1b1008]/16 to-transparent md:w-[42%] md:from-[#1b1008]/68 md:via-[#1b1008]/24" />
        <div className="absolute inset-x-0 top-0 h-[18%] bg-gradient-to-b from-[#1b1008]/40 to-transparent md:h-[22%] md:from-[#1b1008]/58" />
        <div className="absolute inset-x-0 bottom-0 h-[34%] bg-gradient-to-t from-[#f5efe6]/86 via-[#f5efe6]/42 to-transparent md:h-[32%] md:bg-[linear-gradient(0deg,rgba(48,30,15,0.58)_0%,rgba(82,53,27,0.22)_46%,transparent_100%)]" />
      </div>

      {POLAROIDS.map((item) => (
        <PolaroidCard
          key={`desktop-${item.image.src}`}
          image={item.image}
          className={item.className}
        />
      ))}

      {MOBILE_POLAROIDS.map((item) => (
        <PolaroidCard
          key={`mobile-${item.image.src}`}
          image={item.image}
          className={item.className}
          variant="mobile"
        />
      ))}
    </>
  );
}
