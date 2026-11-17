"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import type { Cafe } from "@/types/cafe";
import { getCurrentAccessToken } from "@/lib/auth-client";
import { getSavedCafeEntries, getSavedCollections } from "@/lib/api";
import { isCafeOpenNow } from "@/lib/opening-hours";
import { useSavedFolders } from "../useSavedFolders";
import { showSavedToast } from "../saved-toast";
import { SavedCafesClientProps, QuickFilter } from './types';

export function useSavedPageState({
  locale,
  initialIsLoggedIn,
  initialEntries,
  initialFolders,
  previewMode = false,
}: SavedCafesClientProps) {
  const t = useTranslations("saved")

  // ── Auth & entries ──────────────────────────────────────────────────────────
  const [isLoggedIn, setIsLoggedIn] = useState(initialIsLoggedIn)
  const [entries, setEntries] = useState(initialEntries)
  const [entriesLoading, setEntriesLoading] = useState(initialIsLoggedIn && initialEntries.length === 0)

  // ── Filters ─────────────────────────────────────────────────────────────────
  const [activeCollection, setActiveCollection] = useState<string>("all")
  const [quickFilter, setQuickFilter] = useState<QuickFilter>("all")
  const [district, setDistrict] = useState("")
  const [search, setSearch] = useState("")
  const [filtersOpen, setFiltersOpen] = useState(false)

  // ── Modals ──────────────────────────────────────────────────────────────────
  const [showCreateFolder, setShowCreateFolder] = useState(false)
  const [renameTarget, setRenameTarget] = useState<string | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const [moveTarget, setMoveTarget] = useState<Cafe | null>(null)
  const pendingFolderActionRef = useRef(false)
  const {
    collections,
    collectionNames,
    replaceFolders,
    createFolder,
    renameFolder,
    deleteFolder,
    moveCafeToFolder,
  } = useSavedFolders({
    initialFolders,
    entries,
    setEntries,
    activeCollection,
    setActiveCollection,
  })

  // ── Auth sync ────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (previewMode) return
    let alive = true
    const syncAuth = async () => {
      const token = await getCurrentAccessToken()
      if (alive) {
        const loggedIn = Boolean(token)
        setIsLoggedIn(loggedIn)
        if (!loggedIn) setEntriesLoading(false)
      }
    }
    void syncAuth()
    window.addEventListener("cafe-auth-change", syncAuth)
    return () => { alive = false; window.removeEventListener("cafe-auth-change", syncAuth) }
  }, [previewMode])

  useEffect(() => {
    if (previewMode || !isLoggedIn) {
      setEntriesLoading(false)
      return
    }
    let alive = true
    ;(async () => {
      setEntriesLoading(true)
      const token = await getCurrentAccessToken()
      if (!token) {
        if (alive) {
          setEntries([])
          setEntriesLoading(false)
        }
        return
      }
      const [nextEntries, nextFolders] = await Promise.all([
        getSavedCafeEntries(token, locale),
        getSavedCollections(token),
      ])
      if (alive) {
        setEntries(nextEntries)
        replaceFolders(nextFolders)
        setEntriesLoading(false)
      }
    })()
    return () => { alive = false }
  }, [isLoggedIn, locale, previewMode, replaceFolders])

  useEffect(() => {
    if (activeCollection === "all") return
    if (!collections.some((c) => c.name === activeCollection)) setActiveCollection("all")
  }, [activeCollection, collections])

  // ── Filtered cafes ───────────────────────────────────────────────────────────
  const visibleCafes = useMemo(() => {
    let list =
      activeCollection === "all"
        ? entries.map((e) => e.cafe)
        : (collections.find((c) => c.name === activeCollection)?.cafes ?? [])

    if (quickFilter === "open") list = list.filter(isCafeOpenNow)
    if (quickFilter === "parking") list = list.filter((c) => c.amenities.some((a) => a.toLowerCase().includes("đậu xe")))
    if (district) list = list.filter((c) => c.district === district || c.district_legacy === district)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter((c) => c.name.toLowerCase().includes(q) || c.district?.toLowerCase().includes(q) || c.address?.toLowerCase().includes(q))
    }
    return list
  }, [activeCollection, quickFilter, district, search, entries, collections])

  const activeFilterCount = [quickFilter !== "all", district !== "", search !== ""].filter(Boolean).length

  // ── Handlers ─────────────────────────────────────────────────────────────────

  function handleSavedChange(cafeId: string, saved: boolean) {
    if (!saved) setEntries((cur) => cur.filter((e) => e.cafe.id !== cafeId))
  }

  function handleCreateFolder(folderName: string) {
    void createFolder(folderName)
    setShowCreateFolder(false)
  }

  async function handleRenameFolder(oldName: string, newName: string) {
    if (pendingFolderActionRef.current) return
    pendingFolderActionRef.current = true
    setRenameTarget(null)
    try {
      const renamed = await renameFolder(oldName, newName)
      if (renamed) {
        showSavedToast({
          kind: "rename",
          title: t("folderRenamedToastTitle"),
          description: t("folderRenamedToastDesc", { oldName, newName }),
          closeLabel: t("closeToast"),
        })
      }
    } finally {
      pendingFolderActionRef.current = false
    }
  }

  async function handleDeleteFolder(name: string) {
    if (pendingFolderActionRef.current) return
    pendingFolderActionRef.current = true
    setDeleteTarget(null)
    try {
      const deleted = await deleteFolder(name)
      if (deleted) {
        showSavedToast({
          kind: "delete",
          title: t("folderDeletedToastTitle"),
          description: t("folderDeletedToastDesc", { name }),
          closeLabel: t("closeToast"),
        })
      }
    } finally {
      pendingFolderActionRef.current = false
    }
  }

  function handleMoveToCollection(cafe: Cafe, targetCollection: string | null) {
    void moveCafeToFolder(cafe, targetCollection)
    setMoveTarget(null)
  }

  function handleEnsureCollectionExists(folderName: string) {
    void createFolder(folderName)
  }

  // ── Not logged in ─────────────────────────────────────────────────────────────
  
return { t, isLoggedIn, setIsLoggedIn, entries, setEntries, entriesLoading, setEntriesLoading, activeCollection, setActiveCollection, quickFilter, setQuickFilter, district, setDistrict, search, setSearch, filtersOpen, setFiltersOpen, showCreateFolder, setShowCreateFolder, renameTarget, setRenameTarget, deleteTarget, setDeleteTarget, moveTarget, setMoveTarget, pendingFolderActionRef, collections, collectionNames, replaceFolders, createFolder, renameFolder, deleteFolder, moveCafeToFolder, visibleCafes, activeFilterCount, handleSavedChange, handleCreateFolder, handleRenameFolder, handleDeleteFolder, handleMoveToCollection, handleEnsureCollectionExists, locale, previewMode };
}
