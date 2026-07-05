import { MAX_PHOTOS } from "./contribute-form.constants";

export function appendImageFiles(photos: File[], files: FileList | null) {
  if (!files) return photos;
  return [...photos, ...Array.from(files).filter((file) => file.type.startsWith("image/"))].slice(
    0,
    MAX_PHOTOS,
  );
}
