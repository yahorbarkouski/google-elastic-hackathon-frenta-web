import { atom } from "jotai"
import type { SearchResult } from "@/lib/types"

export const searchQueryAtom = atom<string>("")
export const searchResultsAtom = atom<SearchResult[]>([])
export const searchLoadingAtom = atom<boolean>(false)
export const searchErrorAtom = atom<string | null>(null)
export const searchedAtom = atom<boolean>(false)
export const doubleCheckMatchesAtom = atom<boolean>(false)

