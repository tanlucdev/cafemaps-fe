"use client";

import dynamic from "next/dynamic";
import type { ComponentProps } from "react";
import { useEffect, useRef, useState } from "react";
import type FeaturedCafesSection from "./FeaturedCafesSection";
import FeaturedCafesSkeleton from "./FeaturedCafesSkeleton";

type FeaturedCafesSectionProps = ComponentProps<typeof FeaturedCafesSection>;

const DynamicFeaturedCafesSection = dynamic(() => import("./FeaturedCafesSection"), {
  ssr: false,
});

export default function DeferredFeaturedCafesSection(props: FeaturedCafesSectionProps) {
  const [isReady, setIsReady] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || isReady) return;

    const load = () => setIsReady(true);

    if (!("IntersectionObserver" in globalThis)) {
      const timeoutId = globalThis.setTimeout(load, 1000);
      return () => globalThis.clearTimeout(timeoutId);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          load();
          observer.disconnect();
        }
      },
      { rootMargin: "640px 0px" },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [isReady]);

  return (
    <div ref={ref} className="[content-visibility:auto] [contain-intrinsic-size:720px]">
      {isReady ? <DynamicFeaturedCafesSection {...props} /> : <FeaturedCafesSkeleton />}
    </div>
  );
}
