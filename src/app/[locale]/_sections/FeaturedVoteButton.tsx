"use client";

import { useEffect, useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { Heart } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { isUnauthorizedError, voteCafe } from "@/apis/cafes";
import { getCurrentAccessToken, saveAuthReturnUrl } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

interface FeaturedVoteButtonProps {
  cafeId: string;
  initialVoted?: boolean;
  initialCount?: number;
  voteLabel: string;
  votedLabel: string;
  countLabel: string;
}

export default function FeaturedVoteButton({
  cafeId,
  initialVoted = false,
  initialCount = 0,
  voteLabel,
  votedLabel,
  countLabel: _countLabel,
}: FeaturedVoteButtonProps) {
  void _countLabel;
  const t = useTranslations("cafe");
  const router = useRouter();
  const [voted, setVoted] = useState(initialVoted);
  const [, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialVoted) setVoted(true);
  }, [initialVoted]);

  function redirectToLogin() {
    toast.warning(t("loginRequiredToVote"));
    saveAuthReturnUrl();
    setTimeout(() => router.push("/login"), 700);
  }

  async function handleVote() {
    if (loading || voted) return;
    const token = await getCurrentAccessToken();
    if (!token) {
      redirectToLogin();
      return;
    }

    setLoading(true);
    setVoted(true);
    setCount((value) => value + 1);
    try {
      const result = await voteCafe(cafeId, token);
      setCount(result.weeklyVoteCount);
    } catch (error) {
      setVoted(false);
      setCount((value) => Math.max(0, value - 1));
      if (isUnauthorizedError(error)) redirectToLogin();
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleVote}
      disabled={loading || voted}
      className={cn(
        "absolute right-3 bottom-3 z-30 inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-white/24 px-2.5 py-1.5 text-[11px] font-black shadow-[0_8px_22px_rgba(20,10,2,0.18)] backdrop-blur-md transition",
        voted
          ? "cursor-default bg-[#ffd891]/92 text-[#5b3512]"
          : "bg-[#1b0f08]/62 text-white hover:bg-[#2c1a0e]/78",
      )}
      aria-label={voted ? votedLabel : voteLabel}
    >
      <Heart size={13} className={voted ? "fill-current" : ""} />
      <span>{voted ? votedLabel : voteLabel}</span>
    </button>
  );
}
