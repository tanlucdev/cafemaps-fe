import { ImageResponse } from "next/og";
import sharp from "sharp";
import { getPersonaRelations } from "@/lib/quiz/persona-relations";
import { resolveQuizPosterImage, resolveQuizWideImage } from "@/lib/quiz/profiles";
import { imageToDataUrl, loadExportFonts } from "./assets";
import { DesktopBoard, MobileBoard } from "./render";
import { cleanPayload, type CleanPayload } from "./sanitize";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let payload: CleanPayload;
  let image: string;
  let thumbnails: Record<string, string> = {};
  try {
    const clean = cleanPayload(await request.json());
    if (!clean) return Response.json({ error: "Invalid payload" }, { status: 400 });
    payload = clean;
    image = await imageToDataUrl(
      new URL(
        payload.format === "desktop"
          ? resolveQuizPosterImage(payload.result.profile.posterImageSlug, payload.variant)
          : resolveQuizWideImage(payload.result.profile.posterImageSlug, payload.variant),
        request.url,
      ),
    );
    const relations = getPersonaRelations(payload.result.profile, payload.profiles);
    const relationProfiles = [
      ...relations.compatible,
      ...relations.incompatible,
      ...relations.pair,
    ];
    thumbnails = Object.fromEntries(
      await Promise.all(
        relationProfiles.map(async (profile) => [
          profile.id,
          await imageToDataUrl(new URL(profile.posterImage, request.url)),
        ]),
      ),
    );
  } catch {
    return Response.json({ error: "Invalid payload" }, { status: 400 });
  }

  const size =
    payload.format === "desktop" ? { width: 1728, height: 926 } : { width: 1080, height: 1500 };
  const scale = payload.scale ?? 1;
  const board =
    payload.format === "desktop" ? (
      <DesktopBoard payload={payload} image={image} thumbnails={thumbnails} />
    ) : (
      <MobileBoard payload={payload} image={image} thumbnails={thumbnails} />
    );
  const imageResponse = new ImageResponse(board, { ...size, fonts: await loadExportFonts() });
  if (scale === 1) return imageResponse;
  const buffer = Buffer.from(await imageResponse.arrayBuffer());
  const scaled = await sharp(buffer)
    .resize(size.width * scale, size.height * scale, { kernel: "lanczos3" })
    .png()
    .toBuffer();
  const body = new ArrayBuffer(scaled.byteLength);
  new Uint8Array(body).set(scaled);
  return new Response(body, { headers: { "content-type": "image/png" } });
}
