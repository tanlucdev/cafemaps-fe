import { MAX_IMAGE_BYTES, MAX_PHOTOS } from "./contribute-form.constants";

const ACCEPTED_IMAGE_EXTENSIONS = /\.(jpe?g|png|webp|avif|heic|heif)$/i;
const ACCEPTED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/heic",
  "image/heif",
  "image/heic-sequence",
  "image/heif-sequence",
]);

export const IMAGE_FILE_ACCEPT =
  "image/jpeg,image/png,image/webp,image/avif,image/heic,image/heif,.jpg,.jpeg,.png,.webp,.avif,.heic,.heif";

export function isHeicFile(file: File) {
  return /^image\/hei[cf]/i.test(file.type) || /\.(heic|heif)$/i.test(file.name);
}

export function createHeicPlaceholderDataUrl(
  fileName: string,
  state: "loading" | "failed" = "loading",
) {
  const title = state === "loading" ? "Đang tải..." : "Không tạo được preview HEIC";
  const subtitle =
    state === "loading" ? "Ảnh gốc vẫn đang được gửi" : "Thử ảnh khác hoặc submit để server xử lý";
  const safeName = escapeSvgText(fileName);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800"><defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#fff8ed"/><stop offset="1" stop-color="#f3e3cd"/></linearGradient></defs><rect width="1200" height="800" fill="url(#bg)"/><rect x="52" y="52" width="1096" height="696" rx="42" fill="#fffaf3" stroke="#ead8bd" stroke-width="4"/><rect x="455" y="214" width="290" height="210" rx="32" fill="#f4e4ce" stroke="#d8ba92" stroke-width="6"/><circle cx="535" cy="284" r="32" fill="#b98247"/><path d="M500 374l74-74 56 56 34-34 60 52v22H500z" fill="#94632f"/><text x="600" y="514" text-anchor="middle" font-family="Arial, sans-serif" font-size="52" font-weight="700" fill="#6f4724">${title}</text><text x="600" y="578" text-anchor="middle" font-family="Arial, sans-serif" font-size="30" fill="#8a6a4b">${subtitle}</text><text x="600" y="632" text-anchor="middle" font-family="Arial, sans-serif" font-size="24" fill="#a58c72">${safeName}</text></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function escapeSvgText(value: string) {
  const escapes: Record<string, string> = { "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;" };
  return value.replace(/[<>&"]/g, (char) => escapes[char]);
}

export function isAcceptedImageFile(file: File) {
  return ACCEPTED_IMAGE_TYPES.has(file.type) || ACCEPTED_IMAGE_EXTENSIONS.test(file.name);
}

export function isAllowedImageFile(file: File) {
  return isAcceptedImageFile(file) && file.size <= MAX_IMAGE_BYTES;
}

export function appendImageFiles(photos: File[], files: FileList | null) {
  if (!files) return photos;
  return [...photos, ...Array.from(files).filter(isAllowedImageFile)].slice(0, MAX_PHOTOS);
}
