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
