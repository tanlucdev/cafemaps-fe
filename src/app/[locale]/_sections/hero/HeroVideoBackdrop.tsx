"use client";

import { useEffect, useState } from "react";

const VIDEO_URL = "/background-hero.mp4";

type HeroVideoBackdropProps = {
  poster: string;
};

export function HeroVideoBackdrop({ poster }: HeroVideoBackdropProps) {
  const [canLoadVideo, setCanLoadVideo] = useState(false);

  useEffect(() => {
    const win = window as Window & {
      requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };

    if (win.requestIdleCallback) {
      const idleId = win.requestIdleCallback(() => setCanLoadVideo(true), { timeout: 1800 });
      return () => win.cancelIdleCallback?.(idleId);
    }

    const timeoutId = window.setTimeout(() => setCanLoadVideo(true), 1200);
    return () => window.clearTimeout(timeoutId);
  }, []);

  if (!canLoadVideo) {
    return null;
  }

  return (
    <video
      className="absolute inset-0 z-0 h-full w-full object-cover brightness-[1.08] contrast-[0.98] saturate-[1.06]"
      autoPlay
      loop
      muted
      playsInline
      preload="metadata"
      poster={poster}
      aria-hidden="true"
    >
      <source src={VIDEO_URL} type="video/mp4" />
    </video>
  );
}
