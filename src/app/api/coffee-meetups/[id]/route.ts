import type { NextRequest } from "next/server";
import {
  featureBlockedResponse,
  featureIsEnabled,
  getCafeSnapshot,
  getCurrentUser,
  getMeetupById,
  getRequestToken,
  getSupabase,
  toPublicMeetup,
} from "../_lib";
import { createMeetupSchema } from "@/apis/coffee-meetups/validation";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!featureIsEnabled()) return featureBlockedResponse();
  const { id } = await params;
  const currentUser = await getCurrentUser(request);
  const token = getRequestToken(request);
  const meetup = await getMeetupById(id, token, Boolean(currentUser));
  return Response.json(toPublicMeetup(meetup, currentUser?.id));
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!featureIsEnabled()) return featureBlockedResponse();
  const currentUser = await getCurrentUser(request);
  if (!currentUser) return Response.json({ error: "unauthorized" }, { status: 401 });
  const { id } = await params;
  const token = getRequestToken(request);
  const payload = createMeetupSchema.safeParse(await request.json().catch(() => null));
  if (!payload.success) return Response.json({ error: "invalid_payload" }, { status: 400 });
  const supabase = getSupabase(token);
  const existing = await getMeetupById(id, token, false);
  if (existing.organizer_id !== currentUser.id)
    return Response.json({ error: "forbidden" }, { status: 403 });
  const cafe = await getCafeSnapshot(payload.data.cafeId, token);
  const { error } = await supabase.rpc("coffee_meetup_update", {
    meetup_id: id,
    organizer_id: currentUser.id,
    cafe_id: cafe.id,
    cafe_slug: cafe.slug,
    cafe_name: cafe.name,
    cafe_district: cafe.district,
    cafe_address: cafe.address,
    purpose: payload.data.purpose,
    title: payload.data.title,
    description: payload.data.description || null,
    starts_at: `${payload.data.date}T${payload.data.startsAt}:00+07:00`,
    ends_at: `${payload.data.date}T${payload.data.endsAt}:00+07:00`,
    max_participants: payload.data.maxParticipants,
  });
  if (error) return Response.json({ error: error.message }, { status: 400 });
  return Response.json(toPublicMeetup(await getMeetupById(id, token, true), currentUser.id));
}
