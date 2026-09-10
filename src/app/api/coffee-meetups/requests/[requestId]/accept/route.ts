import type { NextRequest } from "next/server";
import {
  featureBlockedResponse,
  featureIsEnabled,
  getCurrentUser,
  getMeetupById,
  getRequestToken,
  getSupabase,
  toPublicMeetup,
} from "../../../_lib";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ requestId: string }> },
) {
  if (!featureIsEnabled()) return featureBlockedResponse();
  const currentUser = await getCurrentUser(request);
  if (!currentUser) return Response.json({ error: "unauthorized" }, { status: 401 });
  const { requestId } = await params;
  const token = getRequestToken(request);
  const supabase = getSupabase(token);
  const { data: requestRow } = await supabase
    .from("coffee_meetup_requests")
    .select("id,meetup_id")
    .eq("id", requestId)
    .single();
  if (!requestRow) return Response.json({ error: "not_found" }, { status: 404 });
  const meetup = await getMeetupById(requestRow.meetup_id, token, false);
  if (meetup.organizer_id !== currentUser.id)
    return Response.json({ error: "forbidden" }, { status: 403 });
  const { error } = await supabase.rpc("coffee_meetup_accept_request", {
    request_id: requestId,
    organizer_id: currentUser.id,
  });
  if (error) return Response.json({ error: error.message }, { status: 400 });
  return Response.json(
    toPublicMeetup(await getMeetupById(requestRow.meetup_id, token, true), currentUser.id),
  );
}
