"use client";

import { useEffect, useState } from "react";
import { getMyCafeVotes } from "@/apis/cafes";
import { getCurrentAccessToken } from "@/lib/auth-client";

export function useCafeVotes(enabled: boolean) {
  const [votedCafeIds, setVotedCafeIds] = useState<Set<string>>(() => new Set());

  useEffect(() => {
    let cancelled = false;

    async function loadVotes() {
      const token = await getCurrentAccessToken();
      if (!token) return;
      const ids = await getMyCafeVotes(token);
      if (!cancelled) setVotedCafeIds(new Set(ids));
    }

    if (enabled) void loadVotes().catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [enabled]);

  return votedCafeIds;
}
