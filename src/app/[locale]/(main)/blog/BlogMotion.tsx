"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const ease = [0.16, 1, 0.3, 1] as const;

function reveal(disable: boolean, y = 56) {
  return {
    initial: {
      opacity: 0,
      y: disable ? 0 : y,
      scale: disable ? 1 : 0.96,
      filter: disable ? "blur(0px)" : "blur(8px)",
    },
    whileInView: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" },
    viewport: { once: true, amount: 0.12, margin: "0px 0px -6% 0px" },
  };
}

export function BlogHeroMotion({
  children,
  className,
}: {
  children: ReactNode;
  className: string;
}) {
  const reduceMotion = usePrefersReducedMotion();

  return (
    <motion.section
      initial={{ opacity: 0, y: reduceMotion ? 0 : 36, scale: reduceMotion ? 1 : 1.04 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: reduceMotion ? 0 : 1.05, ease }}
      className={className}
    >
      {children}
      {!reduceMotion && (
        <motion.div
          aria-hidden="true"
          initial={{ scaleY: 1 }}
          animate={{ scaleY: 0 }}
          transition={{ duration: 0.82, delay: 0.08, ease }}
          className="pointer-events-none absolute inset-0 z-20 origin-bottom bg-[#2c1a0e]"
        />
      )}
    </motion.section>
  );
}

export function BlogReveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduceMotion = usePrefersReducedMotion();

  return (
    <motion.div
      {...reveal(Boolean(reduceMotion))}
      transition={{ duration: reduceMotion ? 0 : 0.82, delay: reduceMotion ? 0 : delay, ease }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function BlogCardMotion({
  children,
  className,
  index = 0,
}: {
  children: ReactNode;
  className: string;
  index?: number;
}) {
  const reduceMotion = usePrefersReducedMotion();

  return (
    <motion.article
      {...reveal(Boolean(reduceMotion), 64)}
      whileHover={reduceMotion ? undefined : { y: -10, scale: 1.015 }}
      transition={{
        duration: reduceMotion ? 0 : 0.76,
        delay: reduceMotion ? 0 : Math.min(index, 8) * 0.075,
        ease,
      }}
      className={className}
    >
      {children}
    </motion.article>
  );
}
