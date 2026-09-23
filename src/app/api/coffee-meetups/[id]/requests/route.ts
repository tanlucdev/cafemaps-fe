import type { NextRequest } from "next/server";
import { joinMeetupSchema } from "@/apis/coffee-meetups/validation";
import {
  featureBlockedResponse,
  featureIsEnabled,
  getCurrentUser,
  getMeetupById,
  getRequestToken,
  getSupabase,
  toPublicMeetup,
} from "../../_lib";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!featureIsEnabled()) return featureBlockedResponse();
  const currentUser = await getCurrentUser(request);
  if (!currentUser) return Response.json({ error: "unauthorized" }, { status: 401 });
  const { id } = await params;
  const token = getRequestToken(request);
  const payload = joinMeetupSchema.safeParse(await request.json().catch(() => null));
  if (!payload.success) return Response.json({ error: "invalid_payload" }, { status: 400 });

  const supabase = getSupabase(token);
  const meetup = await getMeetupById(id, token, true);
  if (meetup.organizer_id === currentUser.id)
    return Response.json({ error: "self_join" }, { status: 400 });
  if (meetup.requests?.some((item) => item.requester_id === currentUser.id)) {
    return Response.json({ error: "duplicate_request" }, { status: 409 });
  }
  const remaining = meetup.max_participants - meetup.accepted_count;
  if (remaining <= 0) return Response.json({ error: "full" }, { status: 409 });

  const { error } = await supabase.rpc("coffee_meetup_join_request", {
    meetup_id: id,
    requester_id: currentUser.id,
    requester_name: currentUser.displayName ?? "Cafe Maps member",
    message: payload.data.message || null,
  });
  if (error) return Response.json({ error: error.message }, { status: 400 });
  return Response.json(toPublicMeetup(await getMeetupById(id, token, true), currentUser.id), {
    status: 201,
  });
}
