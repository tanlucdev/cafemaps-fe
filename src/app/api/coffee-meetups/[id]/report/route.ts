import type { NextRequest } from "next/server";
import { reportMeetupSchema } from "@/apis/coffee-meetups/validation";
import {
  featureBlockedResponse,
  featureIsEnabled,
  getCurrentUser,
  getRequestToken,
  getSupabase,
} from "../../_lib";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!featureIsEnabled()) return featureBlockedResponse();
  const currentUser = await getCurrentUser(request);
  if (!currentUser) return Response.json({ error: "unauthorized" }, { status: 401 });
  const { id } = await params;
  const payload = reportMeetupSchema.safeParse(await request.json().catch(() => null));
  if (!payload.success) return Response.json({ error: "invalid_payload" }, { status: 400 });
  const supabase = getSupabase(getRequestToken(request));
  const { error } = await supabase.rpc("coffee_meetup_report", {
    meetup_id: id,
    reporter_id: currentUser.id,
    reporter_name: currentUser.displayName ?? "Cafe Maps member",
    reason: payload.data.reason,
    note: payload.data.note || null,
  });
  if (error) return Response.json({ error: error.message }, { status: 400 });
  return Response.json({ ok: true });
}
