export type CloudinaryImagePreset = "card" | "gallery" | "lightbox" | "thumb" | "menu" | "og";

const PRESETS: Record<CloudinaryImagePreset, string> = {
  card: "f_auto,q_auto:good,w_1200,c_limit",
  gallery: "f_auto,q_auto:good,w_1800,c_limit",
  lightbox: "f_auto,q_auto:good,w_2200,c_limit",
  thumb: "f_auto,q_auto,w_360,c_fill",
  menu: "f_auto,q_auto:good,w_1800,c_limit",
  og: "f_auto,q_auto,w_1200,h_630,c_fill",
};

export function cloudinaryImageUrl(src: string, preset: CloudinaryImagePreset) {
  try {
    const url = new URL(src);
    const marker = "/image/upload/";
    const markerIndex = url.pathname.indexOf(marker);
    if (url.hostname !== "res.cloudinary.com" || markerIndex === -1) return src;

    const before = url.pathname.slice(0, markerIndex + marker.length);
    const parts = url.pathname.slice(markerIndex + marker.length).split("/");
    const cleanAfter = (parts[0]?.includes(",") ? parts.slice(1) : parts).join("/");
    url.pathname = `${before}${PRESETS[preset]}/${cleanAfter}`;
    return url.toString();
  } catch {
    return src;
  }
}
