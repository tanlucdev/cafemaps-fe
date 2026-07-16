import type { Cafe, SavedCafeEntry, SavedCollection } from "@/types/cafe"
import { ApiError, apiFetch, authHeaders } from "@/apis/http"
import { mapApiCafe } from "@/apis/cafes/mapper"
import { buildQuery } from "@/apis/cafes/query"

export async function getSavedCafeEntries(
  token: string,
  locale?: string | null
): Promise<SavedCafeEntry[]> {
  try {
    const raw = await apiFetch<Array<{
      cafe: Cafe
      collectionName?: string
      createdAt?: string
    }>>(`/saved${buildQuery(undefined, locale)}`, {
      cache: "no-store",
      headers: authHeaders(token),
    })
    return raw.map(({ cafe, collectionName, createdAt }) => ({
      cafe: mapApiCafe(cafe, locale),
      collectionName: collectionName ?? null,
      createdAt,
    }))
  } catch {
    return []
  }
}

export async function getSavedCollections(token: string): Promise<SavedCollection[]> {
  try {
    const raw = await apiFetch<Array<string | SavedCollection>>("/saved/collections", {
      cache: "no-store",
      headers: authHeaders(token),
    })
    return raw
      .map((item) => (typeof item === "string" ? { name: item } : item))
      .filter((item) => item.name?.trim())
  } catch {
    return []
  }
}

export async function createSavedCollection(name: string, token: string): Promise<SavedCollection> {
  return apiFetch<SavedCollection>("/saved/collections", {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify({ name }),
  })
}

export async function renameSavedCollection(
  oldName: string,
  name: string,
  token: string
): Promise<SavedCollection> {
  return apiFetch<SavedCollection>(`/saved/collections/${encodeURIComponent(oldName)}`, {
    method: "PATCH",
    headers: authHeaders(token),
    body: JSON.stringify({ name }),
  })
}

export async function deleteSavedCollection(name: string, token: string): Promise<void> {
  await apiFetch(`/saved/collections/${encodeURIComponent(name)}`, {
    method: "DELETE",
    headers: authHeaders(token),
  })
}

export async function getSavedCafes(token: string, locale?: string | null): Promise<Cafe[]> {
  const entries = await getSavedCafeEntries(token, locale)
  return entries.map((entry) => entry.cafe)
}

export async function toggleSaveCafe(
  cafeId: string,
  token: string,
  currentlySaved?: boolean,
  collectionName?: string | null
): Promise<{ saved: boolean; collectionName?: string | null }> {
  if (currentlySaved) {
    await apiFetch(`/saved/${cafeId}`, {
      method: "DELETE",
      headers: authHeaders(token),
    })
    return { saved: false }
  }

  try {
    const result = await apiFetch<{ saved?: boolean; collectionName?: string | null }>("/saved", {
      method: "POST",
      headers: authHeaders(token),
      body: JSON.stringify({ cafeId, collectionName }),
    })
    return { saved: true, collectionName: result.collectionName ?? collectionName ?? null }
  } catch (error) {
    if (error instanceof ApiError && error.status === 409) {
      return { saved: true, collectionName: collectionName ?? null }
    }
    throw error
  }
}

export async function moveToCollection(
  cafeId: string,
  collectionName: string | null,
  token: string
): Promise<void> {
  await apiFetch(`/saved/${cafeId}/collection`, {
    method: "PATCH",
    headers: authHeaders(token),
    body: JSON.stringify({ collectionName }),
  })
}
