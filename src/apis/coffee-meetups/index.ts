import { apiFetch } from "@/apis/http";
import { getAuthUser } from "@/lib/auth-client";
import type { CoffeeMeetup, CreateMeetupPayload, MeetupFilters, MeetupPlace, MeetupReportReason } from "./types";
import { meetupLocalDateTimeToIso, normalizeMeetupPurpose } from "./helpers";
import { mockCoffeeMeetup, mockCoffeeMeetups } from "./mock";

type ListResponse<T> = { data: T[]; meta: { total: number; page: number; limit: number; totalPages: number } };
type BackendUser = { displayName?: string | null };
type BackendCafe = NonNullable<CoffeeMeetup["cafe"]> & {
  cover_image?: string | null;
  image?: string | null;
  images?: string[] | null;
  distance_km?: number | string | null;
  distance_mode?: string | null;
  duration_min?: number | string | null;
};
type BackendRequest = CoffeeMeetup["requests"][number] & {
  requester?: BackendUser | null;
  requesterName?: string | null;
};
type BackendMeetup = Omit<CoffeeMeetup, "organizerName" | "requests" | "cafe"> & {
  cafe?: BackendCafe | null;
  place?: MeetupPlace;
  image_url?: string | null;
  organizerName?: string | null;
  organizer?: BackendUser | null;
  acceptedCount?: number;
  pendingCount?: number;
  requests?: BackendRequest[];
  distanceKm?: number | string | null;
  distanceMode?: string | null;
};
type MyMeetups = {
  organized: CoffeeMeetup[];
  joined: CoffeeMeetup[];
  pending: CoffeeMeetup[];
  archived: CoffeeMeetup[];
};

function query(filters?: MeetupFilters) {
  const params = new URLSearchParams();
  if (filters?.purpose) params.set("purpose", normalizeMeetupPurpose(filters.purpose));
  if (filters?.date) params.set("date", filters.date);
  if (filters?.area) params.set("area", filters.area);
  if (filters?.availableOnly) params.set("available", "1");
  if (filters?.nearMe) params.set("nearMe", "true");
  if (filters?.lat != null) params.set("lat", String(filters.lat));
  if (filters?.lng != null) params.set("lng", String(filters.lng));
  if (filters?.radiusKm != null) params.set("radiusKm", String(filters.radiusKm));
  if (filters?.page) params.set("page", String(filters.page));
  if (filters?.limit) params.set("limit", String(filters.limit));
  const value = params.toString();
  return value ? `?${value}` : "";
}

