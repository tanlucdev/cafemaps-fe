import type { NextRequest } from "next/server";
import { createMeetupSchema } from "@/apis/coffee-meetups/validation";
import {
  featureBlockedResponse,
  featureIsEnabled,
  getCafeSnapshot,
  getCurrentUser,
  getRequestToken,
  getSupabase,
  toPublicMeetup,
} from "./_lib";

export async function GET(request: NextRequest) {
  if (!featureIsEnabled()) return featureBlockedResponse();

  const supabase = getSupabase();
  const url = request.nextUrl;
  const purpose = url.searchParams.get("purpose") || null;
  const date = url.searchParams.get("date") || null;
  const area = url.searchParams.get("area") || null;
  const available = url.searchParams.get("available") === "1";
  const currentUser = await getCurrentUser(request);

  let query = supabase
    .from("coffee_meetups")
    .select(
      "id,cafe_id,cafe_slug,cafe_name,cafe_district,cafe_address,organizer_id,organizer_name,purpose,title,description,starts_at,ends_at,max_participants,status,accepted_participant_names,accepted_count,created_at",
    )
    .in("status", ["open", "full"]);
  if (purpose) query = query.eq("purpose", purpose);
  if (date)
    query = query
      .gte("starts_at", `${date}T00:00:00+07:00`)
      .lt("starts_at", `${date}T23:59:59+07:00`);
  if (area) query = query.eq("cafe_district", area);
  const { data, error } = await query.order("starts_at");
  if (error) return Response.json({ error: error.message }, { status: 500 });

  const meetups = (data ?? []).map((row) => toPublicMeetup(row, currentUser?.id));
  return Response.json(
    available
      ? meetups.filter(
          (meetup) => meetup.maxParticipants > meetup.acceptedCount && meetup.status === "open",
        )
      : meetups,
  );
}

export async function POST(request: NextRequest) {
  if (!featureIsEnabled()) return featureBlockedResponse();
  const currentUser = await getCurrentUser(request);
  if (!currentUser) return Response.json({ error: "unauthorized" }, { status: 401 });

  const payload = createMeetupSchema.safeParse(await request.json().catch(() => null));
  if (!payload.success)
    return Response.json(
      { error: "invalid_payload", issues: payload.error.flatten() },
      { status: 400 },
    );

  const token = getRequestToken(request);
  const cafe = await getCafeSnapshot(payload.data.cafeId, token);
  const supabase = getSupabase(token);
  const { data, error } = await supabase.rpc("coffee_meetup_create", {
    cafe_id: cafe.id,
    cafe_slug: cafe.slug,
    cafe_name: cafe.name,
    cafe_district: cafe.district,
    cafe_address: cafe.address,
    organizer_id: currentUser.id,
    organizer_name: currentUser.displayName ?? "Cafe Maps member",
    purpose: payload.data.purpose,
    title: payload.data.title,
    description: payload.data.description || null,
    starts_at: `${payload.data.date}T${payload.data.startsAt}:00+07:00`,
    ends_at: `${payload.data.date}T${payload.data.endsAt}:00+07:00`,
    max_participants: payload.data.maxParticipants,
  });

  if (error) return Response.json({ error: error.message }, { status: 400 });
  return Response.json(toPublicMeetup(data, currentUser.id), { status: 201 });
}
