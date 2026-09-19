import type { LucideIcon } from "lucide-react";
import type { QuizHistoryResult } from "@/apis/quiz";
import type { CafeSubmission } from "@/apis/submissions";
import type { ProfileReview } from "@/types/review";

export type ProfileTab = "saved" | "quiz" | "submitted" | "reviews";

export interface ProfileStat {
  label: string;
  value: number;
  icon: LucideIcon;
}

export interface SubmittedCafePreview {
  name: string;
  area: string;
  status: "pending" | "approved" | "rejected";
}

export type ProfileQuizResult = QuizHistoryResult;
export type ProfileSubmission = CafeSubmission;
export type ProfileReviewItem = ProfileReview;

export interface ActivityPreview {
  icon: LucideIcon;
  title: string;
  time: string;
}
