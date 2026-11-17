"use client";

import type { SavedCafeEntry, SavedCollection } from "@/types/cafe";

export interface SavedCafesClientProps {
  locale: string
  initialIsLoggedIn: boolean
  initialEntries: SavedCafeEntry[]
  initialFolders: SavedCollection[]
  previewMode?: boolean
}

export type QuickFilter = "all" | "open" | "parking"
