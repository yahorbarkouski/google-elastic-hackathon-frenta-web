import { useCallback } from "react"
import { useAtom } from "jotai"
import { searchApartments } from "@/lib/api"
import {
  searchQueryAtom,
  searchResultsAtom,
  searchLoadingAtom,
  searchErrorAtom,
  searchedAtom,
  doubleCheckMatchesAtom,
} from "@/lib/atoms/search"

export function useSearch() {
  const [query, setQuery] = useAtom(searchQueryAtom)
  const [results, setResults] = useAtom(searchResultsAtom)
  const [loading, setLoading] = useAtom(searchLoadingAtom)
  const [error, setError] = useAtom(searchErrorAtom)
  const [searched, setSearched] = useAtom(searchedAtom)
  const [doubleCheckMatches, setDoubleCheckMatches] = useAtom(doubleCheckMatchesAtom)

  const search = useCallback(async (searchQuery?: string, verifyMatches?: boolean, doubleCheck?: boolean) => {
    const queryToSearch = searchQuery || query
    if (!queryToSearch.trim()) return

    setLoading(true)
    setSearched(true)
    setError(null)
    try {
      const data = await searchApartments(
        queryToSearch, 
        20, 
        undefined, 
        verifyMatches, 
        doubleCheck !== undefined ? doubleCheck : doubleCheckMatches
      )
      setResults(data.results)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search failed")
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [query, doubleCheckMatches, setError, setLoading, setResults, setSearched])

  return {
    query,
    setQuery,
    results,
    loading,
    error,
    searched,
    search,
    doubleCheckMatches,
    setDoubleCheckMatches,
  }
}
