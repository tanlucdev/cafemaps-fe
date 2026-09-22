import { ApiError, apiFetch, authHeaders } from "@/apis/http";

export interface CreateSubmissionInput {
  name: string;
  submissionType?: "community" | "owner";
  address?: string;
  googleMapsUrl?: string;
  note?: string;
  payload?: CafeSubmissionPayload;
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

export async function createSubmission(data: CreateSubmissionInput, token: string) {
  return apiFetch<CafeSubmission>("/submissions", {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(data),
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
  file: File,
  token: string,
  kind: "images" | "menu",
) {
  const formData = new FormData();
  formData.set("file", file);
  const response = await fetch(`/api-proxy/submissions/${encodeURIComponent(id)}/${kind}`, {
    method: "POST",
    credentials: "include",
    headers: authHeaders(token),
    body: formData,
  });
  if (!response.ok) throw new ApiError(`Upload failed: ${response.status}`, response.status);
  return response.json() as Promise<CafeSubmission>;
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
