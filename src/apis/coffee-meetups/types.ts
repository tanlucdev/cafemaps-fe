export type MeetupPurpose = string;
export type MeetupStatus = "open" | "full" | "cancelled" | "completed";
export type MeetupRequestStatus = "pending" | "accepted" | "rejected" | "withdrawn";
export type MeetupReportReason = string;

export interface MeetupCafe {
  id: string;
  name: string;
  slug: string;
  district?: string | null;
  address?: string | null;
  images?: string[];
  coverImage?: string | null;
  lat?: number | null;
  lng?: number | null;
  distanceKm?: number | null;
  distanceMode?: "straight" | "route" | null;
  durationMin?: number | null;
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
  imageUrl?: string | null;
  organizerId: string;
  organizerName: string;
  purpose: MeetupPurpose;
  purposeIcon?: string | null;
  purposeColor?: string | null;
  title: string;
  description?: string | null;
  contactInfo?: string | null;
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
  nearMe?: boolean;
  lat?: number;
  lng?: number;
  radiusKm?: number;
  page?: number;
  limit?: number;
}

export interface CreateMeetupPayload {
  cafeId: string;
  place?: MeetupPlaceDraft;
  purpose: MeetupPurpose;
  purposeIcon?: string;
  purposeColor?: string;
  title: string;
  date: string;
  startsAt: string;
  endsAt: string;
  maxParticipants: number;
  description?: string;
  contactInfo?: string;
}

export type MeetupPlaceDraft =
  | { kind: "cafe"; cafeId: string }
  | {
      kind: "external";
      name: string;
      url?: string;
      googleMapsUrl?: string;
      district?: string;
    };
