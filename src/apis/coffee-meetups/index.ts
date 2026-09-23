import type { CoffeeMeetup, CreateMeetupPayload, MeetupFilters, MeetupReportReason } from "./types";
import { AUTH_STORAGE_KEYS } from "@/constants/auth-keys";

function query(filters?: MeetupFilters) {
  const params = new URLSearchParams();
  if (filters?.purpose) params.set("purpose", filters.purpose);
  if (filters?.date) params.set("date", filters.date);
  if (filters?.area) params.set("area", filters.area);
  if (filters?.availableOnly) params.set("available", "1");
  const value = params.toString();
  return value ? `?${value}` : "";
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const token =
    typeof window === "undefined" ? null : localStorage.getItem(AUTH_STORAGE_KEYS.accessToken);
  const res = await fetch(path, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init?.headers,
    },
  });
  if (!res.ok) throw new Error((await res.json().catch(() => null))?.error ?? "Request failed");
  return res.json() as Promise<T>;
}

export const getCoffeeMeetups = (filters?: MeetupFilters) =>
  request<CoffeeMeetup[]>(`/api/coffee-meetups${query(filters)}`);

export const getCoffeeMeetup = (id: string) => request<CoffeeMeetup>(`/api/coffee-meetups/${id}`);

export const getMyCoffeeMeetups = () =>
  request<{
    organized: CoffeeMeetup[];
    joined: CoffeeMeetup[];
    pending: CoffeeMeetup[];
    archived: CoffeeMeetup[];
  }>("/api/coffee-meetups/mine");

export const createCoffeeMeetup = (payload: CreateMeetupPayload) =>
  request<CoffeeMeetup>("/api/coffee-meetups", { method: "POST", body: JSON.stringify(payload) });

export const updateCoffeeMeetup = (id: string, payload: CreateMeetupPayload) =>
  request<CoffeeMeetup>(`/api/coffee-meetups/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });

export const requestToJoinMeetup = (id: string, message: string) =>
  request<CoffeeMeetup>(`/api/coffee-meetups/${id}/requests`, {
    method: "POST",
    body: JSON.stringify({ message }),
  });

export const withdrawMeetupRequest = (requestId: string) =>
  request<CoffeeMeetup>(`/api/coffee-meetups/requests/${requestId}`, { method: "DELETE" });

export const acceptMeetupRequest = (requestId: string) =>
  request<CoffeeMeetup>(`/api/coffee-meetups/requests/${requestId}/accept`, { method: "POST" });

export const rejectMeetupRequest = (requestId: string) =>
  request<CoffeeMeetup>(`/api/coffee-meetups/requests/${requestId}/reject`, { method: "POST" });

export const cancelCoffeeMeetup = (id: string) =>
  request<CoffeeMeetup>(`/api/coffee-meetups/${id}/cancel`, { method: "POST" });

export const completeCoffeeMeetup = (id: string) =>
  request<CoffeeMeetup>(`/api/coffee-meetups/${id}/complete`, { method: "POST" });

export const reportCoffeeMeetup = (id: string, reason: MeetupReportReason, note = "") =>
  request<{ ok: true }>(`/api/coffee-meetups/${id}/report`, {
    method: "POST",
    body: JSON.stringify({ reason, note }),
  });

export * from "./constants";
export * from "./types";
