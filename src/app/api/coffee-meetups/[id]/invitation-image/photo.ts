import { readFile } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";

const photoHosts = new Set([
  "images.unsplash.com",
  "res.cloudinary.com",
  "lh3.googleusercontent.com",
]);
const maxBytes = 8 * 1024 * 1024;

export async function invitationPhoto(source?: string | null) {
  if (!source) return null;
  try {
    let input: Buffer;
    if (/^\/image\/(?:[\w-]+\/)*[\w.-]+\.(?:png|jpe?g|webp)$/i.test(source)) {
      input = await readFile(join(process.cwd(), "public", source));
      if (input.length > maxBytes) return null;
    } else {
      const url = new URL(source);
      if (url.protocol !== "https:" || url.port || url.username || url.password) return null;
      const publicStorage =
        /^[a-z0-9-]+\.supabase\.co$/.test(url.hostname) &&
        url.pathname.startsWith("/storage/v1/object/public/");
      if (!publicStorage && !photoHosts.has(url.hostname)) return null;

      const response = await fetch(url, {
        redirect: "error",
        signal: AbortSignal.timeout(4500),
        cache: "no-store",
      });
      if (
        !response.ok ||
        !response.body ||
        Number(response.headers.get("content-length")) > maxBytes
      ) {
        await response.body?.cancel();
        return null;
      }

      const reader = response.body.getReader();
      const chunks: Uint8Array[] = [];
      let size = 0;
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        size += value.byteLength;
        if (size > maxBytes) {
          await reader.cancel();
          return null;
        }
        chunks.push(value);
      }
      input = Buffer.concat(chunks, size);
    }

    const image = sharp(input, { limitInputPixels: 25_000_000 });
    const { format } = await image.metadata();
    if (!format || !["jpeg", "png", "webp", "avif", "heif", "gif"].includes(format)) return null;
    const photo = await image.rotate().resize(960, 460, { fit: "cover" }).png().toBuffer();
    return `data:image/png;base64,${photo.toString("base64")}`;
  } catch {
    return null;
  }
}
