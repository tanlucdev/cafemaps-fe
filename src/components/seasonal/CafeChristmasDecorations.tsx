"use client";

import { useRef, type CSSProperties, type ReactNode } from "react";
import { useInView } from "framer-motion";
import ChristmasArt from "./ChristmasArt";
import styles from "./CafeChristmasDecorations.module.css";

export function CafeChristmasFrame({ cafeId, index, compact = false, children }: {
  cafeId: string; index: number; compact?: boolean; children: ReactNode;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const visible = useInView(ref);
  const seed = Array.from(cafeId).reduce((hash, char) => (hash * 31 + char.charCodeAt(0)) >>> 0, 0);
  const kind = (["tree", "bow", "hat"] as const)[seed % 3];
  // ponytail: animate only the first six per collection; larger lists keep static ornaments.
  const animated = index < 6;
  return (
    <div className={styles.frame}>
      {children}
      <span ref={animated ? ref : undefined} aria-hidden="true" data-ornament={kind}
        data-moving={animated && visible}
        style={{ "--ornament-delay": `${seed % 7 * -1}s` } as CSSProperties}
        className={`${styles.trim} ${compact ? styles.compact : ""}`}>
        <ChristmasArt kind={kind} className={styles.ornament} />
        <ChristmasArt kind="star" className={styles.star} />
      </span>
    </div>
  );
}

export function CafeChristmasGarland() {
  return (
    <div aria-hidden="true" className={styles.garland}>
      <ChristmasArt kind="sprig" className={styles.sprig} />
      <ChristmasArt kind="lights" className={styles.lights} />
      <ChristmasArt kind="bow" className={styles.bow} />
    </div>
  );
}
