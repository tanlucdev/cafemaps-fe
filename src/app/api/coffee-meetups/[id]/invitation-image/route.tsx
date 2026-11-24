import { ImageResponse } from "next/og";
import { getTranslations } from "next-intl/server";
import { getPublicCoffeeMeetup } from "@/apis/coffee-meetups";
import { mockMeetupIds } from "@/apis/coffee-meetups/mock";
import { getInvitationDesign } from "@/apis/coffee-meetups/invitation";
import { ApiError } from "@/apis/http";
import { formatMeetupTime } from "@/components/coffee-meetups/format";
import { featureFlags } from "@/lib/feature-flags";
import { loadExportFonts } from "@/app/[locale]/(main)/quiz/result-image/assets";
import { invitationPhoto } from "./photo";
import { InvitationImage } from "./render";

export const runtime = "nodejs";

function shorten(value: string, limit: number) {
  const characters = Array.from(value.normalize("NFC").replace(/\s+/g, " ").trim());
  return characters.length <= limit
    ? characters.join("")
    : `${characters
        .slice(0, limit - 1)
        .join("")
        .trimEnd()}…`;
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const isUuid = /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(id);
  const isSample = process.env.NEXT_PUBLIC_MOCK_COFFEE_MEETUPS === "1" && mockMeetupIds.includes(id);
  if (!featureFlags.coffeeMeetupsEnabled || (!isUuid && !isSample)) {
    return new Response(null, { status: 404 });
  }

  try {
    const meetup = await getPublicCoffeeMeetup(id);
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get("locale") === "en" ? "en" : "vi";
    const [photo, fonts, t] = await Promise.all([
      invitationPhoto(meetup.imageUrl || meetup.cafe?.coverImage || meetup.cafe?.images?.[0]),
      loadExportFonts(),
      getTranslations({ locale, namespace: "coffeeMeetups.invitation" }),
    ]);
    const design = getInvitationDesign(
      meetup.invitationTemplate ?? searchParams.get("template"),
      meetup.invitationColor ?? searchParams.get("color"),
    );
    const venue = meetup.place.kind === "external" ? meetup.place.name : meetup.cafe?.name;

    const image = new ImageResponse(
      <InvitationImage
        design={design}
        title={meetup.title.normalize("NFC")}
        organizer={t("from", { name: shorten(meetup.organizerName, 85) })}
        schedule={`${formatMeetupTime(meetup, locale === "en" ? "en-US" : "vi-VN")} · ICT`}
        venue={venue ? shorten(venue, 160) : t("placeMissing")}
        note={shorten(meetup.description ?? "", 125)}
        photo={photo}
      />,
      { width: 1080, height: 1350, fonts, headers: { "Cache-Control": "no-store" } },
    );
    return new Response(await image.arrayBuffer(), { headers: image.headers });
  } catch (error) {
    return new Response(null, {
      status: error instanceof ApiError && [400, 401, 403, 404].includes(error.status) ? 404 : 502,
    });
  }
}
