import { apiFetch, authHeaders } from "@/apis/http";

const COMMUNITY_UPLOAD_TIMEOUT_MS = 180_000;

export interface CreateSubmissionInput {
  name: string;
  submissionType?: "community" | "owner";
  address?: string;
  googleMapsUrl?: string;
  note?: string;
  payload?: CafeSubmissionPayload;
}

export interface CreateCommunitySubmissionInput {
  name: string;
  googleMapsUrl: string;
  note?: string;
  photos: File[];
}

export interface CafeSubmissionPayload {
  images?: string[];
  imageOrientations?: string[];
  coverImage?: string;
  coverImageCrop?: { x: number; y: number } | null;
  menuImages?: string[];
  name?: string;
  address?: string;
  district?: string;
  googleMapsUrl?: string;
  lat?: number;
  lng?: number;
  openingTime?: string;
  closingTime?: string;
  priceMin?: number;
  priceMax?: number;
  vibes?: string[];
  purposes?: string[];
  amenities?: string[];
  tags?: string[];
  oneLiner?: string;
  description?: string;
  parkingLocation?: string;
  signatureDrink?: string;
  instagramUrl?: string;
  ownerName?: string;
  ownerPhone?: string;
  ownerEmail?: string;
  ownerRole?: string;
  ownerProofNote?: string;
}

export interface CafeSubmission {
  id: string;
  submittedById?: string | null;
  createdCafeId?: string | null;
  submissionType?: "community" | "owner";
  name: string;
  address?: string | null;
  googleMapsUrl?: string | null;
  note?: string | null;
  payload?: CafeSubmissionPayload | null;
  reviewNote?: string | null;
  status: "draft" | "pending" | "approved" | "rejected";
  createdAt: string;
  createdCafe?: {
    id: string;
    name: string;
    slug: string;
    address?: string | null;
    district?: string | null;
    coverImage?: string | null;
    isPublished?: boolean;
  } | null;
}

export type SubmissionAssetField = "images" | "menuImages";
export async function createSubmission(data: CreateSubmissionInput, token: string) {
  return apiFetch<CafeSubmission>("/submissions", {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
}

export function createCommunitySubmission({
  name,
  googleMapsUrl,
  note,
  photos,
}: CreateCommunitySubmissionInput) {
  const body = new FormData();
  body.set("name", name);
  body.set("googleMapsUrl", googleMapsUrl);
  if (note) body.set("note", note);
  photos.forEach((photo) => body.append("photos", photo));
  return apiFetch<CafeSubmission>("/submissions/community", {
    method: "POST",
    body,
    timeoutMs: COMMUNITY_UPLOAD_TIMEOUT_MS,
  });
}

export async function updateSubmission(id: string, data: CreateSubmissionInput, token: string) {
  return apiFetch<CafeSubmission>(`/submissions/${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
}

export async function submitSubmission(id: string, token: string) {
  return apiFetch<CafeSubmission>(`/submissions/${encodeURIComponent(id)}/submit`, {
    method: "POST",
    headers: authHeaders(token),
  });
}

export async function uploadSubmissionImage(
  id: string,
  token: string,
  file: File,
  field: SubmissionAssetField,
) {
  const body = new FormData();
  body.set("file", file);
  const result = await apiFetch<CafeSubmission & { uploadedUrls: string[] }>(
    `/submissions/${encodeURIComponent(id)}/${field === "images" ? "images" : "menu"}`,
    { method: "POST", headers: authHeaders(token), body, timeoutMs: COMMUNITY_UPLOAD_TIMEOUT_MS },
  );
  if (
    result.uploadedUrls?.length !== 1 ||
    typeof result.uploadedUrls[0] !== "string" ||
    !result.uploadedUrls[0]
  )
    throw new Error("Upload response missing image URL");
  return result.uploadedUrls[0];
}

export function deleteSubmissionImage(id: string, token: string, url: string) {
  return apiFetch<CafeSubmission>(`/submissions/${encodeURIComponent(id)}/images`, {
    method: "DELETE",
    headers: authHeaders(token),
    body: JSON.stringify({ url }),
    timeoutMs: 45_000,
  });
}

export async function getSubmissionDraft(id: string, token: string) {
  const submissions = await apiFetch<CafeSubmission[]>("/submissions/me", {
    cache: "no-store",
    headers: authHeaders(token),
  });
  const draft = submissions.find(
    (submission) => submission.id === id && submission.status === "draft",
  );
  if (!draft?.payload) throw new Error("Không thể đồng bộ draft");
  return draft.payload;
}

export async function getMySubmissions(token: string): Promise<CafeSubmission[]> {
  try {
    return await apiFetch<CafeSubmission[]>("/submissions/me", {
      cache: "no-store",
      headers: authHeaders(token),
    });
  } catch {
    return [];
  }
}
