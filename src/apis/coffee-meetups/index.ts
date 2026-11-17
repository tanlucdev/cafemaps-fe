import { apiFetch } from "@/apis/http";
import { getAuthUser } from "@/lib/auth-client";
import type { CoffeeMeetup, CreateMeetupPayload, MeetupFilters, MeetupReportReason } from "./types";
import { meetupLocalDateTimeToIso } from "./helpers";
import { mockCoffeeMeetup, mockCoffeeMeetups } from "./mock";

type ListResponse<T> = { data: T[]; meta?: unknown };
type BackendUser = { displayName?: string | null; email?: string | null };
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
  image_url?: string | null;
  organizerName?: string | null;
  organizer?: BackendUser | null;
  acceptedCount?: number;
  pendingCount?: number;
  requests?: BackendRequest[];
};
type MyMeetups = {
  organized: CoffeeMeetup[];
  joined: CoffeeMeetup[];
  pending: CoffeeMeetup[];
  archived: CoffeeMeetup[];
};

function query(filters?: MeetupFilters) {
  const params = new URLSearchParams();
  if (filters?.purpose) params.set("purpose", filters.purpose);
  if (filters?.date) params.set("date", filters.date);
  if (filters?.area) params.set("area", filters.area);
  if (filters?.availableOnly) params.set("available", "1");
  if (filters?.nearMe) {
    params.set("nearMe", "true");
    if (filters.lat !== undefined) params.set("lat", String(filters.lat));
    if (filters.lng !== undefined) params.set("lng", String(filters.lng));
    if (filters.radiusKm !== undefined) params.set("radiusKm", String(filters.radiusKm));
  }
  if (filters?.page) params.set("page", String(filters.page));
  if (filters?.limit) params.set("limit", String(filters.limit));
  const value = params.toString();
  return value ? `?${value}` : "";
}

function toFiniteNumber(value: number | string | null | undefined) {
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function toDistanceMode(value: string | null | undefined): NonNullable<CoffeeMeetup["cafe"]>["distanceMode"] {
  return value === "route" || value === "straight" ? value : null;
}

function normalizeMeetup(raw: BackendMeetup): CoffeeMeetup {
  const cafe = raw.cafe
    ? {
        ...raw.cafe,
        images: raw.cafe.images ?? [],
        coverImage:
          raw.cafe.coverImage ?? raw.cafe.cover_image ?? raw.cafe.images?.[0] ?? raw.cafe.image ?? null,
        lat: toFiniteNumber(raw.cafe.lat),
        lng: toFiniteNumber(raw.cafe.lng),
        distanceKm: toFiniteNumber(raw.cafe.distanceKm ?? raw.cafe.distance_km),
        distanceMode: toDistanceMode(raw.cafe.distanceMode ?? raw.cafe.distance_mode),
        durationMin: toFiniteNumber(raw.cafe.durationMin ?? raw.cafe.duration_min),
      }
    : null;

  return {
    ...raw,
    cafe,
    imageUrl: raw.imageUrl ?? raw.image_url ?? null,
    organizerName: raw.organizerName ?? raw.organizer?.displayName ?? "Cafe Maps user",
    acceptedCount: raw.acceptedCount ?? 1,
    pendingCount: raw.pendingCount ?? 0,
    myRequestStatus: raw.myRequestStatus ?? null,
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
  return { ...rest, startsAt, endsAt };
}

function shouldUseMockMeetups() {
  return process.env.NEXT_PUBLIC_MOCK_COFFEE_MEETUPS === "1";
}

export async function getCoffeeMeetups(filters?: MeetupFilters) {
  if (shouldUseMockMeetups()) return mockCoffeeMeetups(filters, getAuthUser()?.id);
  const res = await apiFetch<ListResponse<BackendMeetup>>(`/coffee-meetups${query(filters)}`);
  return res.data.map(normalizeMeetup);
}

export async function getCoffeeMeetup(id: string) {
  const mocked = shouldUseMockMeetups() ? mockCoffeeMeetup(id, getAuthUser()?.id) : null;
  if (mocked) return mocked;
  try {
    return normalizeMeetup(
      await apiFetch<BackendMeetup>(`/coffee-meetups/${id}`, { cache: "no-store" }),
    );
  } catch (error) {
    const fallback = shouldUseMockMeetups() ? mockCoffeeMeetup(id, getAuthUser()?.id) : null;
    if (fallback) return fallback;
    throw error;
  }
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
