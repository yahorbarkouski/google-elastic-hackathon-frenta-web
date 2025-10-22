import { useState, useCallback } from "react"
import { fetchApartments } from "@/lib/api"
import type { Apartment } from "@/lib/types"

export function useApartments(initialPage: number = 1) {
  const [apartments, setApartments] = useState<Apartment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(initialPage)
  const [totalPages, setTotalPages] = useState(1)

  const loadApartments = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchApartments(page, 20)
      setApartments(data.apartments)
      setTotalPages(data.pagination.total_pages)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load apartments")
    } finally {
      setLoading(false)
    }
  }, [page])

  return {
    apartments,
    loading,
    error,
    page,
    totalPages,
    setPage,
    loadApartments,
  }
}

