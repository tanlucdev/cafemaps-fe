"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { usePathname } from "@/i18n/navigation";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const reduceMotion = usePrefersReducedMotion();
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => setHasMounted(true), []);

  return (
    <motion.main
      key={pathname}
      initial={!hasMounted || reduceMotion ? false : { opacity: 0.96, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={reduceMotion ? { duration: 0 } : { duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
      className="app-main flex-1"
    >
      {children}
    </motion.main>
  );
}
