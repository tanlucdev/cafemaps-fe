import type { CafeSubmissionPayload } from "@/apis/submissions";

export type Draft = CafeSubmissionPayload & { note?: string };
export type CheckItem = { label: string; done: boolean };
export type SectionId = "basics" | "locationHours" | "tags" | "ownerDetails";
export type FocusKey = keyof Draft | "galleryUpload";
export type RequiredItem = {
  key: "name" | "images" | "location" | "openingTime" | "closingTime";
  label: string;
  done: boolean;
  section: SectionId | "gallery";
  focusKey: FocusKey;
};

export const sections: { id: SectionId; label: string }[] = [
  { id: "basics", label: "Thông tin" },
  { id: "locationHours", label: "Địa điểm & giờ" },
  { id: "tags", label: "Vibe & tiện ích" },
  { id: "ownerDetails", label: "Chi tiết owner" },
];

export const emptyDraft: Draft = {
  images: [],
  imageOrientations: [],
  menuImages: [],
  vibes: [],
  purposes: [],
  amenities: [],
  tags: [],
  coverImageCrop: { x: 50, y: 50 },
};

export const textFields: { key: keyof Draft; label: string; placeholder?: string }[] = [
  { key: "ownerName", label: "Tên người gửi" },
  { key: "ownerPhone", label: "Số điện thoại" },
  { key: "ownerEmail", label: "Email" },
  { key: "ownerRole", label: "Vai trò tại quán", placeholder: "Chủ quán / quản lý" },
  { key: "ownerProofNote", label: "Ghi chú xác thực" },
  { key: "name", label: "Tên quán", placeholder: "Tên cafe" },
  { key: "oneLiner", label: "Một dòng giới thiệu" },
  { key: "description", label: "Mô tả" },
  { key: "address", label: "Địa chỉ" },
  { key: "district", label: "Khu vực" },
  { key: "googleMapsUrl", label: "Google Maps URL" },
  { key: "openingTime", label: "Giờ mở cửa", placeholder: "07:00" },
  { key: "closingTime", label: "Giờ đóng cửa", placeholder: "22:00" },
  { key: "parkingLocation", label: "Gửi xe" },
  { key: "signatureDrink", label: "Món nổi bật" },
  { key: "instagramUrl", label: "Instagram" },
  { key: "note", label: "Ghi chú gửi admin" },
];

export const requiredFieldLabels: Partial<Record<FocusKey, string>> = {
  name: "Tên quán",
  galleryUpload: "Ảnh",
  address: "Địa chỉ/Maps",
  googleMapsUrl: "Địa chỉ/Maps",
  openingTime: "Giờ mở",
  closingTime: "Giờ đóng",
};

export function getRequiredItems(draft: Draft, imageCount: number): RequiredItem[] {
  return [
    {
      key: "name",
      label: "Tên quán",
      done: Boolean(draft.name?.trim()),
      section: "basics",
      focusKey: "name",
    },
    {
      key: "images",
      label: "Ảnh",
      done: imageCount > 0,
      section: "gallery",
      focusKey: "galleryUpload",
    },
    {
      key: "location",
      label: "Địa chỉ/Maps",
      done: Boolean(draft.address?.trim() || draft.googleMapsUrl?.trim()),
      section: "locationHours",
      focusKey: draft.address?.trim() ? "googleMapsUrl" : "address",
    },
    {
      key: "openingTime",
      label: "Giờ mở",
      done: Boolean(draft.openingTime?.trim()),
      section: "locationHours",
      focusKey: "openingTime",
    },
    {
      key: "closingTime",
      label: "Giờ đóng",
      done: Boolean(draft.closingTime?.trim()),
      section: "locationHours",
      focusKey: "closingTime",
    },
  ];
}

export const REQUIRED_PREVIEW_MESSAGE =
  "Vui lòng thêm tên quán, địa chỉ hoặc Google Maps, ít nhất 1 ảnh, giờ mở và giờ đóng cửa để xem lại.";

export const ONE_LINER_WORD_LIMIT = 20;

export function limitWords(value: string, limit: number) {
  const words = value.match(/\S+/g) ?? [];
  return words.length <= limit ? value : words.slice(0, limit).join(" ");
}

export function moveToFront<T>(items: T[], index: number) {
  if (index <= 0 || index >= items.length) return items;
  const next = [...items];
  const [item] = next.splice(index, 1);
  return [item, ...next];
}

export function normalizeDraft(draft: Draft): Draft {
  const images = draft.images ?? [];
  const coverImage = images[0];
  return {
    ...draft,
    oneLiner: draft.oneLiner ? limitWords(draft.oneLiner, ONE_LINER_WORD_LIMIT) : undefined,
    images,
    imageOrientations: (draft.imageOrientations ?? []).slice(0, images.length),
    coverImage,
    coverImageCrop: coverImage
      ? coverImage === draft.coverImage
        ? (draft.coverImageCrop ?? { x: 50, y: 50 })
        : { x: 50, y: 50 }
      : null,
  };
}
