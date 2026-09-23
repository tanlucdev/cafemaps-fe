import type { NextRequest } from "next/server";
import {
  featureBlockedResponse,
  featureIsEnabled,
  getCurrentUser,
  getRequestToken,
  getSupabase,
  toPublicMeetup,
} from "../_lib";

const meetupSelect =
  "id,cafe_id,cafe_slug,cafe_name,cafe_district,cafe_address,organizer_id,organizer_name,purpose,title,description,starts_at,ends_at,max_participants,status,accepted_participant_names,accepted_count,created_at,requests:coffee_meetup_requests(id,meetup_id,requester_id,requester_name,message,status,created_at)";

export async function GET(request: NextRequest) {
  if (!featureIsEnabled()) return featureBlockedResponse();
  const currentUser = await getCurrentUser(request);
  if (!currentUser) return Response.json({ error: "unauthorized" }, { status: 401 });

  const supabase = getSupabase(getRequestToken(request));
  const [organized, ownRequests] = await Promise.all([
    supabase
      .from("coffee_meetups")
      .select(meetupSelect)
      .eq("organizer_id", currentUser.id)
      .order("starts_at"),
    supabase
      .from("coffee_meetup_requests")
      .select("meetup_id,status")
      .eq("requester_id", currentUser.id)
      .neq("status", "withdrawn"),
  ]);

  if (organized.error) return Response.json({ error: organized.error.message }, { status: 500 });
  if (ownRequests.error) return Response.json({ error: ownRequests.error.message }, { status: 500 });

  const statusByMeetup = new Map((ownRequests.data ?? []).map((row) => [row.meetup_id, row.status]));
  const requestIds = [...statusByMeetup.keys()];
  const requestedMeetups = requestIds.length
    ? await supabase.from("coffee_meetups").select(meetupSelect).in("id", requestIds)
    : { data: [], error: null };
  if (requestedMeetups.error)
    return Response.json({ error: requestedMeetups.error.message }, { status: 500 });

  const requestMeetups = (requestedMeetups.data ?? []).map((row) => ({
    ...toPublicMeetup(row, currentUser.id),
    myRequestStatus: statusByMeetup.get(row.id) ?? null,
  }));

  return Response.json({
    organized: (organized.data ?? []).map((row) => toPublicMeetup(row, currentUser.id)),
    joined: requestMeetups.filter((meetup) => meetup.myRequestStatus === "accepted"),
    pending: requestMeetups.filter((meetup) => meetup.myRequestStatus === "pending"),
    archived: [
      ...(organized.data ?? []).map((row) => toPublicMeetup(row, currentUser.id)),
      ...requestMeetups,
    ].filter(
      (meetup) =>
        ["cancelled", "completed"].includes(meetup.status) || new Date(meetup.endsAt) < new Date(),
    ),
  });
}
