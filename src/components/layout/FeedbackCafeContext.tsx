"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

const FeedbackCafeContext = createContext<{
  cafeId: string | null;
  setCafeId: (cafeId: string | null) => void;
} | null>(null);

export function FeedbackCafeProvider({ children }: { children: ReactNode }) {
  const [cafeId, setCafeId] = useState<string | null>(null);
  const value = useMemo(() => ({ cafeId, setCafeId }), [cafeId]);
  return (
    <FeedbackCafeContext.Provider value={value}>{children}</FeedbackCafeContext.Provider>
  );
}

export function useFeedbackCafeId(cafeId?: string) {
  const context = useContext(FeedbackCafeContext);
  const setCafeId = context?.setCafeId;

  useEffect(() => {
    if (!setCafeId || !cafeId) return;
    setCafeId(cafeId);
    return () => setCafeId(null);
  }, [cafeId, setCafeId]);

  return context?.cafeId ?? null;
}
