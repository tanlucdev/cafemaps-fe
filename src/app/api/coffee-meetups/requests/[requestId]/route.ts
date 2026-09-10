import type { NextRequest } from "next/server";
import {
  featureBlockedResponse,
  featureIsEnabled,
  getCurrentUser,
  getRequestToken,
  getSupabase,
} from "../../_lib";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ requestId: string }> },
) {
  if (!featureIsEnabled()) return featureBlockedResponse();
  const currentUser = await getCurrentUser(request);
  if (!currentUser) return Response.json({ error: "unauthorized" }, { status: 401 });
  const { requestId } = await params;
  const supabase = getSupabase(getRequestToken(request));
  const { error } = await supabase.rpc("coffee_meetup_withdraw_request", {
    actor_id: currentUser.id,
    request_id: requestId,
  });
  if (error) return Response.json({ error: error.message }, { status: 400 });
  return Response.json({ ok: true });
}
