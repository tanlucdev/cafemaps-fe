"use client";

import { useEffect, useState } from "react";

export function useMinimumLoading(active: boolean, minimumMs = 500) {
  const [visible, setVisible] = useState(active);

  useEffect(() => {
    if (active) {
      setVisible(true);
      return;
    }

    const timeout = window.setTimeout(() => setVisible(false), minimumMs);
    return () => window.clearTimeout(timeout);
  }, [active, minimumMs]);

  return visible;
}
