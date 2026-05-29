import Image from "next/image";
import { cn } from "@/lib/utils";
import type { HeroImage } from "./types";

type PolaroidCardProps = {
  image: HeroImage;
  caption: string;
  className: string;
  variant?: "desktop" | "mobile";
  priority?: boolean;
};

export function PolaroidCard({
  image,
  caption,
  className,
  variant = "desktop",
  priority = false,
}: PolaroidCardProps) {
  const isMobile = variant === "mobile";

  return (
    <div
      className={cn(
        "pointer-events-none absolute",
        isMobile
          ? "z-[1] block w-[58px] opacity-75 sm:w-[78px] sm:opacity-80 lg:hidden"
          : "z-[2] hidden w-[150px] opacity-75 xl:block 2xl:w-[188px] 2xl:opacity-85",
        className,
      )}
      aria-hidden
    >
      <div
        className={cn(
          "relative rounded-[6px] bg-white shadow-[0_16px_38px_rgba(91,56,19,0.2)]",
          isMobile ? "p-1" : "p-2.5 pb-10 2xl:p-3 2xl:pb-11",
        )}
      >
        <span
          className={cn(
            "absolute rotate-[-6deg] rounded-[3px] bg-[#efb34f]/50 backdrop-blur-sm",
            isMobile ? "-top-1 left-2 h-2 w-6" : "-top-2.5 left-5 h-5 w-14",
          )}
        />
        <div
          className={cn(
            "relative overflow-hidden rounded-[3px]",
            isMobile ? "h-[54px] sm:h-[66px]" : "h-[150px] 2xl:h-[188px]",
          )}
        >
          <Image
            src={image.src}
            alt=""
            fill
            sizes={isMobile ? "78px" : "188px"}
            quality={58}
            loading={priority ? undefined : "lazy"}
            priority={priority}
            className="object-cover"
          />
        </div>
        <p
          className={cn(
            "font-lora text-center text-[#2c1a0e] italic",
            isMobile
              ? "mt-1 line-clamp-2 min-h-[17px] px-0.5 text-[8px] leading-[1.05] sm:min-h-[19px] sm:text-[9px]"
              : "bottom-2.5 text-[13px] 2xl:bottom-3 2xl:text-sm",
            !isMobile && "absolute right-0 left-0",
          )}
        >
          {caption}
        </p>
      </div>
    </div>
  );
}
