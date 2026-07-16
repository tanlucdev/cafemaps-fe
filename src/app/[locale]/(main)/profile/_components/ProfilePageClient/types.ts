import type { LucideIcon } from "lucide-react";

export type ProfileTab = "saved" | "quiz" | "submitted" | "activity";

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

export interface ActivityPreview {
  icon: LucideIcon;
  title: string;
  time: string;
}
