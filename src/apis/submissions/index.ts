import { ApiError, apiFetch, authHeaders } from "@/apis/http";

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
export type SubmissionAssetSignature = {
  params: Record<string, string>;
  signature: string;
};

type SubmissionAssetSignatures = {
  cloudName: string;
  apiKey: string;
  assets: SubmissionAssetSignature[];
};

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

export function signSubmissionAssets(
  id: string,
  token: string,
  fields: SubmissionAssetField[],
  signal?: AbortSignal,
) {
  return apiFetch<SubmissionAssetSignatures>(
    `/submissions/${encodeURIComponent(id)}/assets/signatures`,
    {
      method: "POST",
      headers: authHeaders(token),
      body: JSON.stringify({ assets: fields.map((field) => ({ field })) }),
      signal,
    },
  );
}

export async function uploadSignedSubmissionAsset(
  file: File,
  {
    cloudName,
    apiKey,
    params,
    signature,
  }: Pick<SubmissionAssetSignatures, "cloudName" | "apiKey"> &
    Pick<SubmissionAssetSignature, "params" | "signature">,
  signal: AbortSignal,
) {
  const body = new FormData();
  body.set("file", file);
  Object.entries(params).forEach(([key, value]) => body.set(key, value));
  body.set("api_key", apiKey);
  body.set("signature", signature);
  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${encodeURIComponent(cloudName)}/image/upload`,
    {
      method: "POST",
      body,
      signal,
    },
  );
  if (!response.ok)
    throw new ApiError(`Cloudinary upload failed: ${response.status}`, response.status);
  const asset = (await response.json()) as { secure_url?: string; public_id?: string };
  if (!asset.secure_url || !asset.public_id)
    throw new ApiError("Cloudinary response missing asset", 502);
  return { secureUrl: asset.secure_url, publicId: asset.public_id };
}

export function persistSubmissionAsset(
  id: string,
  token: string,
  asset: { secureUrl: string; publicId: string },
  signal?: AbortSignal,
) {
  return apiFetch<CafeSubmission>(`/submissions/${encodeURIComponent(id)}/assets`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify({ secure_url: asset.secureUrl, public_id: asset.publicId }),
    signal,
  });
}

export function deleteSubmissionAsset(id: string, token: string, publicId: string) {
  return apiFetch<CafeSubmission>(`/submissions/${encodeURIComponent(id)}/assets`, {
    method: "DELETE",
    headers: authHeaders(token),
    body: JSON.stringify({ public_id: publicId }),
  });
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