function toFiniteNumber(value: number | string | null | undefined) {
  if (value == null || value === "") return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function toDistanceMode(
  value: string | null | undefined,
): NonNullable<CoffeeMeetup["cafe"]>["distanceMode"] {
  return value === "route" || value === "straight" ? value : null;
}

function normalizeMeetup(raw: BackendMeetup): CoffeeMeetup {
  const cafe = raw.cafe
    ? {
        ...raw.cafe,
        images: raw.cafe.images ?? [],
        coverImage:
          raw.cafe.coverImage ??
          raw.cafe.cover_image ??
          raw.cafe.images?.[0] ??
          raw.cafe.image ??
          null,
        lat: toFiniteNumber(raw.cafe.lat),
        lng: toFiniteNumber(raw.cafe.lng),
        distanceKm: toFiniteNumber(raw.cafe.distanceKm ?? raw.cafe.distance_km),
        distanceMode: toDistanceMode(raw.cafe.distanceMode ?? raw.cafe.distance_mode),
        durationMin: toFiniteNumber(raw.cafe.durationMin ?? raw.cafe.duration_min),
      }
    : null;

  return {
    ...raw,
    purpose: normalizeMeetupPurpose(raw.purpose),
    cafe,
    place:
      raw.place ??
      (cafe && raw.cafeId
        ? { kind: "cafe", cafeId: raw.cafeId }
        : { kind: "external", name: "", googleMapsUrl: "" }),
    distanceKm: toFiniteNumber(raw.distanceKm),
    distanceMode: toDistanceMode(raw.distanceMode),
    imageUrl: raw.imageUrl ?? raw.image_url ?? null,
    organizerName: raw.organizerName ?? raw.organizer?.displayName ?? "Cafe Maps user",
    acceptedCount: raw.acceptedCount ?? 1,
    pendingCount: raw.pendingCount ?? 0,
    myRequestStatus: raw.myRequestStatus ?? null,
    acceptedParticipants: raw.acceptedParticipants ?? (raw.requests ?? [])
      .filter((request) => request.status === "accepted" && request.requesterId !== raw.organizerId)
      .map((request) => ({
        displayName: request.requesterName ?? request.requester?.displayName ?? "Cafe Maps user",
      })),
    requests: (raw.requests ?? []).map((request) => ({
      ...request,
      requesterName: request.requesterName ?? request.requester?.displayName ?? "Cafe Maps user",
    })),
  };
}

function toBackendPayload(payload: CreateMeetupPayload) {
  const startsAt = meetupLocalDateTimeToIso(payload.date, payload.startsAt);
  const endsAt = meetupLocalDateTimeToIso(payload.date, payload.endsAt);
  const { date: _date, ...rest } = payload;
  void _date;
  return { ...rest, purpose: normalizeMeetupPurpose(rest.purpose), startsAt, endsAt };
}

function shouldUseMockMeetups() {
  return process.env.NEXT_PUBLIC_MOCK_COFFEE_MEETUPS === "1";
}

export async function getCoffeeMeetups(filters?: MeetupFilters) {
  if (shouldUseMockMeetups()) {
    const items = mockCoffeeMeetups(filters, getAuthUser()?.id);
    const page = filters?.page ?? 1;
    const limit = filters?.limit ?? 12;
    return {
      data: items.slice((page - 1) * limit, page * limit),
      meta: { total: items.length, page, limit, totalPages: Math.ceil(items.length / limit) },
    };
  }
  const res = await apiFetch<ListResponse<BackendMeetup>>(`/coffee-meetups${query(filters)}`);
  return {
    data: res.data.map(normalizeMeetup),
    meta: res.meta,
  };
}

export async function getCoffeeMeetup(id: string) {
  if (shouldUseMockMeetups()) {
    const mocked = mockCoffeeMeetup(id, getAuthUser()?.id);
    if (mocked) return mocked;
  }
  return fetchCoffeeMeetup(id);
}

export async function getPublicCoffeeMeetup(id: string) {
  const sample = shouldUseMockMeetups() && mockCoffeeMeetup(id);
  return sample || fetchCoffeeMeetup(id);
}

async function fetchCoffeeMeetup(id: string) {
  return normalizeMeetup(
    await apiFetch<BackendMeetup>(`/coffee-meetups/${encodeURIComponent(id)}`, { cache: "no-store" }),
  );
}

export async function getMyCoffeeMeetups(): Promise<MyMeetups> {
  const userId = getAuthUser()?.id;
  const meetups = shouldUseMockMeetups()
    ? mockCoffeeMeetups(undefined, userId)
    : (
        await apiFetch<ListResponse<BackendMeetup>>("/coffee-meetups/me", {
          cache: "no-store",
        })
      ).data.map(normalizeMeetup);
  const now = Date.now();
  const archived = meetups.filter(
    (meetup) =>
      ["cancelled", "completed"].includes(meetup.status) ||
      new Date(meetup.endsAt).getTime() <= now,
  );
  const active = meetups.filter((meetup) => !archived.includes(meetup));
  return {
    organized: active.filter((meetup) => meetup.organizerId === userId),
    joined: active.filter((meetup) => meetup.myRequestStatus === "accepted"),
    pending: active.filter((meetup) => meetup.myRequestStatus === "pending"),
    archived,
  };
}

export const createCoffeeMeetup = async (payload: CreateMeetupPayload) =>
  normalizeMeetup(
    await apiFetch<BackendMeetup>("/coffee-meetups", {
      method: "POST",
      body: JSON.stringify(toBackendPayload(payload)),
    }),
  );

export const updateCoffeeMeetup = async (id: string, payload: CreateMeetupPayload) =>
  normalizeMeetup(
    await apiFetch<BackendMeetup>(`/coffee-meetups/${id}`, {
      method: "PATCH",
      body: JSON.stringify(toBackendPayload(payload)),
    }),
  );

export const requestToJoinMeetup = async (id: string, message: string) =>
  normalizeMeetup(
    await apiFetch<BackendMeetup>(`/coffee-meetups/${id}/requests`, {
      method: "POST",
      body: JSON.stringify({ message }),
    }),
  );

export const withdrawMeetupRequest = async (requestId: string) =>
  normalizeMeetup(
    await apiFetch<BackendMeetup>(`/coffee-meetups/requests/${requestId}`, { method: "DELETE" }),
  );

export const acceptMeetupRequest = async (requestId: string) =>
  normalizeMeetup(
    await apiFetch<BackendMeetup>(`/coffee-meetups/requests/${requestId}/accept`, {
      method: "POST",
    }),
  );

export const rejectMeetupRequest = async (requestId: string) =>
  normalizeMeetup(
    await apiFetch<BackendMeetup>(`/coffee-meetups/requests/${requestId}/reject`, {
      method: "POST",
    }),
  );

export const cancelCoffeeMeetup = async (id: string) =>
  normalizeMeetup(
    await apiFetch<BackendMeetup>(`/coffee-meetups/${id}/cancel`, { method: "POST" }),
  );

export const completeCoffeeMeetup = async (id: string) =>
  normalizeMeetup(
    await apiFetch<BackendMeetup>(`/coffee-meetups/${id}/complete`, { method: "POST" }),
  );

export const reportCoffeeMeetup = async (id: string, reason: MeetupReportReason, note = "") => {
  await apiFetch(`/coffee-meetups/${id}/report`, {
    method: "POST",
    body: JSON.stringify({ reason, note }),
  });
  return { ok: true as const };
};

export * from "./types";
export * from "./helpers";
