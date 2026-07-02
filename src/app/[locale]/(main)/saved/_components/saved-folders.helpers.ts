import type { SavedCafeEntry, SavedCollection } from "@/types/cafe"
import type { CollectionGroup } from "./saved-folders.types"

export function normalizeFolderName(name: string) {
  return name.trim().slice(0, 40)
}

export function buildCollectionGroups(
  entries: SavedCafeEntry[],
  folders: SavedCollection[]
): CollectionGroup[] {
  const map = new Map<string, CollectionGroup>()

  for (const folder of folders) {
    const name = normalizeFolderName(folder.name)
    if (name) map.set(name.toLowerCase(), { name, cafes: [], createdAt: folder.createdAt })
  }

  for (const entry of entries) {
    const name = normalizeFolderName(entry.collectionName ?? "")
    if (!name) continue
    const key = name.toLowerCase()
    const group = map.get(key) ?? { name, cafes: [] }
    group.cafes.push(entry.cafe)
    map.set(key, group)
  }

  return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name))
}
