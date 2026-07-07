"use client"

import { useCallback, useMemo, useState } from "react"
import type { Dispatch, SetStateAction } from "react"
import type { Cafe, SavedCafeEntry, SavedCollection } from "@/types/cafe"
import { getCurrentAccessToken } from "@/lib/auth-client"
import {
  createSavedCollection,
  deleteSavedCollection,
  moveToCollection,
  renameSavedCollection,
} from "@/lib/api"
import { buildCollectionGroups, normalizeFolderName } from "./saved-folders.helpers"

interface UseSavedFoldersParams {
  initialFolders: SavedCollection[]
  entries: SavedCafeEntry[]
  setEntries: Dispatch<SetStateAction<SavedCafeEntry[]>>
  activeCollection: string
  setActiveCollection: Dispatch<SetStateAction<string>>
}

export function useSavedFolders({
  initialFolders,
  entries,
  setEntries,
  activeCollection,
  setActiveCollection,
}: UseSavedFoldersParams) {
  const [folders, setFolders] = useState(initialFolders)

  const collections = useMemo(
    () => buildCollectionGroups(entries, folders),
    [entries, folders]
  )
  const collectionNames = useMemo(() => collections.map((c) => c.name), [collections])

  const replaceFolders = useCallback((next: SavedCollection[]) => {
    setFolders(next)
  }, [])

  async function createFolder(rawName: string) {
    const name = normalizeFolderName(rawName)
    if (!name || collectionNames.some((n) => n.toLowerCase() === name.toLowerCase())) return

    setFolders((cur) => [...cur, { name }])
    const token = await getCurrentAccessToken()
    if (token) await createSavedCollection(name, token).catch(() => null)
  }

  async function renameFolder(oldName: string, rawNewName: string) {
    const newName = normalizeFolderName(rawNewName)
    if (!newName || oldName === newName) return false

    setFolders((cur) => cur.map((folder) => (same(folder.name, oldName) ? { ...folder, name: newName } : folder)))
    setEntries((cur) =>
      cur.map((entry) => (same(entry.collectionName, oldName) ? { ...entry, collectionName: newName } : entry))
    )
    if (activeCollection === oldName) setActiveCollection(newName)

    const token = await getCurrentAccessToken()
    if (!token) return rollbackRename()

    try {
      await renameSavedCollection(oldName, newName, token)
      return true
    } catch {
      return rollbackRename()
    }

    function rollbackRename() {
      setFolders((cur) => cur.map((folder) => (same(folder.name, newName) ? { ...folder, name: oldName } : folder)))
      setEntries((cur) =>
        cur.map((entry) => (same(entry.collectionName, newName) ? { ...entry, collectionName: oldName } : entry))
      )
      setActiveCollection((cur) => (cur === newName ? oldName : cur))
      return false
    }
  }

  async function deleteFolder(name: string) {
    const deletedFolder = folders.find((folder) => same(folder.name, name)) ?? { name }
    const movedEntries = entries.filter((entry) => same(entry.collectionName, name))

    setFolders((cur) => cur.filter((folder) => !same(folder.name, name)))
    setEntries((cur) =>
      cur.map((entry) => (same(entry.collectionName, name) ? { ...entry, collectionName: null } : entry))
    )
    if (activeCollection === name) setActiveCollection("all")

    const token = await getCurrentAccessToken()
    if (!token) return rollbackDelete()

    try {
      await deleteSavedCollection(name, token)
      return true
    } catch {
      return rollbackDelete()
    }

    function rollbackDelete() {
      setFolders((cur) => (cur.some((folder) => same(folder.name, deletedFolder.name)) ? cur : [...cur, deletedFolder]))
      setEntries((cur) =>
        cur.map((entry) =>
          movedEntries.some((moved) => moved.cafe.id === entry.cafe.id) ? { ...entry, collectionName: name } : entry
        )
      )
      setActiveCollection((cur) => (cur === "all" && activeCollection === name ? name : cur))
      return false
    }
  }

  async function moveCafeToFolder(cafe: Cafe, targetCollection: string | null) {
    const name = targetCollection === null ? null : normalizeFolderName(targetCollection)
    if (targetCollection !== null && !name) return

    const previousCollection = entries.find((entry) => entry.cafe.id === cafe.id)?.collectionName ?? null
    const createdFolder = name !== null && !collectionNames.some((folder) => same(folder, name))

    if (name) {
      setFolders((cur) => (cur.some((folder) => same(folder.name, name)) ? cur : [...cur, { name }]))
    }
    setEntries((cur) =>
      cur.map((entry) => (entry.cafe.id === cafe.id ? { ...entry, collectionName: name } : entry))
    )

    const token = await getCurrentAccessToken()
    if (!token) return rollback()

    try {
      await moveToCollection(cafe.id, name, token)
    } catch {
      rollback()
    }

    function rollback() {
      if (createdFolder && name) setFolders((cur) => cur.filter((folder) => !same(folder.name, name)))
      setEntries((cur) =>
        cur.map((entry) => (entry.cafe.id === cafe.id ? { ...entry, collectionName: previousCollection } : entry))
      )
    }
  }

  return {
    collections,
    collectionNames,
    replaceFolders,
    createFolder,
    renameFolder,
    deleteFolder,
    moveCafeToFolder,
  }
}

function same(a: string | null | undefined, b: string) {
  return (a ?? "").trim().toLowerCase() === b.toLowerCase()
}
