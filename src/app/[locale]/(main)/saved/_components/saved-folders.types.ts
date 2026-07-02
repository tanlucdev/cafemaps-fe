import type { Cafe } from "@/types/cafe"

export interface CollectionGroup {
  name: string
  cafes: Cafe[]
  createdAt?: string
}
