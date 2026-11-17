"use client";

import { useLocale } from "next-intl";
import ChristmasArt from "./ChristmasArt";

export default function SeasonalGreeting({ className = "" }: { className?: string }) {
  const locale = useLocale();
  return (
    <p className={`seasonal-greeting ${className}`}>
      <ChristmasArt kind="sprig" />
      <span>{locale === "en"
        ? "A little warmth, a familiar coffee corner."
        : "Một mùa an lành, một góc cà phê quen."}</span>
    </p>
  );
}
