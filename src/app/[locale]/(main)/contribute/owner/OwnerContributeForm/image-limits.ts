export const MAX_OWNER_GALLERY_IMAGES = 12;

export function remainingOwnerGalleryImages(imageCount: number) {
  return Math.max(0, MAX_OWNER_GALLERY_IMAGES - imageCount);
}

export function limitOwnerGalleryFiles<T>(files: T[], imageCount: number) {
  return files.slice(0, remainingOwnerGalleryImages(imageCount));
}

export function ownerGalleryLimitMessage(remaining: number) {
  return remaining
    ? `Bạn chỉ có thể thêm ${remaining} ảnh quán nữa.`
    : `Bạn đã tải đủ ${MAX_OWNER_GALLERY_IMAGES} ảnh quán.`;
}
