import type { NextRequest } from "next/server";
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
  const supabase = getSupabase(token);
  const meetup = await getMeetupById(id, token, false);
  if (meetup.organizer_id !== currentUser.id)
    return Response.json({ error: "forbidden" }, { status: 403 });
  const { error } = await supabase.rpc("coffee_meetup_cancel", {
    meetup_id: id,
    organizer_id: currentUser.id,
  });
  if (error) return Response.json({ error: error.message }, { status: 400 });
  return Response.json(toPublicMeetup(await getMeetupById(id, token, true), currentUser.id));
}
