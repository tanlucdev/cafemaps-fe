"use client";

import { useRef, type CSSProperties, type ReactNode } from "react";
import { useInView } from "framer-motion";
import ChristmasArt from "./ChristmasArt";
import styles from "./CafeChristmasDecorations.module.css";

export function CafeChristmasFrame({ cafeId, compact = false, children }: {
  cafeId: string; compact?: boolean; children: ReactNode;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const visible = useInView(ref);
  const seed = Array.from(cafeId).reduce((hash, char) => (hash * 31 + char.charCodeAt(0)) >>> 0, 0);
  const kind = (["tree", "bow", "kitten", "santa"] as const)[seed % 4];
  return (
    <div className={styles.frame}>
      {children}
      <span ref={ref} aria-hidden="true" data-ornament={kind}
        data-moving={visible}
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
      <ChristmasArt kind="santa" className={styles.santa} />
    </div>
  );
}
