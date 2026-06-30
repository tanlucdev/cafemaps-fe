"use client";

import dynamic from "next/dynamic";
import type { ComponentProps } from "react";
import { useEffect, useState } from "react";
import { HeroSearchFallback } from "./HeroSearchFallback";

type DeferredHeroSearchIslandProps = {
  fallback: ComponentProps<typeof HeroSearchFallback>;
};

const DynamicHeroSearchIsland = dynamic(
  () => import("./HeroSearchIsland").then((mod) => mod.HeroSearchIsland),
  {
    ssr: false,
  },
);

export function DeferredHeroSearchIsland({ fallback }: DeferredHeroSearchIslandProps) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const win = window as Window & {
      requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };

    if (win.requestIdleCallback) {
      const idleId = win.requestIdleCallback(() => setIsReady(true), { timeout: 1200 });
      return () => win.cancelIdleCallback?.(idleId);
    }

    const timeoutId = window.setTimeout(() => setIsReady(true), 700);
    return () => window.clearTimeout(timeoutId);
  }, []);

  if (!isReady) {
    return <HeroSearchFallback {...fallback} />;
  }

  return <DynamicHeroSearchIsland />;
}
