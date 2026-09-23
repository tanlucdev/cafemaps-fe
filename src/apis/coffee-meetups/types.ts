import type { MEETUP_PURPOSES, REPORT_REASONS } from "./constants";

export type MeetupPurpose = (typeof MEETUP_PURPOSES)[number];
export type MeetupStatus = "open" | "full" | "cancelled" | "completed";
export type MeetupRequestStatus = "pending" | "accepted" | "rejected" | "withdrawn";
export type MeetupReportReason = (typeof REPORT_REASONS)[number];

export interface MeetupCafe {
  id: string;
  name: string;
  slug: string;
  district?: string | null;
  address?: string | null;
}

export interface CoffeeMeetupRequest {
  id: string;
  requesterId: string;
  requesterName: string;
  message?: string | null;
  status: MeetupRequestStatus;
  createdAt: string;
}

export interface CoffeeMeetup {
  id: string;
  cafeId: string;
  cafe: MeetupCafe | null;
  organizerId: string;
  organizerName: string;
  purpose: MeetupPurpose;
  title: string;
  description?: string | null;
  startsAt: string;
  endsAt: string;
  maxParticipants: number;
  status: MeetupStatus;
  createdAt: string;
  acceptedCount: number;
  pendingCount: number;
  myRequestStatus?: MeetupRequestStatus | null;
  requests: CoffeeMeetupRequest[];
}

export interface MeetupFilters {
  purpose?: string;
  date?: string;
  area?: string;
  availableOnly?: boolean;
}

export interface CreateMeetupPayload {
  cafeId: string;
  purpose: MeetupPurpose;
  title: string;
  date: string;
  startsAt: string;
  endsAt: string;
  maxParticipants: number;
  description?: string;
}
