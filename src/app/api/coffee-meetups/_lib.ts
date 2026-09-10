import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { featureFlags } from "@/lib/feature-flags";
import { AUTH_COOKIE_KEYS } from "@/constants/auth-keys";
import type { CoffeeMeetup, CoffeeMeetupRequest, MeetupStatus } from "@/apis/coffee-meetups";
import type { NextRequest } from "next/server";

type AuthUser = {
  id: string;
  email: string;
  displayName: string | null;
  avatarUrl?: string | null;
  role: string;
};

type CafeRow = {
  id: string;
  slug: string;
  name: string;
  district: string | null;
  address: string | null;
};

type MeetupRow = {
  id: string;
  cafe_id: string;
  cafe_slug: string;
  cafe_name: string;
  cafe_district: string | null;
  cafe_address: string | null;
  organizer_id: string;
  organizer_name: string;
  purpose: string;
  title: string;
  description: string | null;
  starts_at: string;
  ends_at: string;
  max_participants: number;
  status: MeetupStatus;
  accepted_participant_names: string[] | null;
  accepted_count: number;
  created_at: string;
  requests?: MeetupRequestRow[];
};

type MeetupRequestRow = {
  id: string;
  meetup_id: string;
  requester_id: string;
  requester_name: string;
  message: string | null;
  status: "pending" | "accepted" | "rejected" | "withdrawn";
  created_at: string;
};

const apiBase = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "";
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export function featureBlockedResponse() {
  return Response.json({ error: "coffee_meetups_disabled" }, { status: 404 });
}

export function featureIsEnabled() {
  return featureFlags.coffeeMeetupsEnabled && Boolean(supabaseUrl && supabaseKey);
}

export function getAuthToken(request: NextRequest) {
  const header = request.headers.get("authorization");
  if (header?.startsWith("Bearer ")) return header.slice(7);
  return request.cookies.get(AUTH_COOKIE_KEYS.accessToken)?.value ?? null;
}

export const getRequestToken = getAuthToken;

export function getSupabase(token?: string | null): SupabaseClient {
  return createClient(supabaseUrl, supabaseKey, {
    global: token ? { headers: { Authorization: `Bearer ${token}` } } : undefined,
  });
}

export async function getCurrentUser(request: NextRequest): Promise<AuthUser | null> {
  const token = getAuthToken(request);
  if (!token || !apiBase) return null;
  const response = await fetch(`${apiBase}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!response.ok) return null;
  return (await response.json()) as AuthUser;
}

export function toPublicMeetup(row: MeetupRow, currentUserId?: string | null): CoffeeMeetup {
  const requests = (row.requests ?? []).map(
    (request): CoffeeMeetupRequest => ({
      id: request.id,
      requesterId: request.requester_id,
      requesterName: request.requester_name,
      message: request.message,
      status: request.status,
      createdAt: request.created_at,
    }),
  );
  const acceptedNames = row.accepted_participant_names ?? [];
  const acceptedCount = row.accepted_count || 1;
  const myRequest = currentUserId
    ? requests.find((request) => request.requesterId === currentUserId)
    : undefined;

  return {
    id: row.id,
    cafeId: row.cafe_id,
    cafe: {
      id: row.cafe_id,
      slug: row.cafe_slug,
      name: row.cafe_name,
      district: row.cafe_district,
      address: row.cafe_address,
    },
    organizerId: row.organizer_id,
    organizerName: row.organizer_name,
    purpose: row.purpose as CoffeeMeetup["purpose"],
    title: row.title,
    description: row.description,
    startsAt: row.starts_at,
    endsAt: row.ends_at,
    maxParticipants: row.max_participants,
    status: row.status,
    createdAt: row.created_at,
    acceptedCount,
    pendingCount: requests.filter((request) => request.status === "pending").length,
    myRequestStatus: myRequest?.status ?? null,
    requests: requests.length
      ? requests
      : acceptedNames.map((name, index) => ({
          id: `${row.id}-${index}`,
          requesterId: name,
          requesterName: name,
          message: null,
          status: "accepted",
          createdAt: row.created_at,
        })),
  };
}

export function getRemainingSeats(meetup: Pick<MeetupRow, "accepted_count" | "max_participants">) {
  return Math.max(0, meetup.max_participants - meetup.accepted_count);
}

export async function getMeetupById(id: string, token?: string | null, includeRequests = false) {
  const supabase = getSupabase(token);
  const select =
    "id,cafe_id,cafe_slug,cafe_name,cafe_district,cafe_address,organizer_id,organizer_name,purpose,title,description,starts_at,ends_at,max_participants,status,accepted_participant_names,accepted_count,created_at" +
    (includeRequests
      ? ",requests:coffee_meetup_requests(id,meetup_id,requester_id,requester_name,message,status,created_at)"
      : "");
  const { data, error } = await supabase
    .from("coffee_meetups")
    .select(select)
    .eq("id", id)
    .single();
  if (error) throw error;
  return data as unknown as MeetupRow;
}

export async function getCafeSnapshot(cafeId: string, token?: string | null) {
  const supabase = getSupabase(token);
  const { data, error } = await supabase
    .from("cafes")
    .select("id,slug,name,district,address")
    .eq("id", cafeId)
    .single();
  if (error) throw error;
  return data as unknown as CafeRow;
}
